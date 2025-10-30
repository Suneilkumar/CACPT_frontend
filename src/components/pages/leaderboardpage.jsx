import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../../utils/api";
import LeaderboardCarousel from "./leaderboardc";
import theme from "../../utils/theme";
import { useUser } from "@clerk/clerk-react";

export default function LeaderboardPage({ subject = null }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user} = useUser();

  useEffect(() => {
    fetchLeaderboard(subject)
      .then((data) => {
        // ✅ Your Flask endpoint returns { meta, subject, leaderboard: [...] }
        setLeaders(data.leaderboard || []); 
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [subject]);

  if (loading)
    return <p className="text-center mt-10">Loading leaderboard...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  return (
    <div
      className="p-5 m-5 rounded-xl"
      style={{ backgroundColor: theme.surface }}
    >
      <LeaderboardCarousel
        subject={subject}
        leaders={leaders}
        currentUserId={user?.id} // replace with Clerk user ID
      />
    </div>
  );
}
