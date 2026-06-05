import { useEffect, useState } from "react";

export function Typewriter({
  text,
  speed = 38,
  className = "",
  onDone,
}: {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
  }, [text]);
  useEffect(() => {
    if (i >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setI(i + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed, onDone]);
  return (
    <span className={className}>
      {text.slice(0, i)}
      <span className="animate-pulse">|</span>
    </span>
  );
}
