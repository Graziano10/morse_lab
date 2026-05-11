"use client";

import { getTimingFromWpm } from "@/lib/morse/timing";

const DEFAULT_FREQUENCY = 600;
let currentStopFlag: { stopped: boolean } | null = null;

function createAudioContext(): AudioContext {
  return new AudioContext();
}

function scheduleBeep(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number
): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.8, startTime + 0.005);
  gainNode.gain.setValueAtTime(0.8, startTime + duration - 0.005);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function stopMorse(): void {
  if (currentStopFlag) {
    currentStopFlag.stopped = true;
  }
}

export async function playMorse(
  morseString: string,
  options: { wpm?: number; frequency?: number } = {}
): Promise<void> {
  stopMorse();

  const stopFlag = { stopped: false };
  currentStopFlag = stopFlag;

  const wpm = options.wpm ?? 20;
  const frequency = options.frequency ?? DEFAULT_FREQUENCY;
  const timing = getTimingFromWpm(wpm);

  const ctx = createAudioContext();
  let cursor = ctx.currentTime + 0.1;

  const tokens = morseString.split(/(\s*\/\s*|\s+)/);

  for (let i = 0; i < tokens.length; i++) {
    if (stopFlag.stopped) {
      ctx.close();
      return;
    }

    const token = tokens[i];

    if (/^\s*\/\s*$/.test(token)) {
      cursor += timing.wordGap / 1000;
      continue;
    }

    const trimmed = token.trim();
    if (!trimmed) continue;

    const symbols = trimmed.split("");
    for (let j = 0; j < symbols.length; j++) {
      if (stopFlag.stopped) {
        ctx.close();
        return;
      }

      const sym = symbols[j];
      if (sym === ".") {
        scheduleBeep(ctx, frequency, cursor, timing.dotDuration / 1000);
        cursor += timing.dotDuration / 1000;
      } else if (sym === "-") {
        scheduleBeep(ctx, frequency, cursor, timing.dashDuration / 1000);
        cursor += timing.dashDuration / 1000;
      }

      if (j < symbols.length - 1) {
        cursor += timing.symbolGap / 1000;
      }
    }

    // Check if next token is a word separator or end
    const nextToken = tokens[i + 1];
    if (nextToken !== undefined && !/^\s*\/\s*$/.test(nextToken)) {
      cursor += timing.letterGap / 1000;
    }
  }

  const totalDuration = (cursor - ctx.currentTime + 0.1) * 1000;

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      if (ctx.state !== "closed") ctx.close();
      resolve();
    }, totalDuration);
  });
}
