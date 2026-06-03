import express from 'express';
import authController from '../controllers/authController.js';
import authMidlleware from '../middleware/authMiddleware.js';

const userRouter = express.Router();
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/google-login', authController.googleLogin);
userRouter.post('/refresh', authController.refresh);
userRouter.post('/forgotPassword',authController.forgotPassword);
userRouter.post('/resetPassword/:token',authController.resetPassword);

userRouter.post('/logout', authMidlleware.protect, authController.logout);

export default userRouter;