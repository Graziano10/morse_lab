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

// Y coordinates per depth level — more vertical breathing room
const YS = [32, 98, 174, 258, 348];

// Level-4 x positions (perfectly balanced binary tree, 16 slots, spacing=35)
// leftmost = all-dash (−−−−), rightmost = all-dot (····)
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
  // L4(12) = ··−− skip
  { id: "L",    letter: "L",   morse: "·−··", cx: L4(10), cy: YS[4], dotChild: null, dashChild: null, parent: "R",   depth: 4 },
  // L4(11) = ·−·− skip
  { id: "P",    letter: "P",   morse: "·−−·", cx: L4(9),  cy: YS[4], dotChild: null, dashChild: null, parent: "W",   depth: 4 },
  { id: "J",    letter: "J",   morse: "·−−−", cx: L4(8),  cy: YS[4], dotChild: null, dashChild: null, parent: "W",   depth: 4 },
  { id: "B",    letter: "B",   morse: "−···", cx: L4(7),  cy: YS[4], dotChild: null, dashChild: null, parent: "D",   depth: 4 },
  { id: "X",    letter: "X",   morse: "−··−", cx: L4(6),  cy: YS[4], dotChild: null, dashChild: null, parent: "D",   depth: 4 },
  { id: "C",    letter: "C",   morse: "−·−·", cx: L4(5),  cy: YS[4], dotChild: null, dashChild: null, parent: "K",   depth: 4 },
  { id: "Y",    letter: "Y",   morse: "−·−−", cx: L4(4),  cy: YS[4], dotChild: null, dashChild: null, parent: "K",   depth: 4 },
  { id: "Z",    letter: "Z",   morse: "−−··", cx: L4(3),  cy: YS[4], dotChild: null, dashChild: null, parent: "G",   depth: 4 },
  { id: "Q",    letter: "Q",   morse: "−−·−", cx: L4(2),  cy: YS[4], dotChild: null, dashChild: null, parent: "G",   depth: 4 },
  // L4(1) = −−−· skip
  // L4(0) = −−−− skip
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

// Branch-direction label (· or −) at the midpoint of an edge
function BranchLabel({
  x1, y1, x2, y2, label, active, dotBranch,
}: {
  x1: number; y1: number; x2: number; y2: number;
  label: string; active: boolean; dotBranch: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const color = active
    ? dotBranch ? "#34d399" : "#fbbf24"
    : dotBranch ? "#1a3828" : "#2e1e06";

  return (
    <g>
      <rect x={mx - 6} y={my - 8} width={12} height={12} rx={3}
        fill="#060d0a" fillOpacity={0.85} />
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

  // Press duration ticker (powers the ring UI)
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

  // Keyboard (Space)
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

  const activePath   = getActivePath(currentPath);
  const activeSet    = new Set(activePath);
  const currentNode  = resolveNode(currentPath);
  const currentNodeId = currentNode?.id ?? null;

  const getNodeState = (id: string): "current" | "path" | "inactive" => {
    if (id === currentNodeId) return "current";
    if (activeSet.has(id) && id !== "root") return "path";
    return "inactive";
  };

  const isLineActive = (pId: string, cId: string) =>
    activeSet.has(pId) && activeSet.has(cId);

  // Press ring
  const RING_R = 56;
  const CIRC   = 2 * Math.PI * RING_R;
  const ringProgress  = Math.min(pressDuration / DASH_MS, 1);
  const ringOffset    = CIRC * (1 - ringProgress);
  const ringColor     = ringProgress >= 1 ? "#f59e0b" : "#10b981";
  const predictedSym  = pressed ? (pressDuration >= DASH_MS ? "−" : "·") : null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-8 w-full">

      {/* ══ PCB CARD ══════════════════════════════════════════════════════════ */}
      <div
        className={cn(
          "w-full max-w-3xl rounded-2xl overflow-hidden transition-all duration-300",
          "shadow-[0_0_60px_-10px_rgba(0,0,0,0.8)]",
          isInvalid
            ? "ring-2 ring-red-500/70 shadow-red-900/40"
            : "ring-1 ring-emerald-900/40"
        )}
        style={{
          background: "linear-gradient(160deg,#081410 0%,#060d08 60%,#050b07 100%)",
        }}
      >
        {/* ── Card header ── */}
        <div className="relative flex items-center justify-between px-5 py-3 border-b border-emerald-900/30">
          {/* Mounting holes */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-emerald-900/50 bg-black/60" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-emerald-900/50 bg-black/60" />

          <span className="font-black tracking-[0.6em] text-emerald-900/80 text-xs pl-4">
            MORSE
          </span>

          {/* Status LED */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                isInvalid
                  ? "bg-red-400 shadow-[0_0_14px_5px_rgba(248,113,113,0.8)]"
                  : currentNode
                  ? "bg-emerald-400 shadow-[0_0_14px_5px_rgba(52,211,153,0.7)] animate-pulse"
                  : "bg-red-700 shadow-[0_0_4px_1px_rgba(185,28,28,0.3)]"
              )}
              aria-label="LED stato"
            />
          </div>

          <span className="font-black tracking-[0.6em] text-emerald-900/80 text-xs pr-4">
            CODE
          </span>
        </div>

        {/* ── SVG Tree (viewBox 600 × 380) ── */}
        <div className="px-2 pt-2 pb-3">
          <svg
            viewBox="0 0 600 380"
            className="w-full h-auto"
            aria-label="Albero binario di decodifica Morse"
            style={{ fontFamily: "monospace" }}
          >
            <defs>
              {/* PCB dot-grid */}
              <pattern id="pcb-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="0.65" fill="#0d2216" />
              </pattern>

              {/* Copper trace gradient */}
              <linearGradient id="trace-copper" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5a3e1a" />
                <stop offset="100%" stopColor="#7a5a28" />
              </linearGradient>

              {/* Glow — current node (green LED) */}
              <filter id="led-green" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="5" result="b1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2" />
                <feMerge>
                  <feMergeNode in="b1" />
                  <feMergeNode in="b2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Glow — path nodes (amber) */}
              <filter id="led-amber" x="-70%" y="-70%" width="240%" height="240%">
                <feGaussianBlur stdDeviation="3.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Board background */}
            <rect width="600" height="380" fill="#050c08" rx="6" />
            <rect width="600" height="380" fill="url(#pcb-grid)" rx="6" />

            {/* Corner mounting pads */}
            {[[14,14],[586,14],[14,366],[586,366]].map(([cx,cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={7} fill="#0a1a0e" stroke="#1a3a22" strokeWidth={1} />
                <circle cx={cx} cy={cy} r={3} fill="#0d2016" stroke="#2a5a30" strokeWidth={0.8} />
              </g>
            ))}

            {/* ── Edges ── */}
            {NODES.map((node) => {
              const edges = [];

              if (node.dotChild) {
                const child  = NODE_MAP.get(node.dotChild)!;
                const active = isLineActive(node.id, node.dotChild);
                edges.push(
                  <line key={`${node.id}-dot-line`}
                    x1={node.cx} y1={node.cy} x2={child.cx} y2={child.cy}
                    stroke={active ? "#10b981" : "#132b1a"}
                    strokeWidth={active ? 2.2 : 1.2}
                    strokeOpacity={active ? 1 : 0.9}
                  />
                );
                // Label only for depth 0→1 and 1→2
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
                    stroke={active ? "#f59e0b" : "#2a1a06"}
                    strokeWidth={active ? 2.2 : 1.2}
                    strokeOpacity={active ? 1 : 0.9}
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

            {/* ── Antenna (root) ── */}
            {(() => {
              const { cx, cy } = NODE_MAP.get("root")!;
              return (
                <g>
                  {/* Signal arcs */}
                  {[14, 20, 26].map((r, i) => (
                    <g key={i}>
                      <path
                        d={`M ${cx - r} ${cy - 2} Q ${cx - r - 4} ${cy - r} ${cx - r + 2} ${cy - r*1.4}`}
                        fill="none" stroke="#1a3a28" strokeWidth="1" strokeOpacity={0.6 - i*0.15}
                      />
                      <path
                        d={`M ${cx + r} ${cy - 2} Q ${cx + r + 4} ${cy - r} ${cx + r - 2} ${cy - r*1.4}`}
                        fill="none" stroke="#1a3a28" strokeWidth="1" strokeOpacity={0.6 - i*0.15}
                      />
                    </g>
                  ))}
                  {/* Triangle */}
                  <polygon
                    points={`${cx},${cy - 16} ${cx - 11},${cy + 5} ${cx + 11},${cy + 5}`}
                    fill="#071210" stroke="#2e5a3e" strokeWidth="1.8"
                  />
                  {/* Mast */}
                  <line x1={cx} y1={cy + 5} x2={cx} y2={cy + 18} stroke="#2e5a3e" strokeWidth="1.8" />
                  <line x1={cx - 11} y1={cy + 18} x2={cx + 11} y2={cy + 18} stroke="#2e5a3e" strokeWidth="1.8" />
                  {/* Tap / Hold legend inside card */}
                  <text x={cx + 80} y={cy + 14} fill="#15301a" fontSize={8} textAnchor="middle">TAP = ·</text>
                  <text x={cx - 80} y={cy + 14} fill="#25200a" fontSize={8} textAnchor="middle">HOLD = −</text>
                </g>
              );
            })()}

            {/* ── Letter nodes ── */}
            {NODES.filter((n) => n.depth > 0).map((node) => {
              const state     = getNodeState(node.id);
              const r         = nodeRadius(node.depth);
              const isCurrent = state === "current";
              const isPath    = state === "path";

              // Copper-palette for inactive; bright LED for active
              const fill        = isCurrent ? "#041e0f"  : isPath ? "#1e0f00"  : "#091411";
              const stroke      = isCurrent ? "#00e676"  : isPath ? "#ffa000"  : "#4a6b3a";
              const strokeW     = isCurrent ? 2.5        : isPath ? 2          : 1;
              const textColor   = isCurrent ? "#b9ffd7"  : isPath ? "#ffe082"  : "#5a7a50";
              const fontSize    = node.depth <= 2 ? 13 : node.depth === 3 ? 10 : 9;
              const filter      = isCurrent ? "url(#led-green)" : isPath ? "url(#led-amber)" : undefined;

              return (
                <g key={node.id} filter={filter}>
                  {/* Outer ring (copper pad style) */}
                  {!isCurrent && !isPath && (
                    <circle cx={node.cx} cy={node.cy} r={r + 3}
                      fill="none" stroke="#2a3d28" strokeWidth={0.6}
                    />
                  )}
                  <circle cx={node.cx} cy={node.cy} r={r}
                    fill={fill} stroke={stroke} strokeWidth={strokeW}
                  />
                  {node.letter && (
                    <text
                      x={node.cx} y={node.cy + fontSize * 0.38}
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

            {/* ── Active-node morse code badge ── */}
            {currentNode && (() => {
              const { cx, cy, morse } = currentNode;
              const r = nodeRadius(currentNode.depth);
              const badgeY = cy + r + 14;
              const tw = morse.length * 7 + 10;
              return (
                <g filter="url(#led-green)">
                  <rect x={cx - tw / 2} y={badgeY - 8} width={tw} height={13}
                    rx={4} fill="#021a0c" stroke="#10b981" strokeWidth={0.8}
                  />
                  <text x={cx} y={badgeY + 1}
                    textAnchor="middle" dominantBaseline="central"
                    fill="#34d399" fontSize={8} fontWeight="bold"
                  >
                    {morse}
                  </text>
                </g>
              );
            })()}

            {/* ── Legend strip at bottom ── */}
            <g>
              <circle cx={22} cy={368} r={5} fill="#041e0f" stroke="#00e676" strokeWidth={1.5} />
              <text x={30} y={372} fill="#1a3a28" fontSize={7}>Posizione attuale</text>
              <circle cx={130} cy={368} r={5} fill="#1e0f00" stroke="#ffa000" strokeWidth={1.5} />
              <text x={138} y={372} fill="#2e2010" fontSize={7}>Percorso seguito</text>
              <circle cx={240} cy={368} r={5} fill="#091411" stroke="#4a6b3a" strokeWidth={1} />
              <text x={248} y={372} fill="#1a3028" fontSize={7}>Nodo non attivo</text>
            </g>
          </svg>
        </div>

        {/* ── Inline sequence bar ── */}
        <div className={cn(
          "flex items-center justify-center gap-2 px-4 py-3 border-t transition-colors duration-200",
          currentPath.length > 0 ? "border-emerald-900/40 bg-black/20" : "border-emerald-950/20"
        )}>
          {currentPath.length === 0 ? (
            <span className="text-xs text-emerald-900/60 font-mono tracking-widest select-none">
              {isInvalid ? "— SEQUENZA NON VALIDA —" : "· − · PREMI IL TASTO · − ·"}
            </span>
          ) : (
            <>
              <span className="text-xs text-emerald-900/50 font-mono mr-1">input:</span>
              {currentPath.map((sym, i) => (
                <span key={i}
                  className={cn(
                    "text-xl font-black font-mono leading-none select-none",
                    sym === "." ? "text-emerald-400" : "text-amber-400"
                  )}
                >
                  {sym === "." ? "·" : "−"}
                </span>
              ))}
              {currentNode?.letter && (
                <span className="ml-3 text-xs text-emerald-600/70 font-mono">
                  → {currentNode.letter}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* ══ CONTROLS ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14 w-full max-w-3xl">

        {/* ── Telegraph button ── */}
        <div className="flex flex-col items-center gap-3 select-none shrink-0">
          <p className="text-xs font-mono text-emerald-900/60 tracking-widest uppercase">
            Tasto Telegrafo
          </p>

          {/* Predicted symbol above button */}
          <div className="h-8 flex items-center justify-center">
            {predictedSym ? (
              <span className={cn(
                "text-3xl font-black font-mono transition-all duration-100",
                predictedSym === "·" ? "text-emerald-400" : "text-amber-400"
              )}>
                {predictedSym}
              </span>
            ) : (
              <span className="text-xs text-slate-700 font-mono">tap · / hold −</span>
            )}
          </div>

          {/* Button with press-ring */}
          <div className="relative w-32 h-32">
            {/* SVG ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 128 128"
            >
              {/* Track */}
              <circle cx="64" cy="64" r={RING_R}
                fill="none" stroke="#1a2a1a" strokeWidth="5"
              />
              {/* Progress */}
              {pressed && (
                <circle cx="64" cy="64" r={RING_R}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="5"
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
                "absolute inset-3 rounded-full border-[3px] transition-all duration-75",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                "touch-none select-none flex items-center justify-center",
                pressed
                  ? "bg-red-700 border-red-800 scale-95 shadow-inner shadow-red-950"
                  : [
                      "bg-red-600 border-red-500",
                      "hover:bg-red-500 hover:border-red-400",
                      "shadow-lg shadow-red-900/50",
                    ]
              )}
              aria-label="Tasto telegrafo: premi brevemente per punto, tieni premuto per linea"
            >
              {/* Button gloss */}
              {!pressed && (
                <span
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-white/20 blur-sm"
                  aria-hidden="true"
                />
              )}
              <span className="text-2xl text-white/80 select-none pointer-events-none" aria-hidden="true">
                {pressed ? "●" : "○"}
              </span>
            </button>
          </div>

          <div className="flex gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              Tap = ·
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-2 rounded bg-amber-700 shrink-0" />
              Tieni = −
            </span>
          </div>
          <p className="text-xs text-slate-700">
            o usa{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-xs">
              Spazio
            </kbd>
          </p>
        </div>

        {/* ── Right panel: decoded letter + controls ── */}
        <div className="flex flex-col items-center sm:items-start gap-5 flex-1 w-full">
          {/* Big letter flash */}
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-2xl border border-emerald-900/30 bg-black/40 flex items-center justify-center">
              {lastDecoded ? (
                <span
                  className={cn(
                    "text-7xl font-black font-mono transition-all duration-200 select-none",
                    showFlash
                      ? "text-emerald-400 scale-110 drop-shadow-[0_0_28px_rgba(52,211,153,1)]"
                      : "text-slate-700 scale-100"
                  )}
                  aria-live="assertive"
                >
                  {lastDecoded}
                </span>
              ) : (
                <span className="text-3xl text-slate-800 select-none font-mono">?</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-xs text-slate-600">
              <span>Ultima lettera</span>
              <span>decodificata</span>
              {currentNode?.letter && (
                <span className="mt-2 text-emerald-700 font-mono">
                  ora: {currentNode.letter}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {currentPath.length > 0 && (
              <button
                onClick={handleClearCurrent}
                className="text-xs text-slate-500 hover:text-red-400 border border-slate-700 hover:border-red-800 rounded-lg px-3 py-1.5 transition-colors"
              >
                ✕ Annulla
              </button>
            )}
            <button
              onClick={handleAddSpace}
              className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors"
            >
              ⎵ Spazio
            </button>
            {decodedText && (
              <button
                onClick={handleClearAll}
                className="text-xs text-slate-500 hover:text-red-400 border border-slate-700 hover:border-red-800 rounded-lg px-3 py-1.5 transition-colors"
              >
                🗑 Cancella tutto
              </button>
            )}
          </div>

          {/* Decoded text buffer */}
          {decodedText && (
            <div className="w-full rounded-xl border border-emerald-900/30 bg-black/30 px-4 py-3">
              <span className="block text-xs text-emerald-900/60 font-mono mb-1.5 tracking-widest">
                TESTO DECODIFICATO
              </span>
              <p className="font-mono text-lg text-emerald-300/90 tracking-[0.2em] min-h-[1.8rem] break-all">
                {decodedText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
