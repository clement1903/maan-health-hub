import { useEffect, useState } from "react";

type TypewriterProps = {
  words: string[];
  /** Vitesse de frappe (ms par caractère) */
  typeSpeed?: number;
  /** Vitesse d'effacement (ms par caractère) */
  eraseSpeed?: number;
  /** Durée d'affichage d'un mot complet avant effacement (ms) */
  holdTime?: number;
  className?: string;
};

/** Effet machine à écrire : tape un mot, le garde 2 s, l'efface, tape le suivant. */
export function Typewriter({
  words,
  typeSpeed = 70,
  eraseSpeed = 35,
  holdTime = 2000,
  className,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");

  useEffect(() => {
    const word = words[index % words.length];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < word.length) {
        timer = setTimeout(() => setText(word.slice(0, text.length + 1)), typeSpeed);
      } else {
        timer = setTimeout(() => setPhase("holding"), 0);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("erasing"), holdTime);
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(word.slice(0, text.length - 1)), eraseSpeed);
      } else {
        setIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, index, words, typeSpeed, eraseSpeed, holdTime]);

  return (
    <span className={className}>
      {text}
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.08em] animate-[pulse_1.1s_step-end_infinite] bg-clay"
      />
    </span>
  );
}
