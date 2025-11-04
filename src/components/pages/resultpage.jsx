import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import AnimatedPageWrapper from "../../components/utils/animatedpagewrapper";
import celebration from "../../assets/trophy.json";

export default function ResultsSummary({ results, total, onRetake }) {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const scorePercent = Math.round((correctCount / total) * 100);
  const [filter, setFilter] = useState("all");
  const [flipped, setFlipped] = useState(false);

  // Donut math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scorePercent / 100) * circumference;

  // Color logic
  let scoreColor = "#EF4444";
  if (scorePercent >= 80) scoreColor = "#22C55E";
  else if (scorePercent >= 50) scoreColor = "#F59E0B";

  const filteredResults = useMemo(() => {
    if (filter === "wrong") return results.filter((r) => !r.isCorrect);
    if (filter === "skipped")
      return results.filter((r) => r.submittedAnswerText === null);
    return results;
  }, [filter, results]);

  // Entry motion for the entire card
  const entryVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <AnimatedPageWrapper
      title="Quiz Results"
      subtitle="Here’s how you performed"
      center={true}
    >
      <div className="flex items-center justify-center w-full min-h-[70vh] px-4">
        <motion.div
          variants={entryVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-3xl h-[70vh] max-h-[600px] rounded-3xl"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1200px",
          }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* FRONT SIDE */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-10
              bg-gradient-to-br from-indigo-500/10 via-slate-700/20 to-slate-800/30 border border-slate-700 
              rounded-3xl backdrop-blur-md"
              style={{
                transform: "rotateY(0deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                Quiz Completed!
              </h1>

              {/* Donut */}
              <div
                className="relative flex items-center justify-center mb-6 cursor-pointer"
                onClick={() => setFlipped(true)}
              >
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  className="-rotate-90"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="rgba(255,255,255,0.1)"
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
                  <span className="text-5xl font-bold text-white">
                    {scorePercent}%
                  </span>
                </div>
              </div>

              {scorePercent > 70 && (
                <motion.div
                  className="w-28 h-28 sm:w-32 sm:h-32 mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Lottie animationData={celebration} loop={false} />
                </motion.div>
              )}

              <p className="text-slate-300 text-sm mt-4 max-w-sm">
                {scorePercent >= 80
                  ? "Excellent! You really know your stuff."
                  : scorePercent >= 50
                  ? "Good job! Keep practicing."
                  : "Don’t worry — every quiz is a step toward mastery."}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRetake}
                  className="px-6 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-300"
                >
                  Retake Quiz
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFlipped(true)}
                  className="px-6 py-2 rounded-full bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:text-white transition-all duration-300"
                >
                  View Details ↻
                </motion.button>
              </div>
            </div>

            {/* BACK SIDE */}
            <div
              className="
              absolute inset-0 rounded-3xl p-5 sm:p-8 overflow-y-auto 
              backdrop-blur-lg bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/95 
              border border-slate-700 text-left
            "
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <h2 className="text-xl font-semibold mb-4 text-center text-white">
                Detailed Review
              </h2>

              {/* Filters */}
              <div className="flex justify-center gap-3 mb-6">
                {["all", "wrong", "skipped"].map((f) => (
                  <motion.button
                    key={f}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-sm border font-medium transition-all duration-300 ${
                      filter === f
                        ? "bg-indigo-600 text-white border-indigo-400"
                        : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
                    }`}
                  >
                    {f === "all"
                      ? "All"
                      : f === "wrong"
                      ? "Wrong Answers"
                      : "Skipped"}
                  </motion.button>
                ))}
              </div>

              {/* Questions */}
              <div className="space-y-3 mb-6">
                {filteredResults.length === 0 ? (
                  <p className="text-center text-slate-400 italic">
                    No questions in this category.
                  </p>
                ) : (
                  filteredResults.map((r, idx) => (
                    <motion.div
                      key={r.questionId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl p-4 border text-sm ${
                        r.isCorrect
                          ? "border-green-500/60 bg-green-500/10"
                          : "border-red-500/60 bg-red-500/10"
                      }`}
                    >
                      <p className="font-semibold text-white mb-1">
                        Q{idx + 1}. {r.questionText}
                      </p>
                      <p className="text-slate-300 mb-1">
                        <span className="font-medium text-slate-200">
                          Your answer:
                        </span>{" "}
                        <span
                          className={
                            r.isCorrect ? "text-green-400" : "text-red-400"
                          }
                        >
                          {r.submittedAnswerText || "— Skipped —"}
                        </span>
                      </p>
                      <p className="text-slate-300">
                        <span className="font-medium text-slate-200">
                          Correct answer:
                        </span>{" "}
                        <span className="text-green-400">
                          {r.correctAnswerText}
                        </span>
                      </p>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Back button */}
              <div className="text-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFlipped(false)}
                  className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-300"
                >
                  ↻ Back to Summary
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedPageWrapper>
  );
}
