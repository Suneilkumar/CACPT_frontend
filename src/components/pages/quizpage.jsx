import { useState } from "react";
import SubjectSelector from "./subjectselector";
import ChapterSelector from "./chapterselector";
import QuestionGrid from "./questiongrid";

export default function QuizPage() {
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleChapterSelect = async (chapter) => {
    try {
      setLoading(true);
      setError(null);
      setChapter(chapter);

      const url = new URL("https://api.sunilbasudeo.com/api/questions/search");
      url.searchParams.append("subject", subject.name);
      url.searchParams.append("chapter", chapter.name);
      url.searchParams.append("page", 1);
      url.searchParams.append("per_page", 50);

      console.log("Fetching:", url.toString());
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      console.log("Received data:", data);

      // Shuffle before storing
      const shuffled = shuffleArray(data.items || []);
      setQuestions(shuffled.slice(0,10));
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError(err.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  if (!subject)
    return <SubjectSelector onSelect={(selectedSubject) => setSubject(selectedSubject)} />;

  if (subject && !chapter)
    return <ChapterSelector subject={subject} onSelectChapter={(selectedChapter) => handleChapterSelect(selectedChapter)} />;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading questions for {subject.shortID} → {chapter.shortID}...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p className="mb-4 font-semibold">❌ {error}</p>
        <button
          onClick={() => handleChapterSelect(chapter)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );

  if (questions.length > 0) return <QuestionGrid questions={questions} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
      <p>No questions found for {subject.shortID} → {chapter.shortID}.</p>
      <button
        onClick={() => setChapter(null)}
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        ⬅ Back to Chapters
      </button>
    </div>
  );
}