export type CatalogTaxonomy = {
  slug: string;
  name: string;
};

export type CatalogPriceComponent = {
  kind: "enrollment" | "program" | "subject" | "investment";
  label: string;
  amount: string;
  currency: string;
  formatted: string;
};

export type CatalogOpening = {
  startDate: string;
  startDateLabel: string;
  modality: string | null;
  schedule: string | null;
  priceComponents: CatalogPriceComponent[];
};

export type CatalogProgramCard = {
  id: string;
  slug: string;
  name: string;
  academicType: CatalogTaxonomy;
  knowledgeFields: CatalogTaxonomy[];
  shortDescription: string | null;
  duration: string | null;
  opening: CatalogOpening | null;
};

export type CatalogProgramDetail = CatalogProgramCard & {
  description: string | null;
  entryProfile: string | null;
  exitProfile: string | null;
  requirements: string | null;
  curriculum: string | null;
  complementaryInfo: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type CatalogFilters = {
  query: string;
  typeSlugs: string[];
  fieldSlugs: string[];
};
