"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-[#14263d]">
        No pudimos cargar esta página
      </h1>
      <p className="mt-3 text-[#5b6575]">
        Intente de nuevo. Si el problema continúa, vuelva más tarde.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-[#14263d] px-4 py-2 text-sm text-white"
      >
        Reintentar
      </button>
    </main>
  );
}
