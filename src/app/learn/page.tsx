import { MorseDictionaryTable } from "@/components/morse/MorseDictionaryTable";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-4">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-100 border-l-4 border-emerald-500 pl-4">
        {title}
      </h2>
      <div className="text-slate-300 leading-relaxed flex flex-col gap-3">{children}</div>
    </section>
  );
}

function TimingRow({ symbol, duration, desc }: { symbol: string; duration: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-3">
      <span className="font-mono text-2xl text-emerald-400 w-8 text-center flex-shrink-0">{symbol}</span>
      <span className="font-semibold text-slate-200 w-24 flex-shrink-0">{duration}</span>
      <span className="text-sm text-slate-400">{desc}</span>
    </div>
  );
}

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Badge variant="info" className="w-fit">Guide</Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 leading-tight">
          Learn Morse Code
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
          Everything you need to know to understand, read and write Morse code.
        </p>
      </div>

      {/* What is Morse Code */}
      <Section id="what-is-morse" title="What is Morse Code?">
        <p>
          Morse code is a method of encoding text characters as sequences of{" "}
          <span className="text-emerald-400 font-semibold">dots (·)</span> and{" "}
          <span className="text-amber-400 font-semibold">dashes (−)</span>. Developed by Samuel Morse
          and Alfred Vail in the 1830s, it became the standard for long-distance communication via
          telegraph, radio, and even light signals.
        </p>
        <p>
          Each letter, number and punctuation mark maps to a unique combination. For example:
          <code className="ml-2 px-2 py-0.5 rounded bg-slate-700 font-mono text-emerald-400 text-sm">
            S = ...
          </code>
          {" "}and{" "}
          <code className="px-2 py-0.5 rounded bg-slate-700 font-mono text-emerald-400 text-sm">
            O = ---
          </code>
          {" "}making the famous SOS signal{" "}
          <code className="px-2 py-0.5 rounded bg-slate-700 font-mono text-emerald-400 text-sm">
            ... --- ...
          </code>
        </p>
        <p>
          Today Morse code is still used by amateur radio operators, military, aviation and
          visually impaired users as an assistive communication method.
        </p>
      </Section>

      {/* Alphabet */}
      <Section id="alphabet" title="The Alphabet">
        <p>
          The international Morse code covers 26 letters (A–Z), 10 digits (0–9), and common
          punctuation. Two symbols are used:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 my-2">
          <div className="flex-1 rounded-xl border border-emerald-700/40 bg-emerald-900/20 px-5 py-4 text-center">
            <span className="text-4xl text-emerald-400 font-mono font-bold block mb-2">·</span>
            <p className="text-sm font-semibold text-slate-200">Dot (dit)</p>
            <p className="text-xs text-slate-400 mt-1">Short signal — 1 unit</p>
          </div>
          <div className="flex-1 rounded-xl border border-amber-700/40 bg-amber-900/20 px-5 py-4 text-center">
            <span className="text-4xl text-amber-400 font-mono font-bold block mb-2">−</span>
            <p className="text-sm font-semibold text-slate-200">Dash (dah)</p>
            <p className="text-xs text-slate-400 mt-1">Long signal — 3 units</p>
          </div>
        </div>
      </Section>

      {/* Timing rules */}
      <Section id="timing" title="Timing Rules">
        <p>
          Standard International Morse Code follows the{" "}
          <span className="text-emerald-400 font-semibold">Paris standard</span>: the word
          &#34;PARIS&#34; is used as the timing reference (50 units), giving us 1 WPM = 1200ms per dot unit.
        </p>
        <div className="flex flex-col gap-2 my-2">
          <TimingRow symbol="·" duration="1 unit" desc="Duration of a dot" />
          <TimingRow symbol="−" duration="3 units" desc="Duration of a dash" />
          <TimingRow symbol="·|·" duration="1 unit" desc="Gap between symbols within the same letter" />
          <TimingRow symbol="A|B" duration="3 units" desc="Gap between two letters" />
          <TimingRow symbol="word|word" duration="7 units" desc="Gap between two words (represented as /)" />
        </div>
        <p className="text-sm text-slate-500">
          At 20 WPM: dot = 60ms, dash = 180ms, letter gap = 180ms, word gap = 420ms.
        </p>
      </Section>

      {/* Morse convention */}
      <Section id="conventions" title="Writing Conventions">
        <p>In written/digital form:</p>
        <ul className="flex flex-col gap-2 ml-4">
          {[
            { code: ".", label: "Dot" },
            { code: "-", label: "Dash" },
            { code: "(space)", label: "Letter separator" },
            { code: "/", label: "Word separator" },
          ].map(({ code, label }) => (
            <li key={code} className="flex items-center gap-3 text-sm">
              <code className="px-2 py-0.5 rounded bg-slate-700 font-mono text-emerald-400 flex-shrink-0">
                {code}
              </code>
              <span className="text-slate-400">{label}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 px-5 py-4 mt-2">
          <p className="text-sm font-semibold text-slate-300 mb-2">Examples:</p>
          <div className="flex flex-col gap-1.5 font-mono text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400">SOS</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400">... --- ...</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400">CIAO MONDO</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400 break-all">-.-. .. .- --- / -- --- -. -.. ---</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400">HELLO</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400">.... . .-.. .-.. ---</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Tips */}
      <Section id="tips" title="Learning Tips">
        <ul className="flex flex-col gap-3">
          {[
            "Start with the most common letters: E (·), T (−), A (·−), N (−·), I (··), S (···).",
            "Learn by sound, not just by sight — listen to the audio player to internalize the rhythm.",
            "Practice in short sessions: 10–15 minutes daily beats 1 hour once a week.",
            "Use mnemonics: E = · (1 dot, like 'E' is 1 stroke), T = − (1 dash).",
            "Aim for 5 WPM before increasing speed. Accuracy first, speed will follow.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm sm:text-base">
              <span className="text-emerald-400 font-bold flex-shrink-0">{i + 1}.</span>
              <span className="text-slate-300">{tip}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Dictionary */}
      <Section id="dictionary" title="Complete Morse Dictionary">
        <p>All supported characters and their Morse code equivalents:</p>
        <div className="mt-2">
          <MorseDictionaryTable />
        </div>
      </Section>

      {/* CTA */}
      <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/20 px-6 py-8 text-center flex flex-col gap-4 items-center">
        <h3 className="text-xl font-bold text-slate-100">Ready to test yourself?</h3>
        <p className="text-slate-400 text-sm">
          Jump into the practice mode and start training with instant feedback.
        </p>
        <Link
          href="/practice"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 min-h-[48px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Go to Practice
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
