import type { AnalyticsConsent } from "@/lib/analytics/types";

export const CONSENT_STORAGE_KEY = "fundepos.consent.v1";

type ConsentRecord = {
  version: 1;
  analytics: "granted" | "denied";
};

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") {
    return "unset";
  }
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return "unset";
    }
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.version !== 1) {
      return "unset";
    }
    if (parsed.analytics === "granted" || parsed.analytics === "denied") {
      return parsed.analytics;
    }
    return "unset";
  } catch {
    return "unset";
  }
}

const listeners = new Set<() => void>();

function emitConsent() {
  listeners.forEach((listener) => listener());
}

export function subscribeAnalyticsConsent(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
  };
}

function onStorage(event: StorageEvent) {
  if (event.key === CONSENT_STORAGE_KEY || event.key === null) {
    emitConsent();
  }
}

export function writeAnalyticsConsent(analytics: "granted" | "denied"): void {
  window.localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({ version: 1, analytics } satisfies ConsentRecord),
  );
  emitConsent();
}
