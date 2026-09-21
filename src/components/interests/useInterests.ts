"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  clearInterests,
  getInterestIds,
  getServerInterestIds,
  pruneInterests,
  removeInterest,
  subscribeInterests,
  toggleInterest,
} from "@/lib/interests/store";

export function useInterestIds(): string[] {
  return useSyncExternalStore(
    subscribeInterests,
    getInterestIds,
    getServerInterestIds,
  );
}

export function useHasInterest(programId: string): boolean {
  const ids = useInterestIds();
  return ids.includes(programId);
}

export function useInterestCount(): number {
  return useInterestIds().length;
}

export function useInterestActions() {
  const toggle = useCallback((programId: string) => {
    toggleInterest(programId);
  }, []);
  const remove = useCallback((programId: string) => {
    removeInterest(programId);
  }, []);
  const clear = useCallback(() => {
    clearInterests();
  }, []);
  const prune = useCallback((validIds: readonly string[]) => {
    pruneInterests(validIds);
  }, []);

  return { toggle, remove, clear, prune };
}
