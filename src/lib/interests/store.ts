"use client";

import {
  INTERESTS_STORAGE_KEY,
  readInterestsFromStorage,
  writeInterestsToStorage,
} from "@/lib/interests/storage";

const EMPTY: string[] = [];

let ids: string[] = EMPTY;
let hydrated = false;
let storageListening = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function ensureStorageListener() {
  if (storageListening || typeof window === "undefined") {
    return;
  }

  storageListening = true;
  window.addEventListener("storage", (event) => {
    if (event.key !== INTERESTS_STORAGE_KEY && event.key !== null) {
      return;
    }
    ids = readInterestsFromStorage();
    emit();
  });
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") {
    return;
  }

  hydrated = true;
  ids = readInterestsFromStorage();
  ensureStorageListener();
}

function setIds(next: string[]) {
  ids = next.length === 0 ? EMPTY : next;
  writeInterestsToStorage(next);
  emit();
}

export function subscribeInterests(listener: () => void): () => void {
  listeners.add(listener);
  ensureHydrated();
  return () => {
    listeners.delete(listener);
  };
}

export function getInterestIds(): string[] {
  ensureHydrated();
  return ids;
}

export function getServerInterestIds(): string[] {
  return EMPTY;
}

export function toggleInterest(programId: string) {
  ensureHydrated();
  const id = programId.trim();
  if (!id) {
    return;
  }

  if (ids.includes(id)) {
    setIds(ids.filter((item) => item !== id));
    return;
  }

  setIds([...ids, id]);
}

export function removeInterest(programId: string) {
  ensureHydrated();
  if (!ids.includes(programId)) {
    return;
  }
  setIds(ids.filter((item) => item !== programId));
}

export function clearInterests() {
  ensureHydrated();
  if (ids.length === 0) {
    return;
  }
  setIds([]);
}

export function pruneInterests(validIds: readonly string[]) {
  ensureHydrated();
  const valid = new Set(validIds);
  const next = ids.filter((id) => valid.has(id));
  if (next.length === ids.length) {
    return;
  }
  setIds(next);
}
