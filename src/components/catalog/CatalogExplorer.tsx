"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilterDrawer } from "@/components/catalog/FilterDrawer";
import { FilterFields } from "@/components/catalog/FilterFields";
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
const RESULT_ANNOUNCE_MS = 400;

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState({
    typeSlugs: urlFilters.typeSlugs,
    fieldSlugs: urlFilters.fieldSlugs,
  });
  const [announcedCount, setAnnouncedCount] = useState(
    applyCatalogFilters(programs, urlFilters).length,
  );

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
  const activeFilterCount =
    filters.typeSlugs.length + filters.fieldSlugs.length;
  const hasFilters = Boolean(filters.query || activeFilterCount);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncedCount(visiblePrograms.length);
    }, RESULT_ANNOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [visiblePrograms.length]);

  const draftPreviewCount = useMemo(
    () =>
      applyCatalogFilters(programs, {
        query: filters.query,
        typeSlugs: draft.typeSlugs,
        fieldSlugs: draft.fieldSlugs,
      }).length,
    [programs, filters.query, draft],
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

  const filterHandlers = {
    onToggleType: (slug: string) =>
      applyFilters(
        (current) => ({
          ...current,
          typeSlugs: toggleValue(current.typeSlugs, slug),
        }),
        "now",
      ),
    onToggleField: (slug: string) =>
      applyFilters(
        (current) => ({
          ...current,
          fieldSlugs: toggleValue(current.fieldSlugs, slug),
        }),
        "now",
      ),
  };

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  function openDrawer() {
    setDraft({
      typeSlugs: filters.typeSlugs,
      fieldSlugs: filters.fieldSlugs,
    });
    setDrawerOpen(true);
  }

  function applyDrawer() {
    applyFilters(
      (current) => ({
        ...current,
        typeSlugs: draft.typeSlugs,
        fieldSlugs: draft.fieldSlugs,
      }),
      "now",
    );
    setDrawerOpen(false);
  }

  return (
    <div>
      <div className="rounded-2xl border border-line bg-card p-3 shadow-[0_14px_40px_rgba(15,30,61,0.10)] md:p-4">
        <label className="flex items-center gap-3 rounded-xl border border-line bg-card-subtle px-4 py-3 transition-colors focus-within:border-navy focus-within:bg-card md:px-5 md:py-3.5">
          <SearchIcon />
          <span className="sr-only">Buscar programas</span>
          <input
            type="search"
            name="q"
            value={filters.query}
            onChange={(event) => {
              const query = event.target.value;
              applyFilters((current) => ({ ...current, query }), "debounce");
            }}
            placeholder="Riesgos, dirección, inteligencia artificial…"
            className="w-full min-w-0 bg-transparent text-base text-navy outline-none placeholder:text-muted/85"
          />
        </label>
      </div>

      <ExploreFields
        fields={knowledgeFields}
        selected={filters.fieldSlugs}
        onToggle={filterHandlers.onToggleField}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7.5rem)] overflow-y-auto rounded-2xl border border-line bg-card p-5">
            <FilterFields
              academicTypes={academicTypes}
              knowledgeFields={knowledgeFields}
              typeSlugs={filters.typeSlugs}
              fieldSlugs={filters.fieldSlugs}
              {...filterHandlers}
            />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-3 border-b border-line pb-3">
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-strong bg-card px-3 text-sm font-semibold text-navy lg:hidden"
              aria-expanded={drawerOpen}
              aria-controls="catalog-filter-drawer"
              onClick={openDrawer}
            >
              Filtros
              {activeFilterCount > 0 ? (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-navy px-1.5 text-xs font-semibold text-gold">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
            <p className="text-sm text-muted" aria-hidden="true">
              <span className="font-serif text-xl font-semibold text-navy tabular-nums">
                {visiblePrograms.length}
              </span>{" "}
              {visiblePrograms.length === 1 ? "programa" : "programas"}
            </p>
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {announcedCount}{" "}
              {announcedCount === 1 ? "programa" : "programas"}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => applyFilters(() => EMPTY_FILTERS, "now")}
                className="ml-auto inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-navy-soft transition-colors hover:bg-paper hover:text-navy"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
          {activeFilterCount > 0 || filters.query.trim() ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {filters.query.trim() ? (
                <li>
                  <FilterChip
                    label={`Búsqueda: ${filters.query.trim()}`}
                    onRemove={() =>
                      applyFilters(
                        (current) => ({ ...current, query: "" }),
                        "now",
                      )
                    }
                  />
                </li>
              ) : null}
              {filters.typeSlugs.map((slug) => {
                const type = academicTypes.find((item) => item.slug === slug);
                if (!type) {
                  return null;
                }
                return (
                  <li key={`type-${slug}`}>
                    <FilterChip
                      label={type.name}
                      onRemove={() => filterHandlers.onToggleType(slug)}
                    />
                  </li>
                );
              })}
              {filters.fieldSlugs.map((slug) => {
                const field = knowledgeFields.find((item) => item.slug === slug);
                if (!field) {
                  return null;
                }
                return (
                  <li key={`field-${slug}`}>
                    <FilterChip
                      label={field.name}
                      onRemove={() => filterHandlers.onToggleField(slug)}
                    />
                  </li>
                );
              })}
            </ul>
          ) : null}
          {visiblePrograms.length === 0 ? (
            <EmptyResults
              query={filters.query}
              typeNames={filters.typeSlugs
                .map((slug) => academicTypes.find((item) => item.slug === slug)?.name)
                .filter((name): name is string => Boolean(name))}
              fieldNames={filters.fieldSlugs
                .map(
                  (slug) =>
                    knowledgeFields.find((item) => item.slug === slug)?.name,
                )
                .filter((name): name is string => Boolean(name))}
              onClear={() => applyFilters(() => EMPTY_FILTERS, "now")}
            />
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visiblePrograms.map((program) => (
                <li key={program.slug} className="min-w-0">
                  <ProgramCard program={program} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <FilterDrawer
          open={drawerOpen}
          academicTypes={academicTypes}
          knowledgeFields={knowledgeFields}
          draft={draft}
          previewCount={draftPreviewCount}
          onToggleType={(slug) =>
            setDraft((current) => ({
              ...current,
              typeSlugs: toggleValue(current.typeSlugs, slug),
            }))
          }
          onToggleField={(slug) =>
            setDraft((current) => ({
              ...current,
              fieldSlugs: toggleValue(current.fieldSlugs, slug),
            }))
          }
          onClear={() => setDraft({ typeSlugs: [], fieldSlugs: [] })}
          onApply={applyDrawer}
          onClose={closeDrawer}
        />
      </div>
    </div>
  );
}

function ExploreFields({
  fields,
  selected,
  onToggle,
}: {
  fields: CatalogTaxonomy[];
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  if (fields.length === 0) {
    return null;
  }

  return (
    <section className="mt-7" aria-labelledby="explorar-por-campo">
      <h2
        id="explorar-por-campo"
        className="text-[0.7rem] font-semibold tracking-[0.16em] text-navy uppercase"
      >
        Explorar por campo
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {fields.map((field) => {
          const active = selected.includes(field.slug);
          return (
            <li key={field.slug}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(field.slug)}
                className={`inline-flex min-h-11 items-center rounded-full border px-3.5 text-left text-sm transition-colors ${
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-card text-navy hover:border-navy-soft/40 hover:bg-paper"
                }`}
              >
                {field.name}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function EmptyResults({
  query,
  typeNames,
  fieldNames,
  onClear,
}: {
  query: string;
  typeNames: string[];
  fieldNames: string[];
  onClear: () => void;
}) {
  const parts = [
    query.trim() ? `«${query.trim()}»` : null,
    ...typeNames,
    ...fieldNames,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="mt-8 rounded-2xl border border-line bg-card px-6 py-14 text-center">
      <span aria-hidden="true" className="mx-auto block h-px w-12 bg-gold" />
      <p className="mt-5 font-serif text-xl font-semibold text-navy">
        No hay programas para esta combinación.
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        {parts.length > 0
          ? `No encontramos resultados para ${parts.join(" · ")}. Ajuste la búsqueda o quite algún filtro.`
          : "Pruebe otra búsqueda o quite alguno de los filtros activos."}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-deep"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="size-5 shrink-0 text-navy-soft"
    >
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m13.5 13.5 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="group inline-flex min-h-9 items-center gap-2 rounded-full border border-line-strong bg-card py-1 pr-2 pl-3 text-xs font-medium text-navy transition-colors hover:border-brand-red/45 hover:text-brand-red"
    >
      {label}
      <span
        aria-hidden="true"
        className="inline-flex size-4 items-center justify-center rounded-full bg-paper text-[0.7rem] text-muted group-hover:bg-brand-red/10 group-hover:text-brand-red"
      >
        ×
      </span>
      <span className="sr-only">Quitar filtro</span>
    </button>
  );
}
