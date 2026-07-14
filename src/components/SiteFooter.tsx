import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-line mt-16 bg-brand-ink/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-brand-muted">
        <div>
          <span className="display text-brand-paper text-base tracking-wider">UNITY N MUSIC 517</span>
          <span className="ml-2">Lansing, MI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-brand-paper transition">About</Link>
          <a href="https://www.instagram.com/unitynmusic517/" target="_blank" rel="noreferrer" className="hover:text-brand-paper transition">Instagram</a>
          {/* Hidden admin entry — no link rendered in the public footer on purpose.
              Admin reaches /admin by typing it directly. */}
        </div>
      </div>
    </footer>
  );
}
