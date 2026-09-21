"use client";

import {
  useInterestActions,
  useInterestCount,
} from "@/components/interests/useInterests";
import { track } from "@/lib/analytics/track";
import type { InterestSource } from "@/lib/analytics/types";

export function InterestRemoveButton({
  programId,
  programName,
  programSlug,
  academicTypeName,
  source,
}: {
  programId: string;
  programName: string;
  programSlug: string;
  academicTypeName: string;
  source: InterestSource;
}) {
  const count = useInterestCount();
  const { remove } = useInterestActions();

  return (
    <button
      type="button"
      onClick={() => {
        remove(programId);
        track({
          event: "remove_interest",
          items: [
            {
              item_id: programSlug,
              item_name: programName,
              item_category: academicTypeName,
            },
          ],
          interest_count: Math.max(0, count - 1),
          source,
        });
      }}
      aria-label={`Quitar ${programName} de programas de interés`}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-line-strong bg-card px-3.5 text-sm font-medium text-navy-soft transition-colors duration-150 hover:border-brand-red/45 hover:bg-brand-red/5 hover:text-brand-red"
    >
      <span aria-hidden="true">×</span>
      Quitar
    </button>
  );
}
