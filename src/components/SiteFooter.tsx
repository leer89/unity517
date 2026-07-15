import Link from "next/link";
import { INSTAGRAM_URL, LABEL_URL, SPOTIFY_URL } from "@/lib/links";

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-line mt-16 bg-brand-ink/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-brand-muted">
        <div>
          <span className="display text-brand-paper text-base tracking-wider">UNITY IN MUSIC 517</span>
          <span className="ml-2">Lansing, MI</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="hover:text-brand-paper transition">About</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-brand-paper transition">Instagram</a>
          <a href={LABEL_URL} target="_blank" rel="noreferrer" className="hover:text-brand-cyan transition">Unity In Music Records</a>
          <a href={SPOTIFY_URL} target="_blank" rel="noreferrer" className="hover:text-brand-neon transition">Spotify</a>
          {/* Hidden admin entry — no link rendered in the public footer on purpose.
              Admin reaches /admin by typing it directly. */}
        </div>
      </div>
    </footer>
  );
}
