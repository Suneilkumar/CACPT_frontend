import Sidebar from "./components/pages/sidebar";
import QuizGrid from "./components/pages/questiongrid";
import questions from "./assets/questions.json"

const samplequestions = questions.slice(0,10)

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/4 p-5 ">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6">
        <QuizGrid questions={samplequestions}/>
      </main>
    </div>
  );
}
