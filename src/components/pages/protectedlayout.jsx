import { Routes, Route, NavLink } from "react-router-dom";
import DashboardPage from "./dashboardpage";
import QuizPage from "./quizpage";
import ProfilePage from "../auth/profilepage";
import theme from "../../utils/theme";
import { UserProfile } from "@clerk/clerk-react";

export default function ProtectedLayout() {
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
