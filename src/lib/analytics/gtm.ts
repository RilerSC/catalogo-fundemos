const GTM_ID_RE = /^GTM-[A-Z0-9]+$/;

export function getConfiguredGtmId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
  if (!raw || !GTM_ID_RE.test(raw)) {
    return null;
  }
  return raw;
}

export function isAnalyticsDebug(): boolean {
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true") {
    return true;
  }
  return process.env.NODE_ENV === "development";
}

type DataLayerValue = Record<string, unknown> | IArguments;

declare global {
  interface Window {
    dataLayer?: DataLayerValue[];
  }
}

export function ensureDataLayer(): DataLayerValue[] {
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

export function gtag(
  _command: string,
  _action: string,
  _params: Record<string, string | number>,
): void {
  const dataLayer = ensureDataLayer();
  // GTM consent commands expect the Arguments object, not a plain array.
  // eslint-disable-next-line prefer-rest-params
  dataLayer.push(arguments);
}

let gtmLoaded = false;

let consentDefaultsReady = false;

export function setConsentDefaults(): void {
  if (consentDefaultsReady) {
    return;
  }
  consentDefaultsReady = true;
  ensureDataLayer();
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function updateAnalyticsConsent(granted: boolean): void {
  ensureDataLayer();
  gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function loadGtmContainer(id: string): void {
  if (gtmLoaded || typeof document === "undefined") {
    return;
  }
  gtmLoaded = true;
  const dataLayer = ensureDataLayer();
  dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);
}
