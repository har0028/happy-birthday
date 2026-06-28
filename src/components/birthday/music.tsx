import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [open, setOpen] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  useEffect(() => {
    const tryPlay = async () => {
      try {
        await audioRef.current?.play();
        setPlaying(true);
      } catch {
        // Browsers block autoplay; wait for first interaction
        const onClick = async () => {
          try { await audioRef.current?.play(); setPlaying(true); } catch {}
          window.removeEventListener("pointerdown", onClick);
        };
        window.addEventListener("pointerdown", onClick, { once: true });
      }
    };
    tryPlay();
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { try { await a.play(); setPlaying(true); } catch {} }
    else { a.pause(); setPlaying(false); }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/background.mp3"
        loop
        preload="auto"
        onError={() => setHasAudio(false)}
      />
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="glass-strong flex items-center gap-3 overflow-hidden rounded-full px-4 py-2"
            >
              {volume === 0 ? <VolumeX className="size-4 text-pink" /> : <Volume2 className="size-4 text-pink" />}
              <input
                type="range" min={0} max={1} step={0.01} value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 w-28 accent-pink"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggle}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="glass-strong glow-pink flex size-14 items-center justify-center rounded-full text-pink transition hover:scale-110"
          aria-label={playing ? "Pause music" : "Play music"}
          title={hasAudio ? "Romantic piano" : "Add /public/audio/background.mp3"}
        >
          {playing ? <Pause className="size-6" /> : <Play className="size-6 translate-x-0.5" />}
        </button>
      </motion.div>
    </>
  );
}
