import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../../utils/api";

import theme from "../../utils/theme";
import { useUser } from "@clerk/clerk-react";

export default function TestPage({ subject = null }) {
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
  }, []);

  console.log(leaders)


  return (
    <div
      className="p-5 m-5 rounded-xl"
      style={{ backgroundColor: theme.surface }}
    >
      {leaders.map((leader,index)=>{
        <p>{leader.user}</p>

      })}
    </div>
  );
}
