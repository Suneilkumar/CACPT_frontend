import { useState } from "react";
import theme from "../../utils/theme";
import { SUBJECTS, CHAPTERS } from "../../constants"; // adjust import path

export default function QuizSelector({ onStart }) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  const subjectObj = SUBJECTS.find((s) => s.name === selectedSubject);
  const chapters = selectedSubject ? CHAPTERS[selectedSubject] || [] : [];

  const handleStart = () => {
    if (!selectedSubject || !selectedChapter) return;
    const chapterObj = chapters.find((c) => c.name === selectedChapter);
    onStart({
      subject: subjectObj,
      chapter: chapterObj,
    });
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">
          🧠 Choose Your Quiz
        </h1>

        {/* Subject Dropdown */}
        <label className="block text-left mb-2 text-gray-600 text-sm">
          Select Subject
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedChapter("");
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Select Subject --</option>
          {SUBJECTS.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Chapter Dropdown */}
        <label className="block text-left mb-2 text-gray-600 text-sm">
          Select Chapter
        </label>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          disabled={!selectedSubject}
        >
          <option value="">-- Select Chapter --</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={!selectedSubject || !selectedChapter}
          className={`w-full py-2 rounded-lg font-semibold ${
            !selectedSubject || !selectedChapter
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
