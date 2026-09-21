export type AnalyticsConsent = "granted" | "denied" | "unset";

export type InterestSource = "catalog" | "detail" | "interests";

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category: string;
};

export type PageViewEvent = {
  event: "page_view";
  page_location: string;
  page_path: string;
};

export type ViewItemListEvent = {
  event: "view_item_list";
  item_list_id: "catalog";
  item_list_name: "Oferta académica";
  results_count: number;
};

export type SearchEvent = {
  event: "search";
  results_count: number;
  search_term?: string;
};

export type FilterProgramsEvent = {
  event: "filter_programs";
  type_count: number;
  field_count: number;
  results_count: number;
  type_slugs: string[];
  field_slugs: string[];
};

export type SelectItemEvent = {
  event: "select_item";
  item_list_id: "catalog" | "related";
  items: [AnalyticsItem];
};

export type ViewItemEvent = {
  event: "view_item";
  items: [AnalyticsItem];
};

export type AddToWishlistEvent = {
  event: "add_to_wishlist";
  items: [AnalyticsItem];
  interest_count: number;
};

export type RemoveInterestEvent = {
  event: "remove_interest";
  items: [AnalyticsItem];
  interest_count: number;
  source: InterestSource;
};

export type ViewInterestsEvent = {
  event: "view_interests";
  interest_count: number;
};

export type GenerateLeadEvent = {
  event: "generate_lead";
  program_count: number;
  lead_source: "interests";
};

export type AnalyticsEvent =
  | PageViewEvent
  | ViewItemListEvent
  | SearchEvent
  | FilterProgramsEvent
  | SelectItemEvent
  | ViewItemEvent
  | AddToWishlistEvent
  | RemoveInterestEvent
  | ViewInterestsEvent
  | GenerateLeadEvent;

export function toAnalyticsItem(program: {
  slug: string;
  name: string;
  academicType: { name: string };
}): AnalyticsItem {
  return {
    item_id: program.slug,
    item_name: program.name,
    item_category: program.academicType.name,
  };
}
