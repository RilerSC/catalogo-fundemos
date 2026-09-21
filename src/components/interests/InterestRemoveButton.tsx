"use client";

import { useInterestActions } from "@/components/interests/useInterests";

export function InterestRemoveButton({
  programId,
  programName,
}: {
  programId: string;
  programName: string;
}) {
  const { remove } = useInterestActions();

  return (
    <button
      type="button"
      onClick={() => remove(programId)}
      aria-label={`Quitar ${programName} de programas de interés`}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-line-strong bg-card px-3.5 text-sm font-medium text-navy-soft transition-colors duration-150 hover:border-brand-red/45 hover:bg-brand-red/5 hover:text-brand-red"
    >
      <span aria-hidden="true">×</span>
      Quitar
    </button>
  );
}
