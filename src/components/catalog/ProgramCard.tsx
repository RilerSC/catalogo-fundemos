import Link from "next/link";
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

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#ddd6cb] bg-white p-5 shadow-[0_8px_24px_rgba(20,38,61,0.05)]">
      <p className="text-xs font-semibold tracking-[0.14em] text-[#8b6b2e] uppercase">
        {program.academicType.name}
      </p>
      <Heading className="mt-2 text-xl leading-snug font-semibold text-[#14263d]">
        <Link href={`/programas/${program.slug}`} className="hover:underline">
          {program.name}
        </Link>
      </Heading>
      {program.shortDescription ? (
        <p className="mt-3 text-sm leading-relaxed text-[#5b6575]">
          {program.shortDescription}
        </p>
      ) : null}
      <dl className="mt-4 space-y-1 text-sm text-[#243044]">
        {program.opening ? (
          <div>
            <dt className="sr-only">Inicio</dt>
            <dd>Inicio: {program.opening.startDateLabel}</dd>
          </div>
        ) : null}
        {program.opening?.modality ? (
          <div>
            <dt className="sr-only">Modalidad</dt>
            <dd>{program.opening.modality}</dd>
          </div>
        ) : null}
        {program.duration ? (
          <div>
            <dt className="sr-only">Duración</dt>
            <dd>{program.duration}</dd>
          </div>
        ) : null}
        {program.opening?.priceComponents.map((component) => (
          <div key={component.kind}>
            <dt className="sr-only">{component.label}</dt>
            <dd>
              {component.label}: {component.formatted}
            </dd>
          </div>
        ))}
      </dl>
      {visibleFields.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {visibleFields.map((field) => (
            <li
              key={field.slug}
              className="rounded-full bg-[#f6f3ee] px-2.5 py-1 text-xs text-[#1e3a5f]"
            >
              {field.name}
            </li>
          ))}
          {extraFields > 0 ? (
            <li className="rounded-full bg-[#f6f3ee] px-2.5 py-1 text-xs text-[#5b6575]">
              +{extraFields}
            </li>
          ) : null}
        </ul>
      ) : null}
      <p className="mt-auto pt-5 text-sm font-medium text-[#1e3a5f]">
        <Link href={`/programas/${program.slug}`}>Ver programa</Link>
      </p>
    </article>
  );
}
