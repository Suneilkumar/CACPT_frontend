// src/utils/loader.jsx
import React from "react";
import { motion } from "framer-motion";
import theme from "../../utils/theme";

export default function Loader({
  message = "Loading...",
  size = 28,
  center = true,
}) {
  return (
    <div
      className={`flex items-center ${
        center ? "justify-center" : ""
      } gap-3 select-none`}
    >
      {/* Gradient Orb Spinner */}
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${theme.textPrimary} 0%, transparent 70%)`,
          maskImage: "radial-gradient(circle at center, transparent 60%, black 61%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, transparent 60%, black 61%)",
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.4,
          ease: "linear",
        }}
      >
        <div
          className="absolute inset-0 rounded-full blur-sm opacity-30"
          style={{ backgroundColor: "white" }}
        />
      </motion.div>

      {/* Animated Text */}
      <motion.span
        className="text-sm font-medium tracking-wide"
        style={{
          color: theme.textSecondary,
          letterSpacing: "0.02em",
        }}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {message}
      </motion.span>
    </div>
  );
}
