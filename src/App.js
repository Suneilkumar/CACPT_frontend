import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/auth/Home";
import Home from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sign In */}
        <Route
          path="/sign-in/*"
          element={
            <SignIn
              routing="path"
              path="/sign-in"
              afterSignInUrl="/dashboard"   // 👈 redirect here after login
              afterSignUpUrl="/dashboard"   // 👈 redirect here after signup
            />
          }
        />

        {/* Sign Up */}
        <Route
          path="/sign-up/*"
          element={
            <SignUp
              routing="path"
              path="/sign-up"
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />
          }
        />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Public home page */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
