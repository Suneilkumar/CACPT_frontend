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
        <h1 className="text-2xl font-bold mb-6"
        style={{color:theme.textPrimary}}
        >
          {subject.name}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter)}
              className="p-4 rounded-2xl shadow hover:shadow-lg border transition-transform transform hover:-translate-y-1"
              style={{color: theme.textPrimary,
              backgroundColor: theme.surface,
              borderColor: theme.border,
              boxShadow: `0 4px 10px ${theme.primary}11`}} 
            >
              <div className="text-left text-base font-normal"
              style={{color:theme.textPrimary}}
              >
                {chapter.name}
              </div>
              
            </button>
          ))}
        </div>

        {/* Optional: Back button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 rounded-lg hover:bg-gray-300"
          style = {{backgroundColor:theme.primary, color: theme.textSecondary}}
        >
          Back to Subjects
        </button>
      </div>
    </div>
  );
}
