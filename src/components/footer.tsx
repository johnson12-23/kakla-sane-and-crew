import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-sand/80 md:flex-row md:px-8 md:text-left">
        <p>© {new Date().getFullYear()} Kakla Sane & Crew. Premium travel experience.</p>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hover:text-[color:var(--gold-lux)]">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
