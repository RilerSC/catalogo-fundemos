import Link from "next/link";
import type { CatalogProgramDetail } from "@/lib/catalog/types";

export function ProgramDetail({ program }: { program: CatalogProgramDetail }) {
  const opening = program.opening;

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm">
        <Link href="/" className="font-medium text-[#1e3a5f]">
          ← Volver al catálogo
        </Link>
      </p>
      <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-[#8b6b2e] uppercase">
        {program.academicType.name}
      </p>
      <h1 className="mt-2 text-3xl leading-tight font-semibold text-[#14263d] md:text-4xl">
        {program.name}
      </h1>
      {opening ? (
        <dl className="mt-6 grid gap-2 rounded-2xl border border-[#ddd6cb] bg-white p-5 text-sm md:grid-cols-2">
          <div>
            <dt className="text-[#5b6575]">Inicio</dt>
            <dd className="font-medium">{opening.startDateLabel}</dd>
          </div>
          {opening.modality ? (
            <div>
              <dt className="text-[#5b6575]">Modalidad</dt>
              <dd className="font-medium">{opening.modality}</dd>
            </div>
          ) : null}
          {opening.schedule ? (
            <div>
              <dt className="text-[#5b6575]">Horario</dt>
              <dd className="font-medium">{opening.schedule}</dd>
            </div>
          ) : null}
          {program.duration ? (
            <div>
              <dt className="text-[#5b6575]">Duración</dt>
              <dd className="font-medium">{program.duration}</dd>
            </div>
          ) : null}
          {opening.priceComponents.map((component) => (
            <div key={component.kind}>
              <dt className="text-[#5b6575]">{component.label}</dt>
              <dd className="font-medium">{component.formatted}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {program.knowledgeFields.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {program.knowledgeFields.map((field) => (
            <li
              key={field.slug}
              className="rounded-full bg-white px-3 py-1 text-xs text-[#1e3a5f]"
            >
              {field.name}
            </li>
          ))}
        </ul>
      ) : null}
      <TextSection title="Descripción" value={program.description} />
      <TextSection title="Perfil de ingreso" value={program.entryProfile} />
      <TextSection title="Perfil de salida" value={program.exitProfile} />
      <TextSection title="Requisitos" value={program.requirements} />
      <TextSection title="Plan de estudios" value={program.curriculum} />
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
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-[#14263d]">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-[#243044]">
        {value}
      </p>
    </section>
  );
}
