"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ProgramCard } from "@/components/catalog/ProgramCard";
import {
  useInterestActions,
  useInterestIds,
} from "@/components/interests/useInterests";
import { LeadRequestForm } from "@/components/leads/LeadRequestForm";
import type { CatalogProgramCard } from "@/lib/catalog/types";

type InterestsViewProps = {
  programs: CatalogProgramCard[];
  loadError?: boolean;
};

export function InterestsView({ programs, loadError }: InterestsViewProps) {
  const ids = useInterestIds();
  const { clear, prune } = useInterestActions();

  useEffect(() => {
    if (loadError) {
      return;
    }
    prune(programs.map((program) => program.id));
  }, [loadError, prune, programs]);

  const selected = useMemo(() => {
    const byId = new Map(programs.map((program) => [program.id, program]));
    const seen = new Set<string>();
    const result: CatalogProgramCard[] = [];

    for (const id of ids) {
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);
      const program = byId.get(id);
      if (program) {
        result.push(program);
      }
    }

    return result;
  }, [ids, programs]);

  return (
    <>
      <section className="on-navy relative overflow-hidden bg-navy text-white">
        <Image
          src="/branding/fundepos-roseta-blanca.png"
          alt=""
          width={512}
          height={553}
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 hidden h-72 w-auto opacity-[0.07] md:block"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-9 md:py-12">
          <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-gold uppercase">
            Selección guardada en este navegador
          </p>
          <h1 className="mt-3 font-serif text-[2rem] leading-tight font-semibold tracking-tight md:text-[2.5rem]">
            Mis programas de interés
          </h1>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/75">
            Aquí quedan los programas que marcó mientras exploraba el catálogo.
            Puede abrir cada ficha o quitarlos cuando quiera.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-12">
        {loadError ? (
          <p className="rounded-2xl border border-line bg-card p-6 text-muted">
            No pudimos cargar los programas en este momento. Intente de nuevo
            más tarde.
          </p>
        ) : selected.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <p className="text-sm text-muted">
                <span className="font-serif text-xl font-semibold text-navy tabular-nums">
                  {selected.length}
                </span>{" "}
                {selected.length === 1
                  ? "programa guardado"
                  : "programas guardados"}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Quitar todos los programas de interés de este navegador?",
                    )
                  ) {
                    clear();
                  }
                }}
                className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-navy-soft transition-colors hover:bg-paper hover:text-navy"
              >
                Limpiar intereses
              </button>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Revise las fichas, quite programas o solicite información sobre la
              selección actual.
            </p>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {selected.map((program) => (
                <li key={program.id} className="min-w-0">
                  <ProgramCard program={program} interestAction="remove" />
                </li>
              ))}
            </ul>
            <LeadRequestForm
              programIds={selected.map((program) => program.id)}
              programCount={selected.length}
            />
          </>
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-line bg-card px-6 py-16 text-center">
      <Image
        src="/branding/fundepos-roseta.png"
        alt=""
        width={512}
        height={553}
        aria-hidden="true"
        className="mx-auto h-14 w-auto opacity-25"
      />
      <p className="mt-6 font-serif text-2xl font-semibold text-navy">
        Aún no ha agregado programas de interés.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        Explore la oferta académica y marque los programas que quiera comparar o
        consultar después. Se guardarán en este navegador.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-deep"
      >
        Explorar programas
      </Link>
    </div>
  );
}
