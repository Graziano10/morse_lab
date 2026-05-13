import type { PracticeQuestion } from "@/types/morse";
import { MORSE_DICTIONARY } from "./dictionary";

const PRACTICE_ENTRIES = MORSE_DICTIONARY.filter(
  (e) => e.category === "letter" || e.category === "number"
);

function randomEntry() {
  return PRACTICE_ENTRIES[Math.floor(Math.random() * PRACTICE_ENTRIES.length)];
}

export function generateQuestion(
  type?: "char-to-morse" | "morse-to-char" | "listen-to-char"
): PracticeQuestion {
  const entry = randomEntry();
  const questionType =
    type ?? (Math.random() > 0.5 ? "char-to-morse" : "morse-to-char");
  return {
    type: questionType,
    char: entry.char,
    morse: entry.morse,
  };
}
