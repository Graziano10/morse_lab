"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Tree definition ────────────────────────────────────────────────────────

interface MNode {
  id: string;
  letter: string | null;
  morse: string;
  cx: number;
  cy: number;
  dotChild: string | null;  // reached by pressing · (dot)
  dashChild: string | null; // reached by pressing − (dash)
  parent: string | null;
  depth: number;
}

// Y coordinates per depth level
const YS = [28, 82, 148, 222, 302];

// Level-4 leaf x positions — perfectly balanced binary tree
// 16 slots, spacing=35, leftmost=all-dash, rightmost=all-dot
const L4 = (i: number) => 37.5 + i * 35;

const NODES: MNode[] = [
  // Root (antenna)
  { id: "root", letter: null, morse: "", cx: 300, cy: YS[0], dotChild: "E", dashChild: "T", parent: null, depth: 0 },

  // Depth 1
  { id: "E", letter: "E", morse: "·",   cx: 440, cy: YS[1], dotChild: "I", dashChild: "A",  parent: "root", depth: 1 },
  { id: "T", letter: "T", morse: "−",   cx: 160, cy: YS[1], dotChild: "N", dashChild: "M",  parent: "root", depth: 1 },

  // Depth 2
  { id: "I", letter: "I", morse: "··",  cx: 510, cy: YS[2], dotChild: "S", dashChild: "U",  parent: "E", depth: 2 },
  { id: "A", letter: "A", morse: "·−",  cx: 370, cy: YS[2], dotChild: "R", dashChild: "W",  parent: "E", depth: 2 },
  { id: "N", letter: "N", morse: "−·",  cx: 230, cy: YS[2], dotChild: "D", dashChild: "K",  parent: "T", depth: 2 },
  { id: "M", letter: "M", morse: "−−",  cx:  90, cy: YS[2], dotChild: "G", dashChild: "O",  parent: "T", depth: 2 },

  // Depth 3
  { id: "S", letter: "S", morse: "···", cx: 545, cy: YS[3], dotChild: "H", dashChild: "V",  parent: "I", depth: 3 },
  { id: "U", letter: "U", morse: "··−", cx: 475, cy: YS[3], dotChild: "F", dashChild: null, parent: "I", depth: 3 },
  { id: "R", letter: "R", morse: "·−·", cx: 405, cy: YS[3], dotChild: "L", dashChild: null, parent: "A", depth: 3 },
  { id: "W", letter: "W", morse: "·−−", cx: 335, cy: YS[3], dotChild: "P", dashChild: "J",  parent: "A", depth: 3 },
  { id: "D", letter: "D", morse: "−··", cx: 265, cy: YS[3], dotChild: "B", dashChild: "X",  parent: "N", depth: 3 },
  { id: "K", letter: "K", morse: "−·−", cx: 195, cy: YS[3], dotChild: "C", dashChild: "Y",  parent: "N", depth: 3 },
  { id: "G", letter: "G", morse: "−−·", cx: 125, cy: YS[3], dotChild: "Z", dashChild: "Q",  parent: "M", depth: 3 },
  { id: "O", letter: "O", morse: "−−−", cx:  55, cy: YS[3], dotChild: null, dashChild: null, parent: "M", depth: 3 },

  // Depth 4
  { id: "H", letter: "H", morse: "····", cx: L4(15), cy: YS[4], dotChild: null, dashChild: null, parent: "S", depth: 4 },
  { id: "V", letter: "V", morse: "···−", cx: L4(14), cy: YS[4], dotChild: null, dashChild: null, parent: "S", depth: 4 },
  { id: "F", letter: "F", morse: "··−·", cx: L4(13), cy: YS[4], dotChild: null, dashChild: null, parent: "U", depth: 4 },
  // L4(12) = ··−− (skip)
  { id: "L", letter: "L", morse: "·−··", cx: L4(10), cy: YS[4], dotChild: null, dashChild: null, parent: "R", depth: 4 },
  // L4(11) = ·−·− (skip)
  { id: "P", letter: "P", morse: "·−−·", cx: L4(9),  cy: YS[4], dotChild: null, dashChild: null, parent: "W", depth: 4 },
  { id: "J", letter: "J", morse: "·−−−", cx: L4(8),  cy: YS[4], dotChild: null, dashChild: null, parent: "W", depth: 4 },
  { id: "B", letter: "B", morse: "−···", cx: L4(7),  cy: YS[4], dotChild: null, dashChild: null, parent: "D", depth: 4 },
  { id: "X", letter: "X", morse: "−··−", cx: L4(6),  cy: YS[4], dotChild: null, dashChild: null, parent: "D", depth: 4 },
  { id: "C", letter: "C", morse: "−·−·", cx: L4(5),  cy: YS[4], dotChild: null, dashChild: null, parent: "K", depth: 4 },
  { id: "Y", letter: "Y", morse: "−·−−", cx: L4(4),  cy: YS[4], dotChild: null, dashChild: null, parent: "K", depth: 4 },
  { id: "Z", letter: "Z", morse: "−−··", cx: L4(3),  cy: YS[4], dotChild: null, dashChild: null, parent: "G", depth: 4 },
  { id: "Q", letter: "Q", morse: "−−·−", cx: L4(2),  cy: YS[4], dotChild: null, dashChild: null, parent: "G", depth: 4 },
  // L4(1) = −−−· (skip)
  // L4(0) = −−−− (skip)
];

const NODE_MAP = new Map(NODES.map((n) => [n.id, n]));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getActivePath(path: string[]): string[] {
  const ids: string[] = ["root"];
  let node = NODE_MAP.get("root")!;
  for (const sym of path) {
    const nextId = sym === "." ? node.dotChild : node.dashChild;
    if (!nextId) break;
    const next = NODE_MAP.get(nextId);
    if (!next) break;
    ids.push(nextId);
    node = next;
  }
  return ids;
}

function resolveNode(path: string[]): MNode | null {
  let node = NODE_MAP.get("root")!;
  for (const sym of path) {
    const nextId = sym === "." ? node.dotChild : node.dashChild;
    if (!nextId) return null;
    const next = NODE_MAP.get(nextId);
    if (!next) return null;
    node = next;
  }
  return path.length === 0 ? null : node;
}

function playBeep(isDash: boolean, ctxRef: React.MutableRefObject<AudioContext | null>) {
  try {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = isDash ? 520 : 720;
    const now = ctx.currentTime;
    const dur = isDash ? 0.20 : 0.075;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.006);
    gain.gain.setValueAtTime(0.45, now + dur - 0.006);
    gain.gain.linearRampToValueAtTime(0, now + dur);
    osc.start(now);
    osc.stop(now + dur);
  } catch (_) {
    // AudioContext unavailable (SSR / permissions)
  }
}

function nodeRadius(depth: number) {
  if (depth <= 2) return 16;
  if (depth === 3) return 13;
  return 10;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MorseTreeCard() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [decodedText, setDecodedText] = useState("");
  const [lastDecoded, setLastDecoded] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const pressStartRef = useRef<number | null>(null);
  const decodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const invalidTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Always reflect latest path for the auto-decode timer
  const pathRef = useRef<string[]>([]);

  const updatePath = useCallback((newPath: string[]) => {
    pathRef.current = newPath;
    setCurrentPath(newPath);
  }, []);

  const scheduleAutoDecode = useCallback(() => {
    if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);
    decodeTimerRef.current = setTimeout(() => {
      const path = pathRef.current;
      if (path.length === 0) return;
      const node = resolveNode(path);
      if (node?.letter) {
        setLastDecoded(node.letter);
        setShowFlash(true);
        setDecodedText((prev) => prev + node.letter);
        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => setShowFlash(false), 800);
      } else {
        // Dead-end path — flash invalid
        setIsInvalid(true);
        if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current);
        invalidTimerRef.current = setTimeout(() => setIsInvalid(false), 600);
      }
      updatePath([]);
    }, 1500);
  }, [updatePath]);

  const handlePressStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      pressStartRef.current = Date.now();
      setPressed(true);
      // Pause auto-decode while user is still pressing
      if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);
    },
    []
  );

  const handlePressEnd = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (pressStartRef.current === null) return;
      const dur = Date.now() - pressStartRef.current;
      pressStartRef.current = null;
      setPressed(false);

      const sym: "." | "-" = dur >= 300 ? "-" : ".";
      playBeep(sym === "-", audioCtxRef);

      const newPath = [...pathRef.current, sym];
      updatePath(newPath);
      scheduleAutoDecode();
    },
    [updatePath, scheduleAutoDecode]
  );

  const handlePressCancel = useCallback(() => {
    pressStartRef.current = null;
    setPressed(false);
  }, []);

  // Spacebar as telegraph key
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();
      pressStartRef.current = Date.now();
      setPressed(true);
      if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (pressStartRef.current === null) return;
      const dur = Date.now() - pressStartRef.current;
      pressStartRef.current = null;
      setPressed(false);
      const sym: "." | "-" = dur >= 300 ? "-" : ".";
      playBeep(sym === "-", audioCtxRef);
      const newPath = [...pathRef.current, sym];
      updatePath(newPath);
      scheduleAutoDecode();
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [updatePath, scheduleAutoDecode]);

  const handleClearCurrent = useCallback(() => {
    if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);
    updatePath([]);
  }, [updatePath]);

  const handleAddSpace = useCallback(() => {
    setDecodedText((prev) => prev + " ");
  }, []);

  const handleClearAll = useCallback(() => {
    handleClearCurrent();
    setDecodedText("");
    setLastDecoded(null);
    setShowFlash(false);
  }, [handleClearCurrent]);

  // ─── Derived state ─────────────────────────────────────────────────────────

  const activePath = getActivePath(currentPath);
  const activeSet = new Set(activePath);
  const currentNode = resolveNode(currentPath);
  const currentNodeId = currentNode?.id ?? null;

  const getNodeState = (id: string): "current" | "path" | "inactive" => {
    if (id === currentNodeId) return "current";
    if (activeSet.has(id) && id !== "root") return "path";
    return "inactive";
  };

  const isLineActive = (pId: string, cId: string) =>
    activeSet.has(pId) && activeSet.has(cId);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* ── Physical-card simulation ── */}
      <div
        className={cn(
          "w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden transition-colors duration-200",
          isInvalid
            ? "border-red-500/60 shadow-red-900/30"
            : "border-slate-700/40"
        )}
        style={{ background: "radial-gradient(ellipse at 60% 0%, #0d1f1a 0%, #080e18 100%)" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/30">
          <span className="font-bold tracking-[0.5em] text-slate-400 text-xs">MORSE</span>
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-150",
              isInvalid
                ? "bg-red-400 shadow-[0_0_12px_4px_rgba(248,113,113,0.7)]"
                : "bg-red-600 shadow-[0_0_6px_1px_rgba(220,38,38,0.4)]"
            )}
          />
          <span className="font-bold tracking-[0.5em] text-slate-400 text-xs">CODE</span>
        </div>

        {/* SVG Tree */}
        <div className="px-3 pt-3 pb-5">
          <svg
            viewBox="0 0 600 330"
            className="w-full h-auto"
            aria-label="Albero di decodifica del codice Morse"
            style={{ fontFamily: "monospace" }}
          >
            <defs>
              {/* Board dot pattern */}
              <pattern id="board-dots" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="9" cy="9" r="0.7" fill="#162032" />
              </pattern>
              {/* Glow for current node */}
              <filter id="glow-green" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Glow for path nodes */}
              <filter id="glow-amber" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <rect width="600" height="330" fill="#07111e" rx="6" />
            <rect width="600" height="330" fill="url(#board-dots)" rx="6" />

            {/* ── Edges (drawn behind nodes) ── */}
            {NODES.map((node) => {
              const edges = [];
              if (node.dotChild) {
                const child = NODE_MAP.get(node.dotChild)!;
                const active = isLineActive(node.id, node.dotChild);
                edges.push(
                  <line
                    key={`${node.id}-dot`}
                    x1={node.cx} y1={node.cy}
                    x2={child.cx} y2={child.cy}
                    stroke={active ? "#10b981" : "#172a20"}
                    strokeWidth={active ? 2 : 1}
                    strokeOpacity={active ? 1 : 0.8}
                  />
                );
              }
              if (node.dashChild) {
                const child = NODE_MAP.get(node.dashChild)!;
                const active = isLineActive(node.id, node.dashChild);
                edges.push(
                  <line
                    key={`${node.id}-dash`}
                    x1={node.cx} y1={node.cy}
                    x2={child.cx} y2={child.cy}
                    stroke={active ? "#f59e0b" : "#2a1f0a"}
                    strokeWidth={active ? 2 : 1}
                    strokeOpacity={active ? 1 : 0.8}
                  />
                );
              }
              return edges;
            })}

            {/* ── Antenna (root) ── */}
            {(() => {
              const root = NODE_MAP.get("root")!;
              const { cx, cy } = root;
              return (
                <g>
                  {/* Signal arcs */}
                  <path d={`M ${cx-15} ${cy-4} Q ${cx-21} ${cy-12} ${cx-15} ${cy-20}`} fill="none" stroke="#2d4a3a" strokeWidth="1.2" />
                  <path d={`M ${cx+15} ${cy-4} Q ${cx+21} ${cy-12} ${cx+15} ${cy-20}`} fill="none" stroke="#2d4a3a" strokeWidth="1.2" />
                  {/* Triangle */}
                  <polygon
                    points={`${cx},${cy-14} ${cx-9},${cy+4} ${cx+9},${cy+4}`}
                    fill="none" stroke="#4b7c5e" strokeWidth="1.5"
                  />
                  {/* Mast */}
                  <line x1={cx} y1={cy+4} x2={cx} y2={cy+16} stroke="#4b7c5e" strokeWidth="1.5" />
                  <line x1={cx-10} y1={cy+16} x2={cx+10} y2={cy+16} stroke="#4b7c5e" strokeWidth="1.5" />
                  {/* Dot/dash hint labels */}
                  <text x={cx+52} y={cy+30} fill="#1e4a30" fontSize="9" textAnchor="middle">·</text>
                  <text x={cx-52} y={cy+30} fill="#3a2a0a" fontSize="9" textAnchor="middle">−</text>
                </g>
              );
            })()}

            {/* ── Letter nodes ── */}
            {NODES.filter((n) => n.depth > 0).map((node) => {
              const state = getNodeState(node.id);
              const r = nodeRadius(node.depth);
              const isCurrent = state === "current";
              const isPath = state === "path";

              const fillColor = isCurrent ? "#053520" : isPath ? "#3b1c06" : "#0a1628";
              const strokeColor = isCurrent ? "#34d399" : isPath ? "#fbbf24" : "#1e3a52";
              const strokeWidth = isCurrent || isPath ? 2 : 1;
              const textColor = isCurrent ? "#6ee7b7" : isPath ? "#fde68a" : "#475569";
              const fontSize = node.depth <= 2 ? 11 : node.depth === 3 ? 9 : 8;
              const filter = isCurrent
                ? "url(#glow-green)"
                : isPath
                ? "url(#glow-amber)"
                : undefined;

              return (
                <g key={node.id} filter={filter}>
                  <circle
                    cx={node.cx} cy={node.cy} r={r}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                  />
                  {node.letter && (
                    <text
                      x={node.cx}
                      y={node.cy + fontSize * 0.38}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={fontSize}
                      fontWeight="bold"
                    >
                      {node.letter}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── Current input sequence ── */}
      <div className="h-10 flex items-center justify-center gap-1.5 min-w-[200px]">
        {currentPath.length === 0 ? (
          <span className="text-slate-600 text-sm font-mono select-none">
            {isInvalid ? "sequenza non valida" : "premi il tasto…"}
          </span>
        ) : (
          currentPath.map((sym, i) => (
            <span
              key={i}
              className={cn(
                "text-2xl font-bold font-mono leading-none",
                sym === "." ? "text-emerald-400" : "text-amber-400"
              )}
            >
              {sym === "." ? "·" : "−"}
            </span>
          ))
        )}
      </div>

      {/* ── Decoded letter flash ── */}
      <div className="h-24 flex items-center justify-center">
        {lastDecoded && (
          <span
            className={cn(
              "text-8xl font-black font-mono transition-all duration-200",
              showFlash
                ? "text-emerald-400 opacity-100 scale-110 drop-shadow-[0_0_24px_rgba(52,211,153,0.9)]"
                : "text-slate-700 opacity-60 scale-100"
            )}
            aria-live="assertive"
          >
            {lastDecoded}
          </span>
        )}
      </div>

      {/* ── Telegraph button ── */}
      <div className="flex flex-col items-center gap-3 select-none">
        <button
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerCancel={handlePressCancel}
          className={cn(
            "w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 transition-all duration-75",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
            "touch-none select-none",
            pressed
              ? "border-red-800 bg-red-700 scale-95 shadow-inner shadow-red-950"
              : [
                  "border-red-600 bg-red-600",
                  "hover:bg-red-500 hover:border-red-500",
                  "shadow-lg shadow-red-900/50 hover:shadow-red-800/60",
                  "active:scale-95",
                ]
          )}
          aria-label="Tasto telegrafo: premi brevemente per punto, tieni premuto per linea"
        >
          {/* Gloss */}
          <span
            className={cn(
              "absolute top-3 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full bg-white/20 blur-sm transition-opacity",
              pressed ? "opacity-0" : "opacity-100"
            )}
            aria-hidden="true"
          />
          <span className="text-3xl text-white/80 pointer-events-none" aria-hidden="true">
            {pressed ? "●" : "○"}
          </span>
        </button>

        <div className="flex items-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            Tap = punto (·)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5 h-2 rounded bg-amber-500 shrink-0" />
            Tieni = linea (−)
          </span>
        </div>

        <p className="text-xs text-slate-600">
          oppure{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-400 text-xs font-mono">
            Spazio
          </kbd>
        </p>
      </div>

      {/* ── Controls row ── */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {currentPath.length > 0 && (
          <button
            onClick={handleClearCurrent}
            className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors"
          >
            ✕ Annulla sequenza
          </button>
        )}
        <button
          onClick={handleAddSpace}
          className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors"
        >
          ⎵ Spazio parola
        </button>
      </div>

      {/* ── Decoded text buffer ── */}
      {decodedText && (
        <div className="w-full max-w-2xl rounded-xl border border-slate-700/40 bg-slate-800/30 px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500 font-mono">testo decodificato</span>
            <button
              onClick={handleClearAll}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              cancella tutto
            </button>
          </div>
          <p className="font-mono text-xl text-slate-100 tracking-widest min-h-[1.8rem] break-all">
            {decodedText}
          </p>
        </div>
      )}
    </div>
  );
}
