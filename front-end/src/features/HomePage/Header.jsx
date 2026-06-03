

import Navbar from "./Navbar";
import UserAvator from "../authenthication/UserAvator";
import Logo from "../../ui/Logo";

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-secondary-500 shadow-md shadow-primary-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo — left side */}
        <Logo />

        {/* Nav — center (desktop) / hidden (mobile handled inside Navbar) */}
        <Navbar />

        {/* User Avatar — right side */}
        <div className="flex items-center gap-3">
          <UserAvator />
        </div>
      </div>
    </header>
  );
}

export default Header;


