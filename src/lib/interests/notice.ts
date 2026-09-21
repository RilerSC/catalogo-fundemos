"use client";

export type InterestNotice = {
  key: number;
  programName: string;
};

let notice: InterestNotice | null = null;
let noticeKey = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeInterestNotice(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getInterestNotice(): InterestNotice | null {
  return notice;
}

export function getServerInterestNotice(): InterestNotice | null {
  return null;
}

export function announceInterestAdded(programName: string) {
  noticeKey += 1;
  notice = { key: noticeKey, programName };
  emit();
}

export function dismissInterestNotice() {
  if (notice === null) {
    return;
  }
  notice = null;
  emit();
}
