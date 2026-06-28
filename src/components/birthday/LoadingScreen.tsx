import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "./effects";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const total = 3200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 500);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center night-bg"
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Sparkles count={80} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center"
        >
          <div className="mb-8 text-5xl">✨</div>
          <h1 className="font-display text-2xl font-light italic text-gradient-romance md:text-4xl">
            Preparing something special
          </h1>
          <p className="mt-2 font-display text-lg text-pink/80 md:text-2xl">for someone very special...</p>
          <div className="mt-10 h-[3px] w-72 overflow-hidden rounded-full bg-white/10 md:w-96">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress * 100}%`,
                background: "var(--gradient-aurora)",
                boxShadow: "0 0 20px rgba(255,180,220,0.8)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <p className="mt-3 text-xs tracking-[0.3em] text-pink/60">{Math.floor(progress * 100)}%</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
