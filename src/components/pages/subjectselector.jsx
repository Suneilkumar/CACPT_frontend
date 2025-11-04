import { SUBJECTS } from "../../constants";

import { motion } from "framer-motion";
import AnimatedPageWrapper from "../../components/utils/animatedpagewrapper";


export default function SubjectSelector({ onSelect }) {
  

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.08, type: "spring", stiffness: 80 },
    }),
  };

  return (
    <AnimatedPageWrapper
      title="Choose a Subject"
      subtitle="Select a subject to view the leaderboard and start your journey."
    >
      {/* Wrapper to center vertically + horizontally */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div
          className="
            grid gap-6
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3
            w-full max-w-4xl justify-items-center
          "
        >
          {SUBJECTS.map((subject, idx) => (
            <motion.button
              key={subject.id}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(99,102,241,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(subject)}
              className="
                relative w-full max-w-[240px] p-6 rounded-2xl
                text-white font-semibold text-lg text-center
                bg-gradient-to-br from-indigo-500/20 via-slate-700/40 to-slate-800/60
                border border-slate-700 backdrop-blur-md
                transition-all duration-300
                hover:from-indigo-600/25 hover:to-slate-700/70
                hover:border-indigo-400
                shadow-md hover:shadow-indigo-400/20
              "
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-3xl mb-2">{subject.icon ?? "📘"}</span>
                <span className="font-medium">{subject.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}
