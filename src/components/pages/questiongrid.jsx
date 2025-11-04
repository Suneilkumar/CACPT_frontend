import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPageWrapper from "../../components/utils/animatedpagewrapper";
import ResultPage from "./resultpage";
import { useUser } from "@clerk/clerk-react";
import { saveQuizResults } from "../../utils/api";
import theme from "../../utils/theme";

export default function QuestionGrid({ questions, onBack }) {
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

  // --- SUBMISSION LOGIC ---
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
      submittedAnswerText: q.options[selectedIndex],
      correctAnswerIndex: q.answer,
      correctAnswerText: q.options[q.answer],
      isCorrect,
      userAction: status,
      timeTaken,
      timestamp: new Date().toISOString(),
      meta: {
        difficulty: q.difficulty,
        subject: q.subject,
        chapter: q.chapter,
        explanation: q.explanation,
      },
    };

    setResults((prev) => {
      const already = prev.find((r) => r.questionId === questionId);
      return already ? prev : [...prev, record];
    });

    if (!isLast) {
      setTimeout(() => {
        setCurrent((c) => c + 1);
        setTimeLeft(initialtime);
        setSelectedIndex(null);
        setStatus("unanswered");
        setLocked(false);
      }, 600);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 600);
    }
  };

  const handleSkip = () => {
    if (locked) return;
    setStatus("skipped");
    setLocked(true);

    const record = {
      questionId: q.id || q.$id || current + 1,
      questionText: q.question_text,
      submittedAnswerIndex: null,
      submittedAnswerText: null,
      correctAnswerIndex: q.answer,
      correctAnswerText: q.options[q.answer],
      isCorrect: false,
      userAction: "skipped",
      timeTaken: initialtime - timeLeft,
      timestamp: new Date().toISOString(),
    };

    setResults((prev) => {
      const already = prev.find((r) => r.questionId === record.questionId);
      return already ? prev : [...prev, record];
    });

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
    }, 600);
  };

  const handleBack = () => {
    if (!isFirst) {
      setTimeLeft(initialtime);
      setCurrent((c) => c - 1);
      setLocked(false);
      setSelectedIndex(null);
      setStatus("unanswered");
    } else {
      onBack?.();
    }
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (locked || showResults) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          if (status === "unanswered") handleSkip();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [locked, showResults, status, current]);

  // --- AUTO SAVE RESULTS ---
  useEffect(() => {
    if (showResults && results.length > 0 && user) {
      saveQuizResults({ user, results });
    }
  }, [showResults, results, user]);

  // --- VARIANTS ---
  const cardVariants = {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -80 },
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (results.length / total) * 100;
  const progress = (timeLeft / initialtime) * circumference;

  const timeRatio = timeLeft / initialtime;
  const timerColor = timeRatio > 0.5 ? theme.primary : "#ef4444";
  let cardBg =
    timeRatio <= 0.25
      ? "bg-rose-50/80"
      : timeRatio <= 0.5
      ? "bg-amber-50/80"
      : "bg-white/90";

  // --- RESULTS ---
  if (showResults) return <ResultPage results={results} total={total} />;

  return (
    <AnimatedPageWrapper
      title="Answer the Questions"
      subtitle={`${q.subject} → ${q.chapter}`}
      onBack={handleBack}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id || q.$id}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="w-full flex justify-center"
        >
          <div
            className={`
              ${cardBg} backdrop-blur-md border border-slate-200/60 
              shadow-xl rounded-2xl p-6 w-full max-w-md text-center transition-all duration-300
            `}
          >
            {/* Back */}
            {!isFirst && (
              <button
                onClick={handleBack}
                className="absolute left-6 top-6 text-sm text-indigo-500 hover:text-indigo-400"
              >
                ← Back
              </button>
            )}

            {/* Timer */}
            <div className="flex justify-center mb-4 mt-2">
              <div className="relative">
                <svg width="50" height="50" className="-rotate-90">
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
                <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-indigo-600">
                  {timeLeft}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-4">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-2 bg-green-500"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {current + 1} / {total}
              </p>
            </div>

            {/* Question */}
            <h2 className="font-semibold text-lg mb-4 text-slate-800">
              {q.question_text}
            </h2>

            <div className="flex flex-col w-full text-left">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setStatus("answered");
                  }}
                  className={`
                    w-full border rounded-lg px-3 py-2 mb-2 text-left
                    transition-all duration-200
                    ${
                      selectedIndex === idx
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 hover:bg-slate-100"
                    }
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleSkip}
                disabled={locked}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  locked
                    ? "opacity-50 cursor-not-allowed bg-slate-300"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                }`}
              >
                Skip
              </button>

              <button
                onClick={handleSubmit}
                disabled={locked || selectedIndex === null}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedIndex === null
                    ? "opacity-50 cursor-not-allowed bg-slate-400"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isLast ? "Finish" : "Submit"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </AnimatedPageWrapper>
  );
}
