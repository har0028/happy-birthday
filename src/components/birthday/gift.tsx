import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { Gift } from "lucide-react";

export function SecretGift() {
  const [open, setOpen] = useState(false);
  const [unwrapped, setUnwrapped] = useState(false);

  const launch = () => {
    setOpen(true);
    setTimeout(() => {
      setUnwrapped(true);
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: ["#fde68a", "#ff8ec7", "#c084fc"] });
    }, 1800);
  };

  return (
    <>
      <div className="flex justify-center py-16 night-bg">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={launch}
          className="glass-strong glow-gold relative flex items-center gap-3 rounded-full px-8 py-5 font-display text-xl italic text-gradient-gold md:text-2xl"
          style={{ background: "var(--gradient-romance)" }}
        >
          <Gift className="size-6 text-foreground" />
          <span className="text-foreground">🎁 Open Your Birthday Gift</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
            onClick={() => unwrapped && setOpen(false)}
          >
            {!unwrapped ? (
              <motion.div
                initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                className="relative size-64"
                style={{ perspective: "800px" }}
              >
                <div className="absolute inset-0 rounded-2xl shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #ff8ec7, #c084fc)", boxShadow: "var(--shadow-glow)" }} />
                {/* Ribbon vertical */}
                <motion.div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2"
                  initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ delay: 1, duration: 0.7 }}
                  style={{ background: "linear-gradient(180deg, #fde68a, #f5a524)", transformOrigin: "top" }} />
                {/* Ribbon horizontal */}
                <motion.div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2"
                  initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 1.2, duration: 0.7 }}
                  style={{ background: "linear-gradient(90deg, #fde68a, #f5a524)", transformOrigin: "left" }} />
                {/* Bow */}
                <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl"
                  initial={{ scale: 1, rotate: 0 }} animate={{ scale: 0, rotate: 180 }} transition={{ delay: 0.7 }}>
                  🎀
                </motion.div>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="glass-strong glow-pink mx-auto max-w-lg rounded-3xl p-10 text-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto text-7xl" style={{ filter: "drop-shadow(0 0 30px rgba(255,150,200,0.9))" }}>
                  💖
                </motion.div>
                <p className="mt-6 font-display text-lg italic leading-relaxed text-gradient-romance md:text-xl">
                  "The greatest gift I can ever give you isn't inside this box...
                  <br />It's my promise...
                  <br />That no matter how many birthdays pass...
                  <br />I'll always love you with all my heart.
                  <br /><br />Happy Birthday Bby ❤"
                </p>
                <button onClick={() => setOpen(false)}
                  className="glass mt-8 rounded-full px-6 py-2 text-xs uppercase tracking-widest">
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function EasterEgg() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        aria-label="secret"
        onClick={() => {
          const n = count + 1;
          setCount(n);
          if (n >= 5) { setShow(true); setCount(0); }
        }}
        className="fixed bottom-6 left-6 z-40 text-xs opacity-30 transition hover:opacity-100"
        title=""
      >
        <span className="text-pink">♡</span>
      </button>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/70 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }}
              className="glass-strong glow-pink max-w-md rounded-3xl p-10 text-center">
              <div className="text-6xl">💌</div>
              <p className="mt-6 font-display text-xl italic leading-relaxed text-gradient-romance">
                "No matter how many times you click... you'll never find someone who loves you more than I do. ❤"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
