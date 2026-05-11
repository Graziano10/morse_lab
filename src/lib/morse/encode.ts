import type { TranslationResult } from "@/types/morse";
import { CHAR_TO_MORSE, WORD_GAP, LETTER_SEPARATOR } from "./dictionary";

export function encodeText(text: string): TranslationResult {
  const upper = text.toUpperCase();
  const unsupportedSet = new Set<string>();
  const words = upper.split(" ");

  const encodedWords = words.map((word) => {
    const chars = word.split("");
    const encodedChars: string[] = [];
    for (const ch of chars) {
      const morse = CHAR_TO_MORSE.get(ch);
      if (morse) {
        encodedChars.push(morse);
      } else {
        unsupportedSet.add(ch);
      }
    }
    return encodedChars.join(LETTER_SEPARATOR);
  });

  const output = encodedWords.filter(Boolean).join(WORD_GAP);

  return {
    input: text,
    output,
    unsupportedChars: Array.from(unsupportedSet),
  };
}
