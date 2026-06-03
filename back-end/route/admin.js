// routes/adminRoutes.js
import express from 'express';
import adminController from '../controllers/adminController.js';
import authMidlleware  from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMidlleware.protect);
router.use(authMidlleware.authorize('admin'));

router.get('/stats', adminController.getStats);
router.get('/growth', adminController.getGrowthData);
router.get('/category-distribution', adminController.getCategoryDistribution);
router.get('/difficulty-distribution', adminController.getDifficultyDistribution);
router.get('/recent-activities', adminController.getRecentActivities);

export default router;