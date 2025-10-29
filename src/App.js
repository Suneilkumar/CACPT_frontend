import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import "./index.css";
import ProtectedLayout from "./components/pages/protectedlayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ----------- Auth Routes ----------- */}
        <Route
          path="/sign-in/*"
          element={
            <SignIn
              routing="path"
              path="/sign-in"
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />
          }
        />

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

        {/* ----------- Protected Routes ----------- */}
        <Route
          path="/*"
          element={
            <>
              <SignedIn>
                <ProtectedLayout />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
