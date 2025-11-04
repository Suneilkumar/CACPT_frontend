import { motion } from "framer-motion";
import { UserProfile, useUser, useClerk } from "@clerk/clerk-react";
import theme from "../../utils/theme";

export default function ProfilePage() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-10 text-white">
      {/* Animated Entry Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 p-6 rounded-2xl bg-slate-800/60 backdrop-blur-lg border border-slate-700 shadow-xl mb-10 transition hover:shadow-indigo-500/20">
          <div className="flex items-center gap-4">
            <motion.img
              src={user.imageUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-indigo-400 object-cover shadow-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
            <div>
              <h1 className="text-2xl font-bold text-indigo-400">
                {user.fullName || "Anonymous User"}
              </h1>
              <p className="text-slate-400 text-sm">{user.primaryEmailAddress?.emailAddress}</p>
              <p className="text-slate-500 text-xs mt-1">
                Joined {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openUserProfile()}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-md hover:bg-indigo-500 transition"
          >
            Change Photo / Edit Profile
          </motion.button>
        </div>

        {/* Clerk’s User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="rounded-2xl p-6 sm:p-8 bg-slate-800/60 backdrop-blur-md border border-slate-700 shadow-2xl"
        >
          <UserProfile
            appearance={{
              elements: {
                rootBox: {
                  width: "100%",
                },
                card: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  width: "100%",
                },
                headerTitle: {
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                },
                headerSubtitle: {
                  color: theme.textSecondary,
                },
                formFieldLabel: {
                  color: theme.textPrimary,
                },
                formFieldInput: {
                  backgroundColor: "rgba(15,23,42,0.6)",
                  color: "white",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border || "#475569"}`,
                },
                formButtonPrimary: {
                  backgroundColor: "rgba(15,23,42,0.6)",
                  color: "white" || "#fff",
                  borderRadius: "8px",
                },
                navbar: {
                  backgroundColor: "transparent",
                  borderRight: "1px solid rgba(148,163,184,0.2)",
                },
                navbarButton: {
                  color: theme.textSecondary,
                },
                navbarButtonActive: {
                  backgroundColor: "rgba(99,102,241,0.2)",
                  color: theme.textPrimary,
                },
              },
              variables: {
                colorPrimary: theme.textSecondary,
                colorBackground: "transparent",
                colorText: theme.textPrimary,
                borderRadius: "1rem",
                fontFamily: "Inter, sans-serif",
              },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
