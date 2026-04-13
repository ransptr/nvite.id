import {Check, Sparkles} from 'lucide-react';
import {RevealOnScroll} from '@/src/components/shared/RevealOnScroll';
import {cn} from '@/src/lib/utils';
import {useLanguage} from '@/src/contexts/LanguageContext';
import {translations} from '@/src/i18n/translations';

const TIER_HREFS = ['/signup', '/signup?plan=basic', '/signup?plan=pro'];
const TIER_HIGHLIGHTED = [false, true, false];

function FeatureRow({text, included, dark}: {text: string; included: boolean; dark: boolean}) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]',
          included
            ? 'bg-[#c9974a]/15 text-[#c9974a]'
            : dark
              ? 'bg-white/10 text-white/30'
              : 'bg-[#e8ddd2]/60 text-[#c4b09a]',
        )}
      >
        {included ? '✓' : '✕'}
      </span>
      <span
        className={cn(
          'text-sm',
          included
            ? dark ? 'text-[#f6f0ea]/80' : 'text-[#3d2e1e]'
            : dark ? 'text-white/30 line-through' : 'text-[#b0a090] line-through',
        )}
      >
        {text}
      </span>
    </li>
  );
}

export function PricingSection() {
  const {lang} = useLanguage();
  const t = translations.pricing;
  const tiers = t.tiers[lang];

  return (
    <section id="pricing" className="relative bg-[#fdfaf6] px-5 py-24 md:px-10 md:py-32">
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
            <p className="mx-auto mt-4 max-w-md text-base text-[#6b5640]">
              {t.subtext[lang]}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => {
            const highlighted = TIER_HIGHLIGHTED[i]!;
            const href = TIER_HREFS[i]!;
            return (
              <RevealOnScroll key={tier.name} delay={i * 0.1}>
                <div
                  className={cn(
                    'relative flex flex-col rounded-[2rem] border p-7 transition-all duration-300',
                    highlighted
                      ? 'border-[#c9974a]/40 bg-[#1a1410] text-[#f6f0ea] shadow-[0_24px_64px_rgba(26,20,16,0.22)]'
                      : 'border-[#e8ddd2] bg-white hover:border-[#c9974a]/20 hover:shadow-[0_8px_40px_rgba(201,151,74,0.10)]',
                  )}
                >
                  {tier.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="flex items-center gap-1.5 rounded-full bg-[#c9974a] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1a1410] shadow-[0_4px_16px_rgba(201,151,74,0.5)]">
                        <Sparkles size={10} />
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div
                    className="mb-6 border-b pb-6"
                    style={{borderColor: highlighted ? 'rgba(201,151,74,0.2)' : '#e8ddd2'}}
                  >
                    <h3
                      className={cn(
                        'font-display text-2xl font-bold',
                        highlighted ? 'text-[#f6f0ea]' : 'text-[#1a1410]',
                      )}
                    >
                      {tier.name}
                    </h3>
                    <div className="mt-4 flex items-end gap-1.5">
                      <span
                        className={cn(
                          'font-display text-4xl font-bold',
                          highlighted ? 'text-[#f6f0ea]' : 'text-[#1a1410]',
                        )}
                      >
                        {tier.price}
                      </span>
                      <span
                        className={cn(
                          'pb-1 text-sm',
                          highlighted ? 'text-[#f6f0ea]/50' : 'text-[#9a8070]',
                        )}
                      >
                        / {tier.period}
                      </span>
                    </div>
                    <p
                      className={cn(
                        'mt-2 text-sm leading-relaxed',
                        highlighted ? 'text-[#f6f0ea]/65' : 'text-[#6b5640]',
                      )}
                    >
                      {tier.description}
                    </p>
                  </div>

                  <ul className="mb-8 flex flex-col gap-3">
                    {tier.features.map((f) => (
                      <FeatureRow key={f} text={f} included dark={highlighted} />
                    ))}
                    {tier.missing.map((f) => (
                      <FeatureRow key={f} text={f} included={false} dark={highlighted} />
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <a
                      href={href}
                      className={cn(
                        'block w-full rounded-full py-3.5 text-center text-sm font-semibold transition-all duration-200',
                        highlighted
                          ? 'bg-[#c9974a] text-[#1a1410] hover:bg-[#dba95c] hover:shadow-[0_4px_24px_rgba(201,151,74,0.5)]'
                          : 'border border-[#1a1410]/20 text-[#1a1410] hover:border-[#c9974a]/40 hover:bg-[#c9974a]/5',
                      )}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={0.3}>
          <p className="mt-8 text-center text-xs text-[#9a8070]">
            {t.footerNote[lang]}{' '}
            <a href="/faq" className="font-medium text-[#c9974a] underline underline-offset-2 hover:text-[#a07840]">
              {t.footerCta[lang]}
            </a>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
