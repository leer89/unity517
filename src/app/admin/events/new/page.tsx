import { requireAdmin } from "@/lib/auth";
import EventForm from "../EventForm";
import { createEvent } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="display text-4xl text-brand-paper mb-6">New event</h1>
      <EventForm action={createEvent} />
    </div>
  );
}
