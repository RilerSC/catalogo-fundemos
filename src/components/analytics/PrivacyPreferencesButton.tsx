"use client";

import { useAnalyticsConsent } from "@/components/analytics/AnalyticsProvider";

export function PrivacyPreferencesButton() {
  const { openPreferences } = useAnalyticsConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className="hover:text-gold hover:underline"
    >
      Preferencias de privacidad
    </button>
  );
}
