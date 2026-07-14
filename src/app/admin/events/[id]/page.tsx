import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import EventForm from "../EventForm";
import { updateEvent } from "../../actions";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function EditEventPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", params.id).maybeSingle();
  if (error || !data) notFound();
  const event = data as Event;

  const boundAction = updateEvent.bind(null, event.id);

  return (
    <div>
      <h1 className="display text-4xl text-brand-paper mb-6">Edit event</h1>
      <EventForm action={boundAction} event={event} />
    </div>
  );
}
