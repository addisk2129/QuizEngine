import Quiz from '../models/quizz.js';
import Category from '../models/category.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const quizController = {
  createQuiz: catchAsync(async (req, res, next) => {
    const { title, description, categoryId, difficulty, duration, passingScore, image, isFeatured } = req.body;

    if (!title || !categoryId) {
      return next(new AppError('Title and category are required', 400));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    const slug = title.toLowerCase().replace(/ /g, '-');

    const newQuiz = await Quiz.create({
      title,
      slug,
      description,
      categoryId,
      difficulty,
      duration,
      passingScore,
      image,
      isFeatured
    });

    await Category.findByIdAndUpdate(categoryId, {
      $inc: { totalQuizzes: 1 }
    });

    res.status(201).json({
      status: 'success',
      data: { quiz: newQuiz }
    });
  }),

  getAllQuizzes: catchAsync(async (req, res, next) => {
    const quizzes = await Quiz.find({ isActive: true }).populate('categoryId', 'name slug');

    res.status(200).json({
      status: 'success',
      results: quizzes.length,
      data: { quizzes }
    });
  }),

  getFeaturedQuizzes: catchAsync(async (req, res, next) => {
    const quizzes = await Quiz.find({ isFeatured: true, isActive: true })
      .limit(6)
      .populate('categoryId', 'name');

    res.status(200).json({
      status: 'success',
      data: { quizzes }
    });
  }),

  getQuizzesByCategory: catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    const quizzes = await Quiz.find({ categoryId, isActive: true });

    res.status(200).json({
      status: 'success',
      results: quizzes.length,
      data: { quizzes }
    });
  }),

  getQuizById: catchAsync(async (req, res, next) => {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate('categoryId', 'name slug');

    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { quiz }
    });
  }),

  updateQuiz: catchAsync(async (req, res, next) => {
    const { quizId } = req.params;

    if (req.body.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/ /g, '-');
    }

    const updated = await Quiz.findByIdAndUpdate(quizId, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return next(new AppError('Quiz not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { quiz: updated }
    });
  }),

  deleteQuiz: catchAsync(async (req, res, next) => {
    const { quizId } = req.params;
    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    await Category.findByIdAndUpdate(quiz.categoryId, {
      $inc: { totalQuizzes: -1 }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  })
};

export default quizController;