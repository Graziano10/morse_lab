"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { encodeText } from "@/lib/morse/encode";
import { decodeMorse } from "@/lib/morse/decode";
import { playMorse, stopMorse } from "@/lib/audio/playMorse";

type Mode = "encode" | "decode";

export function MorseTranslator() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [unsupported, setUnsupported] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [wpm, setWpm] = useState(20);
  const [copied, setCopied] = useState(false);

  const translate = useCallback(() => {
    if (!input.trim()) return;
    if (mode === "encode") {
      const result = encodeText(input);
      setOutput(result.output);
      setUnsupported(result.unsupportedChars);
    } else {
      const result = decodeMorse(input);
      setOutput(result.output);
      setUnsupported(result.unsupportedChars);
    }
  }, [input, mode]);

  const handlePlay = async () => {
    const morse = mode === "encode" ? output : input;
    if (!morse.trim()) return;
    setPlaying(true);
    try {
      await playMorse(morse, { wpm });
    } finally {
      setPlaying(false);
    }
  };

  const handleStop = () => {
    stopMorse();
    setPlaying(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
    setUnsupported([]);
  };

  const inputLabel = mode === "encode" ? "Testo" : "Codice Morse";
  const outputLabel = mode === "encode" ? "Codice Morse" : "Testo";
  const inputPlaceholder =
    mode === "encode"
      ? "Scrivi il testo qui... (es. SOS)"
      : "Inserisci il codice Morse... (es. ... --- ...)";

  return (
    <Card glow>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle>Traduttore</CardTitle>
          <div className="flex items-center gap-1 rounded-lg bg-slate-900/60 p-1 border border-slate-700/60">
            <button
              onClick={() => { setMode("encode"); setInput(""); setOutput(""); setUnsupported([]); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                mode === "encode" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              aria-pressed={mode === "encode"}
            >
              Testo → Morse
            </button>
            <button
              onClick={() => { setMode("decode"); setInput(""); setOutput(""); setUnsupported([]); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                mode === "decode" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              aria-pressed={mode === "decode"}
            >
              Morse → Testo
            </button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Textarea
            label={inputLabel}
            placeholder={inputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="font-mono text-sm"
            aria-label={`Inserisci ${inputLabel}`}
          />

          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <button
              onClick={handleSwap}
              disabled={!output}
              className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Inverti input e output"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <Textarea
            label={outputLabel}
            value={output}
            readOnly
            rows={5}
            className="font-mono text-sm bg-slate-900/80"
            aria-label={`${outputLabel} — risultato`}
            aria-live="polite"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button onClick={translate} disabled={!input.trim()} size="lg" className="w-full sm:w-auto">
            Traduci
          </Button>

          <Button
            onClick={handleSwap}
            disabled={!output}
            variant="secondary"
            size="lg"
            className="md:hidden w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Inverti
          </Button>

          {output && (
            <>
              <Button onClick={handleCopy} variant="secondary" size="lg" className="w-full sm:w-auto" aria-label="Copia risultato negli appunti">
                {copied ? "Copiato!" : "Copia"}
              </Button>

              {!playing ? (
                <Button onClick={handlePlay} variant="ghost" size="lg" className="w-full sm:w-auto" aria-label="Ascolta audio Morse">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ascolta
                </Button>
              ) : (
                <Button onClick={handleStop} variant="danger" size="lg" className="w-full sm:w-auto" aria-label="Stop audio">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6h12v12H6z" />
                  </svg>
                  Stop
                </Button>
              )}
            </>
          )}
        </div>

        {output && (
          <div className="flex items-center gap-3 pt-1">
            <label htmlFor="translator-wpm" className="text-sm text-slate-400 whitespace-nowrap">
              Velocità:
            </label>
            <input
              id="translator-wpm"
              type="range"
              min={5}
              max={40}
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-slate-700 accent-emerald-500"
              aria-label={`Velocità: ${wpm} WPM`}
            />
            <span className="text-sm font-mono text-emerald-400 w-16 text-right">{wpm} WPM</span>
          </div>
        )}

        {unsupported.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-amber-900/20 border border-amber-700/40 px-4 py-3" role="alert">
            <span className="text-sm text-amber-300">Caratteri non supportati ignorati:</span>
            {unsupported.map((ch) => (
              <Badge key={ch} variant="warning">{ch}</Badge>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
