"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInterestCount } from "@/components/interests/useInterests";

export function InterestsNavLink() {
  const count = useInterestCount();
  const pathname = usePathname();
  const current = pathname === "/intereses";

  return (
    <Link
      href="/intereses"
      aria-current={current ? "page" : undefined}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-2.5 text-sm font-medium transition-colors sm:px-3 ${
        current
          ? "border-navy bg-navy text-white"
          : "border-line text-navy-soft hover:border-navy-soft/40 hover:bg-paper hover:text-navy"
      }`}
    >
      <span className="sm:hidden">Intereses</span>
      <span className="hidden sm:inline">Mis programas de interés</span>
      {count > 0 ? (
        <span
          aria-hidden="true"
          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${
            current ? "bg-gold text-navy" : "bg-navy text-gold"
          }`}
        >
          {count}
        </span>
      ) : null}
      <span className="sr-only">
        {count === 0
          ? "sin programas seleccionados"
          : `${count} ${count === 1 ? "programa seleccionado" : "programas seleccionados"}`}
      </span>
    </Link>
  );
}
