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
