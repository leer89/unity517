import type { Event } from "@/lib/types";
import { Field, Textarea, FileField, Checkbox, Label } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  event?: Event;
};

// Pre-fills the datetime-local input from an ISO timestamp. Uses local time
// (Eastern for Lansing), so the admin sees the value they entered.
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({ action, event }: Props) {
  return (
    <form action={action} encType="multipart/form-data" className="space-y-5 w-full max-w-2xl">
      <Field
        label={event ? "Title" : "Title (optional, derived from flyer filename if left blank)"}
        name="title"
        defaultValue={event?.title ?? ""}
        required={Boolean(event)}
      />
      <Field label="Slug (auto if blank)" name="slug" defaultValue={event?.slug ?? ""} placeholder="unity-fest-2026" />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Starts at"
          name="starts_at"
          type="datetime-local"
          defaultValue={toDatetimeLocal(event?.starts_at ?? null)}
          required
        />
        <Field
          label="Ends at (optional)"
          name="ends_at"
          type="datetime-local"
          defaultValue={toDatetimeLocal(event?.ends_at ?? null)}
        />
      </div>

      <Field
        label="Location"
        name="location"
        defaultValue={event?.location ?? ""}
        placeholder="216 E Grand River Ave, Old Town Lansing"
      />

      <Textarea
        label="Description"
        name="description"
        rows={5}
        defaultValue={event?.description ?? ""}
      />

      <Field
        label="Ticket URL (optional)"
        name="ticket_url"
        defaultValue={event?.ticket_url ?? ""}
        placeholder="https://..."
      />

      <div className="w-full">
        <Label>Flyer image</Label>
        <p className="text-xs text-brand-muted mt-1">Upload an image, or paste a URL below.</p>
        <FileField label="" name="flyer_file" />
        <Field
          label=""
          name="flyer_url"
          defaultValue={event?.flyer_url ?? ""}
          placeholder="https://...image.jpg"
          className="mt-2"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <Checkbox
          name="is_featured"
          defaultChecked={event ? event.is_featured : true}
          label="Feature on homepage (only one, new events default to featured)"
        />
        {event && (
          <Checkbox name="is_archived" defaultChecked={event?.is_archived ?? false} label="Archived (hidden from public)" />
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit">{event ? "Save changes" : "Create event"}</Button>
      </div>
    </form>
  );
}
