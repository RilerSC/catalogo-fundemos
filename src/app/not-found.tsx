import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-16">
      <h1 className="text-3xl font-semibold text-navy">
        Página no encontrada
      </h1>
      <p className="mt-3 text-muted">
        El programa o la ruta que busca no existe en el catálogo.
      </p>
      <p className="mt-6">
        <Link href="/" className="font-medium text-navy-soft underline">
          Volver al catálogo
        </Link>
      </p>
    </main>
  );
}
