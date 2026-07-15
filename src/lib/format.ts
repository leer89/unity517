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
