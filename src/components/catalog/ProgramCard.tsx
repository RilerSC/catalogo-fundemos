import Link from "next/link";
import { PriceList } from "@/components/catalog/PriceList";
import type { CatalogProgramCard } from "@/lib/catalog/types";

const VISIBLE_FIELDS = 2;

export function ProgramCard({
  program,
  headingLevel = 2,
}: {
  program: CatalogProgramCard;
  headingLevel?: 2 | 3;
}) {
  const extraFields = program.knowledgeFields.length - VISIBLE_FIELDS;
  const visibleFields = program.knowledgeFields.slice(0, VISIBLE_FIELDS);
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const prices = program.opening?.priceComponents ?? [];

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(20,38,61,0.04)] transition-[border-color,box-shadow] duration-150 hover:border-navy-soft/25 hover:shadow-[0_10px_28px_rgba(20,38,61,0.06)]">
      <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-accent uppercase">
        {program.academicType.name}
      </p>
      <Heading className="mt-2 text-lg leading-snug font-semibold tracking-tight break-words text-navy">
        <Link href={`/programas/${program.slug}`} className="hover:underline">
          {program.name}
        </Link>
      </Heading>
      {program.shortDescription ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {program.shortDescription}
        </p>
      ) : null}
      <dl className="mt-4 grid gap-1 text-sm text-ink">
        {program.opening ? (
          <div className="flex gap-2">
            <dt className="shrink-0 text-muted">Inicio</dt>
            <dd>{program.opening.startDateLabel}</dd>
          </div>
        ) : null}
        {program.opening?.modality ? (
          <div className="flex gap-2">
            <dt className="shrink-0 text-muted">Modalidad</dt>
            <dd>{program.opening.modality}</dd>
          </div>
        ) : null}
        {program.duration ? (
          <div className="flex gap-2">
            <dt className="shrink-0 text-muted">Duración</dt>
            <dd>{program.duration}</dd>
          </div>
        ) : null}
      </dl>
      {prices.length > 0 ? (
        <div className="mt-4 border-t border-line pt-3">
          <PriceList components={prices} />
        </div>
      ) : null}
      {visibleFields.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {visibleFields.map((field) => (
            <li
              key={field.slug}
              className="max-w-full truncate rounded-full bg-paper px-2.5 py-0.5 text-[0.7rem] text-navy-soft"
            >
              {field.name}
            </li>
          ))}
          {extraFields > 0 ? (
            <li className="rounded-full bg-paper px-2.5 py-0.5 text-[0.7rem] text-muted">
              +{extraFields}
            </li>
          ) : null}
        </ul>
      ) : null}
      <p className="mt-auto pt-5">
        <Link
          href={`/programas/${program.slug}`}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-navy-soft hover:underline"
        >
          Ver programa
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Link>
      </p>
    </article>
  );
}
