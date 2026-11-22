// What a date field stamps: the day, the time, or both, in the signer's own
// time zone at the moment they sign.

export const dateFormats = ["date", "date_time", "time"] as const;

export type DateFormat = (typeof dateFormats)[number];

export const dateFormatLabels: Record<DateFormat, string> = {
  date: "Date",
  date_time: "Date and time",
  time: "Time",
};

/** "UTC+05:30" for a browser offset of -330, "UTC" for none. */
function describeOffset(timezoneOffsetMinutes: number): string {
  const offset = -timezoneOffsetMinutes;

  if (offset === 0) {
    return "UTC";
  }

  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;

  return `UTC${offset > 0 ? "+" : "-"}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Formats a moment as a date field shows it. timezoneOffsetMinutes is what
 * the signer's browser reports from Date.prototype.getTimezoneOffset.
 */
export function formatSigningDate(
  epochMilliseconds: number,
  timezoneOffsetMinutes: number,
  format: DateFormat = "date",
): string {
  const local = new Date(epochMilliseconds - timezoneOffsetMinutes * 60_000);
  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(local);
  // Built by hand: Intl puts a narrow no-break space before "AM", which not
  // every font in a PDF can draw.
  const hours = local.getUTCHours();
  const time = `${String(((hours + 11) % 12) + 1)}:${String(local.getUTCMinutes()).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"} (${describeOffset(timezoneOffsetMinutes)})`;

  if (format === "time") {
    return time;
  }

  return format === "date_time" ? `${day}, ${time}` : day;
}
