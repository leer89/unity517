import type { Event } from "@/lib/types";
import { Field, Textarea, FileField, Checkbox, Label } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { isoToZonedDateParts } from "@/lib/format";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  event?: Event;
};

// Matches the shared input styling in components/ui/FormField.tsx (that file
// doesn't export its base class, so this is a deliberate small duplicate).
const dateTimeInputClass =
  "block w-full min-w-0 rounded-md bg-brand-ink border border-brand-line " +
  "px-3 py-2 text-base text-brand-paper " +
  "focus:outline-none focus:border-brand-cyan";

export default function EventForm({ action, event }: Props) {
  const gallery = event?.flyer_urls ?? [];

  // type="date" + type="time" instead of a single type="datetime-local":
  // every mobile browser (and desktop Chrome/Edge/Safari) renders type="date"
  // as a real tap-to-open calendar, which datetime-local doesn't reliably do -
  // Firefox desktop in particular renders it as bare spinners with no calendar
  // affordance at all. Two native inputs, still zero JS date-picker library.
  //
  // Values come from isoToZonedDateParts (America/Detroit) rather than the
  // server's own local time (UTC on Vercel) - otherwise the edit form shows
  // a different time than the public site for the same event.
  const starts = isoToZonedDateParts(event?.starts_at ?? null);
  const ends = isoToZonedDateParts(event?.ends_at ?? null);

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
        <div className="w-full">
          <Label>Starts at</Label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              type="date"
              name="starts_date"
              required
              defaultValue={starts.date}
              className={dateTimeInputClass}
            />
            <input
              type="time"
              name="starts_time"
              required
              defaultValue={starts.time}
              className={dateTimeInputClass}
            />
          </div>
        </div>
        <div className="w-full">
          <Label>Ends at (optional)</Label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              type="date"
              name="ends_date"
              defaultValue={ends.date}
              className={dateTimeInputClass}
            />
            <input
              type="time"
              name="ends_time"
              defaultValue={ends.time}
              className={dateTimeInputClass}
            />
          </div>
        </div>
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
          placeholder={"John Beltran\n*INZO | https://open.spotify.com/artist/xxxx\nZach Bletz\n..."}
        />
        <p className="text-xs text-brand-muted mt-1">
          Each name becomes a tappable button that searches for that artist.
          If a search would point somewhere wrong, add the exact link after a pipe:{" "}
          <code className="text-brand-paper/80">Artist Name | https://open.spotify.com/artist/...</code>
          {" "}Put a <code className="text-brand-paper/80">*</code> in front of a name to show it
          as a headliner (bigger, its own row above the rest) - e.g.{" "}
          <code className="text-brand-paper/80">*INZO</code>. For a back-to-back set, write{" "}
          <code className="text-brand-paper/80">Name A b2b Name B</code> - they'll show as one
          bubble but each name still gets its own link. Add both links in the same order if you
          have them: <code className="text-brand-paper/80">Name A b2b Name B | link for A | link for B</code>.
        </p>
      </div>

      <div className="w-full">
        <Textarea
          label="Links (optional - official song, TikTok, event-specific social, etc.)"
          name="links"
          rows={4}
          defaultValue={event?.links ?? ""}
          placeholder={"Official Anthem | https://open.spotify.com/track/xxxx\nhttps://www.tiktok.com/@unitynmusic517\nhttps://www.instagram.com/unitynmusic517/"}
        />
        <p className="text-xs text-brand-muted mt-1">
          One per line. We detect Spotify, TikTok, Instagram, YouTube, SoundCloud, X, and Facebook
          automatically and show the matching icon. Add a custom label with a pipe:{" "}
          <code className="text-brand-paper/80">Official Anthem | https://open.spotify.com/track/...</code>
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
