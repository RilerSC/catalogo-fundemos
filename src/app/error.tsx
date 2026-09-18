"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-16">
      <h1 className="text-2xl font-semibold text-navy">
        No pudimos cargar esta página
      </h1>
      <p className="mt-3 text-muted">
        Intente de nuevo. Si el problema continúa, vuelva más tarde.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 min-h-11 rounded-full bg-navy px-4 text-sm text-white"
      >
        Reintentar
      </button>
    </main>
  );
}
