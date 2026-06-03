import express from 'express';
import questionController from '../controllers/questionController.js';
import authMidlleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMidlleware.protect);


router.get('/', questionController.getQuestions);

router.post('/:quizId', questionController.addQuestion);
router.get('/:quizId', questionController.getQuestionsByQuiz); 
router.get('/:questionId', questionController.getQuestionById);
router.patch('/:questionId', authMidlleware.authorize('admin'), questionController.updateQuestion);
router.delete('/:questionId', authMidlleware.authorize('admin'), questionController.deleteQuestion);

export default router;