import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../../utils/api";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";
import Loader from "../utils/loader";
import AnimatedPageWrapper from "../../components/utils/animatedpagewrapper";

export default function LeaderDashboardPage({
  subject: initialSubject = "Overall",
  onBack,
}) {
  const SUBJECTS = [
    { label: "Overall", value: "Overall" },
    { label: "Accounts", value: "Accounting" },
    { label: "Law", value: "Business Laws" },
    { label: "Maths", value: "Quantitative Aptitude" },
    { label: "Economics", value: "Business Economics" },
  ];

  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState(initialSubject);
  const { user } = useUser();

  useEffect(() => {
    const subjectParam = subject === "Overall" ? null : subject;
    setLoading(true);
    setError(null);

    fetchLeaderboard(subjectParam)
      .then(setLeaders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [subject, user]);

  const totalSlots = 10;
  const placeholders = Array.from(
    { length: Math.max(0, totalSlots - leaders.length) },
    (_, idx) => ({
      userId: `placeholder-${idx}`,
      fullName: "—",
      avgAccuracy: null,
      totalAttempts: null,
      imageUrl: null,
    })
  );
  const displayList = [...leaders.slice(0, totalSlots), ...placeholders].slice(
    0,
    totalSlots
  );

  const rankStyles = [
    "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-700 shadow-yellow-400/50",
    "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 shadow-gray-400/50",
    "bg-gradient-to-br from-amber-700 via-orange-700 to-orange-900 shadow-orange-600/50",
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.07, type: "spring", stiffness: 80 },
    }),
  };

  const getScale = (idx) => {
    if (idx === 0) return "scale-110 z-10";
    if (idx === 1) return "scale-105";
    if (idx === 2) return "scale-102";
    return "";
  };

  return (
    <AnimatedPageWrapper
      title={`Top 10 Scorers — ${subject}`}
      subtitle="Minimum 3 attempts and securing more than 40%"
      onBack={onBack}
    >
      {/* Subject Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {SUBJECTS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSubject(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border
              ${
                subject === value
                  ? "bg-indigo-500 text-white border-indigo-400 shadow-md"
                  : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader message="" size={48} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center text-red-400 py-10">
          <p className="font-semibold text-lg">Error loading leaderboard</p>
          <p className="text-sm text-slate-400 mt-1">{error.message}</p>
        </div>
      )}

      {/* Leaderboard Grid */}
      {!loading && !error && (
        <AnimatePresence mode="popLayout">
          <div
            className="
              grid gap-6
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
              justify-items-center px-4 sm:px-0
            "
          >
            {displayList.map((u, idx) => {
              const isPlaceholder = !u.avgAccuracy;
              const name =
                !isPlaceholder &&
                (u.fullName?.trim() ||
                  (u.email ? u.email.split("@")[0] : "Anonymous"));

              const rankStyle =
                idx < 3
                  ? `${rankStyles[idx]} text-white`
                  : "bg-slate-800 text-slate-200 border border-slate-700";

              const crownColor =
                idx === 0
                  ? "text-yellow-300"
                  : idx === 1
                  ? "text-gray-200"
                  : idx === 2
                  ? "text-amber-400"
                  : "";

              return (
                <motion.div
                  key={u.userId}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative flex flex-col items-center justify-center
                    p-4 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1
                    transition-all duration-300 w-full max-w-[170px]
                    ${rankStyle} ${getScale(idx)}`}
                >
                  {/* Rank badge */}
                  <div className="absolute -top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-xs text-white">
                    #{idx + 1}
                  </div>

                  {/* Crown for top 3 */}
                  {idx < 3 && (
                    <Crown
                      className={`absolute -top-5 left-1/2 -translate-x-1/2 ${crownColor}`}
                      size={20}
                    />
                  )}

                  {/* Avatar */}
                  <div className="w-16 h-16 mb-3 rounded-full overflow-hidden border-2 border-slate-600 flex items-center justify-center bg-white/10">
                    {u.imageUrl ? (
                      <img
                        src={u.imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-slate-200">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <p className="text-center font-semibold truncate w-full">
                    {isPlaceholder ? "—" : name}
                  </p>

                  {/* Score */}
                  {!isPlaceholder && (
                    <p className="text-center text-sm text-slate-200 mt-1">
                      {u.avgAccuracy.toFixed(1)}%
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </AnimatedPageWrapper>
  );
}
