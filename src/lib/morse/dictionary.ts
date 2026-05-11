import type { MorseDictionaryEntry } from "@/types/morse";

export const MORSE_DICTIONARY: MorseDictionaryEntry[] = [
  // Letters
  { char: "A", morse: ".-", category: "letter" },
  { char: "B", morse: "-...", category: "letter" },
  { char: "C", morse: "-.-.", category: "letter" },
  { char: "D", morse: "-..", category: "letter" },
  { char: "E", morse: ".", category: "letter" },
  { char: "F", morse: "..-.", category: "letter" },
  { char: "G", morse: "--.", category: "letter" },
  { char: "H", morse: "....", category: "letter" },
  { char: "I", morse: "..", category: "letter" },
  { char: "J", morse: ".---", category: "letter" },
  { char: "K", morse: "-.-", category: "letter" },
  { char: "L", morse: ".-..", category: "letter" },
  { char: "M", morse: "--", category: "letter" },
  { char: "N", morse: "-.", category: "letter" },
  { char: "O", morse: "---", category: "letter" },
  { char: "P", morse: ".--.", category: "letter" },
  { char: "Q", morse: "--.-", category: "letter" },
  { char: "R", morse: ".-.", category: "letter" },
  { char: "S", morse: "...", category: "letter" },
  { char: "T", morse: "-", category: "letter" },
  { char: "U", morse: "..-", category: "letter" },
  { char: "V", morse: "...-", category: "letter" },
  { char: "W", morse: ".--", category: "letter" },
  { char: "X", morse: "-..-", category: "letter" },
  { char: "Y", morse: "-.--", category: "letter" },
  { char: "Z", morse: "--..", category: "letter" },
  // Numbers
  { char: "0", morse: "-----", category: "number" },
  { char: "1", morse: ".----", category: "number" },
  { char: "2", morse: "..---", category: "number" },
  { char: "3", morse: "...--", category: "number" },
  { char: "4", morse: "....-", category: "number" },
  { char: "5", morse: ".....", category: "number" },
  { char: "6", morse: "-....", category: "number" },
  { char: "7", morse: "--...", category: "number" },
  { char: "8", morse: "---..", category: "number" },
  { char: "9", morse: "----.", category: "number" },
  // Symbols
  { char: ".", morse: ".-.-.-", category: "symbol" },
  { char: ",", morse: "--..--", category: "symbol" },
  { char: "?", morse: "..--..", category: "symbol" },
  { char: "/", morse: "-..-.", category: "symbol" },
  { char: "-", morse: "-....-", category: "symbol" },
  { char: "(", morse: "-.--.", category: "symbol" },
  { char: ")", morse: "-.--.-", category: "symbol" },
];

export const CHAR_TO_MORSE = new Map<string, string>(
  MORSE_DICTIONARY.map((e) => [e.char, e.morse])
);

export const MORSE_TO_CHAR = new Map<string, string>(
  MORSE_DICTIONARY.map((e) => [e.morse, e.char])
);

export const WORD_SEPARATOR = "/";
export const LETTER_SEPARATOR = " ";
export const WORD_GAP = " / ";
