import { useEffect, useRef, useState } from "react";

type Star = { x: number; y: number; r: number; tw: number; baseAlpha: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number };

export function StarField({ density = 220, shooting = true, className = "" }: { density?: number; shooting?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let stars: Star[] = [];
    let shoots: Particle[] = [];
    let active = true;

    const resize = () => {
      c.width = window.innerWidth * devicePixelRatio;
      c.height = window.innerHeight * devicePixelRatio;
      c.style.width = "100%";
      c.style.height = "100%";
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 1.6 + 0.3,
        tw: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.5 + 0.4,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    const draw = (t: number) => {
      if (!active) return;
      const dt = (t - last) / 16.67; last = t;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const s of stars) {
        s.tw += 0.02 * dt;
        const a = s.baseAlpha + Math.sin(s.tw) * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 250, ${Math.max(0, a)})`;
        ctx.fill();
      }
      if (shooting && Math.random() < 0.005) {
        shoots.push({
          x: Math.random() * c.width, y: Math.random() * c.height * 0.5,
          vx: -8 - Math.random() * 4, vy: 4 + Math.random() * 2,
          life: 0, max: 60, color: "255,230,240", size: 2,
        });
      }
      shoots = shoots.filter(p => p.life < p.max);
      for (const p of shoots) {
        p.life++;
        p.x += p.vx; p.y += p.vy;
        const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 8, p.y - p.vy * 8);
        grad.addColorStop(0, `rgba(${p.color}, 1)`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 8, p.y - p.vy * 8);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!active) {
          active = true;
          last = performance.now();
          raf = requestAnimationFrame(draw);
        }
      } else {
        active = false;
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0.01 });
    obs.observe(c);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [density, shooting]);
  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 ${className}`} />;
}

export function FloatingHearts({ count = 14 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 12;
        const dur = 12 + Math.random() * 14;
        const size = 14 + Math.random() * 22;
        const drift = (Math.random() - 0.5) * 200;
        return (
          <span
            key={i}
            className="absolute bottom-[-40px] select-none"
            style={{
              left: `${left}%`,
              fontSize: size,
              animation: `float-up ${dur}s linear ${delay}s infinite`,
              ['--drift' as any]: `${drift}px`,
              textShadow: "0 0 8px rgba(255,150,200,0.7)",
            }}
          >
            ❤
          </span>
        );
      })}
    </div>
  );
}

export function FloatingEmojis({ emojis, count = 18 }: { emojis: string[]; count?: number }) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 14;
        const dur = 16 + Math.random() * 18;
        const size = 18 + Math.random() * 26;
        const drift = (Math.random() - 0.5) * 250;
        const e = emojis[i % emojis.length];
        return (
          <span
            key={i}
            className="absolute bottom-[-50px]"
            style={{
              left: `${left}%`,
              fontSize: size,
              animation: `float-up ${dur}s linear ${delay}s infinite`,
              ['--drift' as any]: `${drift}px`,
              textShadow: "0 0 10px rgba(255,200,230,0.5)",
            }}
          >
            {e}
          </span>
        );
      })}
    </div>
  );
}

export function Sparkles({ count = 40 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const t = Math.random() * 3 + 1.5;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              ['--dur' as any]: `${t}s`,
              boxShadow: "0 0 12px rgba(255,220,240,0.9)",
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[300px] w-[300px] rounded-full opacity-60 mix-blend-screen transition-transform duration-200 ease-out"
      style={{ background: "radial-gradient(circle, rgba(255,180,220,0.35), transparent 60%)" }}
    />
  );
}

export function Moon({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <div
        className="h-40 w-40 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, #fff8e7, #f4d8b0 60%, #b89c70 100%)",
          boxShadow: "0 0 80px rgba(255,230,200,0.6), 0 0 160px rgba(255,200,230,0.3)",
        }}
      />
    </div>
  );
}

export function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[60vh] animate-aurora opacity-60"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(180,120,255,0.35), rgba(255,150,220,0.25), transparent)",
          filter: "blur(40px)",
        }}
      />
      <div className="absolute inset-x-0 top-10 h-[50vh] animate-aurora opacity-50"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(120,220,255,0.3), rgba(255,200,150,0.2), transparent)",
          filter: "blur(50px)",
          animationDelay: "3s",
        }}
      />
    </div>
  );
}
