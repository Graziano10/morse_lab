"use client";

import { create } from "zustand";
import type { PracticeQuestion, PracticeSession } from "@/types/morse";
import { generateQuestion } from "@/lib/morse/random";

interface PracticeState extends PracticeSession {
  lastAnswerCorrect: boolean | null;
  isRevealed: boolean;
  nextQuestion: (type?: "char-to-morse" | "morse-to-char") => void;
  submitAnswer: (answer: string) => boolean;
  reveal: () => void;
  reset: () => void;
}

const initialState: PracticeSession & {
  lastAnswerCorrect: boolean | null;
  isRevealed: boolean;
} = {
  score: 0,
  total: 0,
  streak: 0,
  currentQuestion: null,
  lastAnswerCorrect: null,
  isRevealed: false,
};

export const usePracticeStore = create<PracticeState>((set, get) => ({
  ...initialState,

  nextQuestion: (type) => {
    set({
      currentQuestion: generateQuestion(type),
      lastAnswerCorrect: null,
      isRevealed: false,
    });
  },

  submitAnswer: (answer: string) => {
    const { currentQuestion } = get();
    if (!currentQuestion) return false;

    const normalized = answer.trim().toUpperCase();
    const correct =
      currentQuestion.type === "char-to-morse"
        ? normalized === currentQuestion.morse.trim()
        : normalized === currentQuestion.char.trim();

    set((state) => ({
      score: correct ? state.score + 1 : state.score,
      total: state.total + 1,
      streak: correct ? state.streak + 1 : 0,
      lastAnswerCorrect: correct,
    }));

    return correct;
  },

  reveal: () => set({ isRevealed: true }),

  reset: () => set({ ...initialState }),
}));
