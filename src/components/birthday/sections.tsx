import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { StarField, FloatingHearts, FloatingEmojis, Sparkles, Moon, Aurora } from "./effects";

/* ---------- Landing ---------- */
export function LandingScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse parallax
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMx((e.clientX / window.innerWidth - 0.5) * 30);
      setMy((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden night-bg">
      <StarField density={300} />
      <Moon className="right-10 top-10" />
      <FloatingEmojis emojis={["🏮", "🎈", "🦋", "✨"]} count={24} />
      <FloatingHearts count={10} />

      <motion.div
        style={{ y, opacity, x: mx, translateY: my }}
        className="relative z-10 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 2, delay: 0.5 }}
          className="mb-6 text-xs uppercase text-pink/70 md:text-sm"
        >
          For my Bacha · Cutie · Bby
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1 }}
          className="font-display text-4xl font-light italic leading-tight md:text-7xl"
        >
          <span className="text-gradient-romance">Someone very special</span>
          <br />
          <span className="text-foreground/90">has a birthday today</span>
          <span className="ml-3 inline-block animate-pulse text-rose">❤</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.5 }}
          className="mt-10 text-sm text-pink/60"
        >
          ↓ scroll into the magic ↓
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ---------- Cake ---------- */
function Candle({ lit, onBlown, idx }: { lit: boolean; onBlown: () => void; idx: number }) {
  return (
    <div className="relative flex flex-col items-center" style={{ animationDelay: `${idx * 100}ms` }}>
      <div className="relative h-8 w-2">
        {lit ? (
          <>
            <div
              className="absolute inset-x-1/2 -top-6 h-7 w-3 -translate-x-1/2 rounded-full animate-flicker"
              style={{
                background: "radial-gradient(circle at 50% 70%, #fff7c2 0%, #ffd368 40%, #ff8a3c 70%, transparent 100%)",
                boxShadow: "0 -10px 30px rgba(255,180,80,0.9), 0 0 60px rgba(255,120,40,0.6)",
                filter: "blur(0.5px)",
              }}
            />
            <div
              className="absolute inset-x-1/2 -top-3 h-3 w-1 -translate-x-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, #ffffff, #fff5b0 60%, transparent)" }}
            />
          </>
        ) : (
          <>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="absolute inset-x-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white/20"
                style={{
                  top: `-${10 + i * 12}px`,
                  filter: "blur(4px)",
                  animation: `float-up ${3 + i}s ease-out forwards`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.5,
                }}
              />
            ))}
          </>
        )}
        <div className="h-full w-full rounded-sm" style={{ background: `linear-gradient(180deg, ${idx % 2 ? "#ffb6d9" : "#d6b3ff"}, ${idx % 2 ? "#e478ad" : "#9d6cd9"})` }} />
      </div>
    </div>
  );
}

export function CakeScene({ onContinue }: { onContinue: () => void }) {
  const NUM = 22;
  const [candles, setCandles] = useState<boolean[]>(() => Array(NUM).fill(true));
  const [micState, setMicState] = useState<"idle" | "listening" | "denied" | "celebrating">("idle");
  const [dark, setDark] = useState(false);
  const allOut = candles.every(c => !c);

  useEffect(() => {
    if (allOut && micState !== "celebrating") {
      setMicState("celebrating");
      setDark(true);
      setTimeout(() => {
        setDark(false);
        // Massive fireworks
        const burst = () => {
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: ["#ff8ec7", "#c084fc", "#fde68a", "#ffffff"] });
          confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } });
          confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } });
        };
        burst();
        const i1 = setInterval(burst, 600);
        setTimeout(() => clearInterval(i1), 3500);
        setTimeout(onContinue, 6000);
      }, 1000);
    }
  }, [allOut, micState, onContinue]);

  const blowOneCandle = () => {
    setCandles(prev => {
      const idx = prev.findIndex(c => c);
      if (idx === -1) return prev;
      const next = [...prev]; next[idx] = false; return next;
    });
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicState("listening");
      const ac = new AudioContext();
      const src = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let lastBlow = 0;
      const loop = () => {
        analyser.getByteFrequencyData(data);
        // Wind/blow energy concentrated in low-mid frequencies
        let lowMid = 0;
        for (let i = 5; i < 60; i++) lowMid += data[i];
        const avg = lowMid / 55;
        const now = performance.now();
        if (avg > 70 && now - lastBlow > 250) {
          lastBlow = now;
          blowOneCandle();
        }
        if (!allOut) requestAnimationFrame(loop);
      };
      loop();
    } catch {
      setMicState("denied");
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden night-bg py-20">
      <Sparkles count={60} />
      <FloatingEmojis emojis={["🎈", "🎀", "✨", "💖"]} count={20} />
      {dark && <div className="absolute inset-0 z-30 bg-black" />}

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display text-4xl italic text-gradient-romance md:text-6xl"
        >
          Make A Wish <span className="text-rose">❤</span>
        </motion.h2>

        {/* 3D-ish cake */}
        <div className="relative mx-auto mt-16 w-fit" style={{ perspective: "1200px" }}>
          {/* Glow base */}
          <div className="absolute inset-0 -z-10 rounded-full"
            style={{ background: "radial-gradient(ellipse at center, rgba(255,180,220,0.5), transparent 60%)", filter: "blur(30px)" }} />
          {/* Candles */}
          <div className="flex justify-center gap-2 pb-4">
            {candles.map((lit, i) => (<Candle key={i} idx={i} lit={lit} onBlown={() => {}} />))}
          </div>
          {/* Tier 1 */}
          <div className="mx-auto h-24 w-56 rounded-t-lg shadow-2xl"
            style={{ background: "linear-gradient(180deg, #ffe4f1, #ffb6d9 60%, #c084fc)", boxShadow: "var(--shadow-glow)" }}>
            <div className="h-3 w-full" style={{ background: "repeating-linear-gradient(90deg, #fff 0 8px, #ffd1e8 8px 16px)" }} />
          </div>
          {/* Tier 2 */}
          <div className="mx-auto -mt-2 h-28 w-80 rounded-t-lg"
            style={{ background: "linear-gradient(180deg, #fce7f3, #ffb6d9 60%, #9d6cd9)", boxShadow: "var(--shadow-glow)" }}>
            <div className="h-3 w-full" style={{ background: "repeating-linear-gradient(90deg, #fff 0 10px, #ffd1e8 10px 20px)" }} />
          </div>
          {/* Tier 3 */}
          <div className="mx-auto -mt-2 h-32 w-[26rem] rounded-t-lg"
            style={{ background: "linear-gradient(180deg, #fce7f3, #ffb6d9 60%, #7c3aed)", boxShadow: "var(--shadow-glow)" }} />
          {/* Plate */}
          <div className="mx-auto h-3 w-[28rem] rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-soft glow-gold" />
        </div>

        <p className="mt-12 text-pink/80">Blow into your microphone to blow out the candles ✨</p>
        {micState === "idle" && (
          <button onClick={startMic}
            className="glass-strong glow-pink mt-6 rounded-full px-8 py-3 text-sm tracking-widest uppercase transition hover:scale-105">
            🎤 Ready to Blow? 💨
          </button>
        )}
        {micState === "denied" && (
          <button onClick={blowOneCandle}
            className="glass-strong mt-6 rounded-full px-8 py-3 text-sm tracking-widest uppercase transition hover:scale-105">
            Tap to blow a candle
          </button>
        )}
        {micState === "listening" && !allOut && (
          <p className="mt-6 animate-pulse text-xs uppercase tracking-[0.3em] text-pink">Listening... blow softly</p>
        )}

        {micState === "celebrating" && !dark && (
          <motion.h3
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="mt-12 font-display text-3xl italic text-gradient-gold md:text-5xl"
          >
            🎉 Happy Birthday Lily <span className="text-rose">❤</span> 🎉
          </motion.h3>
        )}
      </div>
    </section>
  );
}

/* ---------- Live age counter ---------- */
const BIRTH = new Date("2005-06-29T00:00:00");
function useLiveAge() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let raf = 0;
    const loop = () => { setNow(Date.now()); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const diffMs = now - BIRTH.getTime();
  const totalSeconds = diffMs / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;
  const years = Math.floor(totalDays / 365.25);
  const remDays = totalDays - years * 365.25;
  const months = Math.floor(remDays / 30.4375);
  const days = Math.floor(remDays - months * 30.4375);
  const hours = Math.floor(totalHours) % 24;
  const minutes = Math.floor(totalMinutes) % 60;
  const seconds = Math.floor(totalSeconds) % 60;
  const ms = Math.floor(diffMs) % 1000;
  return { years, months, days, hours, minutes, seconds, ms, totalDays, totalHours, totalMinutes, totalSeconds };
}

export function TimeScene() {
  const a = useLiveAge();
  const items = [
    { l: "Years", v: a.years }, { l: "Months", v: a.months }, { l: "Days", v: a.days },
    { l: "Hours", v: a.hours }, { l: "Minutes", v: a.minutes }, { l: "Seconds", v: a.seconds },
    { l: "Ms", v: a.ms.toString().padStart(3, "0") },
  ];
  const stats = [
    { l: "Total Days Lived", v: Math.floor(a.totalDays).toLocaleString() },
    { l: "Total Hours", v: Math.floor(a.totalHours).toLocaleString() },
    { l: "Total Minutes", v: Math.floor(a.totalMinutes).toLocaleString() },
    { l: "Total Seconds", v: Math.floor(a.totalSeconds).toLocaleString() },
    { l: "Approx. Heartbeats", v: Math.floor(a.totalMinutes * 72).toLocaleString() },
    { l: "Approx. Smiles Shared", v: Math.floor(a.totalDays * 50).toLocaleString() },
  ];
  return (
    <section className="relative min-h-screen overflow-hidden py-24"
      style={{ background: "radial-gradient(ellipse at center, oklch(0.22 0.12 290), oklch(0.06 0.04 290) 80%)" }}>
      <StarField density={250} />
      <FloatingEmojis emojis={["✨", "💫", "⭐"]} count={14} />
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display text-3xl italic md:text-5xl">
          <span className="text-gradient-aurora">The World Became More Beautiful</span>
          <br />
          <span className="text-foreground/90">On 29 June 2005</span>
          <span className="ml-3 text-rose">❤</span>
        </motion.h2>

        {/* Photo */}
        <div className="mx-auto mt-12 w-fit">
          <div className="glass-strong glow-pink relative rounded-2xl p-3">
            <img
              src="/images/lily-1.jpg"
              alt="Lily"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1494797262163-102fae527c62?w=600"; }}
              className="h-72 w-56 rounded-xl object-cover"
            />
          </div>
        </div>

        {/* Live counter */}
        <div className="glass-strong mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 rounded-2xl p-6 md:grid-cols-7">
          {items.map(i => (
            <div key={i.l} className="text-center">
              <div className="font-display text-3xl font-light text-gradient-romance md:text-4xl tabular-nums">{i.v}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-pink/70 md:text-xs">{i.l}</div>
            </div>
          ))}
        </div>

        {/* Stat cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div key={s.l}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5 text-left">
              <div className="text-xs uppercase tracking-widest text-pink/70">❤ {s.l}</div>
              <div className="mt-2 font-display text-2xl text-foreground tabular-nums md:text-3xl">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Typed wishes ---------- */
const WISHES = [
  "You are my favorite hello and my hardest goodbye.",
  "You make ordinary days feel magical.",
  "You are my happiness.",
  "You are my peace.",
  "You are my favorite notification.",
  "My heart feels complete because of you.",
  "I wish I could celebrate this birthday beside you.",
  "I hope every dream you have comes true.",
  "You deserve all the happiness this world has to offer.",
  "I'll always be proud of you.",
  "I'll always support you.",
  "I'll always choose you.",
  "I love you endlessly.",
];
function Typed({ text, onDone }: { text: string; onDone?: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, 40);
    return () => clearInterval(id);
  }, [text, onDone]);
  return <span>{text.slice(0, n)}<span className="ml-0.5 inline-block w-[2px] animate-pulse bg-pink">‌</span></span>;
}
export function WishesScene() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % WISHES.length), 4500);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-20">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/lily-2.jpg"
          alt=""
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600"; }}
          className="h-full w-full object-cover opacity-30"
          style={{ filter: "blur(30px) saturate(140%)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,5,40,0.7), rgba(40,10,60,0.85))" }} />
      </div>
      <FloatingHearts count={16} />
      <Sparkles count={30} />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-pink/70">A few of the things I want to say</p>
        <div className="min-h-[180px] md:min-h-[140px]">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-light italic leading-snug text-gradient-romance md:text-5xl"
          >
            "<Typed text={WISHES[idx]} />"
          </motion.p>
        </div>
        <div className="mt-8 flex justify-center gap-1">
          {WISHES.map((_, i) => (
            <span key={i} className={`h-1 rounded-full transition-all ${i === idx ? "w-8 bg-pink" : "w-2 bg-pink/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Polaroid gallery ---------- */
const GALLERY = Array.from({ length: 5 }, (_, i) => `/images/gallery-${i + 1}.jpg`);
const FALLBACKS = [
  "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
  "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600",
  "https://images.unsplash.com/photo-1518563259479-d003c05a6507?w=600",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600",
  "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=600",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600",
];

export function GalleryScene() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <section className="relative min-h-screen overflow-hidden py-24 night-bg">
      <StarField density={140} />
      <FloatingHearts count={10} />
      <Sparkles count={30} />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center font-display text-4xl italic text-gradient-romance md:text-6xl">
          Frames of you
        </motion.h2>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {GALLERY.map((src, i) => {
            const rot = (i % 2 === 0 ? -1 : 1) * (3 + (i % 3));
            return (
              <motion.button key={i}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: rot }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 80 }}
                whileHover={{ rotate: 0, scale: 1.06, y: -8, zIndex: 10 }}
                onClick={() => setLightbox(src)}
                className="group glass-strong rounded-md p-3 pb-10 text-left shadow-2xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-black/40">
                  <img
                    src={src}
                    alt={`Memory ${i + 1}`}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACKS[i % FALLBACKS.length]; }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="mt-2 text-center font-script text-lg text-gold-soft">memory {i + 1}</div>
              </motion.button>
            );
          })}
        </div>
      </div>
      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            src={lightbox} className="max-h-[90vh] max-w-full rounded-xl glow-pink" />
        </div>
      )}
    </section>
  );
}

/* ---------- Letter ---------- */
const LETTER = `My Dearest Bby,

Happy Birthday to the most beautiful soul in my life. ❤

Today is the day when the most precious person entered this world, and I honestly can't thank destiny enough for bringing you into my life.

Even though we are miles apart, you are never far from my heart. Every morning begins with thoughts of you, and every night ends with wishing I could simply hold your hand.

Long distance has taught me that true love isn't measured by kilometers. It's measured by trust, patience, loyalty, and the countless little moments that make us smile despite the distance.

You make my life brighter in ways you'll probably never realize. Your smile makes my bad days better. Your voice gives me peace. Your existence makes my future worth dreaming about.

I wish I could celebrate this birthday with you, bring you flowers, hug you tightly, make you laugh, and watch you cut your birthday cake while secretly stealing the first bite.

Maybe today we are far apart...
But one day we won't have to count kilometers anymore.
One day every birthday will be celebrated together.

Until then... please keep smiling. Keep shining. Keep believing in yourself.
And always remember... no matter where life takes us... you'll always have a special place in my heart.

Happy 22nd Birthday, My Cutie.
I love you more than words can ever explain.

Forever Yours,
❤ Harshit ❤`;

export function LetterScene() {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRevealed(true); }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden py-24"
      style={{ background: "linear-gradient(135deg, #3a1f0a, #1a0e05 60%, #2a1408)" }}>
      <Sparkles count={30} />
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-12 text-center font-display text-4xl italic text-gradient-gold md:text-5xl">
          A letter, just for you
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, rotate: -2, y: 60 }}
          whileInView={{ opacity: 1, rotate: -1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1.2, type: "spring" }}
          className="relative mx-auto rounded-sm p-10 md:p-14"
          style={{
            background: "repeating-linear-gradient(180deg, #fdf6e3 0 31px, #f0e6c8 31px 32px)",
            color: "#3a2818",
            boxShadow: "0 40px 100px -20px rgba(0,0,0,0.8), inset 0 0 80px rgba(180,140,80,0.2)",
            transform: "rotate(-1deg)",
          }}
        >
          <pre className="whitespace-pre-wrap font-script text-xl leading-relaxed md:text-2xl"
            style={{ animation: revealed ? "shimmer 6s linear" : undefined }}>
            {LETTER}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Why I love you ---------- */
const REASONS = [
  { t: "Your Smile", b: "It rearranges my whole day." },
  { t: "Your Eyes", b: "An entire galaxy lives in them." },
  { t: "Your Cute Anger", b: "Honestly the sweetest threat in the world." },
  { t: "Your Kindness", b: "You make people feel seen." },
  { t: "Your Caring Nature", b: "Even your worry feels like a hug." },
  { t: "Your Laugh", b: "My favorite song on loop." },
  { t: "Your Voice", b: "Where my peace lives." },
  { t: "Your Honesty", b: "You give me a love I can trust." },
  { t: "Your Innocence", b: "Pure, rare, and completely yours." },
  { t: "Everything About You", b: "There isn't a single thing I'd change." },
];

function FlipCard({ t, b, i }: { t: string; b: string; i: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      onClick={() => setFlipped(f => !f)}
      className="group relative h-44 w-full [perspective:1000px]"
    >
      <div className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="glass-strong glow-pink absolute inset-0 flex items-center justify-center rounded-2xl p-4 [backface-visibility:hidden]">
          <div className="text-center">
            <div className="mb-2 text-3xl">❤</div>
            <div className="font-display text-xl italic text-gradient-romance">{t}</div>
          </div>
        </div>
        <div className="glass-strong absolute inset-0 flex items-center justify-center rounded-2xl p-5 text-center text-sm text-foreground/90 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ background: "var(--gradient-romance)" }}>
          {b}
        </div>
      </div>
    </motion.button>
  );
}

export function ReasonsScene() {
  return (
    <section className="relative min-h-screen overflow-hidden py-24 night-bg">
      <Sparkles count={40} />
      <FloatingHearts count={8} />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center font-display text-4xl italic text-gradient-romance md:text-6xl">
          Why I love you
        </motion.h2>
        <p className="mt-3 text-center text-sm text-pink/70">Tap a card</p>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
          {REASONS.map((r, i) => (<FlipCard key={r.t} {...r} i={i} />))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 22 Stars ---------- */
const COMPLIMENTS = [
  "You make my life brighter.",
  "You are stronger than you know.",
  "You deserve endless happiness.",
  "You are absolutely beautiful.",
  "You make my heart smile.",
  "You are the calmest thing in my chaos.",
  "You glow even when you're tired.",
  "You are my favorite kind of magic.",
  "Your softness is a superpower.",
  "You are someone's whole world. (Mine.)",
  "You're proof good people still exist.",
  "Your kindness changes rooms.",
  "You are the best part of my day.",
  "You laugh and the world lights up.",
  "You are deeply, wildly loved.",
  "You inspire me without trying.",
  "You are the answer to a quiet prayer.",
  "Your dreams are absolutely valid.",
  "You make patience feel poetic.",
  "Loving you is the easiest thing I do.",
  "You are pure sunlight, Bacha.",
  "The world is luckier with you in it.",
];

export function StarsScene() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const stars = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      x: 8 + Math.random() * 84,
      y: 12 + Math.random() * 70,
      size: 14 + Math.random() * 14,
      i,
    })), []);
  return (
    <section className="relative min-h-screen overflow-hidden py-24"
      style={{ background: "radial-gradient(ellipse at top, #2a1450, #08041a 70%)" }}>
      <StarField density={180} />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center font-display text-4xl italic text-gradient-aurora md:text-6xl">
          22 stars for 22 years
        </motion.h2>
        <p className="mt-3 text-center text-sm text-pink/70">Click each star ✨</p>
        <div className="relative mt-12 h-[520px] w-full">
          {stars.map(s => (
            <button key={s.i}
              onClick={() => setRevealed(r => ({ ...r, [s.i]: !r[s.i] }))}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <span className="block animate-twinkle text-gold-soft"
                style={{ fontSize: s.size, ['--dur' as any]: `${2 + s.i * 0.1}s`, textShadow: "0 0 12px rgba(255,220,180,0.9)" }}>
                ✦
              </span>
              {revealed[s.i] && (
                <motion.div initial={{ opacity: 0, scale: 0.6, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-strong absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl p-3 text-center text-xs text-foreground">
                  {COMPLIMENTS[s.i]}
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Our story timeline ---------- */
const STORY = [
  { t: "The day we met", d: "The day my universe shifted." },
  { t: "First conversation", d: "I knew. I just knew." },
  { t: "First late-night chat", d: "Sleep lost. Best trade ever." },
  { t: "First laughter together", d: "My favorite sound was discovered." },
  { t: "First 'I Miss You'", d: "Distance became a feeling." },
  { t: "First 'I Love You'", d: "And the world stood still." },
  { t: "Today", d: "Your 22nd. Mine to celebrate." },
];
export function StoryScene() {
  return (
    <section className="relative min-h-screen overflow-hidden py-24 night-bg">
      <Sparkles count={30} />
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center font-display text-4xl italic text-gradient-romance md:text-6xl">
          Our story
        </motion.h2>
        <div className="relative mt-16">
          <div className="absolute left-4 top-0 h-full w-[2px] md:left-1/2"
            style={{ background: "linear-gradient(180deg, transparent, oklch(0.78 0.18 350), oklch(0.55 0.22 300), transparent)", boxShadow: "0 0 20px rgba(255,150,200,0.6)" }} />
          {STORY.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: i % 2 ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative mb-10 flex items-start gap-6 ${i % 2 ? "md:flex-row-reverse" : ""} md:gap-0`}>
              <div className="absolute left-4 top-3 size-3 -translate-x-1/2 rounded-full bg-pink glow-pink md:left-1/2" />
              <div className={`ml-12 w-full md:ml-0 md:w-1/2 ${i % 2 ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                <div className="glass-strong rounded-2xl p-5">
                  <div className="text-xs uppercase tracking-widest text-pink/70">❤ Chapter {i + 1}</div>
                  <div className="mt-1 font-display text-xl italic text-gradient-romance">{s.t}</div>
                  <p className="mt-2 text-sm text-foreground/80">{s.d}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Future ---------- */
const DREAMS = [
  { t: "Travel Together", i: "🌍" },
  { t: "Watch Sunsets", i: "🌅" },
  { t: "Celebrate Every Birthday Together", i: "🎂" },
  { t: "Hold Hands Forever", i: "🤝" },
  { t: "Grow Old Together", i: "👵🏼👴🏻" },
  { t: "Never Stop Loving Each Other", i: "♾️" },
];
export function FutureScene() {
  return (
    <section className="relative min-h-screen overflow-hidden py-24"
      style={{ background: "linear-gradient(180deg, #ffd1e8 0%, #d9b8ff 40%, #88a8ff 100%)", color: "#2b1140" }}>
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute h-24 w-48 rounded-full bg-white/70 blur-2xl animate-drift"
            style={{ left: `${(i * 17) % 100}%`, top: `${10 + (i * 13) % 70}%`, animationDelay: `${i * 0.7}s`, opacity: 0.7 }} />
        ))}
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center font-display text-4xl italic md:text-6xl"
          style={{ color: "#5b1d6e" }}>
          Our future together
        </motion.h2>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DREAMS.map((d, i) => (
            <motion.div key={d.t}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              animate={{ y: [0, -10, 0] }}
              style={{ animationDelay: `${i * 0.3}s` }}
              className="rounded-3xl border border-white/60 bg-white/30 p-7 text-center backdrop-blur-xl shadow-xl">
              <div className="text-5xl">{d.i}</div>
              <div className="mt-3 font-display text-2xl italic" style={{ color: "#3b1556" }}>{d.t}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final ---------- */
export function FinalScene() {
  const [fire, setFire] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fire) {
        setFire(true);
        const burst = () => {
          confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 }, colors: ["#ff8ec7", "#c084fc", "#fde68a", "#ffffff"] });
        };
        burst();
        const id = setInterval(burst, 1200);
        setTimeout(() => clearInterval(id), 8000);
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [fire]);
  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden py-24"
      style={{ background: "radial-gradient(ellipse at center, #1a0830, #03010a 80%)" }}>
      <StarField density={350} />
      <Aurora />
      <FloatingEmojis emojis={["🪩", "🎆", "✨", "💖", "🎈"]} count={28} />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.h2 initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="font-display text-4xl italic md:text-7xl">
          <span className="text-gradient-aurora">❤ Happy Birthday My Bacha ❤</span>
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}
          className="mt-12 space-y-4 font-display text-2xl italic text-foreground/90 md:text-3xl">
          <p>"I'll keep choosing you...</p>
          <p>Again...</p>
          <p>Again...</p>
          <p>And Again..."</p>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3.5 }}
          className="mt-10 font-display text-xl text-pink/90 md:text-2xl">
          No matter how many birthdays pass...
          <br />you'll always be my favorite person.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 5 }}
          className="mt-10 font-script text-3xl text-gradient-gold">
          Forever Yours ❤<br/>Harshit
        </motion.div>
      </div>
    </section>
  );
}
