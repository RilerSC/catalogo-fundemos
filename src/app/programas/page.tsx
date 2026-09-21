import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function catalogDestination(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && value.length > 0) {
      query.append(key, value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (item) {
          query.append(key, item);
        }
      }
    }
  }
  const suffix = query.toString();
  return suffix ? `/?${suffix}` : "/";
}

export default async function ProgramasAliasPage({ searchParams }: PageProps) {
  permanentRedirect(catalogDestination(await searchParams));
}
