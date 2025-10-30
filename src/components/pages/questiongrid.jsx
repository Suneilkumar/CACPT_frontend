import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import theme from "../../utils/theme";
import ResultPage from "./resultpage"; // ✅ new import
import { useUser } from "@clerk/clerk-react";
import { saveQuizResults } from "../../utils/api";

export default function QuestionGrid({ questions }) {
  const initialtime = 30;
  const { user } = useUser();
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(initialtime);
  const [locked, setLocked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [status, setStatus] = useState("unanswered");
  const [showResults, setShowResults] = useState(false);

  const q = questions[current];
  const total = questions.length;
  const isLast = current === total - 1;
  const isFirst = current === 0;

  const handleSubmit = () => {
    if (locked || selectedIndex === null) return;
    setLocked(true);

    const questionId = q.id || q.$id || current + 1;
    const timeTaken = initialtime - timeLeft;
    const isCorrect = selectedIndex === q.answer;

    const record = {
      questionId,
      questionText: q.question_text,
      submittedAnswerIndex: selectedIndex,
      submittedAnswerText:
        selectedIndex !== null ? q.options[selectedIndex] : null,
      correctAnswerIndex: q.answer,
      correctAnswerText:
        typeof q.answer === "number" ? q.options[q.answer] : q.answer,
      isCorrect,
      userAction: status,
      timeTaken,
      timestamp: new Date().toISOString(),
      meta: {
        difficulty: q.difficulty,
        subject: q.subject,
        chapter: q.chapter,
        hint: q.hint,
        explanation: q.explanation,
        options: q.options,
        featured: q.featured,
        hot: q.hot,
        topic: q.topic,
        normaltime: q.normaltime,
        giventime: q.giventime,
      },
    };

    setResults((prev) => {
      const already = prev.find((r) => r.questionId === questionId);
      if (!already) return [...prev, record];
      return prev;
    });

    if (!isLast) {
      setTimeout(() => {
        setCurrent((c) => c + 1);
        setTimeLeft(initialtime);
        setSelectedIndex(null);
        setStatus("unanswered");
        setLocked(false);
      }, 500);
    } else {
      setTimeout(() => {
        setShowResults(true);
        console.table([...results, record]);
      }, 500);
    }
  };

  const handleSkip = () => {
    if (locked) return;

    setStatus("skipped");
    setSelectedIndex(null);
    setLocked(true);

    const questionId = q.id || q.$id || current + 1;

    // Build the skip record
    const record = {
      questionId,
      questionText: q.question_text,
      submittedAnswerIndex: null,
      submittedAnswerText: null,
      correctAnswerIndex: q.answer,
      correctAnswerText:
        typeof q.answer === "number" ? q.options[q.answer] : q.answer,
      isCorrect: false,
      userAction: "skipped",
      timeTaken: initialtime - timeLeft,
      timestamp: new Date().toISOString(),
    };

    // Update results (avoid duplicates)
    setResults((prev) => {
      const already = prev.find((r) => r.questionId === questionId);
      if (!already) return [...prev, record];
      return prev;
    });

    // Move to next question or show results
    setTimeout(() => {
      if (!isLast) {
        setCurrent((c) => c + 1);
        setTimeLeft(initialtime);
        setSelectedIndex(null);
        setStatus("unanswered");
        setLocked(false);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  const handleBack = () => {
    if (!isFirst) {
      setTimeLeft(initialtime);
      setCurrent((c) => c - 1);
      setLocked(false);
      setSelectedIndex(null);
      setStatus("unanswered");
    }
  };

  useEffect(() => {
    if (locked || showResults) return; // pause timer when locked or finished

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);

          // register skip automatically
          if (status === "unanswered") {
            setStatus("skipped");

            setResults((prev) => {
              const questionId = q.id || q.$id || current + 1;
              const already = prev.find((r) => r.questionId === questionId);
              if (already) return prev;

              const record = {
                questionId,
                questionText: q.question_text,
                submittedAnswerIndex: null,
                submittedAnswerText: null,
                correctAnswerIndex: q.answer,
                correctAnswerText:
                  typeof q.answer === "number" ? q.options[q.answer] : q.answer,
                isCorrect: false,
                userAction: "skipped",
                timeTaken: initialtime,
                timestamp: new Date().toISOString(),
              };

              return [...prev, record];
            });

            // move to next question after short pause
            setTimeout(() => {
              if (!isLast) {
                setCurrent((c) => c + 1);
                setTimeLeft(initialtime);
                setSelectedIndex(null);
                setStatus("unanswered");
                setLocked(false);
              } else {
                setShowResults(true);
              }
            }, 800);
          }

          return 0; // stop countdown
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [locked, status, current, showResults]);

  const cardVariants = {
    initial: { opacity: 0, x: 120 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -120 },
  };

  const progressPercent = (results.length / total) * 100;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / initialtime) * circumference;
  const timeRatio = timeLeft / initialtime;
  let cardBg = theme.surface;
  if (timeRatio <= 0.25) cardBg = "#FEE2E2";
  else if (timeRatio <= 0.5) cardBg = "#FEF3C7";

  const timerColor = timeRatio > 0.5 ? theme.primary : theme.primary;

  useEffect(() => {
    if (showResults && results.length > 0 && user) {
      saveQuizResults({ user, results });
    }
  }, [showResults, results, user]);

  // ✅ Instead of inline results screen, delegate to component
  if (showResults) {
    return <ResultPage results={results} total={total} />;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: theme.background }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id || q.$id}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="flex justify-center w-full"
        >
          <div
            className="p-4 rounded-2xl shadow-xl border max-w-md w-full flex flex-col items-center relative transition-colors duration-500"
            style={{
              borderColor: theme.border,
              color: theme.textPrimary,
              backgroundColor: cardBg,
            }}
          >
            {!isFirst && (
              <button
                onClick={handleBack}
                className="absolute left-4 top-4 text-sm text-gray-600 hover:text-indigo-600"
                style={{ color: theme.primary }}
              >
                ← Back
              </button>
            )}

            {/* Timer */}
            <div className="flex justify-center mb-3 mt-2">
              <div className="relative">
                <svg width="50" height="50" className="rotate-[-90deg]">
                  <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth="5"
                    fill="none"
                  />
                  <motion.circle
                    cx="25"
                    cy="25"
                    r={radius}
                    stroke={timerColor}
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold"
                style={{color:theme.primary}}
                >
                  {timeLeft}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-4">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-2 bg-green-500"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>

              {/* Label should live below the bar, not inside it */}
              <p className="mt-1 text-sm text-gray-500 text-center"
              style={{color:theme.primary}}
              >
                {current + 1} / {total}
              </p>
            </div>

            {/* Question */}
            <div className="w-full flex flex-col">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{q.subject}</span>
                <span className="capitalize">{q.difficulty}</span>
              </div>

              <h2
                className="font-semibold text-lg mb-4 text-center"
                style={{ color: theme.textPrimary }}
              >
                {q.question_text}
              </h2>

              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setStatus("answered");
                  }}
                  className={`block w-full text-left border border-gray-200 rounded-lg px-3 py-2 mb-2 transition-colors duration-200 hover:bg-[var(--hover-bg)]`}
                  style={{
                    "--hover-bg":
                      selectedIndex === idx
                        ? theme.primary + "20" // 20 = ~12% opacity tint
                        : theme.primary + "10",
                    color:
                      selectedIndex === idx ? theme.primary : theme.textPrimary,
                    borderColor:
                      selectedIndex === idx ? theme.primary : "transparent",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-4 w-full">
            <button
                onClick={handleSkip}
                disabled={locked}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    locked
                      ? "cursor-not-allowed"
                      : "hover:bg-[var(--hover-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--hover-bg)]"
                  }`}
                style={{
                  backgroundColor: locked ? theme.disabled  : theme.primary,
                  color: locked ? theme.textSecondary : theme.surface,
                  "--hover-bg": theme.primaryHover,
                  opacity: locked ? 0.7 : 1,
                }}
              >
                Skip
              </button>

              <button
                onClick={handleSubmit}
                disabled={locked || selectedIndex === null}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    selectedIndex === null
                      ? "cursor-not-allowed"
                      : "hover:bg-[var(--hover-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--hover-bg)]"
                  }`}
                style={{
                  backgroundColor: selectedIndex === null ? theme.disabled  : theme.primary,
                  color: selectedIndex === null ? theme.textSecondary : theme.surface,
                  "--hover-bg": theme.primaryHover,
                  opacity: selectedIndex === null ? 0.7 : 1,
                }}
              >
                {isLast ? "Finish" : "Submit"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
