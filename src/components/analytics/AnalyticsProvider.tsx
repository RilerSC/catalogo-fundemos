"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import {
  readAnalyticsConsent,
  subscribeAnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/analytics/consent";
import {
  getConfiguredGtmId,
  loadGtmContainer,
  setConsentDefaults,
  updateAnalyticsConsent,
} from "@/lib/analytics/gtm";
import { resetAnalyticsGuards, trackPageView } from "@/lib/analytics/track";
import type { AnalyticsConsent } from "@/lib/analytics/types";

type AnalyticsContextValue = {
  consent: AnalyticsConsent;
  grant: () => void;
  deny: () => void;
  openPreferences: () => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function useAnalyticsConsent(): AnalyticsContextValue {
  const value = useContext(AnalyticsContext);
  if (!value) {
    throw new Error("useAnalyticsConsent must be used within AnalyticsProvider");
  }
  return value;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    readAnalyticsConsent,
    () => "unset" as const,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setConsentDefaults();
    if (consent !== "granted") {
      return;
    }
    updateAnalyticsConsent(true);
    const gtmId = getConfiguredGtmId();
    if (gtmId) {
      loadGtmContainer(gtmId);
    }
    trackPageView(pathname);
  }, [consent, pathname]);

  const grant = useCallback(() => {
    resetAnalyticsGuards();
    writeAnalyticsConsent("granted");
    setPreferencesOpen(false);
    updateAnalyticsConsent(true);
    const gtmId = getConfiguredGtmId();
    if (gtmId) {
      loadGtmContainer(gtmId);
    }
  }, []);

  const deny = useCallback(() => {
    writeAnalyticsConsent("denied");
    setPreferencesOpen(false);
    updateAnalyticsConsent(false);
  }, []);

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const value = useMemo(
    () => ({ consent, grant, deny, openPreferences }),
    [consent, deny, grant, openPreferences],
  );

  const showBanner = consent === "unset" || preferencesOpen;

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
      {showBanner ? (
        <ConsentBanner
          mode={consent === "unset" ? "first" : "preferences"}
          onGrant={grant}
          onDeny={deny}
          onDismiss={
            consent === "unset" ? undefined : () => setPreferencesOpen(false)
          }
        />
      ) : null}
    </AnalyticsContext.Provider>
  );
}
