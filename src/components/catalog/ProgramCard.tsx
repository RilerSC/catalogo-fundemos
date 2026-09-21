import Link from "next/link";
import { PriceList } from "@/components/catalog/PriceList";
import { InterestRemoveButton } from "@/components/interests/InterestRemoveButton";
import { InterestToggle } from "@/components/interests/InterestToggle";
import type { CatalogProgramCard } from "@/lib/catalog/types";

export function ProgramCard({
  program,
  headingLevel = 2,
  interestAction = "toggle",
}: {
  program: CatalogProgramCard;
  headingLevel?: 2 | 3;
  interestAction?: "toggle" | "remove" | "none";
}) {
  const primaryField = program.knowledgeFields[0];
  const extraFields = Math.max(0, program.knowledgeFields.length - 1);
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const prices = program.opening?.priceComponents ?? [];

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-card transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-navy-soft/30 hover:shadow-[0_16px_40px_rgba(15,30,61,0.10)]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gold opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-navy-soft uppercase">
          {program.academicType.name}
        </p>
        <Heading className="mt-2 font-serif text-[1.2rem] leading-snug font-semibold tracking-tight break-words text-balance text-navy">
          <Link
            href={`/programas/${program.slug}`}
            className="hover:underline hover:decoration-gold hover:underline-offset-4"
          >
            {program.name}
          </Link>
        </Heading>
        {program.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {program.shortDescription}
          </p>
        ) : null}
        <dl className="mt-3 grid gap-1 text-sm">
          {program.opening ? (
            <MetaRow label="Inicio" value={program.opening.startDateLabel} />
          ) : null}
          {program.opening?.modality ? (
            <MetaRow label="Modalidad" value={program.opening.modality} />
          ) : null}
          {program.duration ? (
            <MetaRow label="Duración" value={program.duration} />
          ) : null}
        </dl>
        {prices.length > 0 ? (
          <div className="mt-3">
            <PriceList components={prices} layout="compact" />
          </div>
        ) : null}
        {primaryField ? (
          <p className="mt-3 truncate text-xs text-navy-soft">
            {primaryField.name}
            {extraFields > 0 ? (
              <span className="text-muted"> +{extraFields}</span>
            ) : null}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line pt-4">
          <Link
            href={`/programas/${program.slug}`}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-navy hover:underline hover:decoration-gold hover:underline-offset-4"
          >
            Ver programa
            <span
              aria-hidden="true"
              className="ml-1.5 transition-transform duration-150 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
          {interestAction === "toggle" ? (
            <InterestToggle
              programId={program.id}
              programName={program.name}
            />
          ) : null}
          {interestAction === "remove" ? (
            <InterestRemoveButton
              programId={program.id}
              programName={program.name}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-[4.5rem] shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 font-medium text-ink">{value}</dd>
    </div>
  );
}
