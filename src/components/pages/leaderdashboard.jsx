import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../../utils/api";
import UserAccuracyBar from "./useraccuracybar";
import theme from "../../utils/theme";
import { useUser } from "@clerk/clerk-react";

export default function LeaderboardPage({ subject = null }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user} = useUser();

  useEffect(() => {
    fetchLeaderboard(subject)
      .then(setLeaders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [subject]);

  console.log(leaders)

  if (loading)
    return <p className="text-center mt-10">Loading leaderboard...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="p-2 m-2 rounded-xl"
    style={{backgroundColor:theme.surface}}
    >
      <h1
        className="text-xl font-semibold text-center mb-1"
        style={{ color: theme.primary }}
      >
        {subject ? subject : "Overall"}
      </h1>

      <div className="max-w-4xl mx-auto rounded-2xl p-2">
        <div className="flex flex-wrap justify-center gap-2">
          {leaders.slice(0, 10).map((user, idx) => {
            let displayName =
              user.fullName?.trim() ||
              (user.email ? user.email.split("@")[0] : "Anonymous");

            // If there's an @, take only the part before it
            if (displayName.includes("@")) {
                displayName = displayName.split("@")[0];
            }

            return (
              <div
                key={user.userId}
                className="flex flex-col items-center p-2 rounded-xl w-24 transition"
              >
                <img
                  src={user.imageUrl}
                  alt={displayName}
                  className="w-12 h-12 rounded-full border mt-1 mb-1"
                  style={{
                    boxShadow: `0 0 12px 4px ${theme.primary}55`, // the '55' makes it semi-transparent
                  }}
                  
                />
                <p className="text-center text-xs"
                style={{color:"black"}}
                >
                  {displayName}
                </p>
                <p className="text-xs "
                style={{color:"black"}}
                >
                  {user.avgAccuracy.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  {user.totalAttempts} attempts
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Accuracy bar */}
      <UserAccuracyBar
        leaders={leaders}
        currentUserId={user?.id} // replace with real user.id
      />
    </div>
  );
}
