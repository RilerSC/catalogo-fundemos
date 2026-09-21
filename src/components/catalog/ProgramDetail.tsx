import Image from "next/image";
import Link from "next/link";
import { PriceList } from "@/components/catalog/PriceList";
import { ProgramCard } from "@/components/catalog/ProgramCard";
import { InterestToggle } from "@/components/interests/InterestToggle";
import type {
  CatalogProgramCard,
  CatalogProgramDetail,
} from "@/lib/catalog/types";

export function ProgramDetail({
  program,
  related,
}: {
  program: CatalogProgramDetail;
  related: CatalogProgramCard[];
}) {
  const opening = program.opening;
  const prices = opening?.priceComponents ?? [];
  const hasOpening = Boolean(opening || program.duration || prices.length > 0);
  const hasDescription = Boolean(program.description?.trim());
  const hasEntry = Boolean(program.entryProfile?.trim());
  const hasExit = Boolean(program.exitProfile?.trim());
  const hasProfile = hasEntry || hasExit;
  const hasRequirements = Boolean(program.requirements?.trim());
  const hasCurriculum = Boolean(program.curriculum?.trim());
  const hasComplementary = Boolean(program.complementaryInfo?.trim());

  const toc = [
    hasDescription ? { href: "#descripcion", label: "Descripción" } : null,
    hasProfile ? { href: "#perfil", label: "Perfil" } : null,
    hasRequirements ? { href: "#requisitos", label: "Requisitos" } : null,
    hasCurriculum ? { href: "#plan-de-estudios", label: "Plan de estudios" } : null,
    hasComplementary
      ? { href: "#informacion-complementaria", label: "Información complementaria" }
      : null,
    hasOpening ? { href: "#apertura", label: "Apertura / inversión" } : null,
  ].filter((item): item is { href: string; label: string } => item !== null);

  return (
    <article className="pb-24 lg:pb-0">
      <header className="on-navy relative overflow-hidden bg-navy text-white">
        <Image
          src="/branding/fundepos-roseta-blanca.png"
          alt=""
          width={512}
          height={553}
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 hidden h-[26rem] w-auto opacity-[0.06] lg:block"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-12">
          <nav aria-label="Migas de pan" className="text-sm">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white/70">
              <li>
                <Link href="/" className="transition-colors hover:text-gold">
                  Catálogo
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="min-w-0 text-white">{program.name}</li>
            </ol>
          </nav>
          <p className="mt-7 text-[0.68rem] font-semibold tracking-[0.2em] text-gold uppercase">
            {program.academicType.name}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.12] font-semibold tracking-tight break-words text-balance md:text-[2.7rem]">
            {program.name}
          </h1>
          {program.shortDescription ? (
            <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-white/75">
              {program.shortDescription}
            </p>
          ) : null}
          {program.knowledgeFields.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {program.knowledgeFields.map((field) => (
                <li
                  key={field.slug}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/85"
                >
                  {field.name}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      {toc.length > 1 ? (
        <nav
          aria-label="Contenido de la ficha"
          className="border-b border-line bg-card"
        >
          <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap">
            {toc.map((item) => (
              <li key={item.href} className="shrink-0">
                <a
                  href={item.href}
                  className="inline-flex min-h-10 items-center rounded-full border border-line px-3 text-sm text-navy-soft hover:border-navy-soft/40 hover:text-navy"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {hasOpening ? (
          <aside className="lg:order-2">
            <div
              id="apertura"
              className="overflow-hidden rounded-2xl border border-line bg-card lg:sticky lg:top-24"
            >
              <span aria-hidden="true" className="block h-0.5 bg-gold" />
              <div className="p-5">
                <h2 className="text-[0.7rem] font-semibold tracking-[0.16em] text-navy uppercase">
                  Apertura
                </h2>
                {opening || program.duration ? (
                  <dl className="mt-4 space-y-3 text-sm">
                    {opening ? (
                      <SummaryRow
                        label="Inicio"
                        value={opening.startDateLabel}
                      />
                    ) : null}
                    {opening?.modality ? (
                      <SummaryRow label="Modalidad" value={opening.modality} />
                    ) : null}
                    {opening?.schedule ? (
                      <SummaryRow label="Horario" value={opening.schedule} />
                    ) : null}
                    {program.duration ? (
                      <SummaryRow label="Duración" value={program.duration} />
                    ) : null}
                  </dl>
                ) : null}
                {prices.length > 0 ? (
                  <div className="mt-5 border-t border-line pt-5">
                    <PriceList components={prices} layout="rows" />
                  </div>
                ) : null}
                <div className="mt-5 hidden lg:block">
                  <InterestToggle
                    programId={program.id}
                    programName={program.name}
                    variant="default"
                    block
                  />
                </div>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="hidden lg:order-2 lg:block">
            <InterestToggle
              programId={program.id}
              programName={program.name}
              variant="default"
              block
            />
          </aside>
        )}

        <div className="lg:order-1">
          {hasDescription ? (
            <section id="descripcion">
              <div className="max-w-prose space-y-5 text-[1.05rem] leading-8 text-ink">
                {toParagraphs(program.description ?? "").map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ) : null}
          {hasProfile ? (
            <section id="perfil" className="mt-12 max-w-prose">
              <SectionHeading title="Perfil" />
              {hasEntry ? (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-navy">
                    Perfil de ingreso
                  </h3>
                  <ProseBlocks value={program.entryProfile} />
                </div>
              ) : null}
              {hasExit ? (
                <div className={hasEntry ? "mt-8" : "mt-4"}>
                  <h3 className="text-sm font-semibold text-navy">
                    Perfil de salida
                  </h3>
                  <ProseBlocks value={program.exitProfile} />
                </div>
              ) : null}
            </section>
          ) : null}
          <TextSection
            id="requisitos"
            title="Requisitos"
            value={program.requirements}
          />
          <CurriculumSection value={program.curriculum} />
          <TextSection
            id="informacion-complementaria"
            title="Información complementaria"
            value={program.complementaryInfo}
          />
        </div>
      </div>

      {related.length > 0 ? (
        <section
          aria-labelledby="programas-relacionados"
          className="mx-auto max-w-6xl px-4 pb-12"
        >
          <span aria-hidden="true" className="block h-px w-10 bg-gold" />
          <h2
            id="programas-relacionados"
            className="mt-3 font-serif text-2xl font-semibold tracking-tight text-navy"
          >
            Programas relacionados
          </h2>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Programas visibles con campos de conocimiento o tipo académico en
            común.
          </p>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <li key={item.id} className="min-w-0">
                <ProgramCard program={item} headingLevel={3} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <InterestToggle
          programId={program.id}
          programName={program.name}
          variant="default"
          block
        />
      </div>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium text-navy">{value}</dd>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <>
      <span aria-hidden="true" className="block h-px w-10 bg-gold" />
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-navy">
        {title}
      </h2>
    </>
  );
}

function ProseBlocks({ value }: { value: string | null }) {
  if (!value?.trim()) {
    return null;
  }
  return (
    <div className="mt-2 space-y-4 text-[0.98rem] leading-8 text-ink">
      {toParagraphs(value).map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function TextSection({
  id,
  title,
  value,
}: {
  id: string;
  title: string;
  value: string | null;
}) {
  if (!value?.trim()) {
    return null;
  }
  return (
    <section id={id} className="mt-12 max-w-prose">
      <SectionHeading title={title} />
      <ProseBlocks value={value} />
    </section>
  );
}

const BULLET_LINE = /^\s*([-•*·—]|\d+[.)])\s+/;

/**
 * Los textos provienen de hojas en PDF y traen saltos de línea duros a mitad de
 * frase. Para lectura se recomponen los párrafos (bloques separados por línea en
 * blanco) sin tocar el dato; si el bloque tiene viñetas, el salto sí es
 * significativo y se conserva.
 */
function toParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length === 0) {
        return "";
      }
      return lines.some((line) => BULLET_LINE.test(line))
        ? lines.join("\n")
        : lines.join(" ");
    })
    .filter(Boolean);
}

/**
 * Los planes de estudio llegan como texto plano del catálogo.
 * Solo se reconocen los encabezados exactos de cuatrimestre ("I CUATRIMESTRE", …)
 * para dar ritmo visual: el resto del contenido se respeta tal cual, sin inferir
 * materias, créditos ni requisitos.
 */
const QUARTER_HEADING = /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\s+CUATRIMESTRE$/;
const TABLE_HEADING = "CÓDIGO MATERIA REQUISITOS CRÉDITOS";

type CurriculumBlock = { title: string | null; body: string };

function splitCurriculum(value: string): CurriculumBlock[] {
  const blocks: CurriculumBlock[] = [];
  let title: string | null = null;
  let body: string[] = [];

  const flush = () => {
    const text = body.join("\n").trim();
    if (title !== null || text) {
      blocks.push({ title, body: text });
    }
  };

  for (const line of value.split("\n")) {
    if (QUARTER_HEADING.test(line.trim())) {
      flush();
      title = line.trim();
      body = [];
      continue;
    }
    body.push(line);
  }
  flush();

  return blocks;
}

function CurriculumSection({ value }: { value: string | null }) {
  if (!value?.trim()) {
    return null;
  }

  const blocks = splitCurriculum(value);
  const structured = blocks.filter((block) => block.title !== null);

  return (
    <section id="plan-de-estudios" className="mt-12 max-w-prose">
      <SectionHeading title="Plan de estudios" />
      {structured.length === 0 ? (
        <div className="mt-4 text-[0.98rem] leading-8 text-ink whitespace-pre-wrap">
          {value}
        </div>
      ) : (
        <ol className="mt-6 space-y-6">
          {blocks.map((block, index) =>
            block.title === null && !block.body ? null : (
              <li
                key={`${block.title ?? "intro"}-${index}`}
                className={
                  block.title === null
                    ? ""
                    : "border-l-2 border-gold/70 pl-4 md:pl-5"
                }
              >
                {block.title ? (
                  <h3 className="text-[0.7rem] font-semibold tracking-[0.16em] text-navy-soft uppercase">
                    {block.title}
                  </h3>
                ) : null}
                <CurriculumBody text={block.body} hasTitle={Boolean(block.title)} />
              </li>
            ),
          )}
        </ol>
      )}
    </section>
  );
}

function CurriculumBody({
  text,
  hasTitle,
}: {
  text: string;
  hasTitle: boolean;
}) {
  if (!text) {
    return null;
  }

  const lines = text.split("\n");
  const leadIsTableHeading = lines[0]?.trim() === TABLE_HEADING;
  const rest = leadIsTableHeading ? lines.slice(1).join("\n").trim() : text;

  return (
    <>
      {leadIsTableHeading ? (
        <p className="mt-2 text-[0.68rem] font-semibold tracking-[0.12em] text-muted uppercase">
          {TABLE_HEADING}
        </p>
      ) : null}
      {rest ? (
        <div
          className={`${hasTitle || leadIsTableHeading ? "mt-2" : "mt-4"} text-[0.98rem] leading-8 text-ink whitespace-pre-wrap`}
        >
          {rest}
        </div>
      ) : null}
    </>
  );
}
