import UserAttempt from '../models/user_attempt.js';
import Quiz from '../models/quizz.js';
import Question from '../models/questions.js';
import User from '../models/user.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const attemptController = {
  startAttempt: catchAsync(async (req, res, next) => {
    const {  quizId } = req.body;
     const {id:userId}=req.user;
    const user = await User.findById(userId);
    const quiz = await Quiz.findById(quizId);

    if (!user || !quiz) {
      return next(new AppError('User or Quiz not found', 404));
    }

    const existingAttempt = await UserAttempt.findOne({
      userId,
      quizId,
      status: 'in-progress'
    });

    if (existingAttempt) {
      return res.status(200).json({
        status: 'success',
        data: { attempt: existingAttempt }
      });
    }

    const newAttempt = await UserAttempt.create({
      userId,
      quizId,
      answers: [],
      score: 0,
      totalPoints: quiz.totalPoints,
      percentage: 0,
      status: 'in-progress'
    });

    res.status(201).json({
      status: 'success',
      data: { attempt: newAttempt }
    });
  }),

  submitAttempt: catchAsync(async (req, res, next) => {
    const { attemptId } = req.params;
    const { answers, timeTaken } = req.body;

    const attempt = await UserAttempt.findById(attemptId);
    if (!attempt) {
      return next(new AppError('Attempt not found', 404));
    }

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.selectedOption;
      const pointsEarned = isCorrect ? question.points : 0;

      totalScore += pointsEarned;
      if (isCorrect) correctCount++;
      else incorrectCount++;

      answer.isCorrect = isCorrect;
      answer.pointsEarned = pointsEarned;
    }

    skippedCount = attempt.totalPoints / 10 - (correctCount + incorrectCount);
    const percentage = (totalScore / attempt.totalPoints) * 100;

    attempt.answers = answers;
    attempt.score = totalScore;
    attempt.percentage = percentage;
    attempt.correctAnswers = correctCount;
    attempt.incorrectAnswers = incorrectCount;
    attempt.skippedAnswers = skippedCount;
    attempt.timeTaken = timeTaken;
    attempt.status = 'completed';
    attempt.completedAt = Date.now();

    await attempt.save();

    await User.findByIdAndUpdate(attempt.userId, {
      $inc: {
        totalScore: totalScore,
        quizzesTaken: 1
      }
    });

    await Quiz.findByIdAndUpdate(attempt.quizId, {
      $inc: { totalTakers: 1 }
    });

    res.status(200).json({
      status: 'success',
      data: { attempt }
    });
  }),

  getUserAttempts: catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const attempts = await UserAttempt.find({ userId, status: 'completed' })
      .populate('quizId', 'title slug')
      .sort('-completedAt');

    res.status(200).json({
      status: 'success',
      results: attempts.length,
      data: { attempts }
    });
  }),

  getAttemptById: catchAsync(async (req, res, next) => {
    const { attemptId } = req.params;
    const attempt = await UserAttempt.findById(attemptId)
      .populate('userId', 'username email')
      .populate('quizId', 'title slug');

    if (!attempt) {
      return next(new AppError('Attempt not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { attempt }
    });
  }),

  getLeaderboard: catchAsync(async (req, res, next) => {
    const { quizId } = req.params;
    const leaderboard = await UserAttempt.find({ quizId, status: 'completed' })
      .sort('-percentage')
      .limit(10)
      .populate('userId', 'username avatar')
      .select('percentage score timeTaken');

    res.status(200).json({
      status: 'success',
      data: { leaderboard }
    });
  }),
saveProgress: catchAsync(async (req, res, next) => {

  const {  quizId, answers, currentQuestionIndex } = req.body;
    const {id:userId}=req.user;

    console.log(userId)
  let attempt = await UserAttempt.findOne({
    userId,
    quizId,
    status: 'in-progress'
  });

  if (!attempt) {
    const quiz = await Quiz.findById(quizId);
    attempt = await UserAttempt.create({
      userId,
      quizId,
      answers: [],
      score: 0,
      totalPoints: quiz.totalPoints,
      percentage: 0,
      status: 'in-progress',
      currentQuestionIndex: 0
    });
  }

  
  attempt.answers = answers;
  attempt.currentQuestionIndex = currentQuestionIndex;
  attempt.lastSavedAt = Date.now();
  
  await attempt.save();

  res.status(200).json({
    status: 'success',
    message: 'Progress saved successfully'
  });
}),
};

export default attemptController;