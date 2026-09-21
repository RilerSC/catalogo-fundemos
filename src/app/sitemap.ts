import type { MetadataRoute } from "next";
import { getCatalogPrograms } from "@/lib/catalog/queries";
import { absoluteUrl } from "@/lib/seo/siteUrl";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicPrograms = await getCatalogPrograms({ preview: false });

  return [
    { url: absoluteUrl("/") },
    ...publicPrograms.map((program) => ({
      url: absoluteUrl(`/programas/${program.slug}`),
    })),
  ];
}
