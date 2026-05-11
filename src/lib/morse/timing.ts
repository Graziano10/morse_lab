export interface MorseTiming {
  dotDuration: number;
  dashDuration: number;
  symbolGap: number;
  letterGap: number;
  wordGap: number;
}

/**
 * Paris standard: 1 WPM = 1200ms per dot unit.
 */
export function getTimingFromWpm(wpm: number): MorseTiming {
  const unit = 1200 / wpm;
  return {
    dotDuration: unit,
    dashDuration: unit * 3,
    symbolGap: unit,
    letterGap: unit * 3,
    wordGap: unit * 7,
  };
}
