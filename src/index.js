import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const clerkFrontendAPI = process.env.REACT_APP_CLERK_FRONTEND_API;

if (!clerkPubKey) {
  console.error("Missing Clerk publishable key.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      frontendApi={clerkFrontendAPI}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
