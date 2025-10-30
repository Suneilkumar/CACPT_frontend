import { Routes, Route, NavLink } from "react-router-dom";
import { useClerk, UserProfile } from "@clerk/clerk-react";
import DashboardPage from "./dashboardpage";
import QuizPage from "./quizpage";
import theme from "../../utils/theme";

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
          className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          Sign out
        </button>
      </nav>

      {/* Page Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quizpage" element={<QuizPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}
