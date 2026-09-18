/**
 * Production visibility remains: published program + published offering
 * with startDate >= today.
 *
 * Preview is for local/dev and Vercel Preview so the team can review the
 * 32 draft programs without mutating editorial status.
 *
 * Override: CATALOG_PREVIEW=true|false
 * Default: preview unless VERCEL_ENV=production.
 */
export function isCatalogPreview(): boolean {
  const explicit = process.env.CATALOG_PREVIEW;
  if (explicit === "true") {
    return true;
  }
  if (explicit === "false") {
    return false;
  }
  return process.env.VERCEL_ENV !== "production";
}
