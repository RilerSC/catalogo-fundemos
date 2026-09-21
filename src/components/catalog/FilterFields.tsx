import type { CatalogTaxonomy } from "@/lib/catalog/types";

export function FilterFields({
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
    <div className="space-y-8">
      <FilterGroup
        title="Tipo de programa"
        hint="¿Qué tipo quiere estudiar?"
        selectedCount={typeSlugs.length}
      >
        {academicTypes.map((type) => (
          <FilterOption
            key={type.slug}
            label={type.name}
            checked={typeSlugs.includes(type.slug)}
            onChange={() => onToggleType(type.slug)}
          />
        ))}
      </FilterGroup>
      <FilterGroup
        title="Campo de conocimiento"
        hint="¿Sobre qué quiere estudiar?"
        selectedCount={fieldSlugs.length}
      >
        {knowledgeFields.map((field) => (
          <FilterOption
            key={field.slug}
            label={field.name}
            checked={fieldSlugs.includes(field.slug)}
            onChange={() => onToggleField(field.slug)}
          />
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  title,
  hint,
  selectedCount,
  children,
}: {
  title: string;
  hint: string;
  selectedCount: number;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="flex w-full items-center gap-2 text-[0.7rem] font-semibold tracking-[0.14em] text-navy uppercase">
        {title}
        {selectedCount > 0 ? (
          <span className="rounded-full bg-gold-veil px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-normal text-gold-ink">
            {selectedCount}
          </span>
        ) : null}
      </legend>
      <p className="mt-1.5 text-xs text-muted">{hint}</p>
      <span aria-hidden="true" className="mt-3 block h-px w-8 bg-gold" />
      <ul className="mt-3 space-y-1">{children}</ul>
    </fieldset>
  );
}

function FilterOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label
        className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors ${
          checked
            ? "border-navy/20 bg-gold-veil/60 font-medium text-navy"
            : "border-transparent text-ink hover:border-line hover:bg-paper"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 shrink-0 accent-[var(--brand-navy)]"
        />
        <span>{label}</span>
      </label>
    </li>
  );
}
