import { useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authenthication/authSlice";

import {
  FaTachometerAlt,
  FaUsers,
  FaQuestionCircle,
  FaLayerGroup,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: FaTachometerAlt },
    { path: "/admin/users", name: "Users", icon: FaUsers },
    { path: "/admin/quizzes", name: "Quiz", icon: FaQuestionCircle },
    { path: "/admin/categories", name: "Categories", icon: FaLayerGroup },
    { path: "/admin/settings", name: "Settings", icon: FaCog },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link to="/" className="text-lg font-bold">
            QuizMaster Admin
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <FaTimes />
          </button>
        </div>

        {/* MENU */}
        <nav className="mt-6 space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              <item.icon />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* BACKDROP (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 w-full">

        {/* HEADER */}
        <header className="flex items-center justify-between bg-white shadow px-4 md:px-6 py-3">

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-700"
          >
            <FaBars />
          </button>

          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>

          <div className="flex items-center gap-4">

            {/* NOTIFICATIONS */}
            <button className="relative p-2">
              <FaBell />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* USER */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2"
              >
                <FaUserCircle />
                <span className="hidden sm:block">
                  {user?.firstName || "Admin"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
                  <button
                    onClick={() => navigate("/admin/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;