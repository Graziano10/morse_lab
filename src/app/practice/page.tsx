import { PracticeCard } from "@/components/morse/PracticeCard";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-10 text-center">
        <div className="flex justify-center">
          <Badge variant="success">Training Mode</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">Practice Mode</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Test your knowledge. Choose a mode, answer the flashcard, and track your
          accuracy and streak in real time.
        </p>
      </div>

      {/* Practice card */}
      <PracticeCard />

      {/* Help section */}
      <div className="mt-14 mx-auto max-w-lg">
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 px-5 py-5 flex flex-col gap-3">
          <h2 className="font-semibold text-slate-200">How it works</h2>
          <ul className="flex flex-col gap-2 text-sm text-slate-400">
            <li className="flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">→</span>
              <span><strong className="text-slate-300">Text → Morse:</strong> You see a character and must type the correct Morse code (e.g. <code className="font-mono text-emerald-400">.-</code> for A).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">→</span>
              <span><strong className="text-slate-300">Morse → Text:</strong> You see Morse symbols and must type the character. Use <em>Listen</em> to hear the audio.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">→</span>
              <span><strong className="text-slate-300">Random:</strong> Mix of both modes for full training.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">→</span>
              <span>Use <strong className="text-slate-300">Reveal</strong> to see the answer without submitting.</span>
            </li>
          </ul>
          <div className="pt-2 border-t border-slate-700/60">
            <Link
              href="/learn"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            >
              Not sure about the codes? Check the dictionary →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
