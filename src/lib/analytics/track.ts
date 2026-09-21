import { readAnalyticsConsent } from "@/lib/analytics/consent";
import { ensureDataLayer, isAnalyticsDebug } from "@/lib/analytics/gtm";
import { sanitizePageLocation } from "@/lib/analytics/sanitize";
import type { AnalyticsEvent } from "@/lib/analytics/types";

let lastPagePath: string | null = null;
const emittedOnce = new Set<string>();

export function resetAnalyticsGuards(): void {
  lastPagePath = null;
  emittedOnce.clear();
}

export function currentPageLocation(): string {
  if (typeof window === "undefined") {
    return "/";
  }
  return sanitizePageLocation(
    `${window.location.pathname}${window.location.search}`,
  );
}

export function shouldTrack(): boolean {
  return readAnalyticsConsent() === "granted";
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined" || !shouldTrack()) {
    return;
  }

  if (event.event === "page_view") {
    if (lastPagePath === event.page_path) {
      return;
    }
    lastPagePath = event.page_path;
    if (event.page_path !== "/") {
      emittedOnce.delete("view_item_list:/");
    }
    if (event.page_path !== "/intereses") {
      emittedOnce.delete("view_interests");
    }
    for (const key of [...emittedOnce]) {
      if (key.startsWith("view_item:")) {
        emittedOnce.delete(key);
      }
    }
  }

  if (event.event === "view_item_list") {
    if (emittedOnce.has("view_item_list:/")) {
      return;
    }
    emittedOnce.add("view_item_list:/");
  }

  if (event.event === "view_interests") {
    if (emittedOnce.has("view_interests")) {
      return;
    }
    emittedOnce.add("view_interests");
  }

  if (event.event === "view_item") {
    const key = `view_item:${event.items[0].item_id}`;
    if (emittedOnce.has(key)) {
      return;
    }
    emittedOnce.add(key);
  }

  if (isAnalyticsDebug()) {
    console.info("[analytics]", event.event, event);
  }

  ensureDataLayer().push({ ...event });
}

export function trackPageView(pathname: string): void {
  track({
    event: "page_view",
    page_path: pathname,
    page_location: currentPageLocation(),
  });
}
