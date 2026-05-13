"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { usePracticeStore } from "@/stores/practiceStore";
import { playMorse, stopMorse } from "@/lib/audio/playMorse";
import { TelegraphKey } from "./TelegraphKey";
import type { PracticeQuestion } from "@/types/morse";

type PracticeMode = "random" | "char-to-morse" | "morse-to-char" | "listen";

type QuestionType = PracticeQuestion["type"];

function modeToQuestionType(mode: PracticeMode): QuestionType | undefined {
  if (mode === "char-to-morse") return "char-to-morse";
  if (mode === "morse-to-char") return "morse-to-char";
  if (mode === "listen") return "listen-to-char";
  return undefined; // random
}

function expectsMorse(questionType?: QuestionType): boolean {
  return questionType === "char-to-morse";
}

// ── Pulsante Riproduci audio riutilizzabile ──────────────────────────────────
function PlayButton({
  onPlay,
  playing,
  label = "Riproduci",
  size = "lg",
}: {
  onPlay: () => void;
  playing: boolean;
  label?: string;
  size?: "md" | "lg";
}) {
  return (
    <button
      onClick={onPlay}
      disabled={playing}
      aria-label={playing ? "Riproduzione in corso" : label}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        disabled:opacity-60 disabled:cursor-not-allowed
        ${size === "lg"
          ? "w-20 h-20 sm:w-24 sm:h-24 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 border-4 border-emerald-500"
          : "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm border border-slate-600"
        }`}
    >
      {playing ? (
        <span className="flex gap-0.5 items-end h-5" aria-hidden="true">
          {[3, 5, 4, 6, 3].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-white rounded-full animate-pulse"
              style={{ height: `${h * 3}px`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </span>
      ) : (
        <svg
          className={size === "lg" ? "w-8 h-8" : "w-4 h-4"}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}

// ── Visualizzatore WPM ───────────────────────────────────────────────────────
function WpmControl({
  wpm,
  onChange,
}: {
  wpm: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 w-full">
      <label htmlFor="listen-wpm" className="text-xs text-slate-500 whitespace-nowrap">
        Velocità
      </label>
      <input
        id="listen-wpm"
        type="range"
        min={5}
        max={35}
        value={wpm}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700 accent-emerald-500"
        aria-label={`Velocità ascolto: ${wpm} WPM`}
      />
      <span className="text-xs font-mono text-emerald-400 w-14 text-right">{wpm} WPM</span>
    </div>
  );
}

// ── Componente principale ────────────────────────────────────────────────────
export function PracticeCard() {
  const {
    score, total, streak,
    currentQuestion,
    lastAnswerCorrect, isRevealed,
    nextQuestion, submitAnswer, clearFeedback, reveal, reset,
  } = usePracticeStore();

  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState<PracticeMode>("random");
  const [playing, setPlaying] = useState(false);
  const [useTelegraph, setUseTelegraph] = useState(false);
  const [listenWpm, setListenWpm] = useState(15);
  const inputRef = useRef<HTMLInputElement>(null);

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const isListenMode = mode === "listen";
  const isMorseAnswer = expectsMorse(currentQuestion?.type);

  // Avvia nuova domanda quando cambia la modalità
  useEffect(() => {
    startNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Reset risposta + focus input al cambio domanda
  useEffect(() => {
    setAnswer("");
    if (!useTelegraph && !isListenMode) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentQuestion, useTelegraph, isListenMode]);

  // Auto-play in modalità Ascolto quando arriva una nuova domanda
  useEffect(() => {
    if (isListenMode && currentQuestion && lastAnswerCorrect === null) {
      const timer = setTimeout(() => autoPlay(), 400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.morse, isListenMode]);

  function startNewQuestion() {
    stopMorse();
    setPlaying(false);
    setAnswer("");
    nextQuestion(modeToQuestionType(mode));
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!answer.trim() || !currentQuestion) return;
    const correct = submitAnswer(answer.trim());
    if (correct) {
      setAnswer("");
      setTimeout(() => startNewQuestion(), 900);
    }
    // se sbagliato: lascia l'input invariato così l'utente può ritentare subito
  }

  async function autoPlay() {
    if (!currentQuestion || playing) return;
    setPlaying(true);
    try {
      await playMorse(currentQuestion.morse, { wpm: listenWpm });
    } finally {
      setPlaying(false);
    }
  }

  async function handlePlayMorse() {
    if (!currentQuestion) return;
    setPlaying(true);
    try {
      await playMorse(currentQuestion.morse, { wpm: isListenMode ? listenWpm : 18 });
    } finally {
      setPlaying(false);
    }
  }

  const handleTelegraphSymbol = useCallback((symbol: "." | "-") => {
    clearFeedback();
    setAnswer((prev) => (prev ? prev + symbol : symbol));
  }, [clearFeedback]);

  function handleTelegraphBackspace() {
    setAnswer((prev) => prev.slice(0, -1));
  }

  // ── Visualizzazione domanda ──────────────────────────────────────────────
  const questionDisplay = () => {
    if (!currentQuestion) return null;

    // Modalità ASCOLTO: nessun hint visivo, solo audio
    if (currentQuestion.type === "listen-to-char") {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-slate-400">Ascolta il segnale e identifica il carattere</p>
          <PlayButton onPlay={handlePlayMorse} playing={playing} label="Riproduci segnale Morse" />
          <WpmControl wpm={listenWpm} onChange={setListenWpm} />
        </div>
      );
    }

    // Testo → Morse
    if (currentQuestion.type === "char-to-morse") {
      return (
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">Qual è il codice Morse per:</p>
          <span className="text-6xl sm:text-7xl font-bold text-slate-100 font-mono">
            {currentQuestion.char}
          </span>
        </div>
      );
    }

    // Morse → Testo
    return (
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-3">Che lettera/numero è questo?</p>
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
          aria-label={playing ? "Riproduzione in corso" : "Ascolta audio Morse"}
        >
          {playing ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              In riproduzione…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Ascolta
            </>
          )}
        </button>
      </div>
    );
  };

  const answerPlaceholder =
    currentQuestion?.type === "char-to-morse"
      ? "Inserisci il codice Morse (es. ... --- ...)"
      : "Inserisci il carattere (es. S)";

  // ── Risposta rivelata ────────────────────────────────────────────────────
  const revealedContent = () => {
    if (!currentQuestion) return null;
    if (currentQuestion.type === "listen-to-char") {
      return (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-bold text-slate-100">{currentQuestion.char}</span>
          <span className="text-slate-600">=</span>
          <span className="font-mono text-lg">
            {currentQuestion.morse.split("").map((sym, i) => (
              <span key={i} className={sym === "." ? "text-emerald-400" : "text-amber-400"}>
                {sym}
              </span>
            ))}
          </span>
        </div>
      );
    }
    return (
      <>
        <span className="text-sm text-slate-400">Risposta: </span>
        <span className="font-mono text-slate-100 font-semibold">
          {currentQuestion.type === "char-to-morse" ? currentQuestion.morse : currentQuestion.char}
        </span>
      </>
    );
  };

  // ── Risposta sbagliata ───────────────────────────────────────────────────
  const wrongAnswer = () => {
    if (!currentQuestion || !isRevealed) return null;
    if (currentQuestion.type === "listen-to-char") {
      return (
        <span className="text-sm ml-auto">
          Era:{" "}
          <span className="text-slate-200 font-bold">{currentQuestion.char}</span>
          <span className="font-mono text-slate-400 ml-2">{currentQuestion.morse}</span>
        </span>
      );
    }
    return (
      <span className="text-sm ml-auto font-mono">
        Risposta:{" "}
        <span className="text-slate-200">
          {currentQuestion.type === "char-to-morse" ? currentQuestion.morse : currentQuestion.char}
        </span>
      </span>
    );
  };

  // ── Selezione modalità ───────────────────────────────────────────────────
  const MODES: { value: PracticeMode; label: string }[] = [
    { value: "random",        label: "Casuale" },
    { value: "char-to-morse", label: "→ Morse" },
    { value: "morse-to-char", label: "→ Testo" },
    { value: "listen",        label: "🔊 Ascolto" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{score}</p>
          <p className="text-xs text-slate-500 mt-0.5">Corrette</p>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-slate-100">{total}</p>
          <p className="text-xs text-slate-500 mt-0.5">Totale</p>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{streak}</p>
          <p className="text-xs text-slate-500 mt-0.5">Serie</p>
        </div>
      </div>

      {/* Barra precisione */}
      {total > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Precisione</span>
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
              aria-label={`Precisione: ${accuracy}%`}
            />
          </div>
        </div>
      )}

      {/* Card principale */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Modalità</CardTitle>
            <div className="flex items-center gap-1 rounded-lg bg-slate-900/60 p-1 border border-slate-700/60 flex-wrap">
              {MODES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[32px] ${
                    mode === value ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                  aria-pressed={mode === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardBody className="flex flex-col gap-5">
          {/* Domanda */}
          {currentQuestion && (
            <div className={`flex items-center justify-center rounded-xl border border-slate-700/40 bg-slate-900/40 px-4 py-6 ${
              isListenMode ? "min-h-[200px]" : "min-h-[120px]"
            }`}>
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
                {lastAnswerCorrect ? "Corretto!" : "Sbagliato!"}
              </span>
              {!lastAnswerCorrect && wrongAnswer()}
            </div>
          )}

          {/* Risposta rivelata */}
          {isRevealed && lastAnswerCorrect === null && currentQuestion && (
            <div className="rounded-lg bg-slate-700/40 border border-slate-600/40 px-4 py-3" aria-live="polite">
              {revealedContent()}
            </div>
          )}

          {/* Toggle telegrafo — solo quando la risposta è Morse */}
          {isMorseAnswer && (
            <div className="flex items-center justify-between rounded-lg border border-slate-700/40 bg-slate-800/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base">📡</span>
                <span className="text-sm font-medium text-slate-300">Tasto Telegrafo</span>
              </div>
              <button
                onClick={() => { setUseTelegraph((v) => !v); setAnswer(""); }}
                role="switch"
                aria-checked={useTelegraph}
                aria-label="Attiva/disattiva il tasto telegrafo"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                  useTelegraph ? "bg-emerald-500" : "bg-slate-600"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${useTelegraph ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          )}

          {/* ── Input telegrafo ── */}
          {useTelegraph && isMorseAnswer ? (
            <div className="flex flex-col items-center gap-5 py-2">
              <div
                className="w-full min-h-[48px] flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3"
                aria-live="polite"
                aria-label="Codice Morse in inserimento"
              >
                {answer ? (
                  <span className="font-mono text-2xl tracking-widest">
                    {answer.split("").map((sym, i) => (
                      <span key={i} className={sym === "." ? "text-emerald-400" : "text-amber-400"}>{sym}</span>
                    ))}
                  </span>
                ) : (
                  <span className="text-slate-600 text-sm">premi il tasto per iniziare…</span>
                )}
              </div>
              <TelegraphKey onSymbol={handleTelegraphSymbol} disabled={!currentQuestion} />
              <div className="flex w-full gap-2">
                <Button type="button" onClick={handleTelegraphBackspace} variant="ghost" size="md" disabled={!answer} aria-label="Cancella ultimo simbolo" className="flex-none px-3">⌫</Button>
                <Button type="button" onClick={() => setAnswer("")} variant="ghost" size="md" disabled={!answer} aria-label="Cancella tutto" className="flex-none px-3">Cancella</Button>
                <Button type="button" onClick={() => handleSubmit()} size="md" disabled={!answer.trim()} className="flex-1">Invia</Button>
              </div>
            </div>
          ) : (
            /* ── Input tastiera (anche modalità Ascolto) ── */
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                ref={inputRef}
                value={answer}
                onChange={(e) => { if (lastAnswerCorrect === false) clearFeedback(); setAnswer(e.target.value); }}
                placeholder={isListenMode ? "Inserisci il carattere sentito (es. S)" : answerPlaceholder}
                aria-label="La tua risposta"
                autoComplete="off"
                autoCapitalize="characters"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" size="lg" disabled={!answer.trim()} className="flex-1">Invia</Button>
                <Button type="button" onClick={reveal} variant="ghost" size="lg" className="flex-1">Rivela</Button>
                <Button type="button" onClick={startNewQuestion} variant="secondary" size="lg" className="flex-1">Salta</Button>
              </div>
            </form>
          )}

          {/* Rivela/Salta in modalità telegrafo */}
          {useTelegraph && isMorseAnswer && (
            <div className="flex gap-2">
              <Button type="button" onClick={reveal} variant="ghost" size="md" className="flex-1">Rivela</Button>
              <Button type="button" onClick={startNewQuestion} variant="secondary" size="md" className="flex-1">Salta</Button>
            </div>
          )}
        </CardBody>
      </Card>

      {total > 0 && (
        <Button onClick={reset} variant="ghost" size="sm" className="w-full text-slate-500">
          Reimposta sessione
        </Button>
      )}
    </div>
  );
}
