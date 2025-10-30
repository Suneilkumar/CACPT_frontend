
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
  