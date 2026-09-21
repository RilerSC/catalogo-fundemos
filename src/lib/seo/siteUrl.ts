/**
 * URL absoluta del sitio para metadata, sitemap y JSON-LD.
 * Producción exige SITE_URL (no se inventa un dominio).
 * Preview/dev puede usar un fallback técnico que no se trata como
 * canonical de producción: VERCEL_URL o localhost.
 */
export function getSiteUrl(): URL {
  const configured = normalizeAbsoluteUrl(process.env.SITE_URL);
  if (configured) {
    return configured;
  }

  if (isProductionRuntime()) {
    throw new Error("SITE_URL is required in production");
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return new URL(`https://${vercelHost.replace(/\/$/, "")}`);
  }

  return new URL("http://localhost:3000");
}

export function absoluteUrl(path: string, base = getSiteUrl()): string {
  const origin = base.origin;
  if (path === "/" || path === "") {
    return `${origin}/`;
  }
  return new URL(path, `${origin}/`).href;
}

export function isProductionRuntime(): boolean {
  return process.env.VERCEL_ENV === "production";
}

function normalizeAbsoluteUrl(value: string | undefined): URL | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    url.hash = "";
    url.search = "";
    if (url.pathname === "/") {
      return url;
    }
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url;
  } catch {
    return null;
  }
}
