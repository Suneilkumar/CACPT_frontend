import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
      <h1 className="text-4xl font-bold">Welcome to My App</h1>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <p className="text-lg">You’re signed in!</p>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
