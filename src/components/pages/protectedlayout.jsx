import { Routes, Route, NavLink } from "react-router-dom";
import { useClerk, UserProfile } from "@clerk/clerk-react";
import QuizPage from "./quizpage";
import theme from "../../utils/theme";
import DailyProgressPage from "./dailyprogresspage";
import LeaderDashboardPage from "./leaderdashboardpage";
import ProfilePage from "./profilepage";

export default function ProtectedLayout() {
  const { signOut } = useClerk();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.background, color: theme.textPrimary }}
    >
      {/* Top Navigation */}
      <nav
        className="flex items-center justify-between px-8 py-4 shadow-sm"
        style={{ backgroundColor: theme.surface }}
      >
        {/* Left side: Navigation links */}
        <div className="flex gap-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `font-medium hover:text-indigo-600 ${
                isActive ? "text-indigo-600" : "text-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dailyprogress"
            className={({ isActive }) =>
              `font-medium hover:text-indigo-600 ${
                isActive ? "text-indigo-600" : "text-gray-700"
              }`
            }
          >
            Daily Progress
          </NavLink>

          <NavLink
            to="/quizpage"
            className={({ isActive }) =>
              `font-medium hover:text-indigo-600 ${
                isActive ? "text-indigo-600" : "text-gray-700"
              }`
            }
          >
            Quiz
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `font-medium hover:text-indigo-600 ${
                isActive ? "text-indigo-600" : "text-gray-700"
              }`
            }
          >
            Profile
          </NavLink>
        </div>

        {/* Right side: Sign Out button */}
        <button
          onClick={() => signOut(() => (window.location.href = "/"))}
          className={({ isActive }) =>
              `font-medium hover:text-indigo-600 ${
                isActive ? "text-indigo-600" : "text-gray-700"
              }`
            }
        >
          Sign out
        </button>
      </nav>

      {/* Page Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<LeaderDashboardPage />} />
          <Route path="/dailyprogress" element={<DailyProgressPage />} />
          <Route path="/quizpage" element={<QuizPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<LeaderDashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}
