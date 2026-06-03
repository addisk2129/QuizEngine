import User from '../models/user.js';
import Question from '../models/questions.js';
import Category from '../models/category.js';
import Quiz from '../models/quizz.js';
import UserAttempt from '../models/user_attempt.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const adminController = {
  getStats: catchAsync(async (req, res, next) => {
    const [totalUsers, totalQuestions, totalCategories, totalQuizzes, totalAttempts] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Category.countDocuments(),
      Quiz.countDocuments(),
      UserAttempt.countDocuments()
    ]);

    const avgScoreResult = await UserAttempt.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$percentage' } } }
    ]);
    const avgScore = avgScoreResult[0]?.avg.toFixed(2) || 0;

    // Calculate active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalQuestions,
        totalCategories,
        totalQuizzesTaken: totalAttempts,
        avgScore: Math.round(avgScore),
        activeUsers
      }
    });
  }),

  // Get monthly growth data
  getGrowthData: catchAsync(async (req, res, next) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Get user growth per month
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get quiz attempts per month
    const quizGrowth = await UserAttempt.aggregate([
      {
        $match: {
          completedAt: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31)
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $month: '$completedAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const users = Array(12).fill(0);
    const quizzes = Array(12).fill(0);

    userGrowth.forEach(item => { users[item._id - 1] = item.count; });
    quizGrowth.forEach(item => { quizzes[item._id - 1] = item.count; });

    res.status(200).json({
      status: 'success',
      data: {
        labels: months,
        users,
        quizzes
      }
    });
  }),

  // Get category distribution
  getCategoryDistribution: catchAsync(async (req, res, next) => {
    const categories = await Category.find();
    const categoryData = [];

    for (const category of categories) {
      const quizCount = await Quiz.countDocuments({ categoryId: category._id });
      categoryData.push({
        name: category.name,
        count: quizCount
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        labels: categoryData.map(c => c.name),
        values: categoryData.map(c => c.count)
      }
    });
  }),


  getDifficultyDistribution: catchAsync(async (req, res, next) => {
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const difficultyCounts = [];

    for (const difficulty of difficulties) {
      const count = await Quiz.countDocuments({ difficulty });
      difficultyCounts.push(count);
    }

    res.status(200).json({
      status: 'success',
      data: {
        labels: difficulties,
        values: difficultyCounts
      }
    });
  }),

  // Get recent activities
  getRecentActivities: catchAsync(async (req, res, next) => {
    const recentAttempts = await UserAttempt.find({ status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(10)
      .populate('userId', 'userName')
      .populate('quizId', 'title');

    const activities = recentAttempts.map(attempt => ({
      id: attempt._id,
      user: attempt.userId?.userName || 'Unknown User',
      action: 'completed quiz',
      quiz: attempt.quizId?.title || 'Unknown Quiz',
      time: getTimeAgo(attempt.completedAt)
    }));

    res.status(200).json({
      status: 'success',
      data: activities
    });
  })
};

// Helper function
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  return 'Just now';
}

export default adminController;