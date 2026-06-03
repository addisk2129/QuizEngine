// pages/user/Dashboard.jsx - Simplified
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaChartLine, FaTrophy, FaClock, FaStar, FaArrowRight, FaBookOpen, FaFire } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import axiosPrivate from '../../utils/axiosPrivate';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalQuizzes: 0, totalScore: 0, avgScore: 0, totalTime: 0, rank: 0, streak: 0 });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [attemptsRes] = await Promise.all([axiosPrivate.get(`/attempts/user/${user?.id}`)]);
      const attempts = attemptsRes.data.data.attempts || [];
      const completedAttempts = attempts.filter(a => a.status === 'completed');
      
      const totalScore = completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
      const avgScore = completedAttempts.length ? Math.round(totalScore / completedAttempts.length) : 0;
      const totalTime = completedAttempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0);

      setStats({
        totalQuizzes: completedAttempts.length,
        totalScore,
        avgScore,
        totalTime: Math.floor(totalTime / 60),
        rank: Math.floor(Math.random() * 100) + 1,
        streak: Math.floor(Math.random() * 10) + 1
      });

      setRecentQuizzes(attempts.slice(0, 5).map(a => ({
        id: a._id,
        title: a.quizId?.title || 'Quiz',
        score: a.percentage || 0,
        date: a.completedAt,
        duration: Math.floor((a.timeTaken || 0) / 60)
      })));

      setChartData({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ label: 'Your Score', data: [65, 72, 80, 77], borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)', fill: true, tension: 0.4 }]
      });
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Quizzes Taken', value: stats.totalQuizzes, icon: FaBookOpen, color: 'bg-blue-500' },
    { title: 'Total Score', value: stats.totalScore, icon: FaTrophy, color: 'bg-yellow-500' },
    { title: 'Avg Score', value: `${stats.avgScore}%`, icon: FaChartLine, color: 'bg-green-500' },
    { title: 'Study Streak', value: `${stats.streak} days`, icon: FaFire, color: 'bg-orange-500' }
  ];

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.firstName || 'Learner'}! 👋</h1><p className="text-white/80 mt-1">Ready to test your knowledge today?</p></div>
          <button onClick={() => navigate('/categories')} className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-xl flex items-center gap-2 transition">Start New Quiz <FaArrowRight /></button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards?.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex justify-between items-start">
              <div><p className="text-gray-500 text-sm">{stat.title}</p><p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{stat.value}</p></div>
              <div className={`${stat.color} p-3 rounded-xl text-white`}><stat.icon className="text-xl" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border"><h3 className="font-semibold text-gray-800 mb-4">Your Progress</h3><Line data={chartData} options={{ responsive: true }} /></div>
        <div className="bg-white rounded-xl p-5 shadow-sm border"><h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b"><span className="text-gray-600">Total Time Spent</span><span className="font-semibold">{stats.totalTime} min</span></div>
            <div className="flex justify-between items-center pb-3 border-b"><span className="text-gray-600">Global Rank</span><span className="font-semibold">#{stats.rank}</span></div>
            <div className="flex justify-between items-center pb-3 border-b"><span className="text-gray-600">Best Score</span><span className="font-semibold text-green-600">{Math.max(...recentQuizzes.map(q => q.score), 0)}%</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-600">Completion Rate</span><span className="font-semibold">{stats.totalQuizzes ? Math.round((stats.totalQuizzes / (stats.totalQuizzes + 5)) * 100) : 0}%</span></div>
          </div>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-5 py-4 border-b flex justify-between items-center"><h3 className="font-semibold text-gray-800">Recent Quizzes</h3><button onClick={() => navigate('/my-quizzes')} className="text-primary-600 text-sm hover:underline">View All</button></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Quiz</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Score</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Date</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Time</th><th></th></tr></thead>
            <tbody className="divide-y">
              {recentQuizzes?.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{quiz.title}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{quiz.score}%</span></td>
                  <td className="px-5 py-3 text-gray-600">{new Date(quiz.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-gray-600">{quiz.duration} min</td>
                  <td className="px-5 py-3"><button className="text-primary-600 text-sm hover:underline">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;