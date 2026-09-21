import type { Metadata } from "next";
import { InterestsView } from "@/components/interests/InterestsView";
import { getCatalogPrograms } from "@/lib/catalog/queries";
import { pageRobots } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    title: "Mis programas de interés",
    description:
      "Consulte los programas de Universidad FUNDEPOS que marcó de interés en este navegador.",
    robots: pageRobots(false),
  };
}

export default async function InteresesPage() {
  let programs: Awaited<ReturnType<typeof getCatalogPrograms>> = [];
  let loadError = false;

  try {
    programs = await getCatalogPrograms();
  } catch {
    loadError = true;
  }

  return (
    <main className="flex-1">
      <InterestsView programs={programs} loadError={loadError} />
    </main>
  );
}
