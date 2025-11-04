import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SubjectSelector from "./subjectselector";
import ChapterSelector from "./chapterselector";
import AnimatedPageWrapper from "../../components/utils/animatedpagewrapper";

export default function TeachingNotes() {
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setAnswers({});
    setSubmitted(false);

    try {
      const res = await fetch("https://api.sunilbasudeo.com/api/generate_notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject?.name || subject,
          chapter: chapter?.name || chapter,
          topic,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server returned ${res.status}: ${txt.slice(0, 400)}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index, value) =>
    setAnswers((prev) => ({ ...prev, [index]: value }));

  const handleSubmit = () => setSubmitted(true);

  const total = data?.questions?.length || 0;
  const score = data?.questions?.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0
  );

  const CorrectIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  const WrongIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Stage 1: Subject selection
  if (!subject) return <SubjectSelector onSelect={(s) => setSubject(s)} />;

  // Stage 2: Chapter selection
  if (subject && !chapter)
    return (
      <ChapterSelector
        subject={subject}
        onSelectChapter={(c) => setChapter(c)}
        onBack={() => setSubject(null)}
      />
    );

  // Stage 3: Notes generator UI
  return (
    <AnimatedPageWrapper title="Teaching Notes" subtitle="Auto-generated notes and quiz for quick revision" center={false}>
      <div className="max-w-5xl w-full mx-auto text-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        >
          <div>
            <Link
              to="/"
              className="text-indigo-400 hover:underline text-sm block mb-2"
              onClick={() => {
                setSubject(null);
                setChapter(null);
              }}
            >
              ← Back to Subjects
            </Link>
            <h1 className="text-2xl font-bold">
              {subject.name} <span className="text-slate-400">→</span>{" "}
              <span className="text-xl font-medium text-indigo-300">
                {chapter.name}
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Generate teaching notes, summary, and mini-quiz.
            </p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setChapter(null)}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              Change Chapter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setSubject(null);
                setChapter(null);
                setData(null);
              }}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              Change Subject
            </motion.button>
          </div>
        </motion.div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., Promissory Note)"
            className="flex-1 bg-slate-800 text-slate-100 border border-slate-700 rounded-lg px-4 py-2 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={fetchData}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              loading
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? "Fetching..." : "Generate"}
          </motion.button>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Loader */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-400 animate-pulse mb-6"
          >
            Generating content...
          </motion.div>
        )}

        {/* Notes & Quiz */}
        <AnimatePresence>
          {data && (
            <motion.div
              key="notes-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-900/60 to-slate-800/60 border border-slate-700 p-6 shadow-xl backdrop-blur-lg space-y-6"
            >
              {/* Title */}
              <div>
                <h2 className="text-2xl font-semibold text-indigo-300 mb-1">
                  {data.title || topic || chapter.name}
                </h2>
                <p className="text-slate-400 text-sm">
                  ⏱ Reading Time: {data.reading_time || "N/A"}
                </p>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">📝 Notes</h3>
                <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-4 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                  {data.notes || "No notes available."}
                </div>
              </div>

              {/* Quiz */}
              {data.questions?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    ✅ True / False Quiz
                  </h3>
                  {data.questions.map((q, i) => (
                    <div
                      key={i}
                      className="bg-slate-900/40 border border-slate-700 rounded-lg p-3 mb-2"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <p className="text-slate-200 text-sm flex-1">
                          {i + 1}. {q.statement}
                        </p>

                        {!submitted ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAnswer(i, true)}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                answers[i] === true
                                  ? "bg-green-600 text-white"
                                  : "bg-slate-700 hover:bg-green-700/40 text-green-300"
                              }`}
                            >
                              ✔ True
                            </button>
                            <button
                              onClick={() => handleAnswer(i, false)}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                answers[i] === false
                                  ? "bg-red-600 text-white"
                                  : "bg-slate-700 hover:bg-red-700/40 text-red-300"
                              }`}
                            >
                              ✖ False
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            {answers[i] === q.answer ? (
                              <div className="flex items-center gap-1 text-green-400">
                                <CorrectIcon /> Right
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-400">
                                <WrongIcon /> Wrong
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {submitted && (
                        <p className="text-slate-400 text-xs mt-2 pl-5 italic">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  {!submitted ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length < total}
                      className={`mt-4 px-5 py-2 rounded-full font-medium transition ${
                        Object.keys(answers).length < total
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      Submit Answers
                    </motion.button>
                  ) : (
                    <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-300">
                      <h4 className="font-semibold text-lg mb-1">
                        🎯 Your Score: {score} / {total}
                      </h4>
                      <p>
                        {score === total
                          ? "Perfect score! Outstanding!"
                          : score >= total / 2
                          ? "Good effort! Keep revising."
                          : "Don’t worry — practice makes perfect."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  📘 Summary
                </h3>
                <div className="bg-slate-900/40 border border-slate-700 p-4 rounded-lg text-slate-200 text-sm">
                  {data.summary || "No summary available."}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPageWrapper>
  );
}
