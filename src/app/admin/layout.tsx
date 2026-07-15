import Link from "next/link";

// No noindex for the layout itself — individual admin pages set their own metadata.
// We keep the admin entrance hidden by simply never linking to /admin from the public site.

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-line bg-brand-ink/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="display text-brand-paper tracking-wider text-lg">
            UNITY · ADMIN
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/events" className="text-brand-muted hover:text-brand-paper">Events</Link>
            <Link href="/admin/events/reorder" className="text-brand-muted hover:text-brand-paper">Reorder</Link>
            <Link href="/admin/banner" className="text-brand-muted hover:text-brand-paper">Banner</Link>
            <Link href="/admin/copy" className="text-brand-muted hover:text-brand-paper">Copy</Link>
            <Link href="/" className="text-brand-muted hover:text-brand-paper">View site →</Link>
            <form action="/admin/logout" method="post">
              <button type="submit" className="text-brand-neon hover:text-brand-paper">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
