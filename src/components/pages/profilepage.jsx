import { UserProfile } from "@clerk/clerk-react";
import theme from "../../utils/theme";

export default function ProfilePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: theme.background,
        color: theme.textPrimary,
      }}
    >
      <UserProfile
        appearance={{
          elements: {
            rootBox: {
              backgroundColor: theme.background,
              color: theme.textPrimary,
            },
            card: {
              backgroundColor: theme.cardBackground || theme.background,
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
            headerTitle: {
              color: theme.primary,
            },
            headerSubtitle: {
              color: theme.textSecondary,
            },
            formButtonPrimary: {
              backgroundColor: theme.primary,
              color: theme.buttonText || "#fff",
              borderRadius: "8px",
            },
          },
          variables: {
            colorPrimary: theme.primary,
            colorBackground: theme.background,
            colorText: theme.textPrimary,
            fontFamily: "sans-serif",
          },
        }}
      />
    </div>
  );
}
