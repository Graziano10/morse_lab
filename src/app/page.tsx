import Link from "next/link";
import { MorseTranslator } from "@/components/morse/MorseTranslator";

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-700/50 bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-400">
      {children}
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 hover:border-slate-600 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-100 mb-1">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: "Instant Translation",
    description: "Convert text to Morse code and back in real time.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    title: "Audio Playback",
    description: "Hear Morse code at any speed with configurable WPM and frequency.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Full Dictionary",
    description: "A–Z, 0–9, and common symbols with visual dot/dash patterns.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Interactive Practice",
    description: "Train with flashcards, track your accuracy and streak.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Learn the Rules",
    description: "Understand timing, units and the history of Morse code.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Mobile-First",
    description: "Designed for smartphones first — fast, comfortable and accessible.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left: text */}
            <div className="flex flex-col gap-6 text-center lg:text-left lg:flex-1">
              <div className="flex justify-center lg:justify-start">
                <HeroBadge>Open Source · Free · No signup</HeroBadge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Learn{" "}
                <span className="text-emerald-400">Morse Code</span>{" "}
                the modern way
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Translate, listen and practice Morse code — all in your browser.
                No install required. Works perfectly on mobile.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link
                  href="/practice"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 text-base transition-all min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Start Practicing
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/learn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 font-semibold px-6 py-3 text-base transition-all min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-slate-500">
                <span className="font-mono text-emerald-400/70 text-xl tracking-widest">... --- ...</span>
                <span className="text-sm">= SOS</span>
              </div>
            </div>

            {/* Right: stats */}
            <div className="grid grid-cols-2 gap-4 lg:flex-shrink-0 w-full sm:max-w-xs">
              {[
                { value: "26", label: "Letters" },
                { value: "10", label: "Numbers" },
                { value: "7", label: "Symbols" },
                { value: "∞", label: "Practice" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-6 py-5 text-center"
                >
                  <p className="text-3xl font-bold text-emerald-400">{value}</p>
                  <p className="text-sm text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Translator section */}
      <section className="px-4 sm:px-6 lg:px-8 py-10" id="translator">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Try it now</h2>
            <p className="text-slate-400">Type any text and get the Morse code instantly.</p>
          </div>
          <MorseTranslator />
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Everything you need</h2>
            <p className="text-slate-400">A complete toolkit for learning Morse code.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/20 px-6 sm:px-10 py-10 sm:py-14">
            <p className="text-3xl sm:text-4xl font-mono text-emerald-400 mb-4 tracking-widest">
              -.. --- -. . --..--
            </p>
            <p className="text-slate-400 text-sm mb-6">( &#34;DONE,&#34; in Morse )</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3">
              Ready to master Morse?
            </h2>
            <p className="text-slate-400 mb-8">
              Start with the basics or jump straight into practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/learn"
                className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3 min-h-[48px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Start Learning
              </Link>
              <Link
                href="/practice"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 min-h-[48px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Start Practicing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
