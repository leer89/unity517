import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/format";
import { deleteEvent } from "../actions";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminEventsList() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });
  const events = (data ?? []) as Event[];

  async function handleDelete(id: string) {
    "use server";
    await deleteEvent(id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="display text-4xl text-brand-paper">Events</h1>
        <Link href="/admin/events/new" className="px-5 py-2 rounded-full bg-brand-neon text-brand-ink font-semibold uppercase tracking-widest text-xs shadow-glow-neon">+ New</Link>
      </div>

      {events.length === 0 ? (
        <p className="text-brand-muted">No events yet. Create the first one.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-line">
          <table className="w-full text-sm">
            <thead className="bg-brand-card text-brand-muted text-xs uppercase tracking-widest">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t border-brand-line">
                  <td className="px-4 py-3">
                    <Link href={`/admin/events/${e.id}`} className="text-brand-paper hover:text-brand-cyan">{e.title}</Link>
                    <div className="text-brand-muted text-xs">{e.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-brand-paper/90">{formatEventDate(e.starts_at, e.ends_at)}</td>
                  <td className="px-4 py-3">
                    {e.is_featured && <span className="text-brand-neon text-xs mr-2">★ FEATURED</span>}
                    {e.is_archived && <span className="text-brand-muted text-xs">ARCHIVED</span>}
                    {!e.is_featured && !e.is_archived && <span className="text-brand-cyan text-xs">LIVE</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/events/${e.id}`} className="text-brand-cyan hover:underline text-xs mr-3">Edit</Link>
                    <form action={handleDelete.bind(null, e.id)} className="inline">
                      <button type="submit" className="text-brand-neon hover:underline text-xs">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
