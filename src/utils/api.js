
const BASE_URL = "https://api.sunilbasudeo.com/api";

export function getAvatarUrl(avatarId) {
    return `https://api.dicebear.com/7.x/identicon/png?seed=${encodeURIComponent(
      avatarId
    )}`;
  }

export async function post(path, body) {
    const res = await fetch(`${BASE_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  }

  export async function get(path, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/${path}?${query}`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  }

// Post the quiz results to server
export function saveQuizResults({ user, results }) {
    return post("quiz_results", {
      user_id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      results,
    });
  }

  export async function fetchQuizSummary({ userId = null, startDate = null, endDate = null } = {}) {
    const params = new URLSearchParams();
    if (userId) params.append("user_id", userId);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
  
    const url = `${BASE_URL}/quiz_summary?${params}`;
    console.log("📡 Fetching from:", url);
  
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  }

  export async function fetchLeaderboard(subject = null) {
    const params = new URLSearchParams();
    if (subject) params.append("subject", subject);
  
    const url = `${BASE_URL}/leaderboard?${params}`;
    console.log("📡 Fetching leaderboard from:", url);
  
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
  
    const data = await res.json();
  
    // The Flask API already returns enriched data:
    // {
    //   userId, email, fullName, imageUrl, avgAccuracy, totalAttempts
    // }
  
    return data.leaderboard || [];
  }
  
  console.log(
    "FetchQuizSummary →",
    JSON.stringify(await fetchQuizSummary(), null, 2)
  );

  // Summarizes all users' daily subject data, filtered by userId
  export function summarizeByDateAndSubject(summaryArray, userId) {
    const filtered = summaryArray.filter((d) => d.user_id === userId);
    const result = {};
  
    filtered.forEach((entry) => {
      const dateKey = entry.date;
      if (!result[dateKey]) result[dateKey] = {};
  
      let totalCorrect = 0;
      let totalAttempts = 0;
      let totalTime = 0;
  
      entry.subjects.forEach((sub) => {
        const subjectName = sub.subject || "Unknown Subject";
        const lastAttemptTime = sub.chapters?.[0]?.last_attempt_time || entry.last_attempt_time;
  
        if (!result[dateKey][subjectName]) {
          result[dateKey][subjectName] = {
            accuracy: Math.round(sub.accuracy || 0),
            total: sub.total_attempts || 0,
            correct: sub.total_correct || 0,
            avgTime: +(sub.avg_time_sec || 0).toFixed(2),
            attempts: 1,
            times: [lastAttemptTime],
          };
        } else {
          // handle multiple sessions on the same day
          const s = result[dateKey][subjectName];
          s.correct += sub.total_correct || 0;
          s.total += sub.total_attempts || 0;
          s.avgTime = +(s.avgTime + sub.avg_time_sec) / 2;
          s.accuracy = Math.round((s.correct / s.total) * 100);
          s.attempts += 1;
          s.times.push(lastAttemptTime);
        }
  
        totalCorrect += sub.total_correct || 0;
        totalAttempts += sub.total_attempts || 0;
        totalTime += sub.total_time || 0;
      });
  
      // Create "Overall" aggregate
      if (totalAttempts > 0) {
        const overallAcc = Math.round((totalCorrect / totalAttempts) * 100);
        result[dateKey]["Overall"] = {
          accuracy: overallAcc,
          total: totalAttempts,
          correct: totalCorrect,
          avgTime: +(totalTime / totalAttempts).toFixed(2),
        };
      }
    });
  
    return result;
  }
  