// pages/user/UserQuizzes.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch, FaStar, FaClock, FaQuestionCircle } from 'react-icons/fa';
import axiosPrivate from '../../utils/axiosPrivate';

function UserQuizzes() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUserQuizzes();
  }, []);

  const fetchUserQuizzes = async () => {
    try {
      const [attemptsRes, allQuizzesRes] = await Promise.all([
        axiosPrivate.get(`/attempts/user/${user?.id}`),
        axiosPrivate.get('/quizzes')
      ]);

      const completedAttempts = attemptsRes.data.data.attempts || [];
      const allQuizzes = allQuizzesRes.data.data.quizzes || [];

      const userQuizzes = allQuizzes?.map(quiz => {
        const attempt = completedAttempts.find(a => a.quizId?._id === quiz._id);
        return {
          id: quiz._id,
          title: quiz.title,
          category: quiz.categoryId?.name || 'General',
          score: attempt?.percentage || null,
          date: attempt?.completedAt,
          questions: quiz.totalQuestions,
          time: quiz.duration,
          completed: !!attempt
        };
      });

      setQuizzes(userQuizzes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes?.filter(quiz => {
    const matchesSearch = quiz?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'completed' && quiz.completed) || (filter === 'pending' && !quiz.completed);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Quizzes</h1>
        <div className="relative w-full sm:w-64"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" /><input type="text" placeholder="Search quizzes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
      </div>

      <div className="flex gap-2 border-b">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-medium transition ${filter === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>All ({quizzes.length})</button>
        <button onClick={() => setFilter('completed')} className={`px-4 py-2 text-sm font-medium transition ${filter === 'completed' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>Completed ({quizzes.filter(q => q.completed).length})</button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 text-sm font-medium transition ${filter === 'pending' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>Pending ({quizzes.filter(q => !q.completed).length})</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuizzes?.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-5">
            <div className="flex justify-between items-start mb-3"><span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{quiz.category}</span>{quiz.completed && <div className="flex items-center gap-1"><FaStar className="text-yellow-400 text-sm" /><span className="text-sm font-semibold text-gray-800">{quiz.score}%</span></div>}</div>
            <h3 className="font-semibold text-gray-800 mb-2">{quiz.title}</h3>
            <div className="flex gap-4 text-sm text-gray-500 mb-4"><span className="flex items-center gap-1"><FaQuestionCircle className="text-xs" /> {quiz.questions} questions</span><span className="flex items-center gap-1"><FaClock className="text-xs" /> {quiz.time} min</span></div>
            {quiz.completed ? (
              <div className="flex items-center justify-between"><span className="text-xs text-gray-400">Completed: {new Date(quiz.date).toLocaleDateString()}</span><button className="text-primary-600 text-sm hover:underline">Review</button></div>
            ) : (
              <button onClick={() => navigate(`/start-quiz/${quiz.id}`)} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">Start Quiz</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserQuizzes;