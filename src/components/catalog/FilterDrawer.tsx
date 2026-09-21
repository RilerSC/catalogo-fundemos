"use client";

import { useEffect, useId, useRef } from "react";
import { FilterFields } from "@/components/catalog/FilterFields";
import type { CatalogTaxonomy } from "@/lib/catalog/types";

type DraftFilters = {
  typeSlugs: string[];
  fieldSlugs: string[];
};

type FilterDrawerProps = {
  open: boolean;
  academicTypes: CatalogTaxonomy[];
  knowledgeFields: CatalogTaxonomy[];
  draft: DraftFilters;
  previewCount: number;
  onToggleType: (slug: string) => void;
  onToggleField: (slug: string) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
};

function focusableElements(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((element) => !element.hasAttribute("disabled") && !element.hidden);
}

export function FilterDrawer({
  open,
  academicTypes,
  knowledgeFields,
  draft,
  previewCount,
  onToggleType,
  onToggleField,
  onClear,
  onApply,
  onClose,
}: FilterDrawerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) {
        return;
      }
      const items = focusableElements(dialog);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 bg-navy/45"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        id="catalog-filter-drawer"
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 flex max-h-[min(92dvh,40rem)] flex-col rounded-t-2xl border border-line bg-card shadow-[0_-12px_40px_rgba(15,30,61,0.18)] outline-none"
      >
        <span aria-hidden="true" className="block h-0.5 rounded-t-2xl bg-gold" />
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 id={titleId} className="font-serif text-lg font-semibold text-navy">
            Filtros
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-navy-soft hover:bg-paper hover:text-navy"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-lg text-navy-soft hover:bg-paper hover:text-navy"
              aria-label="Cerrar filtros"
            >
              ×
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <FilterFields
            academicTypes={academicTypes}
            knowledgeFields={knowledgeFields}
            typeSlugs={draft.typeSlugs}
            fieldSlugs={draft.fieldSlugs}
            onToggleType={onToggleType}
            onToggleField={onToggleField}
          />
        </div>
        <div className="border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onApply}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-navy text-sm font-semibold text-white hover:bg-navy-deep"
          >
            Ver {previewCount} {previewCount === 1 ? "programa" : "programas"}
          </button>
        </div>
      </div>
    </div>
  );
}
