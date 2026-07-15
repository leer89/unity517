import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/format";
import { moveEvent } from "../../actions";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function ReorderEventsPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_archived", false)
    .order("sort_order", { ascending: true })
    .order("starts_at", { ascending: true });
  const events = (data ?? []) as Event[];

  async function move(id: string, direction: "up" | "down") {
    "use server";
    await moveEvent(id, direction);
  }

  return (
    <div>
      <h1 className="display text-4xl text-brand-paper mb-2">Reorder events</h1>
      <p className="text-brand-muted mb-6 max-w-2xl">
        This controls the order shows appear in the &ldquo;Upcoming&rdquo; grid on the homepage.
        Use the arrows to move a show up or down &mdash; top of this list is top-left of the grid.
        Archived events aren&rsquo;t shown here.
      </p>

      {events.length === 0 ? (
        <p className="text-brand-muted">No events yet.</p>
      ) : (
        <ul className="w-full max-w-2xl space-y-3">
          {events.map((e, i) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-xl border border-brand-line bg-brand-card p-3"
            >
              <div className="relative w-14 h-[74px] shrink-0 rounded-lg overflow-hidden bg-brand-ink">
                {e.flyer_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.flyer_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/30 to-brand-cyan/20" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-brand-paper truncate">{e.title}</div>
                <div className="text-xs text-brand-muted truncate">
                  {formatEventDate(e.starts_at, e.ends_at)}
                  {e.is_featured && <span className="text-brand-neon ml-2">Featured</span>}
                </div>
              </div>

              {/* Big tap targets, no drag gestures - reliable on a phone mid-scroll. */}
              <div className="flex flex-col gap-1 shrink-0">
                <form action={move.bind(null, e.id, "up")}>
                  <button
                    type="submit"
                    disabled={i === 0}
                    aria-label={`Move ${e.title} up`}
                    className="flex items-center justify-center w-11 h-11 rounded-lg border border-brand-line text-brand-paper disabled:opacity-30 hover:border-brand-cyan/60"
                  >
                    ↑
                  </button>
                </form>
                <form action={move.bind(null, e.id, "down")}>
                  <button
                    type="submit"
                    disabled={i === events.length - 1}
                    aria-label={`Move ${e.title} down`}
                    className="flex items-center justify-center w-11 h-11 rounded-lg border border-brand-line text-brand-paper disabled:opacity-30 hover:border-brand-cyan/60"
                  >
                    ↓
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
