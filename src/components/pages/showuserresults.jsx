import { useEffect, useState } from "react";
import { fetchQuizSummary } from "../../utils/api";

export default function UserQuizSummary({ user }) {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchQuizSummary({ userId: user?.id });
        setSummaries(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <p className="p-4 text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!summaries.length)
    return (
      <p className="p-4 text-gray-500">
        No quiz data available yet. Take a quiz to see your summary here.
      </p>
    );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-indigo-700">
        📊 Quiz Performance Dashboard
      </h2>

      {summaries.map((day, i) => (
        <div key={i} className="border rounded-lg shadow-sm p-4 bg-white">
          <div className="mb-2 flex justify-between items-center">
            <h3 className="font-semibold text-indigo-700">
              {day.date} — {day.email}
            </h3>
            <span className="text-sm text-gray-500">
              Last Attempt: {day.last_attempt_time}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            Total Attempts: {day.total_attempts} | Correct: {day.total_correct}/
            {day.total_questions} |{" "}
            <span className="font-medium text-green-700">
              {day.accuracy}% accuracy
            </span>{" "}
            | Avg Time: {day.avg_time_sec}s/question
          </p>

          {/* Subject Breakdown */}
          {day.subjects.map((subject, si) => (
            <div key={si} className="mb-4 border-t pt-2">
              <h4 className="font-medium text-indigo-600">
                {subject.subject}{" "}
                <span className="text-sm text-gray-500">
                  ({subject.accuracy}% accuracy, avg {subject.avg_time_sec}s)
                </span>
              </h4>

              {/* Chapter Table */}
              <table className="w-full text-sm border mt-1">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border px-2 py-1 text-left">Chapter</th>
                    <th className="border px-2 py-1 text-center">Attempts</th>
                    <th className="border px-2 py-1 text-center">Correct</th>
                    <th className="border px-2 py-1 text-center">% Accuracy</th>
                    <th className="border px-2 py-1 text-center">
                      Avg Time (s)
                    </th>
                    <th className="border px-2 py-1 text-center">
                      Last Attempt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subject.chapters.map((ch, ci) => (
                    <tr key={ci} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{ch.chapter}</td>
                      <td className="border px-2 py-1 text-center">
                        {ch.attempts}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {ch.correct}
                      </td>
                      <td
                        className={`border px-2 py-1 text-center font-medium ${
                          ch.accuracy >= 80
                            ? "text-green-600"
                            : ch.accuracy >= 50
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {ch.accuracy}%
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {ch.avg_time_sec}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {ch.last_attempt_time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
