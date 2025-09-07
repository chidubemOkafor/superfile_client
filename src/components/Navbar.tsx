import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className={`text-2xl font-bold transition-colors duration-300 ${scrolled ? "text-indigo-600" : "text-white"}`}>
          FileVault
        </Link>
        <div>
          <Link
            to="/process-file"
            className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 ${
              scrolled
                ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                : "bg-white/30 text-white shadow-none hover:bg-white/50"
            }`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
