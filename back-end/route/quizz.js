import express from 'express';
import quizController from '../controllers/quizController.js';
import authMidlleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', quizController.getAllQuizzes);
router.get('/category/:categoryId', quizController.getQuizzesByCategory);

router.use(authMidlleware.protect) 
router.post('/', authMidlleware.authorize('admin'), quizController.createQuiz);
router.get('/featured', quizController.getFeaturedQuizzes);
router.get('/:quizId', quizController.getQuizById);
router.patch('/:quizId', authMidlleware.authorize('admin'), quizController.updateQuiz);
router.delete('/:quizId', authMidlleware.authorize('admin'), quizController.deleteQuiz);

export default router;