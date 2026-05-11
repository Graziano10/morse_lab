import { z } from "zod";

export const encodeSchema = z.object({
  text: z
    .string()
    .min(1, "Text cannot be empty")
    .max(500, "Text too long (max 500 characters)"),
});

export const decodeSchema = z.object({
  morse: z
    .string()
    .min(1, "Morse code cannot be empty")
    .max(2000, "Morse code too long (max 2000 characters)")
    .regex(
      /^[.\-\s/]+$/,
      "Invalid Morse code: only dots (.), dashes (-), spaces and slashes (/) are allowed"
    ),
});

export type EncodeInput = z.infer<typeof encodeSchema>;
export type DecodeInput = z.infer<typeof decodeSchema>;
