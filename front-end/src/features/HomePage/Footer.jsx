import StyledScrollLink from "../../ui/StyledScrollLink";
import { useEffect, useState } from "react";
import axiosPublic from "../../utils/axiosPublic";

function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPublic.get("/categories");
        setCategories(response.data.data.allCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const quickLinks = [
    { to: "hero-section", label: "Home" },
    { to: "category-section", label: "Categories" },
    { to: "about-section", label: "About" },
  ];

  const socials = [
    { label: "Telegram", href: "#" },
    { label: "Github", href: "#" },
    { label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand column */}
        <div className="col-span-2 sm:col-span-2 md:col-span-1">
          <h2 className="text-lg font-bold text-primary-400 font-heading mb-3">
            QuizMaster
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Learn, compete, and grow with thousands of quizzes on every topic.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <StyledScrollLink
                  to={l.to}
                  smooth
                  duration={500}
                  className="text-gray-400 text-sm hover:text-primary-400 transition cursor-pointer"
                >
                  {l.label}
                </StyledScrollLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
            Categories
          </h3>
          <ul className="space-y-2">
            {categories?.slice(0, 5).map((cat) => (
              <li key={cat._id} className="text-gray-400 text-sm hover:text-primary-400 transition cursor-pointer">
                {cat.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
            Connect
          </h3>
          <ul className="space-y-2">
            {socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-gray-400 text-sm hover:text-primary-400 transition"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
          <p>Built with ❤️ for learners worldwide</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;