import type { TranslationResult } from "@/types/morse";
import { MORSE_TO_CHAR } from "./dictionary";

export function decodeMorse(morse: string): TranslationResult {
  const normalized = morse.trim();
  const wordTokens = normalized.split(/\s*\/\s*/);
  const unsupportedSet = new Set<string>();

  const decodedWords = wordTokens.map((wordToken) => {
    const letterTokens = wordToken.trim().split(/\s+/);
    const chars: string[] = [];
    for (const token of letterTokens) {
      if (!token) continue;
      const ch = MORSE_TO_CHAR.get(token);
      if (ch) {
        chars.push(ch);
      } else {
        unsupportedSet.add(token);
        chars.push("?");
      }
    }
    return chars.join("");
  });

  const output = decodedWords.filter(Boolean).join(" ");

  return {
    input: morse,
    output,
    unsupportedChars: Array.from(unsupportedSet),
  };
}
