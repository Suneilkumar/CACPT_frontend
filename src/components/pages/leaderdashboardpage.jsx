import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../../utils/api";
import theme from "../../utils/theme";
import { useUser } from "@clerk/clerk-react";
import Loader from "../utils/loader";


export default function LeaderDashboardPage({
  subject: initialSubject = "Overall",
}) {
  const SUBJECTS = [
    "Overall",
    "Accounting",
    "Business Laws",
    "Quantitative Aptitude",
    "Business Economics",
  ];

  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState(initialSubject);
  const { user } = useUser();

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = dimensions;
  const isPortrait = width < height;

  // Responsive container sizing
  let containerWidth, containerHeight;

  if (width < 640) {
    containerWidth = width * 0.95;
    containerHeight = height * 0.75;
  } else if (width < 1024) {
    containerWidth = isPortrait ? width * 0.9 : width * 0.75;
    containerHeight = isPortrait ? height * 0.7 : height * 0.8;
  } else {
    containerWidth = Math.min(width * 0.7, 1200);
    containerHeight = Math.min(height * 0.8, 750);
  }

  containerWidth = Math.max(280, Math.min(containerWidth, 1200));
  containerHeight = Math.max(400, Math.min(containerHeight, 800));

  const baseScale = Math.min(containerWidth, containerHeight);
  const imgWidth = Math.max(30, Math.min(baseScale * 0.07, 90));
  const textFontSize = Math.max(10, Math.min(baseScale * 0.03, 16));

  // Fetch leaderboard data
  useEffect(() => {
    const subjectParam = subject === "Overall" ? null : subject;
    setLoading(true);
    setError(null);

    fetchLeaderboard(subjectParam)
      .then(setLeaders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [subject, user]);

  // Placeholder fallback for missing entries
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

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        className="relative flex flex-col justify-between rounded-3xl shadow-xl p-6"
        style={{
          backgroundColor: theme.surface,
          width: containerWidth,
          height: containerHeight,
        }}
      >
        {/* Loader overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-3xl z-10">
            <Loader message="Loading ..." center size={42} />
          </div>
        )}

        {/* Error message */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-5">
            <p className="text-red-500 font-medium">
              Error loading leaderboard
            </p>
            <p className="text-xs text-gray-500 mt-1">{error.message}</p>
          </div>
        )}

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col items-center justify-center transition-opacity ${
            loading ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          {/* Title */}
          <p
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-2"
            style={{ color: theme.primary }}
          >
            Top 10 Scorers — {subject}
          </p>

          {/* Clarification subtitle */}
          <p
            className="text-sm sm:text-base md:text-lg text-center font-medium mb-6"
            style={{ color: theme.textPrimary, opacity: 0.85 }}
          >
            Minimum 3 attempts and securing more than 40%
          </p>

          {/* Leaderboard grid */}
          <div className="w-full flex-1 flex items-center justify-center">
            <div
              className="
                grid justify-items-center content-center
                gap-3 sm:gap-4 md:gap-5
                grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
              "
            >
              {displayList.map((u, idx) => {
                const isPlaceholder = !u.avgAccuracy;
                const displayName = isPlaceholder
                  ? ""
                  : (
                      u.fullName?.trim() ||
                      (u.email ? u.email.split("@")[0] : "Anonymous")
                    ).split("@")[0];

                // Glow for top ranks
                let glowColor;
                if (idx === 0) glowColor = "rgba(255, 215, 0, 0.8)"; // gold
                else if (idx === 1)
                  glowColor = "rgba(192, 192, 192, 0.7)"; // silver
                else if (idx === 2)
                  glowColor = "rgba(205, 127, 50, 0.7)"; // bronze
                else glowColor = `${theme.background}55`;

                return (
                  <div
                    key={u.userId}
                    className={`flex flex-col items-center p-2 rounded-xl transition ${
                      isPlaceholder ? "opacity-50" : ""
                    }`}
                  >
                    <div
                      className="rounded-full border mt-1 mb-2 flex items-center justify-center overflow-hidden"
                      style={{
                        width: imgWidth,
                        height: imgWidth,
                        borderColor: theme.primary,
                        boxShadow: `0 0 12px 3px ${glowColor}`,
                        backgroundColor: "#fff",
                      }}
                    >
                      {u.imageUrl ? (
                        <img
                          src={u.imageUrl}
                          alt={displayName}
                          className="object-cover"
                          style={{
                            width: imgWidth - 4,
                            height: imgWidth - 4,
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: textFontSize * 1.2,
                            color: theme.textPrimary,
                          }}
                        >
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    <p
                      className="text-center font-semibold leading-tight"
                      style={{
                        color: theme.textPrimary,
                        fontSize: textFontSize,
                      }}
                    >
                      {displayName || ""}
                    </p>
                    <p
                      className="text-center font-semibold leading-tight"
                      style={{
                        color: theme.textPrimary,
                        fontSize: textFontSize * 0.8,
                      }}
                    >
                      {isPlaceholder ? "" : `${u.avgAccuracy.toFixed(1)}%`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject Selector (at bottom) */}
        <div className="flex flex-wrap justify-center gap-1 mt-2 pb-2">
          {SUBJECTS.map((subj) => (
            <label
              key={subj}
              className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border transition-all"
              style={{
                backgroundColor:
                  subject === subj ? theme.primary : theme.surface,
                borderColor:
                  subject === subj ? theme.primary : theme.greydisabled,
                color:
                  subject === subj ? theme.textSecondary : theme.textPrimary,
              }}
            >
              <input
                type="radio"
                name="subject"
                value={subj}
                checked={subject === subj}
                onChange={() => setSubject(subj)}
                className="hidden"
              />
              <span className="text-sm font-medium">{subj}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
