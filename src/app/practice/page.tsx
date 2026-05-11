import { PracticeCard } from "@/components/morse/PracticeCard";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export const metadata = { title: "Pratica" };

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Intestazione */}
      <div className="flex flex-col gap-3 mb-10 text-center">
        <div className="flex justify-center">
          <Badge variant="success">Modalità Allenamento</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">Modalità Pratica</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Metti alla prova le tue conoscenze. Scegli una modalità, rispondi alla flashcard
          e monitora precisione e serie in tempo reale.
        </p>
      </div>

      {/* Card di pratica */}
      <PracticeCard />

      {/* Sezione di aiuto */}
      <div className="mt-14 mx-auto max-w-lg">
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 px-5 py-5 flex flex-col gap-3">
          <h2 className="font-semibold text-slate-200">Come funziona</h2>
          <ul className="flex flex-col gap-2 text-sm text-slate-400">
            <li className="flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">→</span>
              <span>
                <strong className="text-slate-300">Testo → Morse:</strong> vedi un carattere e devi digitare il codice Morse corretto (es.{" "}
                <code className="font-mono text-emerald-400">.-</code> per A).
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">→</span>
              <span>
                <strong className="text-slate-300">Morse → Testo:</strong> vedi i simboli Morse e devi digitare il carattere. Usa <em>Ascolta</em> per sentire l&apos;audio.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">→</span>
              <span>
                <strong className="text-slate-300">Casuale:</strong> misto di entrambe le modalità per un allenamento completo.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">→</span>
              <span>
                Usa <strong className="text-slate-300">Rivela</strong> per vedere la risposta senza inviarla. Usa il{" "}
                <strong className="text-slate-300">Tasto Telegrafo</strong> per inserire il Morse premendo un bottone fisico.
              </span>
            </li>
          </ul>
          <div className="pt-2 border-t border-slate-700/60">
            <Link
              href="/learn"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            >
              Non ricordi i codici? Consulta il dizionario →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
