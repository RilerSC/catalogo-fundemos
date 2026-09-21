type ConsentBannerProps = {
  mode: "first" | "preferences";
  onGrant: () => void;
  onDeny: () => void;
  onDismiss?: () => void;
};

export function ConsentBanner({
  mode,
  onGrant,
  onDeny,
  onDismiss,
}: ConsentBannerProps) {
  const titleId = "analytics-consent-title";
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
    >
      <section className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-line bg-card p-5 shadow-[0_16px_40px_rgba(15,30,61,0.16)] md:p-6">
        <h2
          id={titleId}
          className="font-serif text-lg font-semibold text-navy md:text-xl"
        >
          {mode === "first"
            ? "Analítica opcional"
            : "Preferencias de privacidad"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Usamos analítica opcional para entender cómo se utiliza el catálogo y
          mejorar la experiencia. No se carga hasta que usted lo permita.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onGrant}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-line-strong bg-card px-4 text-sm font-semibold text-navy transition-colors hover:bg-paper"
          >
            Permitir analítica
          </button>
          <button
            type="button"
            onClick={onDeny}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-line-strong bg-card px-4 text-sm font-semibold text-navy transition-colors hover:bg-paper"
          >
            No permitir
          </button>
          {onDismiss ? (
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-medium text-navy-soft transition-colors hover:bg-paper hover:text-navy"
            >
              Cerrar
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
