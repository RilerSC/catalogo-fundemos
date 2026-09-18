const DATE_FORMATTER = new Intl.DateTimeFormat("es-CR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function toDateKey(value: string | Date): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  return value.toISOString().slice(0, 10);
}

export function formatStartDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return DATE_FORMATTER.format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatPriceLabel(
  amount: string | null,
  currency: string | null,
): string | null {
  if (amount === null || currency === null) {
    return null;
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) {
    return null;
  }

  try {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toLocaleString("es-CR")}`;
  }
}

export function shortenText(value: string | null, maxLength = 180): string | null {
  if (!value) {
    return null;
  }
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, maxLength - 1).trimEnd()}…`;
}

export function todayUtcDateKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
