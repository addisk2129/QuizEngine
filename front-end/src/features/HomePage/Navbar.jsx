
import { useState } from "react";
import StyledScrollLink from "../../ui/StyledScrollLink";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../authenthication/authSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { to: "hero-section", label: "Home" },
    { to: "category-section", label: "Category" },
    { to: "about-section", label: "About" },
  ];

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (result.meta.requestStatus === "fulfilled") {
      setIsOpen(false);
      navigate("/");
    }
  };

  return (
    <>
      {/* ===== DESKTOP NAV ===== */}
      <ul className="hidden md:flex items-center gap-8 text-white text-sm font-medium">
        {navItems.map((item) => (
          <li key={item.to}>
            <StyledScrollLink
              to={item.to}
              smooth
              duration={500}
              offset={-70}
              className="hover:text-primary-300 transition cursor-pointer"
            >
              {item.label}
            </StyledScrollLink>
          </li>
        ))}
        {isAuthenticated && (
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-[#b01e53] transition cursor-pointer font-bold"
            >
              Logout
            </button>
          </li>
        )}
      </ul>

      {/* ===== MOBILE HAMBURGER BUTTON ===== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg text-white hover:bg-white/10 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <span className="text-2xl leading-none">✕</span>
        ) : (
          <span className="text-2xl leading-none">☰</span>
        )}
      </button>

      {/* ===== MOBILE FULL-SCREEN OVERLAY ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* panel — comes from the top */}
          <div
            className="absolute top-0 left-0 right-0 bg-[#0b0412] border-b border-[#b01e53]/30 py-6 px-4 shadow-xl animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button inside the panel */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white text-2xl hover:text-[#b01e53] transition"
              >
                ✕
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <StyledScrollLink
                    to={item.to}
                    smooth
                    duration={500}
                    offset={-70}
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 px-4 text-white text-base rounded-lg hover:bg-white/10 transition cursor-pointer"
                  >
                    {item.label}
                  </StyledScrollLink>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-3 px-4 text-[#b01e53] font-bold text-base rounded-lg hover:bg-white/10 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;