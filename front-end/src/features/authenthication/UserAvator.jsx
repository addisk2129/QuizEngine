import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "./authSlice";
import StyledLink from "../../ui/StyledLink";

function UserAvator() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">

      {!isAuthenticated ? (
        <StyledLink
          to="/login"
          className="text-sm md:text-base text-white whitespace-nowrap"
        >
          Sign in
        </StyledLink>
      ) : (
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">

          <button
            onClick={handleLogout}
            className="text-white text-sm md:text-base hover:text-primary-300 transition-colors px-2 py-1"
          >
            Logout
          </button>

          {user?.role === "admin" && (
            <StyledLink
              to="/admin/dashboard"
              className="text-white text-sm md:text-base hover:text-primary-300 transition-colors px-2 py-1 whitespace-nowrap"
            >
              Admin
            </StyledLink>
          )}

          <StyledLink
            to="/profile"
            className="text-white text-sm md:text-base hover:text-primary-300 transition-colors px-2 py-1 whitespace-nowrap"
          >
            Profile
          </StyledLink>

        </div>
      )}

    </div>
  );
}

export default UserAvator;