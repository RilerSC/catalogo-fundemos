import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="min-w-0">
          <p className="text-[0.68rem] font-medium tracking-[0.2em] text-accent uppercase">
            Universidad FUNDEPOS
          </p>
          <p className="text-base font-semibold tracking-tight text-navy">
            Oferta académica
          </p>
        </Link>
        <nav aria-label="Principal">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-navy-soft hover:bg-paper"
          >
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted">
        Universidad FUNDEPOS · Catálogo de oferta académica
      </div>
    </footer>
  );
}

export function PreviewBanner({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return null;
  }
  return (
    <p className="bg-navy px-4 py-2 text-center text-xs text-white">
      Vista previa: se muestran programas en borrador. En producción solo
      aparecerán los publicados con apertura vigente.
    </p>
  );
}
