import { MorseTreeCard } from "@/components/morse/MorseTreeCard";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export const metadata = { title: "Decoder Visuale" };

export default function DecoderPage() {
  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-10 text-center">
        <div className="flex justify-center">
          <Badge variant="success">Scheda Fisica Simulata</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          Decoder Visuale Morse
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
          Usa il tasto telegrafo per navigare l&apos;albero binario del codice Morse.
          Ogni pressione breve è un <span className="text-emerald-400 font-mono font-bold">punto (·)</span>,
          ogni pressione lunga una{" "}
          <span className="text-amber-400 font-mono font-bold">linea (−)</span>.
          Il nodo illuminato indica la tua posizione nell&apos;albero.
        </p>
      </div>

      {/* Interactive card */}
      <MorseTreeCard />

      {/* How it works */}
      <div className="mt-16 mx-auto max-w-xl">
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 px-5 py-5 flex flex-col gap-3">
          <h2 className="font-semibold text-slate-200">Come funziona</h2>
          <ul className="flex flex-col gap-2 text-sm text-slate-400">
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0">→</span>
              <span>
                <strong className="text-slate-300">Premi brevemente</strong> (&lt; 300 ms) per inserire un{" "}
                <span className="text-emerald-400 font-mono">punto (·)</span> — il nodo attivo si sposta a destra.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0">→</span>
              <span>
                <strong className="text-slate-300">Tieni premuto</strong> (≥ 300 ms) per inserire una{" "}
                <span className="text-amber-400 font-mono">linea (−)</span> — il nodo si sposta a sinistra.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0">→</span>
              <span>
                Dopo <strong className="text-slate-300">1,5 secondi di pausa</strong> la lettera corrente viene
                decodificata automaticamente e appare in grande.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0">→</span>
              <span>
                Il nodo <span className="text-emerald-400 font-semibold">verde</span> è la posizione attuale;
                quelli <span className="text-amber-400 font-semibold">ambra</span> il percorso seguito.
              </span>
            </li>
          </ul>
          <div className="pt-2 border-t border-slate-700/60">
            <Link
              href="/learn"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            >
              Consulta il dizionario Morse completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
