"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TelegraphKeyProps {
  onSymbol: (symbol: "." | "-") => void;
  disabled?: boolean;
  dashThresholdMs?: number;
}

export function TelegraphKey({
  onSymbol,
  disabled = false,
  dashThresholdMs = 300,
}: TelegraphKeyProps) {
  const [pressed, setPressed] = useState(false);
  const [lastSymbol, setLastSymbol] = useState<"." | "-" | null>(null);
  const pressStartRef = useRef<number | null>(null);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      pressStartRef.current = Date.now();
      setPressed(true);
      setLastSymbol(null);
    },
    [disabled]
  );

  const handlePressEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled || pressStartRef.current === null) return;
      e.preventDefault();

      const duration = Date.now() - pressStartRef.current;
      pressStartRef.current = null;
      setPressed(false);

      const symbol: "." | "-" = duration >= dashThresholdMs ? "-" : ".";
      setLastSymbol(symbol);
      onSymbol(symbol);

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => setLastSymbol(null), 600);
    },
    [disabled, dashThresholdMs, onSymbol]
  );

  const handlePressCancel = useCallback(() => {
    pressStartRef.current = null;
    setPressed(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Indicatore ultimo simbolo */}
      <div className="h-10 flex items-center justify-center">
        {lastSymbol !== null ? (
          <span
            className={cn(
              "text-3xl font-mono font-bold transition-all duration-100",
              lastSymbol === "." ? "text-emerald-400 scale-110" : "text-amber-400 scale-110"
            )}
            aria-live="assertive"
            aria-label={lastSymbol === "." ? "Punto" : "Linea"}
          >
            {lastSymbol === "." ? "·" : "−"}
          </span>
        ) : (
          <span className="text-slate-600 text-sm">premi o tieni premuto</span>
        )}
      </div>

      {/* Il tasto */}
      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressCancel}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressCancel}
        disabled={disabled}
        aria-label="Tasto telegrafo: premi per punto, tieni per linea"
        className={cn(
          "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full",
          "border-4 transition-all duration-75",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
          "touch-none",
          disabled
            ? "opacity-40 cursor-not-allowed border-slate-600 bg-slate-700"
            : pressed
            ? ["border-red-800 bg-red-700", "scale-95 shadow-inner shadow-red-950"]
            : [
                "border-red-600 bg-red-600",
                "hover:bg-red-500 hover:border-red-500",
                "shadow-lg shadow-red-900/60",
                "active:scale-95",
              ]
        )}
      >
        <span
          className={cn(
            "absolute top-3 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full",
            "bg-white/20 blur-sm transition-opacity duration-75",
            pressed ? "opacity-0" : "opacity-100"
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "text-white text-2xl font-bold font-mono transition-transform duration-75",
            pressed ? "translate-y-0.5" : ""
          )}
          aria-hidden="true"
        >
          {pressed ? "●" : "○"}
        </span>
      </button>

      {/* Legenda */}
      <div className="flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          Tap = punto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-5 h-2 rounded bg-amber-500" />
          Tieni = linea
        </span>
      </div>
    </div>
  );
}
