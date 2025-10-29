// src/clerkDevMock.js
import React from "react";

export const useUser = () => ({
  isSignedIn: true,
  user: {
    firstName: "Dev",
    lastName: "User",
    emailAddress: "dev@localhost",
  },
});

export const SignedIn = ({ children }) => <>{children}</>;
export const SignedOut = () => null;
export const ClerkProvider = ({ children }) => <>{children}</>;
