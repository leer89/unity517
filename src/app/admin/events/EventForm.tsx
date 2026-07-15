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
  const y = d.getFullYear();
  const mo = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${y}-${mo}-${day}T${hh}:${mm}`;
}

export default function EventForm({ action, event }: Props) {
  const gallery = event?.flyer_urls ?? [];

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
        <Textarea
          label="Lineup (optional - one artist per line, any order, we alphabetize it)"
          name="lineup"
          rows={8}
          defaultValue={event?.lineup ?? ""}
          placeholder={"John Beltran\nRaedy Lex | https://open.spotify.com/artist/xxxx\nZak Bletz\n..."}
        />
        <p className="text-xs text-brand-muted mt-1">
          Each name becomes a tappable button that searches Spotify for that artist.
          If a search would point somewhere wrong, add the exact link after a pipe:{" "}
          <code className="text-brand-paper/80">Artist Name | https://open.spotify.com/artist/...</code>
        </p>
      </div>

      <div className="w-full">
        <Label>Cover flyer</Label>
        <p className="text-xs text-brand-muted mt-1">
          Shown in the grid, the featured card, and link previews. Upload an image, or paste a URL below.
        </p>
        <FileField label="" name="flyer_file" />
        <Field
          label=""
          name="flyer_url"
          defaultValue={event?.flyer_url ?? ""}
          placeholder="https://...image.jpg"
          className="mt-2"
        />
      </div>

      <div className="w-full">
        <Label>Additional flyers</Label>
        <p className="text-xs text-brand-muted mt-1">
          Optional. Add more photos to turn the event page into a swipeable gallery,
          cover flyer first. Select multiple files at once to upload them all.
        </p>

        {gallery.length > 0 && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {gallery.map((url) => (
              <label
                key={url}
                className="relative block rounded-md overflow-hidden border border-brand-line aspect-square cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-brand-ink/80 py-1 text-[10px] uppercase tracking-widest text-brand-paper">
                  <input type="checkbox" name="remove_flyer_urls" value={url} className="accent-brand-neon" />
                  Remove
                </span>
              </label>
            ))}
          </div>
        )}

        <input
          type="file"
          name="extra_flyer_files"
          accept="image/*"
          multiple
          className="mt-3 block w-full min-w-0 text-sm text-brand-paper file:mr-3 file:rounded-md file:border-0 file:bg-brand-card file:px-3 file:py-2 file:text-brand-paper hover:file:bg-brand-line"
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
