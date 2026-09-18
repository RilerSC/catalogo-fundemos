import type { Metadata } from "next";
import Link from "next/link";
import { ProgramCard } from "@/components/catalog/ProgramCard";
import {
  getCatalogPrograms,
  getKnowledgeFields,
} from "@/lib/catalog/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Oferta académica",
  description:
    "Descubra la oferta académica de Universidad FUNDEPOS. Busque y explore programas por área y tipo.",
};

export default async function HomePage() {
  let programs: Awaited<ReturnType<typeof getCatalogPrograms>> = [];
  let fields: Awaited<ReturnType<typeof getKnowledgeFields>> = [];
  let loadError = false;

  try {
    [programs, fields] = await Promise.all([
      getCatalogPrograms(),
      getKnowledgeFields(),
    ]);
  } catch {
    loadError = true;
  }

  const upcoming = programs.slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="max-w-3xl">
        <p className="text-xs tracking-[0.18em] text-[#8b6b2e] uppercase">
          Universidad FUNDEPOS
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-semibold text-[#14263d] md:text-5xl">
          Encuentre el programa que quiere estudiar
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#5b6575]">
          Explore técnicos, especialistas, grados y posgrados. Busque por tema
          o filtre por tipo de programa.
        </p>
        <form action="/programas" method="get" className="mt-8">
          <label htmlFor="home-search" className="sr-only">
            Buscar programas
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="home-search"
              type="search"
              name="q"
              placeholder="Buscar por programa, área o tipo"
              className="w-full rounded-xl border border-[#ddd6cb] bg-white px-4 py-3"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#14263d] px-5 py-3 text-sm font-medium text-white"
            >
              Buscar
            </button>
          </div>
        </form>
        <p className="mt-4">
          <Link
            href="/programas"
            className="font-medium text-[#1e3a5f] underline"
          >
            Ver todo el catálogo
          </Link>
        </p>
      </section>
      {loadError ? (
        <p className="mt-10 rounded-2xl bg-white p-6 text-[#5b6575]">
          No pudimos cargar el catálogo en este momento. Intente de nuevo más
          tarde.
        </p>
      ) : (
        <>
          <section className="mt-14">
            <h2 className="text-2xl font-semibold text-[#14263d]">
              ¿Sobre qué quiere estudiar?
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <li key={field.slug}>
                  <Link
                    href={`/programas?field=${encodeURIComponent(field.slug)}`}
                    className="block rounded-2xl border border-[#ddd6cb] bg-white px-4 py-4 hover:border-[#8b6b2e]"
                  >
                    {field.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          {upcoming.length > 0 ? (
            <section className="mt-14">
              <h2 className="text-2xl font-semibold text-[#14263d]">
                Próximos inicios
              </h2>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                {upcoming.map((program) => (
                  <li key={program.slug}>
                    <ProgramCard program={program} headingLevel={3} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
