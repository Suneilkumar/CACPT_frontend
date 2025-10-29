import { useClerk } from "@clerk/clerk-react";

export default function DashboardPage() {
  const { signOut } = useClerk();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">My App</h1>
      <button
        onClick={() => signOut(() => window.location.href = "/")}
        className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition"
      >
        Sign out
      </button>
    </nav>
  );
}