"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProgramCard } from "@/components/catalog/ProgramCard";
import {
  applyCatalogFilters,
  catalogQueryString,
  parseCatalogSearchParams,
} from "@/lib/catalog/search";
import type {
  CatalogFilters,
  CatalogProgramCard,
  CatalogTaxonomy,
} from "@/lib/catalog/types";

type CatalogExplorerProps = {
  programs: CatalogProgramCard[];
  academicTypes: CatalogTaxonomy[];
  knowledgeFields: CatalogTaxonomy[];
  urlFilters: CatalogFilters;
};

const SEARCH_URL_SYNC_MS = 200;

const EMPTY_FILTERS: CatalogFilters = {
  query: "",
  typeSlugs: [],
  fieldSlugs: [],
};

export function CatalogExplorer({
  programs,
  academicTypes,
  knowledgeFields,
  urlFilters,
}: CatalogExplorerProps) {
  const pathname = usePathname();
  const [filters, setFilters] = useState<CatalogFilters>(urlFilters);
  const filtersRef = useRef(urlFilters);
  const urlSyncTimer = useRef<number | null>(null);

  useEffect(() => {
    function onPopState() {
      const next = parseCatalogSearchParams(
        new URLSearchParams(window.location.search),
      );
      filtersRef.current = next;
      setFilters(next);
    }
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (urlSyncTimer.current !== null) {
        window.clearTimeout(urlSyncTimer.current);
      }
    };
  }, []);

  const visiblePrograms = useMemo(
    () => applyCatalogFilters(programs, filters),
    [programs, filters],
  );
  const hasFilters = Boolean(
    filters.query || filters.typeSlugs.length || filters.fieldSlugs.length,
  );

  function syncUrl(next: CatalogFilters) {
    const href = `${pathname}${catalogQueryString(next)}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (href === current) {
      return;
    }
    // History API keeps the URL shareable without App Router navigation,
    // so CatalogScreen does not refetch Neon on each interaction.
    window.history.replaceState(null, "", href);
  }

  function applyFilters(
    patch: (current: CatalogFilters) => CatalogFilters,
    url: "now" | "debounce",
  ) {
    const next = patch(filtersRef.current);
    filtersRef.current = next;
    setFilters(next);
    if (urlSyncTimer.current !== null) {
      window.clearTimeout(urlSyncTimer.current);
      urlSyncTimer.current = null;
    }
    if (url === "debounce") {
      urlSyncTimer.current = window.setTimeout(() => {
        syncUrl(next);
        urlSyncTimer.current = null;
      }, SEARCH_URL_SYNC_MS);
      return;
    }
    syncUrl(next);
  }

  function toggleValue(values: string[], slug: string): string[] {
    return values.includes(slug)
      ? values.filter((value) => value !== slug)
      : [...values, slug];
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside>
        <details className="rounded-2xl border border-[#ddd6cb] bg-white p-4 lg:hidden">
          <summary className="cursor-pointer font-medium text-[#14263d]">
            Filtros
          </summary>
          <div className="mt-4">
            <FilterFields
              academicTypes={academicTypes}
              knowledgeFields={knowledgeFields}
              typeSlugs={filters.typeSlugs}
              fieldSlugs={filters.fieldSlugs}
              onToggleType={(slug) =>
                applyFilters(
                  (current) => ({
                    ...current,
                    typeSlugs: toggleValue(current.typeSlugs, slug),
                  }),
                  "now",
                )
              }
              onToggleField={(slug) =>
                applyFilters(
                  (current) => ({
                    ...current,
                    fieldSlugs: toggleValue(current.fieldSlugs, slug),
                  }),
                  "now",
                )
              }
            />
          </div>
        </details>
        <div className="hidden lg:block">
          <FilterFields
            academicTypes={academicTypes}
            knowledgeFields={knowledgeFields}
            typeSlugs={filters.typeSlugs}
            fieldSlugs={filters.fieldSlugs}
            onToggleType={(slug) =>
              applyFilters(
                (current) => ({
                  ...current,
                  typeSlugs: toggleValue(current.typeSlugs, slug),
                }),
                "now",
              )
            }
            onToggleField={(slug) =>
              applyFilters(
                (current) => ({
                  ...current,
                  fieldSlugs: toggleValue(current.fieldSlugs, slug),
                }),
                "now",
              )
            }
          />
        </div>
      </aside>
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="block min-w-0 flex-1">
            <span className="mb-1 block text-sm font-medium text-[#14263d]">
              Buscar programas
            </span>
            <input
              type="search"
              name="q"
              value={filters.query}
              onChange={(event) => {
                const query = event.target.value;
                applyFilters((current) => ({ ...current, query }), "debounce");
              }}
              placeholder="Ej. riesgos, dirección, inteligencia artificial"
              className="w-full rounded-xl border border-[#ddd6cb] bg-white px-3 py-2.5 text-[#14263d]"
            />
          </label>
          <p className="text-sm text-[#5b6575]">
            {visiblePrograms.length}{" "}
            {visiblePrograms.length === 1 ? "programa" : "programas"}
          </p>
        </div>
        {hasFilters ? (
          <p className="mt-3">
            <button
              type="button"
              onClick={() => applyFilters(() => EMPTY_FILTERS, "now")}
              className="text-sm font-medium text-[#1e3a5f] underline"
            >
              Limpiar filtros
            </button>
          </p>
        ) : null}
        {visiblePrograms.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#ddd6cb] bg-white p-8 text-center">
            <p className="text-lg font-medium text-[#14263d]">
              No encontramos programas con estos filtros.
            </p>
            <button
              type="button"
              onClick={() => applyFilters(() => EMPTY_FILTERS, "now")}
              className="mt-4 rounded-full bg-[#14263d] px-4 py-2 text-sm text-white"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {visiblePrograms.map((program) => (
              <li key={program.slug}>
                <ProgramCard program={program} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterFields({
  academicTypes,
  knowledgeFields,
  typeSlugs,
  fieldSlugs,
  onToggleType,
  onToggleField,
}: {
  academicTypes: CatalogTaxonomy[];
  knowledgeFields: CatalogTaxonomy[];
  typeSlugs: string[];
  fieldSlugs: string[];
  onToggleType: (slug: string) => void;
  onToggleField: (slug: string) => void;
}) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold text-[#14263d]">
          ¿Qué tipo de programa quiero estudiar?
        </legend>
        <ul className="mt-3 space-y-2">
          {academicTypes.map((type) => (
            <li key={type.slug}>
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={typeSlugs.includes(type.slug)}
                  onChange={() => onToggleType(type.slug)}
                  className="mt-0.5"
                />
                <span>{type.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold text-[#14263d]">
          ¿Sobre qué quiero estudiar?
        </legend>
        <ul className="mt-3 space-y-2">
          {knowledgeFields.map((field) => (
            <li key={field.slug}>
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={fieldSlugs.includes(field.slug)}
                  onChange={() => onToggleField(field.slug)}
                  className="mt-0.5"
                />
                <span>{field.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
