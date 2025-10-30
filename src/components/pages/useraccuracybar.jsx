import React from "react";
import theme from "../../utils/theme";

export default function UserAccuracyBar({
  leaders = [],
  currentUserId = null,
}) {
  const clamp = (val) => Math.min(Math.max(val ?? 0, 0), 100);

  const currentUser = currentUserId
    ? leaders.find((u) => u.userId === currentUserId)
    : null;
  const currentAcc = currentUser ? clamp(currentUser.avgAccuracy) : null;

  return (
    <div className="w-full p-2 mt-1">
      {/* The horizontal scale */}
      <div
        className="w-full h-3 rounded-full overflow-hidden m-0 p-0"
        style={{
          background: "linear-gradient(to right, #ef4444, #f59e0b, #10b981)", 
          boxShadow: "inset 0 0 0px rgba(0,0,0,0)",
          position: "relative", // ensures child absolute positions use this width
        }}
      >
        {/* gray dots for all users except current */}
        {leaders
          .filter((user) => user.userId !== currentUserId)
          .map((user) => {
            const acc = clamp(user.avgAccuracy);
            return (
              <div
                key={user.userId}
                title={`${user.fullName || user.email}: ${acc.toFixed(1)}%`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${acc}%`,
                  top: "4px",
                  backgroundColor: theme.background,
                  transform: "translateX(-50%)",
                }}
              ></div>
            );
          })}

        {/* glowing marker for current user */}
        {currentAcc !== null && (
          <div
            className="absolute w-2 h-2 rounded-full z-20"
            style={{
              left: `${currentAcc}%`,
              top: "2px",
              backgroundColor: theme.primary,
              boxShadow: `0 0 12px 4px ${theme.primary}55`,
              transform: "translateX(-50%)",
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
