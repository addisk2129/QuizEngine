import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { sendEmailWithTemplate } from '../service/emailTemplateService.js';
import { createSendToken, signTokens } from './tokenHandler.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authController = {
  signup: catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;
    
    if (!userName || !email || !password || !passwordConfirm) {
      return next(new AppError("Please fill all required fields", 400));
    }
    
    if (password.length < 8) {
      return next(new AppError("Password is too short (minimum 8 characters)", 400));
    }
    
    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User with this email already exists", 400));
    }

    const newUser = await User.create({ 
      userName, email, password, passwordConfirm,
      emailVerified: true
    });
     console.log(newUser)
    const message = "Account created successfully";
    await createSendToken(newUser, res, message, 201);
  }),

  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    
    const message = "Logged in successfully";
    await createSendToken(user, res, message);
  }),

  googleLogin: catchAsync(async (req, res, next) => {
    const { credential } = req.body; 
  
    if (!credential) {
      return next(new AppError("No credential provided", 400));
    }
  
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
  
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture, email_verified } = payload;
  
    if (!email_verified) {
      return next(new AppError("Google email not verified", 400));
    }
  
    let user = await User.findOne({ email });
  
    if (!user) {
      user = await User.create({
        userName: name,
        email,
        googleId,
        photo: picture,
        password: undefined,
        emailVerified: true
      });
    }
  
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save({ validateBeforeSave: false });
    }
    
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    
    const message = "Logged in with Google successfully";

  
    createSendToken(user, res, message, 200);
  }),

  refresh: catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return next(new AppError("No refresh token provided", 401));
    }
  
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return next(new AppError("Invalid or expired refresh token", 401));
    }
  
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken
    });
  
    if (!user) {
      return next(new AppError("Invalid refresh token", 401));
    }
  
    const { accessToken } = signTokens(user._id, user.email);
  
    res.status(200).json({
      status: "success",
      accessToken
    });
  }),

  logout: catchAsync(async (req, res, next) => {
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save({ validateBeforeSave: false });
    }

    res.clearCookie('refreshToken');
    
    res.status(200).json({
      status: "success",
      message: "Logged out successfully"
    });
  }),

  forgotPassword: catchAsync(async (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
      return next(new AppError("Please provide email", 400));
    }
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return next(new AppError('There is no user with this email address.', 404));
    }
  
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
  
    try {
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetURL = `${frontendURL}/reset-password/${resetToken}`;
      await sendEmailWithTemplate(email, 'passwordReset', { resetURL });
  
      res.status(200).json({
        status: "success",
        message: "Password reset link sent to your email."
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      return next(new AppError("Error sending email. Try again later.", 500));
    }
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;
  
    if (!token) {
      return next(new AppError("Invalid token", 401));
    }
  
    if (!password || !passwordConfirm) {
      return next(new AppError("Please provide password and password confirmation", 400));
    }
  
    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }
  
    if (password.length < 8) {
      return next(new AppError("Password is too short (minimum 8 characters)", 400));
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }  
    });
  
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
  
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();
  
    const message = "Password reset successful";
    await createSendToken(user, res, message);
  }),

  changePassword: catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return next(new AppError("Please provide all password fields", 400));
    }

    if (newPassword !== newPasswordConfirm) {
      return next(new AppError("New passwords do not match", 400));
    }

    if (newPassword.length < 8) {
      return next(new AppError("Password is too short (minimum 8 characters)", 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(currentPassword, user.password))) {
      return next(new AppError("Current password is incorrect", 401));
    }

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password changed successfully"
    });
  })
};

export default authController;