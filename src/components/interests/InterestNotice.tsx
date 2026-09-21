"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import {
  dismissInterestNotice,
  getInterestNotice,
  getServerInterestNotice,
  subscribeInterestNotice,
} from "@/lib/interests/notice";

const AUTO_DISMISS_MS = 7000;

export function InterestNotice() {
  const notice = useSyncExternalStore(
    subscribeInterestNotice,
    getInterestNotice,
    getServerInterestNotice,
  );

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = window.setTimeout(() => {
      dismissInterestNotice();
    }, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!notice) {
    return (
      <div className="sr-only" aria-live="polite" aria-atomic="true" />
    );
  }

  return (
    <div
      className="border-b border-gold/40 bg-gold-veil px-4 py-2.5 text-sm text-navy"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p>
          <span className="font-medium">
            Programa agregado a Mis programas de interés.
          </span>{" "}
          <span className="sr-only">{notice.programName}.</span>
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/intereses"
            className="font-semibold underline decoration-gold underline-offset-4 hover:text-navy-deep"
          >
            Ver mis intereses
          </Link>
          <button
            type="button"
            onClick={() => dismissInterestNotice()}
            className="inline-flex min-h-11 items-center text-sm text-navy-soft hover:text-navy"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
