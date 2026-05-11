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

export const metadata = { title: "Impara" };

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-12">
      {/* Intestazione */}
      <div className="flex flex-col gap-4">
        <Badge variant="info" className="w-fit">Guida</Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 leading-tight">
          Impara il Codice Morse
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
          Tutto quello che devi sapere per capire, leggere e scrivere il codice Morse.
        </p>
      </div>

      {/* Cos'è il Codice Morse */}
      <Section id="cos-e" title="Cos'è il Codice Morse?">
        <p>
          Il codice Morse è un metodo per codificare caratteri di testo come sequenze di{" "}
          <span className="text-emerald-400 font-semibold">punti (·)</span> e{" "}
          <span className="text-amber-400 font-semibold">linee (−)</span>. Sviluppato da Samuel Morse
          e Alfred Vail negli anni 1830, divenne lo standard per le comunicazioni a lunga distanza
          via telegrafo, radio e segnali luminosi.
        </p>
        <p>
          Ogni lettera, numero e segno di punteggiatura corrisponde a una combinazione unica. Ad esempio:
          <code className="ml-2 px-2 py-0.5 rounded bg-slate-700 font-mono text-emerald-400 text-sm">
            S = ...
          </code>
          {" "}e{" "}
          <code className="px-2 py-0.5 rounded bg-slate-700 font-mono text-emerald-400 text-sm">
            O = ---
          </code>
          {" "}formano il famoso segnale SOS{" "}
          <code className="px-2 py-0.5 rounded bg-slate-700 font-mono text-emerald-400 text-sm">
            ... --- ...
          </code>
        </p>
        <p>
          Oggi il codice Morse è ancora usato dai radioamatori, dalle forze armate, dall&apos;aviazione
          e come metodo di comunicazione assistiva per persone con disabilità visive.
        </p>
      </Section>

      {/* L'alfabeto */}
      <Section id="alfabeto" title="L'Alfabeto">
        <p>
          Il codice Morse internazionale comprende 26 lettere (A–Z), 10 cifre (0–9) e la punteggiatura
          più comune. Vengono usati solo due simboli:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 my-2">
          <div className="flex-1 rounded-xl border border-emerald-700/40 bg-emerald-900/20 px-5 py-4 text-center">
            <span className="text-4xl text-emerald-400 font-mono font-bold block mb-2">·</span>
            <p className="text-sm font-semibold text-slate-200">Punto (dit)</p>
            <p className="text-xs text-slate-400 mt-1">Segnale breve — 1 unità</p>
          </div>
          <div className="flex-1 rounded-xl border border-amber-700/40 bg-amber-900/20 px-5 py-4 text-center">
            <span className="text-4xl text-amber-400 font-mono font-bold block mb-2">−</span>
            <p className="text-sm font-semibold text-slate-200">Linea (dah)</p>
            <p className="text-xs text-slate-400 mt-1">Segnale lungo — 3 unità</p>
          </div>
        </div>
      </Section>

      {/* Regole di timing */}
      <Section id="timing" title="Regole di Timing">
        <p>
          Il codice Morse internazionale segue lo{" "}
          <span className="text-emerald-400 font-semibold">standard Paris</span>: la parola
          &#34;PARIS&#34; è usata come riferimento di timing (50 unità), il che dà 1 WPM = 1200ms per unità punto.
        </p>
        <div className="flex flex-col gap-2 my-2">
          <TimingRow symbol="·" duration="1 unità" desc="Durata di un punto" />
          <TimingRow symbol="−" duration="3 unità" desc="Durata di una linea" />
          <TimingRow symbol="·|·" duration="1 unità" desc="Pausa tra simboli della stessa lettera" />
          <TimingRow symbol="A|B" duration="3 unità" desc="Pausa tra due lettere" />
          <TimingRow symbol="parola|parola" duration="7 unità" desc="Pausa tra due parole (indicata con /)" />
        </div>
        <p className="text-sm text-slate-500">
          A 20 WPM: punto = 60ms, linea = 180ms, pausa lettera = 180ms, pausa parola = 420ms.
        </p>
      </Section>

      {/* Convenzioni di scrittura */}
      <Section id="convenzioni" title="Convenzioni di Scrittura">
        <p>In forma scritta/digitale:</p>
        <ul className="flex flex-col gap-2 ml-4">
          {[
            { code: ".", label: "Punto" },
            { code: "-", label: "Linea" },
            { code: "(spazio)", label: "Separatore tra lettere" },
            { code: "/", label: "Separatore tra parole" },
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
          <p className="text-sm font-semibold text-slate-300 mb-2">Esempi:</p>
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
              <span className="text-slate-400">CIAO</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400">-.-. .. .- ---</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Consigli */}
      <Section id="consigli" title="Consigli per Imparare">
        <ul className="flex flex-col gap-3">
          {[
            "Parti dalle lettere più comuni: E (·), T (−), A (·−), N (−·), I (··), S (···).",
            "Impara a orecchio, non solo visivamente — ascolta il riproduttore audio per interiorizzare il ritmo.",
            "Sessioni brevi: 10–15 minuti al giorno sono più efficaci di un'ora una volta sola.",
            "Usa i mnemonici: E = · (1 punto, come la lettera E ha 1 tratto), T = − (1 linea).",
            "Punta a 5 WPM prima di aumentare la velocità. Prima la precisione, la velocità verrà da sola.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm sm:text-base">
              <span className="text-emerald-400 font-bold flex-shrink-0">{i + 1}.</span>
              <span className="text-slate-300">{tip}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Dizionario */}
      <Section id="dizionario" title="Dizionario Morse Completo">
        <p>Tutti i caratteri supportati e i relativi codici Morse:</p>
        <div className="mt-2">
          <MorseDictionaryTable />
        </div>
      </Section>

      {/* CTA */}
      <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/20 px-6 py-8 text-center flex flex-col gap-4 items-center">
        <h3 className="text-xl font-bold text-slate-100">Pronto a metterti alla prova?</h3>
        <p className="text-slate-400 text-sm">
          Entra nella modalità pratica e inizia ad allenarti con feedback immediato.
        </p>
        <Link
          href="/practice"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 min-h-[48px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Vai alla Pratica
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
