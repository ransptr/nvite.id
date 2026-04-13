import {motion} from 'framer-motion';
import {Link2, LayoutTemplate, ListChecks, Palette} from 'lucide-react';
import {RevealOnScroll} from '@/src/components/shared/RevealOnScroll';
import {useLanguage} from '@/src/contexts/LanguageContext';
import {translations} from '@/src/i18n/translations';

const ICONS = [Palette, LayoutTemplate, Link2, ListChecks];
const ACCENTS = ['#c9974a', '#a07840', '#7a5830', '#c9974a'];

export function HowItWorksSection() {
  const {lang} = useLanguage();
  const t = translations.howItWorks;
  const steps = t.steps[lang];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#fdfaf6] px-5 py-24 md:px-10 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9974a]/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="mb-16 text-center">
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = ICONS[i]!;
            const accent = ACCENTS[i]!;
            return (
              <RevealOnScroll key={step.number} delay={i * 0.1}>
                <div className="group relative flex flex-col rounded-[1.75rem] border border-[#e8ddd2] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9974a]/30 hover:shadow-[0_16px_48px_rgba(201,151,74,0.12)]">
                  <span className="mb-5 font-display text-[3.5rem] font-bold leading-none tracking-tight text-[#f0e8dc]">
                    {step.number}
                  </span>
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-300"
                    style={{background: `${accent}18`}}
                  >
                    <Icon size={20} style={{color: accent}} strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold text-[#1a1410]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#6b5640]">{step.body}</p>

                  {i < steps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                      <motion.div
                        animate={{x: [0, 4, 0]}}
                        transition={{duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3}}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-[#e8ddd2] bg-[#fdfaf6] text-[#c9974a] shadow-sm"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
