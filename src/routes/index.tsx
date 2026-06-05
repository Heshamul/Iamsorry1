import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Stars, FloatingHearts } from "@/components/Stars";
import { Typewriter } from "@/components/Typewriter";
import { startPiano, stopPiano, isPianoOn } from "@/lib/piano";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Letter For You ❤️" },
      { name: "description", content: "A letter from my heart to yours." },
    ],
  }),
  component: LetterApp,
});

type Page =
  | "envelope"
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6"
  | "p7"
  | "ask"
  | "yay";

function LetterApp() {
  const [page, setPage] = useState<Page>("envelope");
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    return () => stopPiano();
  }, []);

  const toggleMusic = () => {
    if (isPianoOn()) {
      stopPiano();
      setMuted(true);
    } else {
      startPiano();
      setMuted(false);
    }
  };

  const go = (p: Page) => {
    if (!isPianoOn()) {
      startPiano();
      setMuted(false);
    }
    setPage(p);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Stars />
      <FloatingHearts count={10} />

      <button
        onClick={toggleMusic}
        aria-label="toggle music"
        className="fixed right-4 top-4 z-50 rounded-full border border-border bg-background/40 px-3 py-2 text-xs backdrop-blur-md transition hover:bg-background/70"
      >
        {muted ? "🔇 music" : "🎵 music"}
      </button>

      <AnimatePresence mode="wait">
        {page === "envelope" && <Envelope key="env" onOpen={() => go("p1")} />}
        {page === "p1" && <Page1 key="p1" onNext={() => go("p2")} />}
        {page === "p2" && <Page2 key="p2" onNext={() => go("p3")} />}
        {page === "p3" && <Page3 key="p3" onNext={() => go("p4")} />}
        {page === "p4" && <Page4 key="p4" onNext={() => go("p5")} />}
        {page === "p5" && <Page5 key="p5" onNext={() => go("p6")} />}
        {page === "p6" && <Page6 key="p6" onNext={() => go("p7")} />}
        {page === "p7" && <Page7 key="p7" onNext={() => go("ask")} />}
        {page === "ask" && <PageAsk key="ask" onYes={() => go("yay")} />}
        {page === "yay" && <PageYay key="yay" />}
      </AnimatePresence>
    </div>
  );
}

const fadeVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 py-12 text-center"
    >
      {children}
    </motion.section>
  );
}

function ContinueButton({ onClick, label = "Continue ➜" }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      onClick={onClick}
      className="btn-glow mt-10 rounded-full px-7 py-3 text-base font-medium tracking-wide"
    >
      {label}
    </motion.button>
  );
}

/* ---------------- Envelope ---------------- */
function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const handle = () => {
    setOpening(true);
    setTimeout(onOpen, 1600);
  };
  return (
    <Shell>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="font-display text-3xl italic leading-tight text-glow sm:text-4xl"
      >
        For the most important person in my life ❤️
      </motion.h1>
      <p className="mt-3 text-sm text-muted-foreground">There's something I need to tell you.</p>

      <div className="relative my-10 h-56 w-72">
        {/* envelope body */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 rounded-md"
          style={{
            background: "linear-gradient(180deg, oklch(0.78 0.14 15) 0%, oklch(0.58 0.18 12) 100%)",
            boxShadow: "0 20px 60px -10px rgba(0,0,0,0.6), inset 0 -20px 30px rgba(0,0,0,0.25)",
          }}
        />
        {/* flap */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={{ rotateX: opening ? -180 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            transformOrigin: "top",
            background: "linear-gradient(180deg, oklch(0.82 0.14 15) 0%, oklch(0.62 0.18 12) 100%)",
            clipPath: "polygon(0 0, 100% 0, 50% 75%)",
          }}
          className="absolute inset-0 rounded-md"
        />
        {/* heart seal */}
        <motion.div
          animate={{ scale: opening ? [1, 1.4, 0] : [1, 1.1, 1] }}
          transition={{ duration: opening ? 0.6 : 1.6, repeat: opening ? 0 : Infinity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl heart-glow"
        >
          ❤️
        </motion.div>
        {/* petals on open */}
        {opening &&
          Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: (Math.random() - 0.5) * 300,
                y: -100 - Math.random() * 200,
                rotate: Math.random() * 540,
                opacity: 0,
              }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 text-2xl"
            >
              🌸
            </motion.span>
          ))}
      </div>

      {!opening && (
        <button onClick={handle} className="btn-glow rounded-full px-8 py-3 text-base font-medium">
          💌 Open My Letter
        </button>
      )}
    </Shell>
  );
}

/* ---------------- Page 1 ---------------- */
function Page1({ onNext }: { onNext: () => void }) {
  const [done, setDone] = useState(false);
  const lines = [
    "My Dearest Love,",
    "Before you continue reading...",
    "I need you to know something.",
    "Every word written here comes from my heart.",
    "And every word is for you.",
  ];
  return (
    <Shell>
      <PaperCard>
        <SequentialLines lines={lines} onComplete={() => setDone(true)} typewriter />
      </PaperCard>
      {done && <ContinueButton onClick={onNext} />}
    </Shell>
  );
}

/* ---------------- Page 2 ---------------- */
function Page2({ onNext }: { onNext: () => void }) {
  const [done, setDone] = useState(false);
  const lines = [
    "I know I hurt you.",
    "I know I disappointed you.",
    "And I know I made you sad.",
    "For that...",
    "I am truly sorry.",
    "If I could go back and change things, I would.",
    "Because the last thing I ever want is to be the reason behind your tears.",
  ];
  return (
    <Shell>
      <RainOverlay />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-6 left-4 text-5xl"
      >
        🧸
      </motion.div>
      <PaperCard>
        <SequentialLines lines={lines} onComplete={() => setDone(true)} />
      </PaperCard>
      {done && <ContinueButton onClick={onNext} />}
    </Shell>
  );
}

/* ---------------- Page 3 ---------------- */
function Page3({ onNext }: { onNext: () => void }) {
  const [done, setDone] = useState(false);
  const lines = [
    "✨ You are my favorite notification.",
    "✨ You are my favorite voice.",
    "✨ You are my favorite smile.",
    "✨ You are my favorite comfort.",
    "✨ You are my favorite person.",
    "✨ You are my favorite future.",
    "Out of all the people in this world...",
    "My heart chose you.",
    "And it still chooses you.",
    "Every single day.",
  ];
  return (
    <Shell>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="heartbeat text-[28rem] opacity-10">❤️</div>
      </div>
      <PaperCard>
        <SequentialLines lines={lines} onComplete={() => setDone(true)} delay={650} />
      </PaperCard>
      {done && <ContinueButton onClick={onNext} />}
    </Shell>
  );
}

/* ---------------- Page 4 ---------------- */
function Page4({ onNext }: { onNext: () => void }) {
  const promises = [
    "I will listen better.",
    "I will understand better.",
    "I will communicate better.",
    "I will care better.",
    "I will love you better.",
  ];
  const [checked, setChecked] = useState(0);
  const [showTail, setShowTail] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (checked < promises.length) {
      const t = setTimeout(() => setChecked(checked + 1), 750);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowTail(true), 600);
      return () => clearTimeout(t);
    }
  }, [checked]);

  return (
    <Shell>
      <PaperCard>
        <p className="font-hand text-xl leading-relaxed text-stone-700">
          I cannot promise that I will never make mistakes.
        </p>
        <p className="mt-3 font-hand text-xl leading-relaxed text-stone-700">
          But I can promise that I will keep trying.
        </p>
        <p className="mt-1 font-hand text-2xl text-rose-600">For you. For us.</p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className="my-5 h-1 origin-left rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.18 350), transparent)" }}
        />

        <ul className="space-y-2 text-left">
          {promises.map((p, i) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i < checked ? 1 : 0.35, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 font-hand text-xl text-stone-700"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded border-2 ${
                  i < checked ? "border-rose-500 bg-rose-500 text-white" : "border-stone-400"
                }`}
              >
                {i < checked && "✓"}
              </span>
              {p}
            </motion.li>
          ))}
        </ul>

        {showTail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            onAnimationComplete={() => setDone(true)}
            className="mt-6 space-y-1 font-hand text-xl text-stone-700"
          >
            <p>Aage se aur zyada dhyan rakhunga.</p>
            <p>Aur jo bhi problem hai...</p>
            <p className="text-rose-600">Hum saath mein sab sahi kar lenge.</p>
          </motion.div>
        )}
      </PaperCard>
      {done && <ContinueButton onClick={onNext} />}
    </Shell>
  );
}

/* ---------------- Page 5 ---------------- */
function Page5({ onNext }: { onNext: () => void }) {
  const [done, setDone] = useState(false);
  const lines = [
    "Imagine us...",
    "A few years from now.",
    "Looking back at this moment.",
    "Laughing together.",
    "Holding hands.",
    "Wondering why we were ever worried.",
    "Because that's still the future I want.",
    "A future where it's always you and me.",
  ];
  return (
    <Shell>
      <HeartConstellation />
      <div className="relative z-10">
        <SequentialLines
          lines={lines}
          onComplete={() => setDone(true)}
          delay={900}
          className="font-display text-xl italic leading-relaxed text-glow"
        />
      </div>
      {done && <ContinueButton onClick={onNext} />}
    </Shell>
  );
}

function HeartConstellation() {
  // points roughly forming a heart
  const points = [
    [50, 30], [42, 22], [34, 22], [28, 28], [28, 38], [34, 48], [42, 56], [50, 62],
    [58, 56], [66, 48], [72, 38], [72, 28], [66, 22], [58, 22], [50, 30],
  ];
  return (
    <svg viewBox="0 0 100 80" className="pointer-events-none absolute inset-0 m-auto h-72 w-72 opacity-90">
      <motion.polyline
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="oklch(0.85 0.15 350)"
        strokeWidth="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 3 }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="0.8"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.6] }}
          transition={{ duration: 2, delay: i * 0.15, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: "drop-shadow(0 0 3px white)" }}
        />
      ))}
    </svg>
  );
}

/* ---------------- Page 6 ---------------- */
function Page6({ onNext }: { onNext: () => void }) {
  const notes = [
    "I miss you.",
    "You make my world better.",
    "I still choose you.",
    "You are worth fighting for.",
    "You are my safe place.",
    "I love you more than words.",
  ];
  const [opened, setOpened] = useState<boolean[]>(() => notes.map(() => false));
  const [active, setActive] = useState<number | null>(null);
  const allOpen = opened.every(Boolean);

  const positions = [
    { x: -100, y: -90 }, { x: 90, y: -110 }, { x: -130, y: 20 },
    { x: 120, y: 10 }, { x: -70, y: 110 }, { x: 80, y: 120 },
  ];

  return (
    <Shell>
      <div className="relative flex h-[480px] w-full items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute text-[16rem] heart-glow opacity-60"
        >
          ❤️
        </motion.div>

        {notes.map((n, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, x: positions[i].x, y: positions[i].y }}
            transition={{ delay: i * 0.18, type: "spring" }}
            onClick={() => {
              setOpened((o) => o.map((v, idx) => (idx === i ? true : v)));
              setActive(i);
            }}
            className="absolute text-3xl transition hover:scale-125"
            style={{ filter: opened[i] ? "grayscale(0.2)" : "drop-shadow(0 0 12px oklch(0.8 0.2 15 / 0.8))" }}
          >
            {opened[i] ? "💗" : "❤️"}
          </motion.button>
        ))}

        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-background/70 px-5 py-2 font-hand text-xl text-glow backdrop-blur-md"
            >
              ❤️ {notes[active]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!allOpen && (
        <p className="mt-2 text-sm text-muted-foreground">
          Tap each heart... {opened.filter(Boolean).length}/{notes.length}
        </p>
      )}

      {allOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <p className="mt-4 font-display text-2xl italic text-glow">And that's why I'm here.</p>
          <p className="font-display text-xl italic text-muted-foreground">Trying to make things right.</p>
          <ContinueButton onClick={onNext} />
        </motion.div>
      )}
    </Shell>
  );
}

/* ---------------- Page 7: Please Talk To Me ---------------- */
function Page7({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);
  const lines = [
    "I don't want distance.",
    "I don't want silence.",
    "I don't want to lose what we have.",
    "I just want us.",
    "Please talk to me.",
    "Let's understand each other.",
    "Let's fix everything together.",
    "Because no problem is bigger than us when we're on the same side.",
  ];
  useEffect(() => {
    if (step < lines.length) {
      const t = setTimeout(() => setStep(step + 1), 1100);
      return () => clearTimeout(t);
    }
  }, [step]);
  const done = step >= lines.length;

  return (
    <Shell>
      <TwoStars />
      <div className="relative z-10 space-y-3">
        {lines.slice(0, step).map((l, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-xl italic text-glow"
          >
            {l}
          </motion.p>
        ))}
      </div>

      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
          <p className="mt-8 font-display text-3xl italic text-rose-300 text-glow">❤️ I Love You ❤️</p>
          <p className="mt-2 font-hand text-lg text-muted-foreground">
            Yesterday. Today. Tomorrow. Always.
          </p>
          <ContinueButton onClick={onNext} label="💬 Please Talk To Me" />
        </motion.div>
      )}
    </Shell>
  );
}

function TwoStars() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ x: -120 }}
        animate={{ x: -20 }}
        transition={{ duration: 6, ease: "easeInOut" }}
        className="absolute text-4xl heart-glow"
      >
        ⭐
      </motion.div>
      <motion.div
        initial={{ x: 120 }}
        animate={{ x: 20 }}
        transition={{ duration: 6, ease: "easeInOut" }}
        className="absolute text-4xl heart-glow"
      >
        ⭐
      </motion.div>
    </div>
  );
}

/* ---------------- Ask ---------------- */
function PageAsk({ onYes }: { onYes: () => void }) {
  return (
    <Shell>
      <FloatingHearts count={20} emoji="🌸" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="space-y-3"
      >
        <p className="font-display text-2xl italic text-glow">Thank you for reading my heart.</p>
        <p className="font-hand text-lg text-muted-foreground">
          I know things aren't perfect right now.
        </p>
        <p className="font-hand text-lg text-muted-foreground">But I believe in us.</p>
        <p className="font-hand text-lg text-muted-foreground">I believe in our story.</p>
        <p className="font-hand text-lg text-muted-foreground">
          And I believe we can get through this together.
        </p>
        <p className="text-3xl heartbeat">❤️</p>
        <p className="font-display text-2xl italic text-rose-300 text-glow">Will you talk to me?</p>
      </motion.div>
      <button onClick={onYes} className="btn-glow mt-8 rounded-full px-8 py-3 text-base">
        🥺 Yes, let's talk
      </button>
    </Shell>
  );
}

/* ---------------- YAY ---------------- */
function PageYay() {
  return (
    <Shell>
      <FloatingHearts count={40} />
      <FloatingHearts count={30} emoji="🌸" />
      <motion.h1
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="font-display text-5xl italic text-glow"
      >
        YAYYYY ❤️
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-6 font-hand text-2xl"
      >
        That's all I wanted.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-2 font-hand text-2xl"
      >
        Now come here...
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 1.8, duration: 1 }}
        className="mt-8 text-7xl"
      >
        🫂
      </motion.div>
    </Shell>
  );
}

/* ---------------- Helpers ---------------- */
function PaperCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -10, y: 20 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ duration: 1 }}
      className="paper w-full px-7 py-10 text-left"
    >
      {children}
    </motion.div>
  );
}

function SequentialLines({
  lines,
  onComplete,
  delay = 850,
  typewriter = false,
  className = "",
}: {
  lines: string[];
  onComplete?: () => void;
  delay?: number;
  typewriter?: boolean;
  className?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (typewriter) return;
    if (i < lines.length) {
      const t = setTimeout(() => setI(i + 1), delay);
      return () => clearTimeout(t);
    } else {
      onComplete?.();
    }
  }, [i, lines.length, delay, onComplete, typewriter]);

  if (typewriter) {
    return (
      <div className={className || "font-hand text-xl leading-relaxed text-stone-700"}>
        <TypewriterStack lines={lines} onComplete={onComplete} />
      </div>
    );
  }

  return (
    <div className={className || "space-y-2 font-hand text-xl leading-relaxed text-stone-700"}>
      {lines.slice(0, i).map((l, idx) => (
        <motion.p key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {l}
        </motion.p>
      ))}
    </div>
  );
}

function TypewriterStack({ lines, onComplete }: { lines: string[]; onComplete?: () => void }) {
  const [i, setI] = useState(0);
  return (
    <div className="space-y-2">
      {lines.slice(0, i).map((l, idx) => (
        <p key={idx}>{l}</p>
      ))}
      {i < lines.length && (
        <Typewriter
          text={lines[i]}
          onDone={() => {
            setTimeout(() => {
              setI(i + 1);
              if (i + 1 >= lines.length) onComplete?.();
            }, 400);
          }}
        />
      )}
    </div>
  );
}

function RainOverlay() {
  const drops = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.8 + Math.random() * 1.2,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/60" />
      {drops.map((d) => (
        <span
          key={d.id}
          className="rain-drop absolute top-0 h-6 w-px bg-blue-200/40"
          style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s` }}
        />
      ))}
    </div>
  );
}
