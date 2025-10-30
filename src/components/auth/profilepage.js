import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      // Update profile image using Clerk API
      await user.setProfileImage({ file });
    } catch (err) {
      console.error("Error updating avatar:", err);
      setError("Failed to update profile picture.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
          />

          <label
            htmlFor="avatar-upload"
            className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full text-sm font-medium"
          >
            {uploading ? "Uploading..." : "Change Photo"}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {user.fullName || "Unnamed User"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
