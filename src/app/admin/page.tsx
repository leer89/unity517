import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminHome() {
  await requireAdmin();
  const supabase = createClient();

  const { count: upcomingCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("is_archived", false)
    .gte("starts_at", new Date().toISOString());

  const { count: totalCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="display text-4xl text-brand-paper">Dashboard</h1>
      <p className="text-brand-muted mt-1">Manage events, banner, and site copy.</p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Stat label="Upcoming events" value={upcomingCount ?? 0} href="/admin/events" />
        <Stat label="Total events" value={totalCount ?? 0} href="/admin/events" />
        <Stat label="Banner" value="Edit" href="/admin/banner" />
      </div>

      <div className="mt-10 flex gap-3 flex-wrap">
        <Link href="/admin/events/new" className="px-5 py-3 rounded-full bg-brand-neon text-brand-ink font-semibold uppercase tracking-widest text-sm shadow-glow-neon">+ New event</Link>
        <Link href="/admin/banner" className="px-5 py-3 rounded-full border border-brand-line text-brand-paper hover:border-brand-cyan/60 text-sm uppercase tracking-widest">Edit banner</Link>
        <Link href="/admin/copy" className="px-5 py-3 rounded-full border border-brand-line text-brand-paper hover:border-brand-cyan/60 text-sm uppercase tracking-widest">Edit site copy</Link>
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-brand-line bg-brand-card p-5 hover:border-brand-neon/60 transition">
      <div className="text-xs uppercase tracking-[0.2em] text-brand-muted">{label}</div>
      <div className="display text-4xl text-brand-paper mt-2">{value}</div>
    </Link>
  );
}
