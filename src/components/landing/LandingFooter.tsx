import {ArrowRight, Instagram, Twitter} from 'lucide-react';
import {Link} from 'react-router-dom';
import {RevealOnScroll} from '@/src/components/shared/RevealOnScroll';
import {useLanguage} from '@/src/contexts/LanguageContext';
import {translations} from '@/src/i18n/translations';

export function CtaBand() {
  const {lang} = useLanguage();
  const t = translations.cta;

  return (
    <section className="relative overflow-hidden bg-[#0d0805] px-5 py-24 text-center md:px-10 md:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,151,74,0.14) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        <RevealOnScroll>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9974a]/70">
            {t.sectionLabel[lang]}
          </p>
          <h2 className="font-display text-[2.6rem] font-bold italic leading-tight text-[#f6f0ea] md:text-[3.6rem]">
            {t.h2Line1[lang]}
            <br />
            {t.h2Line2[lang]}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#f6f0ea]/55">
            {t.subtext[lang]}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-[#c9974a] px-8 py-4 text-sm font-bold text-[#1a1410] shadow-[0_8px_32px_rgba(201,151,74,0.45)] transition-all duration-300 hover:bg-[#dba95c] hover:shadow-[0_12px_40px_rgba(201,151,74,0.55)]"
            >
              {t.cta1[lang]}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <Link
              to="/claire"
              className="inline-flex items-center gap-2 rounded-full border border-[#f6f0ea]/20 px-8 py-4 text-sm font-semibold text-[#f6f0ea]/80 transition-all duration-300 hover:border-[#f6f0ea]/40 hover:text-[#f6f0ea]"
            >
              {t.cta2[lang]}
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function LandingFooter() {
  const {lang} = useLanguage();
  const t = translations.footer;
  const currentYear = new Date().getFullYear();
  const columns = t.columns[lang];

  return (
    <footer className="border-t border-[#e8ddd2]/60 bg-[#fdfaf6] px-5 py-14 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-baseline gap-0.5">
              <span className="font-display text-xl font-bold italic leading-none tracking-tight text-[#1a1410]">
                nvite
              </span>
              <span className="pb-0.5 text-[0.65rem] font-semibold tracking-widest text-[#c9974a]">
                .id
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#6b5640]">
              {t.brandTagline[lang]}
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/nvite.id"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8ddd2] text-[#9a8070] transition-colors hover:border-[#c9974a]/40 hover:text-[#c9974a]"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://twitter.com/nviteid"
                aria-label="Twitter / X"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8ddd2] text-[#9a8070] transition-colors hover:border-[#c9974a]/40 hover:text-[#c9974a]"
              >
                <Twitter size={14} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#9a8070]">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#6b5640] transition-colors hover:text-[#1a1410]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e8ddd2]/60 pt-7 sm:flex-row">
          <p className="text-xs text-[#9a8070]">{t.copyright[lang](currentYear)}</p>
          <p className="text-xs text-[#b0a090]">{t.madeWith[lang]}</p>
        </div>
      </div>
    </footer>
  );
}
