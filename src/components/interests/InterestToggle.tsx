"use client";

import {
  useHasInterest,
  useInterestActions,
} from "@/components/interests/useInterests";
import { announceInterestAdded } from "@/lib/interests/notice";

type InterestToggleProps = {
  programId: string;
  programName: string;
  variant?: "compact" | "default";
  block?: boolean;
};

export function InterestToggle({
  programId,
  programName,
  variant = "compact",
  block = false,
}: InterestToggleProps) {
  const selected = useHasInterest(programId);
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
        if (!selected) {
          announceInterestAdded(programName);
        }
        toggle(programId);
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
