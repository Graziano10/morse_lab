"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { encodeText } from "@/lib/morse/encode";
import { playMorse, stopMorse } from "@/lib/audio/playMorse";

export function MorsePlayer() {
  const [text, setText] = useState("");
  const [morse, setMorse] = useState("");
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);
  const [playing, setPlaying] = useState(false);

  const handleEncode = () => {
    if (!text.trim()) return;
    const result = encodeText(text);
    setMorse(result.output);
  };

  const handlePlay = async () => {
    const target = morse || (text ? encodeText(text).output : "");
    if (!target.trim()) return;
    if (!morse && text) setMorse(encodeText(text).output);
    setPlaying(true);
    try {
      await playMorse(target, { wpm, frequency });
    } finally {
      setPlaying(false);
    }
  };

  const handleStop = () => {
    stopMorse();
    setPlaying(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Player</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Textarea
          label="Text to play"
          placeholder="Type text here and click Play..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setMorse("");
          }}
          rows={3}
          aria-label="Text for audio playback"
        />

        {morse && (
          <div className="rounded-lg bg-slate-900/60 border border-slate-700/40 px-4 py-3">
            <p className="text-xs text-slate-500 mb-1">Morse code</p>
            <p className="font-mono text-emerald-400 text-sm break-all" aria-live="polite">
              {morse}
            </p>
          </div>
        )}

        <Slider
          label="Speed (WPM)"
          min={5}
          max={40}
          value={wpm}
          onChange={(e) => setWpm(Number(e.target.value))}
          valueDisplay={`${wpm} WPM`}
          aria-label={`Playback speed: ${wpm} WPM`}
        />

        <Slider
          label="Frequency (Hz)"
          min={400}
          max={900}
          step={50}
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          valueDisplay={`${frequency} Hz`}
          aria-label={`Tone frequency: ${frequency} Hz`}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleEncode}
            variant="secondary"
            size="lg"
            disabled={!text.trim()}
            className="w-full sm:w-auto"
          >
            Encode
          </Button>
          {!playing ? (
            <Button
              onClick={handlePlay}
              size="lg"
              disabled={!text.trim() && !morse.trim()}
              className="w-full sm:w-auto"
              aria-label="Play Morse audio"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              variant="danger"
              size="lg"
              className="w-full sm:w-auto"
              aria-label="Stop Morse audio"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6h12v12H6z" />
              </svg>
              Stop
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
