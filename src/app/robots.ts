import type { MetadataRoute } from "next";
import { isCatalogPreview } from "@/lib/catalog/visibility";
import { absoluteUrl } from "@/lib/seo/siteUrl";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (isCatalogPreview()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
