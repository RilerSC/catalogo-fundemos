import type { CatalogFilters, CatalogProgramCard } from "./types";

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function searchHaystack(program: CatalogProgramCard): string {
  return normalizeSearchText(
    [
      program.name,
      program.shortDescription ?? "",
      program.academicType.name,
      ...program.knowledgeFields.map((field) => field.name),
    ].join(" "),
  );
}

function tokenMatches(haystack: string, token: string): boolean {
  if (token === "ia" || token === "ai") {
    return (
      haystack.includes("inteligencia") ||
      haystack.includes("artificial") ||
      /(^|\s)ia(\s|$)/.test(haystack) ||
      /(^|\s)ai(\s|$)/.test(haystack)
    );
  }
  return haystack.includes(token);
}

export function matchesSearch(program: CatalogProgramCard, query: string): boolean {
  const normalized = normalizeSearchText(query);
  if (!normalized) {
    return true;
  }
  const haystack = searchHaystack(program);
  return normalized.split(" ").every((token) => tokenMatches(haystack, token));
}

export function applyCatalogFilters(
  programs: CatalogProgramCard[],
  filters: CatalogFilters,
): CatalogProgramCard[] {
  return programs.filter((program) => {
    if (
      filters.typeSlugs.length > 0 &&
      !filters.typeSlugs.includes(program.academicType.slug)
    ) {
      return false;
    }
    if (
      filters.fieldSlugs.length > 0 &&
      !program.knowledgeFields.some((field) =>
        filters.fieldSlugs.includes(field.slug),
      )
    ) {
      return false;
    }
    return matchesSearch(program, filters.query);
  });
}

export function parseCatalogFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CatalogFilters {
  return {
    query: firstParam(searchParams.q) ?? "",
    typeSlugs: listParam(searchParams.type),
    fieldSlugs: listParam(searchParams.field),
  };
}

export function parseCatalogSearchParams(
  searchParams: Pick<URLSearchParams, "get" | "getAll">,
): CatalogFilters {
  return parseCatalogFilters({
    q: searchParams.get("q") ?? undefined,
    type: searchParams.getAll("type"),
    field: searchParams.getAll("field"),
  });
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function listParam(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  const items = Array.isArray(value) ? value : value.split(",");
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

export function catalogQueryString(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) {
    params.set("q", filters.query.trim());
  }
  for (const slug of filters.typeSlugs) {
    params.append("type", slug);
  }
  for (const slug of filters.fieldSlugs) {
    params.append("field", slug);
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}
