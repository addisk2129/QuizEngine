
import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(authMiddleware.protect);

// User self management
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

// ==================== ADMIN ONLY ROUTES ====================
router.use(authMiddleware.authorize('admin'));

router.get('/', userController.getAllUsers);
router.get('/stats', userController.getUserStats);
router.get('/dashboard-stats', userController.getDashboardStat);
router.get('/:userId', userController.getUserById);
router.patch('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

export default router;