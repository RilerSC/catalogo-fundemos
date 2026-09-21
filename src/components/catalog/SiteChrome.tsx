import Image from "next/image";
import Link from "next/link";
import { PrivacyPreferencesButton } from "@/components/analytics/PrivacyPreferencesButton";
import { InterestsNavLink } from "@/components/interests/InterestsNavLink";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:gap-6">
        <Link
          href="/"
          aria-label="Universidad FUNDEPOS, inicio del catálogo"
          className="flex min-w-0 items-center gap-3"
        >
          {/* Assets oficiales sin recolorear ni deformar; la roseta sustituye al logotipo donde no cabe */}
          <Image
            src="/branding/fundepos-roseta.png"
            alt=""
            width={512}
            height={553}
            priority
            className="h-9 w-auto sm:hidden"
          />
          <Image
            src="/branding/fundepos-logo.png"
            alt=""
            width={960}
            height={251}
            priority
            className="hidden h-9 w-auto sm:block md:h-10"
          />
          <span className="hidden h-8 w-px bg-line md:block" />
          <span className="hidden text-sm font-medium text-navy-soft md:block">
            Catálogo académico
          </span>
        </Link>
        <nav
          aria-label="Principal"
          className="flex shrink-0 items-center gap-1 sm:gap-2"
        >
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-medium text-navy-soft transition-colors hover:bg-paper hover:text-navy sm:px-3"
          >
            Catálogo
          </Link>
          <InterestsNavLink />
        </nav>
      </div>
      <span
        aria-hidden="true"
        className="block h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-navy relative mt-auto overflow-hidden bg-navy-deep text-white/85">
      <Image
        src="/branding/fundepos-roseta-blanca.png"
        alt=""
        width={512}
        height={553}
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-16 h-56 w-auto opacity-[0.06]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="max-w-md">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            Universidad FUNDEPOS
          </p>
          <p className="mt-2 font-serif text-xl text-white">
            Catálogo de oferta académica
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Explore los programas disponibles, consulte cada ficha y guarde los
            que le interesen para revisarlos después.
          </p>
        </div>
        <nav aria-label="Pie de página" className="text-sm sm:text-right">
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-gold hover:underline">
                Catálogo
              </Link>
            </li>
            <li>
              <Link
                href="/intereses"
                className="hover:text-gold hover:underline"
              >
                Mis programas de interés
              </Link>
            </li>
            <li>
              <PrivacyPreferencesButton />
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export function PreviewBanner({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return null;
  }
  return (
    <p className="border-b border-gold/40 bg-gold-veil px-4 py-2 text-center text-xs text-navy">
      <span className="font-semibold">Vista previa:</span> se muestran programas
      en borrador. En producción solo aparecerán los publicados con apertura
      vigente.
    </p>
  );
}
