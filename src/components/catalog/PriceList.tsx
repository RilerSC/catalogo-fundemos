import type { CatalogPriceComponent } from "@/lib/catalog/types";

/**
 * Cada componente de precio se muestra por separado tal como viene del catálogo.
 * No se suman componentes ni se construye un total.
 */
export function PriceList({
  components,
  layout = "stack",
}: {
  components: CatalogPriceComponent[];
  layout?: "stack" | "rows" | "compact";
}) {
  if (components.length === 0) {
    return null;
  }

  if (layout === "compact") {
    return (
      <dl className="space-y-0.5">
        {components.map((component) => (
          <div
            key={component.kind}
            className="flex items-baseline justify-between gap-3"
          >
            <dt className="text-xs text-muted">{component.label}</dt>
            <dd className="text-sm font-semibold text-navy tabular-nums">
              {component.formatted}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  if (layout === "rows") {
    // Pensado para el panel de apertura de la ficha: dos columnas en ancho
    // completo y una sola cuando el panel pasa a la barra lateral.
    return (
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {components.map((component) => (
          <div
            key={component.kind}
            className="rounded-xl border border-line bg-card-subtle px-4 py-3"
          >
            <dt className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted uppercase">
              {component.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold tracking-tight text-navy tabular-nums">
              {component.formatted}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className="space-y-1">
      {components.map((component) => (
        <div
          key={component.kind}
          className="flex items-baseline justify-between gap-3"
        >
          <dt className="text-sm text-muted">{component.label}</dt>
          <dd className="text-sm font-semibold text-navy tabular-nums">
            {component.formatted}
          </dd>
        </div>
      ))}
    </dl>
  );
}
