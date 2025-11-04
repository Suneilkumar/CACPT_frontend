import { useState } from "react";
import SubjectSelector from "./subjectselector";
import ChapterSelector from "./chapterselector";
import QuestionGrid from "./questiongrid";
import AnimatedPageWrapper from "../../components/utils/animatedpagewrapper";
import { motion } from "framer-motion";

export default function QuizPage() {
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fisher–Yates shuffle (unchanged)
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Fetch & handle chapter selection
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
      setQuestions(shuffled.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError(err.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  // Navigation hierarchy
  if (!subject)
    return <SubjectSelector onSelect={(selectedSubject) => setSubject(selectedSubject)} />;

  if (subject && !chapter)
    return (
      <ChapterSelector
        subject={subject}
        onSelectChapter={(selectedChapter) => handleChapterSelect(selectedChapter)}
        onBack={() => setSubject(null)}
      />
    );

  // Loading state (modernized)
  if (loading)
    return (
      <AnimatedPageWrapper
        title="Loading Questions..."
        subtitle={`${subject.shortID || subject.name} → ${chapter?.shortID || chapter?.name}`}
        onBack={() => setChapter(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center w-full h-[60vh]"
        >
          <div className="animate-pulse text-slate-300 text-lg font-medium">
            Fetching questions...
          </div>
        </motion.div>
      </AnimatedPageWrapper>
    );

  // Error state (modernized)
  if (error)
    return (
      <AnimatedPageWrapper
        title="Something went wrong 😕"
        subtitle={`${subject.name} → ${chapter.name}`}
        onBack={() => setChapter(null)}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-red-400 text-lg font-semibold mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChapterSelect(chapter)}
            className="
              px-5 py-2 rounded-full
              bg-indigo-600 text-white font-medium
              hover:bg-indigo-700 transition-all duration-300
            "
          >
            Retry
          </motion.button>
        </div>
      </AnimatedPageWrapper>
    );

  // Loaded questions
  if (questions.length > 0)
    return <QuestionGrid questions={questions} onBack={() => setChapter(null)} />;

  // No questions found
  return (
    <AnimatedPageWrapper
      title="No Questions Found"
      subtitle={`${subject.name} → ${chapter.name}`}
      onBack={() => setChapter(null)}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-slate-300 mb-4">
          No questions available for this chapter yet.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChapter(null)}
          className="
            mt-2 px-5 py-2 bg-slate-700 text-slate-300 rounded-full
            border border-slate-600 hover:bg-slate-600 hover:text-white
            transition-all duration-300
          "
        >
          ⬅ Back to Chapters
        </motion.button>
      </div>
    </AnimatedPageWrapper>
  );
}
