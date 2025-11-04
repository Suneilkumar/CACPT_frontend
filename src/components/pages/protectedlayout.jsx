import { Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import QuizPage from "./quizpage";
import DailyProgressPage from "./dailyprogresspage";
import LeaderDashboardPage from "./leaderdashboardpage";
import ProfilePage from "./profilepage";
// import TeachingNotes from "./teachingnotes";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import icon from '../../assets/images/icon.svg'

export default function ProtectedLayout() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dailyprogress", label: "Progress" },
    // { path: "/notes", label: "Notes" },
    { path: "/quizpage", label: "Quiz" },
    { path: "/profile", label: "Profile" },
  ];

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Top Navigation */}
      <nav className="backdrop-blur-xl bg-slate-800/50 border-b border-slate-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          {/* Left: Brand + menu toggle */}
          <div className="flex items-center gap-4">
            <button
              className="sm:hidden text-slate-300 hover:text-indigo-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <img
                src={icon}
                alt="MyLearning Logo"
                className="w-6 h-6"
                style={{ filter: "drop-shadow(0 0 6px rgba(99, 102, 241, 0.3))" }}
              />
            
          </div>

          {/* Center: Nav Links */}
          <div className="hidden sm:flex gap-8">
            {links.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-400"
                      : "text-slate-300 hover:text-indigo-300"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="underline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-indigo-400 rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right: Profile avatar with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-slate-600 object-cover"
              />
              <ChevronDown
                size={18}
                className={`text-slate-300 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-44 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 transition"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 transition"
                    >
                      Dashboard
                    </button>

                    <hr className="border-slate-700" />

                    <button
                      onClick={() =>
                        signOut(() => (window.location.href = "/"))
                      }
                      className="px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden flex flex-col px-6 pb-4 gap-2 bg-slate-900/90 border-t border-slate-700 backdrop-blur-lg"
            >
              {links.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm py-2 border-b border-slate-700/30 transition ${
                      isActive
                        ? "text-indigo-400"
                        : "text-slate-300 hover:text-indigo-300"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="min-h-[calc(100vh-64px)]"
          >
            <Routes>
              <Route path="/dashboard" element={<LeaderDashboardPage />} />
              <Route path="/dailyprogress" element={<DailyProgressPage />} />
              {/* <Route path="/notes" element={<TeachingNotes />} /> */}
              <Route path="/quizpage" element={<QuizPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<LeaderDashboardPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
