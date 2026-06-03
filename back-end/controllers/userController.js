// controllers/userController.js
import User from '../models/user.js';
import Category from '../models/category.js';
import Question from '../models/Questions.js';
import Quiz from '../models/quizz.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import bcrypt from 'bcryptjs';

const userController = {
  // ==================== USER SELF (Profile) ====================
  
  // Get current user profile
  getProfile: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password -refreshToken');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  }),

  // Update current user profile
  updateProfile: catchAsync(async (req, res, next) => {
    const { username, email, photo } = req.body;

    if (req.body.password || req.body.refreshToken) {
      return next(new AppError('This route is not for password updates. Please use /change-password', 400));
    }

    // Check if email already exists
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return next(new AppError('Email already in use', 400));
    }

    // Check if username already exists
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return next(new AppError('Username already taken', 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, username, email, photo },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  }),

  // Change password
  changePassword: catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return next(new AppError('Please provide all password fields', 400));
    }

    if (newPassword !== newPasswordConfirm) {
      return next(new AppError('New passwords do not match', 400));
    }

    if (newPassword.length < 8) {
      return next(new AppError('Password must be at least 8 characters', 400));
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return next(new AppError('User not found', 404));

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) return next(new AppError('Current password is incorrect', 401));

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  }),

  // Delete current user account
  deleteAccount: catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('refreshToken');
    res.status(204).json({ status: 'success', data: null });
  }),

  // ==================== ADMIN ONLY ====================

  // Get all users
  getAllUsers: catchAsync(async (req, res, next) => {
    const users = await User.find().select('-password -refreshToken');
    res.status(200).json({ status: 'success', results: users.length, data: { users } });
  }),

  // Get user by ID
  getUserById: catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ status: 'success', data: { user } });
  }),

  // Admin update any user
  updateUser: catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const {userName, email, role, photo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userName, email, role, photo },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!updatedUser) return next(new AppError('User not found', 404));
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  }),

  // Admin delete any user
  deleteUser: catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return next(new AppError('User not found', 404));
    res.status(204).json({ status: 'success', data: null });
  }),

  // ==================== STATS ====================

  // Get user statistics
  getUserStats: catchAsync(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    res.status(200).json({
      status: 'success',
      data: { totalUsers, newUsersThisMonth }
    });
  }),

  // Get dashboard stats (admin)
  getDashboardStat: catchAsync(async (req, res, next) => {
    const [totalUsers, totalCategory, totalQuizz, totalQuestions] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Quiz.countDocuments(),
      Question.countDocuments()
    ]);

    res.status(200).json({
      status: 'success',
      data: { totalUsers, totalCategory, totalQuizz, totalQuestions }
    });
  })
};

export default userController;