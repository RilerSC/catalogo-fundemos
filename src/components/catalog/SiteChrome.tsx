import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[#ddd6cb] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="min-w-0">
          <p className="text-xs tracking-[0.18em] text-[#8b6b2e] uppercase">
            Universidad FUNDEPOS
          </p>
          <p className="text-lg font-semibold text-[#14263d]">
            Oferta académica
          </p>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-4 text-sm">
          <Link href="/programas" className="font-medium text-[#1e3a5f]">
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#ddd6cb]">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[#5b6575]">
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
    <p className="bg-[#14263d] px-4 py-2 text-center text-xs text-white">
      Vista previa: se muestran programas en borrador. En producción solo
      aparecerán los publicados con apertura vigente.
    </p>
  );
}
