export type CatalogTaxonomy = {
  slug: string;
  name: string;
};

export type CatalogOpening = {
  startDate: string;
  startDateLabel: string;
  modality: string | null;
  schedule: string | null;
  priceAmount: string | null;
  priceCurrency: string | null;
  priceLabel: string | null;
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
