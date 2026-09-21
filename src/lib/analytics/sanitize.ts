const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const MAX_SEARCH_TERM = 80;

export function sanitizeSearchTerm(value: string): string | undefined {
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) {
    return undefined;
  }
  if (compact.length > MAX_SEARCH_TERM) {
    return undefined;
  }
  if (EMAIL_RE.test(compact)) {
    return undefined;
  }
  const digits = compact.replace(/\D/g, "");
  if (digits.length >= 7) {
    return undefined;
  }
  return compact;
}

export function sanitizePageLocation(href: string): string {
  try {
    const url = new URL(href, "http://localhost");
    url.searchParams.delete("q");
    const allowed = new URLSearchParams();
    for (const key of ["type", "field"]) {
      for (const value of url.searchParams.getAll(key)) {
        const slug = value.trim();
        if (slug) {
          allowed.append(key, slug);
        }
      }
    }
    const query = allowed.toString();
    return query ? `${url.pathname}?${query}` : url.pathname;
  } catch {
    return "/";
  }
}
