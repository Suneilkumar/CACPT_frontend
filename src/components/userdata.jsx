import React, { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetch("https://54.152.173.244/api/questions") // example public API
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading users...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">User List</h1>
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <p className="font-semibold text-gray-800">{user.question_text}</p>
            <p className="text-gray-500 text-sm">{user.chapter}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
