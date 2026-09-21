"use client";

import {
  useHasInterest,
  useInterestActions,
  useInterestCount,
} from "@/components/interests/useInterests";
import { track } from "@/lib/analytics/track";
import type { InterestSource } from "@/lib/analytics/types";
import { announceInterestAdded } from "@/lib/interests/notice";

type InterestToggleProps = {
  programId: string;
  programName: string;
  programSlug: string;
  academicTypeName: string;
  source: InterestSource;
  variant?: "compact" | "default";
  block?: boolean;
};

export function InterestToggle({
  programId,
  programName,
  programSlug,
  academicTypeName,
  source,
  variant = "compact",
  block = false,
}: InterestToggleProps) {
  const selected = useHasInterest(programId);
  const count = useInterestCount();
  const { toggle } = useInterestActions();
  const size =
    variant === "compact"
      ? "min-h-11 px-3.5 text-sm"
      : "min-h-12 px-5 text-[0.95rem]";
  const width = block ? "w-full justify-center" : "shrink-0";

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={
        selected
          ? `Quitar ${programName} de programas de interés`
          : `Agregar ${programName} a programas de interés`
      }
      onClick={() => {
        const item = {
          item_id: programSlug,
          item_name: programName,
          item_category: academicTypeName,
        };
        if (!selected) {
          announceInterestAdded(programName);
          toggle(programId);
          track({
            event: "add_to_wishlist",
            items: [item],
            interest_count: count + 1,
          });
          return;
        }
        toggle(programId);
        track({
          event: "remove_interest",
          items: [item],
          interest_count: Math.max(0, count - 1),
          source,
        });
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold whitespace-nowrap transition-colors duration-150 ${width} ${size} ${
        selected
          ? "border-navy bg-navy text-white hover:bg-navy-deep"
          : "border-line-strong bg-card text-navy hover:border-navy/40 hover:bg-gold-veil/50"
      }`}
    >
      <span
        aria-hidden="true"
        className={selected ? "text-gold" : "text-navy-soft"}
      >
        {selected ? "✓" : "+"}
      </span>
      {selected ? "En mis intereses" : "Me interesa"}
    </button>
  );
}
