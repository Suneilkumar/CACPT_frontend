import { CHAPTERS } from "../../constants";
import theme from "../../utils/theme";

export default function ChapterSelector({ subject, onSelectChapter }) {
  const chapters = CHAPTERS[subject.name] || [];

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">
          {subject.name}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter)}
              className="p-2 bg-white rounded-2xl shadow hover:shadow-lg border border-gray-100 transition-transform transform hover:-translate-y-1"
            >
              <div className="text-left text-base font-normal text-gray-800">
                {chapter.name}
              </div>
              
            </button>
          ))}
        </div>

        {/* Optional: Back button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Back to Subjects
        </button>
      </div>
    </div>
  );
}
