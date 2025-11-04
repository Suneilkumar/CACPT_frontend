import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { CalendarDays } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { fetchQuizSummary, summarizeByDateAndSubject } from "../../utils/api";
import Loader from "../utils/loader";

const SUBJECTS = [
  { label: "Overall", value: "Overall" },
  { label: "Accounts", value: "Accounting" },
  { label: "Law", value: "Business Laws" },
  { label: "Maths", value: "Quantitative Aptitude" },
  { label: "Economics", value: "Business Economics" },
];

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

export default function DailyProgressPage({ initialYear = 2025 }) {
  const { user } = useUser();
  const [year, setYear] = useState(initialYear);
  const [subject, setSubject] = useState("Overall");
  const [performance, setPerformance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);

  const isMobile = width < 768;
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    async function loadData() {
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
    loadData();
  }, [user]);

  const colorScale = (accuracy) => {
    if (accuracy == null) return "#334155";
    if (accuracy >= 75) return "#22c55e";
    if (accuracy >= 50) return "#eab308";
    return "#ef4444";
  };

  const chartData = Object.entries(performance)
    .map(([date, subj]) => ({
      date,
      accuracy: subj[subject]?.accuracy ?? null,
    }))
    .filter((d) => d.accuracy != null)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays size={36} className="text-indigo-400" />
          <div>
            <h1 className="text-3xl font-bold">Progress Calendar</h1>
            <p className="text-sm text-slate-400">
              {year} — Visual summary of your quiz performance
            </p>
          </div>
        </div>

        {/* Subject selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {SUBJECTS.map(({ label, value }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSubject(value)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                subject === value
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-md"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Loader / Error */}
      {loading && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader message="Loading performance data..." size={48} />
        </div>
      )}

      {!loading && error && (
        <div className="text-red-400 mt-8 text-center">
          Failed to load data: {error.message}
        </div>
      )}

      {/* Calendar + Chart Layout */}
      {!loading && !error && (
        <div
          className={`w-full max-w-6xl flex ${
            isMobile ? "flex-col items-center" : "flex-row justify-between"
          } gap-10`}
        >
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <svg
              width={isMobile ? width * 0.95 : 600}
              height={isMobile ? 580 : 420}
              viewBox={`0 0 ${isMobile ? width * 0.95 : 600} ${isMobile ? 580 : 420}`}
            >
              {months.map((month, rowIdx) => {
                const days = getDaysInMonth(year, month);
                const monthLabel = new Date(year, month - 1).toLocaleString(
                  "en",
                  { month: "short" }
                );
                const y = rowIdx * (isMobile ? 45 : 32) + 30;

                return (
                  <g key={month}>
                    {/* Month label */}
                    <text
                      x={10}
                      y={y + 8}
                      fill="#e2e8f0"
                      fontSize={isMobile ? 11 : 12}
                      fontFamily="Inter, sans-serif"
                      dominantBaseline="middle"
                      textAnchor="start"
                    >
                      {monthLabel}
                    </text>

                    {/* Days row */}
                    {Array.from({ length: days }, (_, d) => {
                      const day = String(d + 1).padStart(2, "0");
                      const dateKey = `${year}-${String(month).padStart(
                        2,
                        "0"
                      )}-${day}`;
                      const stats = performance[dateKey]?.[subject];
                      const accuracy = stats?.accuracy;
                      return (
                        <motion.rect
                          key={dateKey}
                          x={60 + d * (isMobile ? 9.2 : 10.5)}
                          y={y+2}
                          width={isMobile ? 8.5 : 9.5}
                          height={isMobile ? 8.5 : 9.5}
                          rx={2}
                          fill={colorScale(accuracy)}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: d * 0.01 + rowIdx * 0.05,
                            duration: 0.2,
                          }}
                          style={{ cursor: stats ? "pointer" : "default" }}
                          onClick={() => stats && setSelectedDate(dateKey)}
                        >
                          <title>
                            {stats
                              ? `${dateKey}: ${stats.correct}/${stats.total} correct (${accuracy}%)`
                              : `${dateKey}: No attempts`}
                          </title>
                        </motion.rect>
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-xs text-slate-400">
              <span>No attempts</span>
              <div className="w-4 h-4 rounded bg-slate-700" />
              <span>Low</span>
              <div className="w-4 h-4 rounded bg-red-500" />
              <span>Medium</span>
              <div className="w-4 h-4 rounded bg-yellow-400" />
              <span>High</span>
              <div className="w-4 h-4 rounded bg-green-500" />
            </div>
          </motion.div>

          {/* Accuracy Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${
              isMobile ? "w-full max-w-md mt-8" : "flex-1"
            } bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-lg`}
          >
            <h2 className="text-lg font-semibold text-indigo-400 mb-2 text-center">
              Accuracy Trend
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                    itemStyle={{ color: "#38bdf8" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: "#a5b4fc" }}
                    activeDot={{ r: 5, fill: "#818cf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-slate-400 text-sm mt-6">
                No performance data available yet.
              </p>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 w-80 max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <h2 className="text-lg font-semibold text-indigo-400 mb-3 text-center">
                {selectedDate}
              </h2>

              <div className="space-y-2">
                {subject === "Overall"
                  ? Object.entries(performance[selectedDate] || {})
                      .filter(([s]) => s !== "Overall")
                      .map(([s, stats]) => (
                        <div
                          key={s}
                          className="p-2 border border-slate-700 rounded-lg bg-slate-900/50"
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{s}</p>
                            <span
                              className={`text-sm font-semibold ${
                                stats.accuracy >= 75
                                  ? "text-green-400"
                                  : stats.accuracy >= 50
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {stats.accuracy}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {stats.correct}/{stats.total} correct •{" "}
                            {stats.avgTime}s avg
                          </p>
                        </div>
                      ))
                  : performance[selectedDate]?.[subject] && (
                      <div className="p-2 border border-slate-700 rounded-lg bg-slate-900/50">
                        {(() => {
                          const stats = performance[selectedDate][subject];
                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">{subject}</p>
                                <span
                                  className={`text-sm font-semibold ${
                                    stats.accuracy >= 75
                                      ? "text-green-400"
                                      : stats.accuracy >= 50
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {stats.accuracy}%
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                {stats.correct}/{stats.total} correct •{" "}
                                {stats.avgTime}s avg
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-4 w-full text-white text-sm py-2 rounded-md bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setSelectedDate(null)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
