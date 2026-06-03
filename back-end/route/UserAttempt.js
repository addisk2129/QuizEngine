import express from 'express';
import attemptController from '../controllers/attemptController.js';
import authMidlleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMidlleware.protect);


router.post('/save-progress', attemptController.saveProgress);
router.post('/', attemptController.startAttempt);
router.patch('/:attemptId/submit', attemptController.submitAttempt);
router.get('/user/:userId', attemptController.getUserAttempts);
router.get('/:attemptId', attemptController.getAttemptById);
router.get('/quiz/:quizId/leaderboard', attemptController.getLeaderboard);

export default router;