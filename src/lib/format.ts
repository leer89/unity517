/**
 * Format an event datetime range like "Aug 30 · 11am–10pm" or "Aug 30 · 8pm"
 * Returns local time in America/Detroit (Lansing is in Eastern).
 */
export function formatEventDate(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt);
  const dateFmt: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: "America/Detroit",
  };
  const timeFmt: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: undefined,
    hour12: true,
    timeZone: "America/Detroit",
  };

  const datePart = new Intl.DateTimeFormat("en-US", dateFmt).format(start);
  const startTime = new Intl.DateTimeFormat("en-US", timeFmt).format(start).toLowerCase().replace(" ", "");

  if (!endsAt) return `${datePart} · ${startTime}`;

  const end = new Date(endsAt);
  const endTime = new Intl.DateTimeFormat("en-US", timeFmt).format(end).toLowerCase().replace(" ", "");
  return `${datePart} · ${startTime}–${endTime}`;
}

/**
 * Whole days remaining until an ISO timestamp, clamped at 0. Used for the
 * homepage festival countdown - the hero's "thesis" moment while the fest is
 * still months out but the site is already live for weekly flyers.
 */
export function daysUntil(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((target.getTime() - now.getTime()) / msPerDay);
  return Math.max(diff, 0);
}

// Lansing, MI is always Eastern - every event date/time in the admin is
// entered and displayed in this zone, regardless of what timezone the
// server itself happens to run in (Vercel runs UTC).
const EVENT_TIMEZONE = "America/Detroit";

/**
 * Converts a "wall clock" date + time - exactly what the admin typed into
 * the date/time inputs, always meant as Eastern local time - into the
 * correct UTC ISO timestamp for storage.
 *
 * Without this, `new Date("2026-07-14T21:00")` gets interpreted using the
 * server's own timezone (UTC on Vercel), so "9:00 PM" silently gets stored
 * as 9:00 PM UTC (= 5:00 PM Eastern) instead of 9:00 PM Eastern. That bug is
 * why an event's edit form and its public listing could show different
 * times for the same event.
 */
export function zonedDateTimeToISO(dateStr: string, timeStr: string): string {
  const guess = new Date(`${dateStr}T${timeStr}:00.000Z`);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: EVENT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(guess)
      .map((p) => [p.type, p.value]),
  );
  const guessInZone = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  const offset = guessInZone - guess.getTime();
  return new Date(guess.getTime() - offset).toISOString();
}

/**
 * Reverse of zonedDateTimeToISO: splits a stored UTC ISO timestamp back into
 * the Eastern-local "YYYY-MM-DD" and "HH:mm" strings the date/time inputs
 * need, so the edit form always shows the same time the public site shows.
 */
export function isoToZonedDateParts(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: EVENT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}
