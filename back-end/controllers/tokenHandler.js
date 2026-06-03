import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const signTokens = (id, email) => {
  const accessToken = jwt.sign(
    { id, email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d' }
  );
  const refreshToken = jwt.sign(
    { id, email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

export const createSendToken = async (user, res, message, statusCode = 200) => {
  const { _id: id, email } = user;

  const { accessToken, refreshToken } = signTokens(id, email);

  await User.findByIdAndUpdate(id, { refreshToken });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(statusCode).json({
    status: "success",
    accessToken,
    message,
    data: {
      user: {
        id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    }
  });
};