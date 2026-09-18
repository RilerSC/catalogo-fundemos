import Link from "next/link";
import { PriceList } from "@/components/catalog/PriceList";
import type { CatalogProgramDetail } from "@/lib/catalog/types";

export function ProgramDetail({ program }: { program: CatalogProgramDetail }) {
  const opening = program.opening;
  const prices = opening?.priceComponents ?? [];
  const hasSummary = Boolean(
    opening || program.duration || prices.length > 0,
  );

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm">
        <Link href="/" className="text-muted hover:text-navy hover:underline">
          ← Volver al catálogo
        </Link>
      </p>
      <p className="mt-8 text-[0.7rem] font-semibold tracking-[0.16em] text-accent uppercase">
        {program.academicType.name}
      </p>
      <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight break-words text-navy md:text-[2.35rem]">
        {program.name}
      </h1>
      {program.description ? (
        <p className="mt-5 max-w-prose text-[1.02rem] leading-relaxed text-ink whitespace-pre-wrap">
          {program.description}
        </p>
      ) : null}
      {program.knowledgeFields.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {program.knowledgeFields.map((field) => (
            <li
              key={field.slug}
              className="rounded-full bg-card px-3 py-1 text-xs text-navy-soft"
            >
              {field.name}
            </li>
          ))}
        </ul>
      ) : null}
      {hasSummary ? (
        <section className="mt-8 rounded-2xl border border-line bg-card p-5 md:p-6">
          <h2 className="text-sm font-semibold tracking-wide text-navy uppercase">
            Apertura
          </h2>
          {opening || program.duration ? (
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {opening ? (
                <div>
                  <dt className="text-muted">Inicio</dt>
                  <dd className="mt-0.5 font-medium text-navy">
                    {opening.startDateLabel}
                  </dd>
                </div>
              ) : null}
              {opening?.modality ? (
                <div>
                  <dt className="text-muted">Modalidad</dt>
                  <dd className="mt-0.5 font-medium text-navy">
                    {opening.modality}
                  </dd>
                </div>
              ) : null}
              {opening?.schedule ? (
                <div>
                  <dt className="text-muted">Horario</dt>
                  <dd className="mt-0.5 font-medium text-navy">
                    {opening.schedule}
                  </dd>
                </div>
              ) : null}
              {program.duration ? (
                <div>
                  <dt className="text-muted">Duración</dt>
                  <dd className="mt-0.5 font-medium text-navy">
                    {program.duration}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          {prices.length > 0 ? (
            <div className="mt-5 border-t border-line pt-4">
              <PriceList components={prices} layout="rows" />
            </div>
          ) : null}
        </section>
      ) : null}
      <TextSection title="Perfil de ingreso" value={program.entryProfile} />
      <TextSection title="Perfil de salida" value={program.exitProfile} />
      <TextSection title="Requisitos" value={program.requirements} />
      <CurriculumSection value={program.curriculum} />
      <TextSection
        title="Información complementaria"
        value={program.complementaryInfo}
      />
    </article>
  );
}

function TextSection({ title, value }: { title: string; value: string | null }) {
  if (!value?.trim()) {
    return null;
  }
  return (
    <section className="mt-10 max-w-prose">
      <h2 className="border-b border-line pb-2 text-lg font-semibold text-navy">
        {title}
      </h2>
      <p className="mt-4 whitespace-pre-wrap text-[0.95rem] leading-7 text-ink">
        {value}
      </p>
    </section>
  );
}

function CurriculumSection({ value }: { value: string | null }) {
  if (!value?.trim()) {
    return null;
  }
  return (
    <section className="mt-10 max-w-prose">
      <h2 className="border-b border-line pb-2 text-lg font-semibold text-navy">
        Plan de estudios
      </h2>
      <div className="mt-4 whitespace-pre-wrap text-[0.95rem] leading-7 text-ink">
        {value}
      </div>
    </section>
  );
}
