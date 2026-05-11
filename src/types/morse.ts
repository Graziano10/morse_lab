export type MorseSymbol = "." | "-";

export type MorseCode = string;

export interface MorseDictionaryEntry {
  char: string;
  morse: MorseCode;
  category: "letter" | "number" | "symbol";
}

export interface TranslationResult {
  input: string;
  output: string;
  unsupportedChars: string[];
}

export interface AudioOptions {
  wpm: number;
  frequency: number;
}

export interface PracticeQuestion {
  type: "char-to-morse" | "morse-to-char";
  char: string;
  morse: MorseCode;
}

export interface PracticeSession {
  score: number;
  total: number;
  streak: number;
  currentQuestion: PracticeQuestion | null;
}
