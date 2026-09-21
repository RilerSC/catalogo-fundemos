import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-20">
      <span aria-hidden="true" className="block h-px w-10 bg-gold" />
      <h1 className="mt-4 font-serif text-3xl font-semibold text-navy">
        Página no encontrada
      </h1>
      <p className="mt-3 leading-relaxed text-muted">
        El programa o la ruta que busca no existe en el catálogo.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-deep"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}
