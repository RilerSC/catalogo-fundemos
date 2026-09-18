import type { CatalogPriceComponent } from "@/lib/catalog/types";

export function PriceList({
  components,
  layout = "stack",
}: {
  components: CatalogPriceComponent[];
  layout?: "stack" | "rows";
}) {
  if (components.length === 0) {
    return null;
  }

  return (
    <dl
      className={
        layout === "rows"
          ? "grid gap-x-6 gap-y-2 sm:grid-cols-2"
          : "space-y-1"
      }
    >
      {components.map((component) => (
        <div
          key={component.kind}
          className="flex items-baseline justify-between gap-3"
        >
          <dt className="text-sm text-muted">{component.label}</dt>
          <dd className="text-sm font-semibold tabular-nums text-navy">
            {component.formatted}
          </dd>
        </div>
      ))}
    </dl>
  );
}
