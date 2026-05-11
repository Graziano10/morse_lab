import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-700/60 bg-slate-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-emerald-400 font-mono text-xl">·−</span>
            <span className="font-semibold text-slate-300">MorseLab</span>
            <span className="text-slate-600">·</span>
            <span className="text-sm">Impara il Codice Morse</span>
          </div>

          <nav className="flex items-center gap-4" aria-label="Navigazione footer">
            {[
              { href: "/", label: "Home" },
              { href: "/learn", label: "Impara" },
              { href: "/practice", label: "Pratica" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Realizzato con Next.js · TypeScript · Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
