import React, { useState, useEffect } from "react";
import theme from "../../utils/theme";
import { fetchQuizSummary, summarizeByDateAndSubject } from "../../utils/api";
import { useUser } from "@clerk/clerk-react";
import Loader from "../utils/loader";

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const SUBJECTS = [
  { label: "Overall", value: "Overall" },
  { label: "Accounts", value: "Accounting" },
  { label: "Law", value: "Business Laws" },
  { label: "Maths", value: "Quantitative Aptitude" },
  { label: "Economics", value: "Business Economics" },
];

export default function DailyProgressPage({
  subject: initialSubject = "Overall",
  initialYear = 2025,
  minYear = 2025,
  maxYear = 2030,
}) {
  const { user } = useUser();
  const [year, setYear] = useState(initialYear);
  const [performance, setPerformance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [subject, setSubject] = useState(initialSubject);

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

  containerWidth = Math.max(300, Math.min(containerWidth, 1200));
  containerHeight = Math.max(400, Math.min(containerHeight, 800));

  const baseScale = Math.min(containerWidth, containerHeight);
  const cellWidth = Math.max(4, Math.min(baseScale * 0.025, 30));
  const gap = Math.max(1, Math.min(baseScale * 0.0025, 4));
  const cellHeight = Math.max(8, Math.min(baseScale * 0.075, 25));
  const rowGap = Math.max(1, Math.min(baseScale * 0.025, 6));
  const labelSpace = Math.max(15, Math.min(baseScale * 0.06, 40));
  const fontSize = Math.max(5, Math.min(baseScale * 0.04, 12));

  const months = Array.from({ length: 12 }, (_, m) => m + 1);

  useEffect(() => {
    async function loadPerformance() {
      if (!user) return;
      try {
        setLoading(true);
        const allData = await fetchQuizSummary();
        const summary = summarizeByDateAndSubject(allData, user.id);
        setPerformance(summary);
      } catch (err) {
        console.error("Error loading quiz summary:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadPerformance();
  }, [user]);

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
            <Loader message="Loading performance..." center size={42} />
          </div>
        )}

        {/* Error message */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-5">
            <p className="text-red-500 font-medium">Failed to load data</p>
            <p className="text-xs text-gray-500 mt-1">{error.message}</p>
          </div>
        )}

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col items-center justify-center transition-opacity ${
            loading ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          {/* Header */}
          <p
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center"
            style={{ color: theme.primary }}
          >
            Daily Summary of attempts taken in {year}
          </p>
          {/* Clarification subtitle */}

          {/* Heatmap container */}
          <div className="flex-1 flex items-center justify-center">
            <svg
              width={labelSpace + 31 * (cellWidth + gap)}
              height={months.length * (cellHeight + rowGap)}
              role="img"
              aria-label={`${subject} performance heatmap for ${year}`}
            >
              {months.map((month, rowIdx) => {
                const monthStr = String(month).padStart(2, "0");
                const totalDays = daysInMonth(year, month);
                const labelY = rowIdx * (cellHeight + rowGap) + cellHeight / 2;

                return (
                  <g key={`${year}-${month}`}>
                    <text
                      x={0}
                      y={labelY}
                      fontSize={fontSize}
                      fill={theme.primary}
                      fontFamily="sans-serif"
                      dominantBaseline="middle"
                      
                    >
                      {`${new Date(year, month - 1).toLocaleString("en", {
                        month: "short",
                      })}→`}
                    </text>

                    {Array.from({ length: totalDays }, (_, dayIdx) => {
                      const day = String(dayIdx + 1).padStart(2, "0");
                      const dateKey = `${year}-${monthStr}-${day}`;
                      const subjectStats = performance[dateKey]?.[subject];
                      const accuracy = subjectStats?.accuracy;

                      let color = theme.background;
                      if (accuracy != null) {
                        if (accuracy >= 75) color = "#22c55e";
                        else if (accuracy >= 50) color = "#eab308";
                        else color = "#ef4444";
                      }

                      return (
                        <rect
                          key={dateKey}
                          x={labelSpace + dayIdx * (cellWidth + gap)}
                          y={rowIdx * (cellHeight + rowGap)}
                          width={cellWidth}
                          height={cellHeight}
                          rx={0.5}
                          fill={color}
                          className="cursor-pointer"
                          onClick={() => {
                            if (performance[dateKey]) setSelectedDate(dateKey);
                          }}
                        >
                          <title>
                            {subjectStats
                              ? `${dateKey}: ${subjectStats.correct}/${subjectStats.total} correct — ${accuracy}%`
                              : `${dateKey}: No attempts`}
                          </title>
                        </rect>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Subject selector at bottom */}
          <div className="flex flex-wrap justify-center gap-1 mt-2 pb-2">
            {SUBJECTS.map(({ label, value }) => (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded-full border transition-all"
                style={{
                  backgroundColor:
                    subject === value ? theme.primary : theme.surface,
                  borderColor:
                    subject === value ? theme.primary : theme.greydisabled,
                  color:
                    subject === value ? theme.textSecondary : theme.textPrimary,
                }}
              >
                <input
                  type="radio"
                  name="subject"
                  value={value}
                  checked={subject === value}
                  onChange={() => setSubject(value)}
                  className="hidden"
                />
                <span className="text-xs font-normal">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Modal for daily detail */}
        {selectedDate && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={() => setSelectedDate(null)}
          >
            <div
              className="rounded-2xl shadow-lg p-6 w-80 max-h-[80vh] overflow-y-auto"
              style={{ backgroundColor: theme.surface }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-2 text-center">
                {selectedDate}
              </h2>

              <div className="space-y-2">
                {subject === "Overall"
                  ? Object.entries(performance[selectedDate] || {})
                      .filter(([sub]) => sub !== "Overall")
                      .map(([sub, stats]) => (
                        <div key={sub} className="border-b pb-1">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-sm">{sub}</p>
                            <span
                              className={`text-sm font-semibold ${
                                stats.accuracy >= 75
                                  ? "text-green-600"
                                  : stats.accuracy >= 50
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {stats.accuracy}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {stats.correct}/{stats.total} correct •{" "}
                            {stats.avgTime}s avg
                          </p>
                        </div>
                      ))
                  : performance[selectedDate]?.[subject] && (
                      <div className="border-b pb-1">
                        {(() => {
                          const stats = performance[selectedDate][subject];
                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <p className="font-medium text-sm">{subject}</p>
                                <span
                                  className={`text-sm font-semibold ${
                                    stats.accuracy >= 75
                                      ? "text-green-600"
                                      : stats.accuracy >= 50
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {stats.accuracy}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {stats.correct}/{stats.total} correct •{" "}
                                {stats.avgTime}s avg
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    )}
              </div>

              <button
                onClick={() => setSelectedDate(null)}
                className="mt-4 w-full text-white text-sm py-1 rounded-md hover:bg-blue-600"
                style={{ backgroundColor: theme.primary }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
