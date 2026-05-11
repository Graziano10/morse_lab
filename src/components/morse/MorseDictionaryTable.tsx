import { MORSE_DICTIONARY } from "@/lib/morse/dictionary";
import { Badge } from "@/components/ui/Badge";
import type { MorseDictionaryEntry } from "@/types/morse";

function categoryLabel(cat: MorseDictionaryEntry["category"]): string {
  if (cat === "letter") return "lettera";
  if (cat === "number") return "numero";
  return "simbolo";
}

function MorseSymbolDisplay({ morse }: { morse: string }) {
  return (
    <span className="font-mono text-emerald-400 tracking-widest text-base">
      {morse.split("").map((sym, i) => (
        <span key={i} className={sym === "." ? "text-emerald-400" : "text-amber-400"}>
          {sym}
        </span>
      ))}
    </span>
  );
}

function DictionaryCard({ entry }: { entry: MorseDictionaryEntry }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-3 hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-slate-100 w-8 text-center">{entry.char}</span>
        <MorseSymbolDisplay morse={entry.morse} />
      </div>
      <Badge variant={entry.category === "letter" ? "info" : entry.category === "number" ? "warning" : "default"}>
        {categoryLabel(entry.category)}
      </Badge>
    </div>
  );
}

interface MorseDictionaryTableProps {
  filter?: "letter" | "number" | "symbol" | "all";
}

export function MorseDictionaryTable({ filter = "all" }: MorseDictionaryTableProps) {
  const entries =
    filter === "all" ? MORSE_DICTIONARY : MORSE_DICTIONARY.filter((e) => e.category === filter);

  const groups =
    filter !== "all"
      ? [{ label: categoryLabel(filter as MorseDictionaryEntry["category"]), items: entries }]
      : [
          { label: "Lettere (A–Z)", items: entries.filter((e) => e.category === "letter") },
          { label: "Numeri (0–9)", items: entries.filter((e) => e.category === "number") },
          { label: "Simboli", items: entries.filter((e) => e.category === "symbol") },
        ];

  return (
    <div className="flex flex-col gap-8">
      {/* Mobile: card list */}
      <div className="md:hidden flex flex-col gap-6">
        {groups.map(({ label, items }) =>
          items.length === 0 ? null : (
            <section key={label}>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((entry) => (
                  <DictionaryCard key={entry.char} entry={entry} />
                ))}
              </div>
            </section>
          )
        )}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block">
        {groups.map(({ label, items }) =>
          items.length === 0 ? null : (
            <section key={label} className="mb-8">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{label}</h3>
              <div className="overflow-hidden rounded-xl border border-slate-700/60">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/60 bg-slate-800/80">
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">Carattere</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">Codice Morse</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">Schema</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((entry, idx) => (
                      <tr
                        key={entry.char}
                        className={`border-b border-slate-700/30 transition-colors hover:bg-slate-700/20 ${
                          idx % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="text-xl font-bold text-slate-100">{entry.char}</span>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <MorseSymbolDisplay morse={entry.morse} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {entry.morse.split("").map((sym, i) => (
                              <span
                                key={i}
                                className={`inline-block rounded ${
                                  sym === "." ? "w-2 h-2 bg-emerald-400 rounded-full" : "w-6 h-2 bg-amber-400 rounded"
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={entry.category === "letter" ? "info" : entry.category === "number" ? "warning" : "default"}>
                            {categoryLabel(entry.category)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
        )}
      </div>
    </div>
  );
}
