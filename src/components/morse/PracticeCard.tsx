"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { usePracticeStore } from "@/stores/practiceStore";
import { playMorse, stopMorse } from "@/lib/audio/playMorse";

type PracticeMode = "char-to-morse" | "morse-to-char" | "random";

export function PracticeCard() {
  const {
    score,
    total,
    streak,
    currentQuestion,
    lastAnswerCorrect,
    isRevealed,
    nextQuestion,
    submitAnswer,
    reveal,
    reset,
  } = usePracticeStore();

  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState<PracticeMode>("random");
  const [playing, setPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    startNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function startNewQuestion() {
    stopMorse();
    setPlaying(false);
    setAnswer("");
    nextQuestion(mode === "random" ? undefined : mode);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!answer.trim() || !currentQuestion) return;
    submitAnswer(answer.trim());
    setAnswer("");
  }

  function handleReveal() {
    reveal();
  }

  async function handlePlayMorse() {
    if (!currentQuestion) return;
    const morse =
      currentQuestion.type === "morse-to-char"
        ? currentQuestion.morse
        : currentQuestion.morse;
    setPlaying(true);
    try {
      await playMorse(morse, { wpm: 18 });
    } finally {
      setPlaying(false);
    }
  }

  const questionDisplay = () => {
    if (!currentQuestion) return null;
    if (currentQuestion.type === "char-to-morse") {
      return (
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">What is the Morse code for:</p>
          <span className="text-6xl sm:text-7xl font-bold text-slate-100 font-mono">
            {currentQuestion.char}
          </span>
        </div>
      );
    }
    return (
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-3">What letter/number is this?</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {currentQuestion.morse.split("").map((sym, i) => (
            <span
              key={i}
              className={`text-4xl sm:text-5xl font-mono font-bold ${
                sym === "." ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {sym}
            </span>
          ))}
        </div>
        <button
          onClick={handlePlayMorse}
          disabled={playing}
          className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-1"
          aria-label={playing ? "Playing audio" : "Play Morse sound"}
        >
          {playing ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Playing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Listen
            </>
          )}
        </button>
      </div>
    );
  };

  const answerPlaceholder =
    currentQuestion?.type === "char-to-morse"
      ? "Type Morse code (e.g. ... --- ...)"
      : "Type the character (e.g. S)";

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{score}</p>
          <p className="text-xs text-slate-500 mt-0.5">Correct</p>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-slate-100">{total}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total</p>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{streak}</p>
          <p className="text-xs text-slate-500 mt-0.5">Streak</p>
        </div>
      </div>

      {/* Accuracy bar */}
      {total > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Accuracy</span>
            <span className="text-emerald-400 font-mono">{accuracy}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-700">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${accuracy}%` }}
              role="progressbar"
              aria-valuenow={accuracy}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Accuracy: ${accuracy}%`}
            />
          </div>
        </div>
      )}

      {/* Mode selector */}
      <Card>
        <CardHeader>
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
            <CardTitle className="text-base">Practice Mode</CardTitle>
            <div className="flex items-center gap-1 rounded-lg bg-slate-900/60 p-1 border border-slate-700/60">
              {(["random", "char-to-morse", "morse-to-char"] as PracticeMode[]).map(
                (m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[32px] ${
                      mode === m
                        ? "bg-emerald-500 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    aria-pressed={mode === m}
                  >
                    {m === "random" ? "Random" : m === "char-to-morse" ? "→ Morse" : "→ Text"}
                  </button>
                )
              )}
            </div>
          </div>
        </CardHeader>

        <CardBody className="flex flex-col gap-5">
          {/* Question */}
          {currentQuestion && (
            <div className="min-h-[120px] flex items-center justify-center rounded-xl border border-slate-700/40 bg-slate-900/40 px-4 py-6">
              {questionDisplay()}
            </div>
          )}

          {/* Feedback */}
          {lastAnswerCorrect !== null && (
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-3 ${
                lastAnswerCorrect
                  ? "bg-emerald-900/30 border border-emerald-700/40 text-emerald-300"
                  : "bg-red-900/30 border border-red-700/40 text-red-300"
              }`}
              role="alert"
              aria-live="assertive"
            >
              <span className="text-lg">{lastAnswerCorrect ? "✓" : "✗"}</span>
              <span className="text-sm font-medium">
                {lastAnswerCorrect ? "Correct!" : "Wrong!"}
              </span>
              {!lastAnswerCorrect && isRevealed && currentQuestion && (
                <span className="text-sm ml-auto font-mono">
                  Answer:{" "}
                  <span className="text-slate-200">
                    {currentQuestion.type === "char-to-morse"
                      ? currentQuestion.morse
                      : currentQuestion.char}
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Revealed answer */}
          {isRevealed && lastAnswerCorrect === null && currentQuestion && (
            <div className="rounded-lg bg-slate-700/40 border border-slate-600/40 px-4 py-3" aria-live="polite">
              <span className="text-sm text-slate-400">Answer: </span>
              <span className="font-mono text-slate-100 font-semibold">
                {currentQuestion.type === "char-to-morse"
                  ? currentQuestion.morse
                  : currentQuestion.char}
              </span>
            </div>
          )}

          {/* Answer form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={answerPlaceholder}
              aria-label="Your answer"
              autoComplete="off"
              autoCapitalize="characters"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="submit"
                size="lg"
                disabled={!answer.trim()}
                className="flex-1"
              >
                Submit
              </Button>
              <Button
                type="button"
                onClick={handleReveal}
                variant="ghost"
                size="lg"
                className="flex-1"
              >
                Reveal
              </Button>
              <Button
                type="button"
                onClick={startNewQuestion}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Skip
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Reset */}
      {total > 0 && (
        <Button onClick={reset} variant="ghost" size="sm" className="w-full text-slate-500">
          Reset session
        </Button>
      )}
    </div>
  );
}
