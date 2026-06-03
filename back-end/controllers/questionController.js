import Question from '../models/questions.js';
import Quiz from '../models/quizz.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const questionController = {
  addQuestion: catchAsync(async (req, res, next) => {
     console.log("PARAMS ",req.params)
    const { quizId } = req.params;
    const { text, options, correctAnswer, explanation, points, difficulty } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    const newQuestion = await Question.create({
      quizId,
      text,
      options,
      correctAnswer,
      explanation,
      points,
      difficulty
    });

    const totalQuestions = await Question.countDocuments({ quizId });
    const totalPoints = await Question.aggregate([
      { $match: { quizId: quiz._id } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    await Quiz.findByIdAndUpdate(quizId, {
      totalQuestions,
      totalPoints: totalPoints[0]?.total || 0
    });

    res.status(201).json({
      status: 'success',
      data: { question: newQuestion }
    });
  }),

  getQuestionsByQuiz: catchAsync(async (req, res, next) => {
    const { quizId } = req.params;
    const questions = await Question.find({ quizId });

    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: { questions }
    });
  }),

  getQuestions: catchAsync(async (req, res, next) => {
    const questions = await Question.find();

    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: { questions }
    });
  }),

  getQuestionById: catchAsync(async (req, res, next) => {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);

    if (!question) {
      return next(new AppError('Question not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { question }
    });
  }),

  updateQuestion: catchAsync(async (req, res, next) => {
    const { questionId } = req.params;
    const updated = await Question.findByIdAndUpdate(questionId, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return next(new AppError('Question not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { question: updated }
    });
  }),

  deleteQuestion: catchAsync(async (req, res, next) => {
    const { questionId } = req.params;
    const question = await Question.findByIdAndDelete(questionId);

    if (!question) {
      return next(new AppError('Question not found', 404));
    }

    const totalQuestions = await Question.countDocuments({ quizId: question.quizId });
    const totalPoints = await Question.aggregate([
      { $match: { quizId: question.quizId } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    await Quiz.findByIdAndUpdate(question.quizId, {
      totalQuestions,
      totalPoints: totalPoints[0]?.total || 0
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  })
};

export default questionController;