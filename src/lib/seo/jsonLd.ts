import { absoluteUrl } from "@/lib/seo/siteUrl";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Universidad FUNDEPOS",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/branding/fundepos-logo.png"),
  };
}

export function breadcrumbListJsonLd(input: {
  programName: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Catálogo",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: input.programName,
        item: absoluteUrl(`/programas/${input.slug}`),
      },
    ],
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
