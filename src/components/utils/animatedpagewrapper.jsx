import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function AnimatedPageWrapper({
  title,
  subtitle,
  onBack,
  children,
  center = true,
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-page gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Page content container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        className={`relative z-10 flex flex-col ${
          center ? "items-center justify-center text-center" : ""
        } px-6 py-12 min-h-screen`}
      >
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          {title && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-300 text-sm md:text-base mb-8">
                  {subtitle}
                </p>
              )}
            </>
          )}

          {/* Main content */}
          <div>{children}</div>

          {/* Back button (optional) */}
          {onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                mt-10 px-5 py-2 flex items-center gap-2 rounded-full
                bg-slate-800 text-slate-300 border border-slate-700
                hover:bg-indigo-600 hover:text-white hover:border-indigo-400
                transition-all duration-300 text-sm font-medium
              "
            >
              <ArrowLeft size={16} />
              Back
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
