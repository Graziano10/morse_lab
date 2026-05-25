"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Tree definition ──────────────────────────────────────────────────────────

interface MNode {
  id: string;
  letter: string | null;
  morse: string;
  cx: number;
  cy: number;
  dotChild: string | null;
  dashChild: string | null;
  parent: string | null;
  depth: number;
}

const YS = [32, 98, 174, 258, 348];

const L4 = (i: number) => 37.5 + i * 35;

const NODES: MNode[] = [
  { id: "root", letter: null,  morse: "",     cx: 300,    cy: YS[0], dotChild: "E",  dashChild: "T",  parent: null, depth: 0 },

  { id: "E",    letter: "E",   morse: "·",    cx: 440,    cy: YS[1], dotChild: "I",  dashChild: "A",  parent: "root", depth: 1 },
  { id: "T",    letter: "T",   morse: "−",    cx: 160,    cy: YS[1], dotChild: "N",  dashChild: "M",  parent: "root", depth: 1 },

  { id: "I",    letter: "I",   morse: "··",   cx: 510,    cy: YS[2], dotChild: "S",  dashChild: "U",  parent: "E",   depth: 2 },
  { id: "A",    letter: "A",   morse: "·−",   cx: 370,    cy: YS[2], dotChild: "R",  dashChild: "W",  parent: "E",   depth: 2 },
  { id: "N",    letter: "N",   morse: "−·",   cx: 230,    cy: YS[2], dotChild: "D",  dashChild: "K",  parent: "T",   depth: 2 },
  { id: "M",    letter: "M",   morse: "−−",   cx:  90,    cy: YS[2], dotChild: "G",  dashChild: "O",  parent: "T",   depth: 2 },

  { id: "S",    letter: "S",   morse: "···",  cx: 545,    cy: YS[3], dotChild: "H",  dashChild: "V",  parent: "I",   depth: 3 },
  { id: "U",    letter: "U",   morse: "··−",  cx: 475,    cy: YS[3], dotChild: "F",  dashChild: null, parent: "I",   depth: 3 },
  { id: "R",    letter: "R",   morse: "·−·",  cx: 405,    cy: YS[3], dotChild: "L",  dashChild: null, parent: "A",   depth: 3 },
  { id: "W",    letter: "W",   morse: "·−−",  cx: 335,    cy: YS[3], dotChild: "P",  dashChild: "J",  parent: "A",   depth: 3 },
  { id: "D",    letter: "D",   morse: "−··",  cx: 265,    cy: YS[3], dotChild: "B",  dashChild: "X",  parent: "N",   depth: 3 },
  { id: "K",    letter: "K",   morse: "−·−",  cx: 195,    cy: YS[3], dotChild: "C",  dashChild: "Y",  parent: "N",   depth: 3 },
  { id: "G",    letter: "G",   morse: "−−·",  cx: 125,    cy: YS[3], dotChild: "Z",  dashChild: "Q",  parent: "M",   depth: 3 },
  { id: "O",    letter: "O",   morse: "−−−",  cx:  55,    cy: YS[3], dotChild: null, dashChild: null, parent: "M",   depth: 3 },

  { id: "H",    letter: "H",   morse: "····", cx: L4(15), cy: YS[4], dotChild: null, dashChild: null, parent: "S",   depth: 4 },
  { id: "V",    letter: "V",   morse: "···−", cx: L4(14), cy: YS[4], dotChild: null, dashChild: null, parent: "S",   depth: 4 },
  { id: "F",    letter: "F",   morse: "··−·", cx: L4(13), cy: YS[4], dotChild: null, dashChild: null, parent: "U",   depth: 4 },
  { id: "L",    letter: "L",   morse: "·−··", cx: L4(10), cy: YS[4], dotChild: null, dashChild: null, parent: "R",   depth: 4 },
  { id: "P",    letter: "P",   morse: "·−−·", cx: L4(9),  cy: YS[4], dotChild: null, dashChild: null, parent: "W",   depth: 4 },
  { id: "J",    letter: "J",   morse: "·−−−", cx: L4(8),  cy: YS[4], dotChild: null, dashChild: null, parent: "W",   depth: 4 },
  { id: "B",    letter: "B",   morse: "−···", cx: L4(7),  cy: YS[4], dotChild: null, dashChild: null, parent: "D",   depth: 4 },
  { id: "X",    letter: "X",   morse: "−··−", cx: L4(6),  cy: YS[4], dotChild: null, dashChild: null, parent: "D",   depth: 4 },
  { id: "C",    letter: "C",   morse: "−·−·", cx: L4(5),  cy: YS[4], dotChild: null, dashChild: null, parent: "K",   depth: 4 },
  { id: "Y",    letter: "Y",   morse: "−·−−", cx: L4(4),  cy: YS[4], dotChild: null, dashChild: null, parent: "K",   depth: 4 },
  { id: "Z",    letter: "Z",   morse: "−−··", cx: L4(3),  cy: YS[4], dotChild: null, dashChild: null, parent: "G",   depth: 4 },
  { id: "Q",    letter: "Q",   morse: "−−·−", cx: L4(2),  cy: YS[4], dotChild: null, dashChild: null, parent: "G",   depth: 4 },
];

const NODE_MAP = new Map(NODES.map((n) => [n.id, n]));

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      ctxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = isDash ? 520 : 720;
    const now = ctx.currentTime;
    const dur = isDash ? 0.22 : 0.08;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.006);
    gain.gain.setValueAtTime(0.45, now + dur - 0.006);
    gain.gain.linearRampToValueAtTime(0, now + dur);
    osc.start(now);
    osc.stop(now + dur);
  } catch (_) {}
}

function nodeRadius(depth: number) {
  if (depth === 1) return 22;
  if (depth === 2) return 18;
  if (depth === 3) return 14;
  return 11;
}

// ─── SVG sub-components ───────────────────────────────────────────────────────

function BranchLabel({
  x1, y1, x2, y2, label, active, dotBranch,
}: {
  x1: number; y1: number; x2: number; y2: number;
  label: string; active: boolean; dotBranch: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const color = active
    ? dotBranch ? "#22d3ee" : "#f59e0b"
    : dotBranch ? "#1a3038" : "#2e2010";

  return (
    <g>
      <rect x={mx - 6} y={my - 8} width={12} height={12} rx={3}
        fill="#09090b" fillOpacity={0.9} />
      <text x={mx} y={my + 1}
        textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={9} fontWeight="bold" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const DASH_MS = 300;

export function MorseTreeCard() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [decodedText, setDecodedText] = useState("");
  const [lastDecoded, setLastDecoded] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [pressDuration, setPressDuration] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);

  const pressStartRef    = useRef<number | null>(null);
  const decodeTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const invalidTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const pathRef          = useRef<string[]>([]);

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
        flashTimerRef.current = setTimeout(() => setShowFlash(false), 900);
      } else {
        setIsInvalid(true);
        if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current);
        invalidTimerRef.current = setTimeout(() => setIsInvalid(false), 700);
      }
      updatePath([]);
    }, 1500);
  }, [updatePath]);

  useEffect(() => {
    if (!pressed) {
      setPressDuration(0);
      if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);
      return;
    }
    pressIntervalRef.current = setInterval(() => {
      if (pressStartRef.current !== null)
        setPressDuration(Date.now() - pressStartRef.current);
    }, 25);
    return () => {
      if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);
    };
  }, [pressed]);

  const startPress = useCallback(() => {
    pressStartRef.current = Date.now();
    setPressed(true);
    if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);
  }, []);

  const endPress = useCallback(() => {
    if (pressStartRef.current === null) return;
    const dur = Date.now() - pressStartRef.current;
    pressStartRef.current = null;
    setPressed(false);
    const sym: "." | "-" = dur >= DASH_MS ? "-" : ".";
    playBeep(sym === "-", audioCtxRef);
    const newPath = [...pathRef.current, sym];
    updatePath(newPath);
    scheduleAutoDecode();
  }, [updatePath, scheduleAutoDecode]);

  const cancelPress = useCallback(() => {
    pressStartRef.current = null;
    setPressed(false);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startPress();
  }, [startPress]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    endPress();
  }, [endPress]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();
      startPress();
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      endPress();
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [startPress, endPress]);

  const handleClearCurrent = useCallback(() => {
    if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);
    updatePath([]);
  }, [updatePath]);

  const handleAddSpace = useCallback(() => {
    setDecodedText((prev) => (prev.endsWith(" ") ? prev : prev + " "));
  }, []);

  const handleClearAll = useCallback(() => {
    handleClearCurrent();
    setDecodedText("");
    setLastDecoded(null);
    setShowFlash(false);
  }, [handleClearCurrent]);

  // ─── Derived render state ─────────────────────────────────────────────────

  const activePath    = getActivePath(currentPath);
  const activeSet     = new Set(activePath);
  const currentNode   = resolveNode(currentPath);
  const currentNodeId = currentNode?.id ?? null;

  const getNodeState = (id: string): "current" | "path" | "inactive" => {
    if (id === currentNodeId) return "current";
    if (activeSet.has(id) && id !== "root") return "path";
    return "inactive";
  };

  const isLineActive = (pId: string, cId: string) =>
    activeSet.has(pId) && activeSet.has(cId);

  const RING_R = 56;
  const CIRC   = 2 * Math.PI * RING_R;
  const ringProgress = Math.min(pressDuration / DASH_MS, 1);
  const ringOffset   = CIRC * (1 - ringProgress);
  const ringColor    = ringProgress >= 1 ? "#f59e0b" : "#22d3ee";
  const predictedSym = pressed ? (pressDuration >= DASH_MS ? "−" : "·") : null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-6 w-full">

      {/* ── Tree Card ── */}
      <div className={cn(
        "w-full max-w-3xl rounded-2xl overflow-hidden transition-all duration-300",
        "border shadow-2xl shadow-black/60",
        isInvalid
          ? "border-red-500/25 shadow-red-950/30"
          : "border-white/[0.07]"
      )} style={{ background: "#09090b" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <span className="text-cyan-500 font-black tracking-wider text-sm font-mono">·−</span>
            <span className="text-[11px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
              Morse Tree
            </span>
          </div>

          {/* Status indicator */}
          <div className={cn(
            "w-2 h-2 rounded-full transition-all duration-200",
            isInvalid
              ? "bg-red-500 shadow-[0_0_8px_3px_rgba(239,68,68,0.5)]"
              : currentNode
              ? "bg-cyan-400 shadow-[0_0_8px_3px_rgba(34,211,238,0.5)] animate-pulse"
              : "bg-zinc-800"
          )} />
        </div>

        {/* SVG Tree */}
        <div className="px-2 py-3">
          <svg
            viewBox="0 0 600 380"
            className="w-full h-auto"
            aria-label="Albero binario di decodifica Morse"
            style={{ fontFamily: "monospace" }}
          >
            <defs>
              <filter id="glow-cyan" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" result="b1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b2" />
                <feMerge>
                  <feMergeNode in="b1" />
                  <feMergeNode in="b2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-amber" x="-70%" y="-70%" width="240%" height="240%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <rect width="600" height="380" fill="#09090b" rx="4" />

            {/* Subtle depth guides */}
            {[YS[1], YS[2], YS[3], YS[4]].map((y, i) => (
              <line key={i} x1={16} y1={y} x2={584} y2={y}
                stroke="#18181b" strokeWidth={0.5} strokeDasharray="3 8"
              />
            ))}

            {/* Root symbol */}
            {(() => {
              const { cx, cy } = NODE_MAP.get("root")!;
              return (
                <g>
                  <polygon
                    points={`${cx},${cy - 13} ${cx - 10},${cy + 7} ${cx + 10},${cy + 7}`}
                    fill="#111113" stroke="#3f3f46" strokeWidth="1.5"
                  />
                  <line x1={cx} y1={cy + 7} x2={cx} y2={cy + 20} stroke="#3f3f46" strokeWidth="1.5" />
                  <line x1={cx - 10} y1={cy + 20} x2={cx + 10} y2={cy + 20} stroke="#3f3f46" strokeWidth="1.5" />
                  <text x={cx + 78} y={cy + 6} fill="#3f3f46" fontSize={8} textAnchor="middle">HOLD = −</text>
                  <text x={cx - 78} y={cy + 6} fill="#3f3f46" fontSize={8} textAnchor="middle">TAP = ·</text>
                </g>
              );
            })()}

            {/* Edges */}
            {NODES.map((node) => {
              const edges = [];

              if (node.dotChild) {
                const child  = NODE_MAP.get(node.dotChild)!;
                const active = isLineActive(node.id, node.dotChild);
                edges.push(
                  <line key={`${node.id}-dot-line`}
                    x1={node.cx} y1={node.cy} x2={child.cx} y2={child.cy}
                    stroke={active ? "#22d3ee" : "#27272a"}
                    strokeWidth={active ? 2 : 1}
                    strokeOpacity={active ? 1 : 0.7}
                  />
                );
                if (node.depth <= 1) {
                  edges.push(
                    <BranchLabel key={`${node.id}-dot-lbl`}
                      x1={node.cx} y1={node.cy} x2={child.cx} y2={child.cy}
                      label="·" dotBranch active={active}
                    />
                  );
                }
              }

              if (node.dashChild) {
                const child  = NODE_MAP.get(node.dashChild)!;
                const active = isLineActive(node.id, node.dashChild);
                edges.push(
                  <line key={`${node.id}-dash-line`}
                    x1={node.cx} y1={node.cy} x2={child.cx} y2={child.cy}
                    stroke={active ? "#f59e0b" : "#27272a"}
                    strokeWidth={active ? 2 : 1}
                    strokeOpacity={active ? 1 : 0.7}
                  />
                );
                if (node.depth <= 1) {
                  edges.push(
                    <BranchLabel key={`${node.id}-dash-lbl`}
                      x1={node.cx} y1={node.cy} x2={child.cx} y2={child.cy}
                      label="−" dotBranch={false} active={active}
                    />
                  );
                }
              }

              return edges;
            })}

            {/* Letter nodes */}
            {NODES.filter((n) => n.depth > 0).map((node) => {
              const state     = getNodeState(node.id);
              const r         = nodeRadius(node.depth);
              const isCurrent = state === "current";
              const isPath    = state === "path";

              const fill      = isCurrent ? "#041e26" : isPath ? "#1a1200" : "#111113";
              const stroke    = isCurrent ? "#22d3ee" : isPath ? "#f59e0b" : "#3f3f46";
              const strokeW   = isCurrent ? 2         : isPath ? 1.5       : 1;
              const textColor = isCurrent ? "#67e8f9"  : isPath ? "#fcd34d" : "#52525b";
              const fontSize  = node.depth <= 2 ? 13 : node.depth === 3 ? 10 : 9;
              const filter    = isCurrent ? "url(#glow-cyan)" : isPath ? "url(#glow-amber)" : undefined;

              return (
                <g key={node.id} filter={filter}>
                  <circle cx={node.cx} cy={node.cy} r={r}
                    fill={fill} stroke={stroke} strokeWidth={strokeW}
                  />
                  {node.letter && (
                    <text
                      x={node.cx} y={node.cy + fontSize * 0.38}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={fontSize}
                      fontWeight="600"
                    >
                      {node.letter}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Active node morse badge */}
            {currentNode && (() => {
              const { cx, cy, morse } = currentNode;
              const r      = nodeRadius(currentNode.depth);
              const badgeY = cy + r + 14;
              const tw     = morse.length * 7 + 12;
              return (
                <g filter="url(#glow-cyan)">
                  <rect x={cx - tw / 2} y={badgeY - 8} width={tw} height={13}
                    rx={4} fill="#041e26" stroke="#22d3ee" strokeWidth={0.8}
                  />
                  <text x={cx} y={badgeY + 1}
                    textAnchor="middle" dominantBaseline="central"
                    fill="#67e8f9" fontSize={8} fontWeight="bold"
                  >
                    {morse}
                  </text>
                </g>
              );
            })()}

            {/* Legend */}
            <g>
              <circle cx={22} cy={368} r={4} fill="#041e26" stroke="#22d3ee" strokeWidth={1.5} />
              <text x={30} y={372} fill="#52525b" fontSize={7}>Attuale</text>
              <circle cx={88} cy={368} r={4} fill="#1a1200" stroke="#f59e0b" strokeWidth={1.5} />
              <text x={96} y={372} fill="#52525b" fontSize={7}>Percorso</text>
              <circle cx={158} cy={368} r={4} fill="#111113" stroke="#3f3f46" strokeWidth={1} />
              <text x={166} y={372} fill="#52525b" fontSize={7}>Inattivo</text>
            </g>
          </svg>
        </div>

        {/* Sequence bar */}
        <div className={cn(
          "flex items-center justify-center gap-2 px-5 py-3 border-t transition-colors duration-200",
          currentPath.length > 0 ? "border-white/[0.06] bg-white/[0.015]" : "border-white/[0.04]"
        )}>
          {currentPath.length === 0 ? (
            <span className={cn(
              "text-[11px] font-mono tracking-widest select-none",
              isInvalid ? "text-red-500/70" : "text-zinc-700"
            )}>
              {isInvalid ? "SEQUENZA NON VALIDA" : "· − · PREMI IL TASTO · − ·"}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-700 font-mono tracking-wider mr-1">input</span>
              {currentPath.map((sym, i) => (
                <span key={i} className={cn(
                  "text-xl font-black font-mono leading-none select-none",
                  sym === "." ? "text-cyan-400" : "text-amber-400"
                )}>
                  {sym === "." ? "·" : "−"}
                </span>
              ))}
              {currentNode?.letter && (
                <span className="ml-2 text-[11px] text-zinc-600 font-mono">
                  → {currentNode.letter}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14 w-full max-w-3xl">

        {/* Telegraph button */}
        <div className="flex flex-col items-center gap-3 select-none shrink-0">
          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase">
            Telegrafo
          </p>

          {/* Predicted symbol */}
          <div className="h-8 flex items-center justify-center">
            {predictedSym ? (
              <span className={cn(
                "text-3xl font-black font-mono transition-all duration-100",
                predictedSym === "·" ? "text-cyan-400" : "text-amber-400"
              )}>
                {predictedSym}
              </span>
            ) : (
              <span className="text-[10px] text-zinc-700 font-mono tracking-wider">
                tap · / hold −
              </span>
            )}
          </div>

          {/* Button + ring */}
          <div className="relative w-32 h-32">
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 128 128"
            >
              <circle cx="64" cy="64" r={RING_R}
                fill="none" stroke="#27272a" strokeWidth="4"
              />
              {pressed && (
                <circle cx="64" cy="64" r={RING_R}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={ringOffset}
                  style={{ transition: "stroke-dashoffset 0.02s linear, stroke 0.1s" }}
                />
              )}
            </svg>

            <button
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={cancelPress}
              className={cn(
                "absolute inset-3 rounded-full transition-all duration-75",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]",
                "touch-none select-none flex items-center justify-center border-2",
                pressed
                  ? "bg-zinc-800 border-zinc-600 scale-95 shadow-inner shadow-black/60"
                  : [
                      "bg-zinc-900 border-zinc-700",
                      "hover:bg-zinc-800 hover:border-zinc-600",
                      "shadow-lg shadow-black/50",
                    ]
              )}
              aria-label="Tasto telegrafo: premi brevemente per punto, tieni premuto per linea"
            >
              {!pressed && (
                <span
                  className="absolute top-2.5 left-1/2 -translate-x-1/2 w-7 h-2 rounded-full bg-white/[0.06] blur-sm"
                  aria-hidden="true"
                />
              )}
              <span className={cn(
                "text-2xl select-none pointer-events-none transition-all duration-100",
                pressed ? "text-zinc-500 scale-75" : "text-zinc-600"
              )} aria-hidden="true">
                {pressed ? "●" : "○"}
              </span>
            </button>
          </div>

          <div className="flex gap-5 text-[10px] text-zinc-700 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-800 shrink-0" />
              Tap ·
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-1.5 rounded bg-amber-900 shrink-0" />
              Tieni −
            </span>
          </div>
          <p className="text-[10px] text-zinc-700 font-mono">
            o{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-mono">
              Space
            </kbd>
          </p>
        </div>

        {/* Right panel: decoded letter + controls */}
        <div className="flex flex-col items-center sm:items-start gap-5 flex-1 w-full">

          {/* Letter display */}
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl border border-white/[0.07] bg-white/[0.02] flex items-center justify-center">
              {lastDecoded ? (
                <span
                  className={cn(
                    "text-6xl font-black font-mono transition-all duration-200 select-none",
                    showFlash
                      ? "text-cyan-400 scale-110 drop-shadow-[0_0_24px_rgba(34,211,238,0.8)]"
                      : "text-zinc-700 scale-100"
                  )}
                  aria-live="assertive"
                >
                  {lastDecoded}
                </span>
              ) : (
                <span className="text-3xl text-zinc-800 select-none font-mono">?</span>
              )}
            </div>

            <div className="flex flex-col gap-1 text-[11px] text-zinc-700 font-mono">
              <span>Ultima lettera</span>
              <span>decodificata</span>
              {currentNode?.letter && (
                <span className="mt-2 text-cyan-800 font-mono">
                  → {currentNode.letter}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {currentPath.length > 0 && (
              <button
                onClick={handleClearCurrent}
                className="text-[11px] font-mono text-zinc-600 hover:text-red-400 border border-white/[0.07] hover:border-red-900/40 rounded-lg px-3 py-1.5 transition-colors"
              >
                ✕ Annulla
              </button>
            )}
            <button
              onClick={handleAddSpace}
              className="text-[11px] font-mono text-zinc-600 hover:text-zinc-300 border border-white/[0.07] rounded-lg px-3 py-1.5 transition-colors"
            >
              ⎵ Spazio
            </button>
            {decodedText && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-mono text-zinc-600 hover:text-red-400 border border-white/[0.07] hover:border-red-900/40 rounded-lg px-3 py-1.5 transition-colors"
              >
                Cancella tutto
              </button>
            )}
          </div>

          {/* Decoded text buffer */}
          {decodedText && (
            <div className="w-full rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <span className="block text-[10px] text-zinc-700 font-mono mb-2 tracking-[0.2em] uppercase">
                Testo Decodificato
              </span>
              <p className="font-mono text-lg text-zinc-300 tracking-[0.15em] min-h-[1.8rem] break-all">
                {decodedText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
