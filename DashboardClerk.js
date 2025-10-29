import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";

export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-center px-6">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">🚧 Under Construction</h1>
            <p className="text-lg text-gray-300 mb-8">
              We’re working hard to bring you something amazing.<br />
              Our new site will be live soon — stay tuned!
            </p>

            <div className="animate-pulse flex justify-center mb-8">
              <div className="h-3 w-3 bg-yellow-400 rounded-full mx-1"></div>
              <div className="h-3 w-3 bg-yellow-400 rounded-full mx-1 delay-75"></div>
              <div className="h-3 w-3 bg-yellow-400 rounded-full mx-1 delay-150"></div>
            </div>

            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Sunil Basudeo. All rights reserved.
            </p>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
