// pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { FaUsers, FaQuestionCircle, FaLayerGroup, FaTrophy, FaEye, FaStar } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import axiosPrivate from '../../utils/axiosPrivate';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalCategories: 0,
    totalQuizzesTaken: 0,
    avgScore: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [growthData, setGrowthData] = useState({ users: [], quizzes: [] });
  const [categoryDistribution, setCategoryDistribution] = useState({ labels: [], data: [] });
  const [difficultyData, setDifficultyData] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await axiosPrivate.get('/admin/stats');
       console.log("statsResponse ",statsResponse)

      setStats({
        totalUsers: statsResponse.data.data.totalUsers,
        totalQuestions: statsResponse.data.data.totalQuestions,
        totalCategories: statsResponse.data.data.totalCategories,
        totalQuizzesTaken: statsResponse.data.data.totalQuizzesTaken || 0,
        avgScore: statsResponse.data.data.avgScore || 78,
        activeUsers: statsResponse.data.data.activeUsers || 342
      });


      const growthResponse = await axiosPrivate.get('/admin/growth');
       console.log("growthResponse ",growthResponse)
      setGrowthData({
        users: growthResponse.data.data.users,
        quizzes: growthResponse.data.data.quizzes
      });

  
      const categoryResponse = await axiosPrivate.get('/admin/category-distribution');
       console.log("categoryResponse ",categoryResponse)
      setCategoryDistribution({
        labels: categoryResponse.data.data.labels,
        data: categoryResponse.data.data.values
      });

      const difficultyResponse = await axiosPrivate.get('/admin/difficulty-distribution');
       console.log("difficultyResponse ",difficultyResponse)
      setDifficultyData({
        labels: difficultyResponse.data.data.labels,
        data: difficultyResponse.data.data.values
      });


      const activitiesResponse = await axiosPrivate.get('/admin/recent-activities');
       console.log("activitiesResponse ",activitiesResponse)
      setRecentActivities(activitiesResponse.data.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: FaUsers, color: 'bg-blue-500', change: '+12%' },
    { title: 'Total Questions', value: stats.totalQuestions, icon: FaQuestionCircle, color: 'bg-green-500', change: '+8%' },
    { title: 'Categories', value: stats.totalCategories, icon: FaLayerGroup, color: 'bg-purple-500', change: '+5%' },
    { title: 'Quizzes Taken', value: stats.totalQuizzesTaken, icon: FaTrophy, color: 'bg-orange-500', change: '+23%' }
  ];

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Users',
        data: growthData.users.length ? growthData.users : [650, 780, 890, 1020, 1150, 1245, 1320, 1450, 1580, 1690, 1780, 1890],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Quizzes Taken',
        data: growthData.quizzes.length ? growthData.quizzes : [320, 450, 580, 720, 890, 1050, 1250, 1420, 1650, 1820, 1980, 2150],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const barChartData = {
    labels: categoryDistribution.labels.length ? categoryDistribution.labels : ['Programming', 'Web Dev', 'Languages', 'Math', 'Science', 'History'],
    datasets: [
      {
        label: 'Quizzes',
        data: categoryDistribution.data.length ? categoryDistribution.data : [45, 38, 32, 28, 25, 22],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
        borderRadius: 8
      }
    ]
  };

  const doughnutChartData = {
    labels: difficultyData.labels.length ? difficultyData.labels : ['Beginner', 'Intermediate', 'Advanced'],
    datasets: [
      {
        data: difficultyData.data.length ? difficultyData.data : [35, 45, 20],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value.toLocaleString()}</p>
                <span className="text-green-500 text-sm mt-2 inline-block">{stat.change}</span>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                <stat.icon className="text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Overview</h3>
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Difficulty</h3>
          <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
          <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaEye className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium text-primary-600">{activity.quiz}</span>
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-primary-600 text-sm font-medium hover:text-primary-700">
            View All Activity →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;