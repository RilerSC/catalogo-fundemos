import type { CatalogProgramCard } from "@/lib/catalog/types";

const RELATED_LIMIT = 3;

/**
 * Relacionados por taxonomía, sin ponderaciones arbitrarias.
 * 1. más campos de conocimiento compartidos;
 * 2. mismo tipo académico como desempate;
 * 3. nombre en español para un orden estable.
 * Solo recibe programas ya visibles (preview/producción) y excluye el actual.
 */
export function relatedCatalogPrograms(
  current: Pick<CatalogProgramCard, "id" | "academicType" | "knowledgeFields">,
  catalog: CatalogProgramCard[],
  limit = RELATED_LIMIT,
): CatalogProgramCard[] {
  const currentFields = new Set(current.knowledgeFields.map((field) => field.slug));

  return catalog
    .filter((program) => program.id !== current.id)
    .map((program) => {
      const sharedFields = program.knowledgeFields.filter((field) =>
        currentFields.has(field.slug),
      ).length;
      const sameType = program.academicType.slug === current.academicType.slug ? 1 : 0;
      return { program, sharedFields, sameType };
    })
    .filter((item) => item.sharedFields > 0 || item.sameType > 0)
    .sort((left, right) => {
      if (right.sharedFields !== left.sharedFields) {
        return right.sharedFields - left.sharedFields;
      }
      if (right.sameType !== left.sameType) {
        return right.sameType - left.sameType;
      }
      return left.program.name.localeCompare(right.program.name, "es");
    })
    .slice(0, limit)
    .map((item) => item.program);
}
