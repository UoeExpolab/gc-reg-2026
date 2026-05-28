export const TABLE_BOOKING_OPENS_AT = "2026-05-02T08:00:00.000Z";
export const TABLE_BOOKING_CLOSES_AT = "2026-06-03T16:00:00.000Z";
export const TABLE_BOOKING_TIME_ZONE = "Europe/London";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: TABLE_BOOKING_TIME_ZONE,
});

export function getTableBookingStatus(now = new Date()) {
  const opensAt = new Date(TABLE_BOOKING_OPENS_AT);
  const closesAt = new Date(TABLE_BOOKING_CLOSES_AT);
  const nowMs = now.getTime();
  const opensAtMs = opensAt.getTime();
  const closesAtMs = closesAt.getTime();

  return {
    opensAt,
    closesAt,
    opensAtLabel: dateFormatter.format(opensAt),
    closesAtLabel: dateFormatter.format(closesAt),
    isBefore: nowMs < opensAtMs,
    isOpen: nowMs >= opensAtMs && nowMs <= closesAtMs,
    isClosed: nowMs > closesAtMs,
    msUntilOpen: Math.max(0, opensAtMs - nowMs),
    msUntilClose: Math.max(0, closesAtMs - nowMs),
  };
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}
