import { useMemo } from "react";

export function Stars({ count = 80 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="twinkle absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: "0 0 6px white",
          }}
        />
      ))}
    </div>
  );
}

export function FloatingHearts({ count = 12, emoji = "❤️" }: { count?: number; emoji?: string }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        size: 12 + Math.random() * 16,
        drift: (Math.random() - 0.5) * 80,
      })),
    [count, emoji],
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="float-up absolute"
          style={{
            left: `${h.left}%`,
            bottom: 0,
            fontSize: h.size,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            ["--drift" as never]: `${h.drift}px`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
