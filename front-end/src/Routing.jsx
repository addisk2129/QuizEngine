import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Questions from './pages/admin/Questions';
import Quizzes from './pages/admin/Quizzes';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './layout/ProtectedRoute';
import Home from './pages/Home';
import Login from './features/authenthication/Login';
import SignUP from './features/authenthication/SignUP';
import ForgotPassword from './features/authenthication/ForgotPassword';
import ResetPassword from './features/authenthication/ResetPassword';
import StartPage from './features/Quiz/StartQuiz';
import TakeQuiz from './pages/TakeQuiz';
import ConfirmationPage from './pages/ConfirmationPage';
import ResultPage from './pages/ResultPage';
import UserLayout from './layout/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import Profile from  './pages/user/Profile';
import UserQuizzes from './pages/user/UserQuizzes';

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/:quizId/questions" element={<Questions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

    <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
        <Route path="/start-quiz/:id" element={<StartPage />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
        <Route path="/confirmation/:id" element={<ConfirmationPage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/my-quizzes" element={<UserQuizzes />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>
    </Routes>
  );
}

export default Routing;