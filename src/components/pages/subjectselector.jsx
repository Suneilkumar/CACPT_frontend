
import { SUBJECTS } from "../../constants";
import theme from "../../utils/theme";
import { useClerk } from "@clerk/clerk-react";

export default function SubjectSelector({ onSelect }) {
  const { signOut } = useClerk();
  
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-8" style={{color:theme.textPrimary}}>
          Choose a Subject
        </h1>
        

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSelect(subject)}
              className="p-6 rounded-2xl shadow hover:shadow-lg border transition-transform transform hover:-translate-y-1"
              style={{color: theme.textPrimary,
              backgroundColor: theme.surface,
              borderColor: theme.border,
              boxShadow: `0 4px 10px ${theme.primary}11`}} 
            >
              <div className="text-lg font-semibold"
              style={{color:theme.textPrimary}}
              >
                {subject.name}
              </div>
            
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
