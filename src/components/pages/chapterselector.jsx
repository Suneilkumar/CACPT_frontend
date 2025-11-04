import { CHAPTERS } from "../../constants";
import { motion } from "framer-motion";
import AnimatedPageWrapper from "../../components/utils/animatedpagewrapper";

export default function ChapterSelector({ subject, onSelectChapter, onBack }) {
  const chapters = CHAPTERS[subject.name] || [];

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
      title={subject.name}
      subtitle="Select a chapter to begin"
      onBack={onBack}
    >
      {/* Centered layout wrapper */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div
          className="
            grid gap-6
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3
            w-full max-w-5xl justify-items-center
          "
        >
          {chapters.map((chapter, idx) => (
            <motion.button
              key={chapter.id}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(99,102,241,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectChapter(chapter)}
              className="
                relative w-full max-w-[260px] p-5 rounded-2xl text-white text-left
                bg-gradient-to-br from-indigo-500/20 via-slate-700/40 to-slate-800/60
                border border-slate-700 backdrop-blur-md
                transition-all duration-300
                hover:from-indigo-600/25 hover:to-slate-700/70
                hover:border-indigo-400 hover:shadow-indigo-400/20
                shadow-md
              "
            >
              <h2 className="text-lg font-semibold mb-1">{chapter.name}</h2>
              {chapter.description && (
                <p className="text-slate-400 text-sm line-clamp-2">
                  {chapter.description}
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}
