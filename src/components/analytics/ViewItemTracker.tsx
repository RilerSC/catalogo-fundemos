"use client";

import { useEffect } from "react";
import { useAnalyticsConsent } from "@/components/analytics/AnalyticsProvider";
import { track } from "@/lib/analytics/track";
import type { AnalyticsItem } from "@/lib/analytics/types";

export function ViewItemTracker({ item }: { item: AnalyticsItem }) {
  const { consent } = useAnalyticsConsent();
  useEffect(() => {
    if (consent !== "granted") {
      return;
    }
    track({
      event: "view_item",
      items: [item],
    });
  }, [consent, item]);
  return null;
}
