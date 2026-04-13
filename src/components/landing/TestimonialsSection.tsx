import {RevealOnScroll} from '@/src/components/shared/RevealOnScroll';
import {useLanguage} from '@/src/contexts/LanguageContext';
import {translations} from '@/src/i18n/translations';

function Stars({count}: {count: number}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length: count}).map((_, i) => (
        <span key={i} className="text-[#c9974a]" style={{fontSize: 12}}>
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const {lang} = useLanguage();
  const t = translations.testimonials;
  const items = t.items[lang];

  return (
    <section className="relative bg-[#f7f2ec] px-5 py-24 md:px-10 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9974a]/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9974a]">
              {t.sectionLabel[lang]}
            </p>
            <h2 className="font-display text-[2.4rem] font-bold leading-tight text-[#1a1410] md:text-[3.2rem]">
              {t.h2Line1[lang]}
              <br />
              <span className="italic">{t.h2Line2[lang]}</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <RevealOnScroll key={item.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-[2rem] border border-[#e8ddd2] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(201,151,74,0.1)]">
                <Stars count={item.rating} />
                <blockquote className="mt-4 flex-1">
                  <p className="text-base leading-relaxed text-[#3d2e1e]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-[#e8ddd2] pt-5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{background: `linear-gradient(135deg, ${item.accent}, ${item.accent}99)`}}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1410]">{item.name}</p>
                    <p className="text-xs text-[#9a8070]">
                      {item.date} &middot; {item.city}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
