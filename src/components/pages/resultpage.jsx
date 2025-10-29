import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import theme from "../../utils/theme";

export default function ResultsSummary({ results, total, onRetake }) {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const scorePercent = Math.round((correctCount / total) * 100);
  const [filter, setFilter] = useState("all");
  const [flipped, setFlipped] = useState(false);

  // Donut geometry
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scorePercent / 100) * circumference;

  // Dynamic color
  let scoreColor = "#EF4444";
  if (scorePercent >= 80) scoreColor = "#22C55E";
  else if (scorePercent >= 50) scoreColor = "#F59E0B";

  // Filtered questions
  const filteredResults = useMemo(() => {
    if (filter === "wrong") return results.filter((r) => !r.isCorrect);
    if (filter === "skipped")
      return results.filter((r) => r.submittedAnswerText === null);
    return results;
  }, [filter, results]);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundColor: theme.background,
        perspective: "1000px",
      }}
    >
      <motion.div
        className="relative w-[95%] max-w-3xl min-h-[520px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* FRONT SIDE - Donut Summary */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center text-center p-6"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            zIndex: flipped ? 0 : 2,
          }}
        >
          <h1 className="text-2xl font-bold mb-6 text-indigo-700">
            Quiz Completed!
          </h1>

          {/* ✅ Donut Chart */}
          <div
            className="relative flex items-center justify-center mb-6 cursor-pointer"
            onClick={() => setFlipped(true)}
          >
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="rotate-[-90deg]"
            >
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="15"
                fill="none"
              />
              <motion.circle
                cx="100"
                cy="100"
                r={radius}
                stroke={scoreColor}
                strokeWidth="15"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold text-gray-800">
                {scorePercent}%
              </span>
              
            </div>
          </div>

          <p className="text-gray-600 mb-2">
            Correct Answers: {correctCount} / {total}
          </p>
          <p
            className={`text-sm font-medium ${
              scorePercent >= 80
                ? "text-green-600"
                : scorePercent >= 50
                ? "text-amber-600"
                : "text-red-600"
            }`}
          >
            
          </p>

        
          <p
            onClick={() => setFlipped(true)}
            className="mt-4 text-indigo-600 text-sm hover:underline cursor-pointer"
          >
            View Detailed Summary ↻
          </p>
        </div>

        {/* BACK SIDE - Detailed Review */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-y-auto p-6 text-left"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 text-center">
            Detailed Review
          </h2>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            {["all", "wrong", "skipped"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  filter === f
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "wrong"
                  ? "Wrong Answers"
                  : "Skipped"}
              </button>
            ))}
          </div>

          {/* Question-wise Summary */}
          <div className="space-y-3 mb-6">
            {filteredResults.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                No questions in this category.
              </p>
            ) : (
              filteredResults.map((r, idx) => (
                <div
                  key={r.questionId}
                  className="border rounded-lg p-3 text-sm"
                  style={{
                    borderColor: r.isCorrect ? "#22C55E" : "#EF4444",
                    backgroundColor: r.isCorrect
                      ? "rgba(34,197,94,0.08)"
                      : "rgba(239,68,68,0.08)",
                  }}
                >
                  <div className="font-medium mb-1">
                    Q{idx + 1}. {r.questionText}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Your answer:</span>{" "}
                    <span
                      className={
                        r.isCorrect ? "text-green-700" : "text-red-600"
                      }
                    >
                      {r.submittedAnswerText || "— Skipped —"}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Correct answer:</span>{" "}
                    <span className="text-green-700">{r.correctAnswerText}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <p
              onClick={() => setFlipped(false)}
              className="text-indigo-600 text-sm hover:underline cursor-pointer"
            >
              ↻ Back to Summary
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
