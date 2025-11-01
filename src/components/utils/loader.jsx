// src/utils/loader.jsx
import React from "react";
import theme from "../../utils/theme";

export default function Loader({
  message = "Loading...",
  size = 40,
  center = true,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        center ? "absolute inset-0" : "mt-10"
      } space-y-3`}
    >
      <div
        className="animate-spin rounded-full border-4 border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: theme.primary,
          borderTopColor: "transparent",
        }}
      />
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
}
