export const INTERESTS_STORAGE_KEY = "fundepos.catalog.interests";
export const INTERESTS_STORAGE_VERSION = 1;

function uniqueProgramIds(values: unknown[]): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }
    const id = value.trim();
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    ids.push(id);
  }

  return ids;
}

export function parseInterestsPayload(raw: string | null): string[] {
  if (!raw) {
    return [];
  }

  try {
    const data: unknown = JSON.parse(raw);
    if (Array.isArray(data)) {
      return uniqueProgramIds(data);
    }
    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as { programIds?: unknown }).programIds)
    ) {
      return uniqueProgramIds((data as { programIds: unknown[] }).programIds);
    }
    return [];
  } catch {
    return [];
  }
}

export function serializeInterests(programIds: string[]): string {
  return JSON.stringify({
    version: INTERESTS_STORAGE_VERSION,
    programIds: uniqueProgramIds(programIds),
  });
}

export function readInterestsFromStorage(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return parseInterestsPayload(
      window.localStorage.getItem(INTERESTS_STORAGE_KEY),
    );
  } catch {
    return [];
  }
}

export function writeInterestsToStorage(programIds: string[]): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(
      INTERESTS_STORAGE_KEY,
      serializeInterests(programIds),
    );
    return true;
  } catch {
    return false;
  }
}
