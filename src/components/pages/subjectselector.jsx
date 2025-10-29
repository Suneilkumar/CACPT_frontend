
import { SUBJECTS } from "../../constants";
import theme from "../../utils/theme";

export default function SubjectSelector({ onSelect }) {
  console.log("Received onSelect:", onSelect);
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">
          Choose a Subject
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSelect(subject)}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg border border-gray-100 transition-transform transform hover:-translate-y-1"
            >
              <div className="text-lg font-semibold text-gray-800">
                {subject.name}
              </div>
            
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
