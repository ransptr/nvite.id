import {motion, useReducedMotion, type Variants} from 'framer-motion';
import {ArrowRight, Play} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useLanguage} from '@/src/contexts/LanguageContext';
import {translations} from '@/src/i18n/translations';

const STAGGER_CONTAINER: Variants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.12, delayChildren: 0.1}},
};
const FADE_UP: Variants = {
  hidden: {opacity: 0, y: 40},
  show: {opacity: 1, y: 0, transition: {duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number]}},
};
const FADE_IN: Variants = {
  hidden: {opacity: 0},
  show: {opacity: 1, transition: {duration: 1.1, ease: 'easeOut'}},
};

export function HeroSection() {
  const {lang} = useLanguage();
  const t = translations.hero;
  const reduce = useReducedMotion();

  const floaters = t.floaters[lang];
  const stats = t.stats[lang];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fdfaf6] px-5 pb-20 pt-28 md:px-10 md:pt-32">
      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Warm radial glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2"
        style={{
          width: 900,
          height: 900,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,151,74,0.10) 0%, rgba(201,151,74,0.03) 50%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        {/* Left — copy */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          <motion.div variants={FADE_UP}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9974a]/30 bg-[#c9974a]/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#9a6f2e]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c9974a]" />
              {t.badge[lang]}
            </span>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            className="mt-5 font-display text-[3.2rem] font-bold leading-[1.05] tracking-tight text-[#1a1410] md:text-[4.2rem] lg:text-[4.8rem]"
          >
            {t.h1Line1[lang]}
            <br />
            <span className="italic text-[#c9974a]">{t.h1Line2[lang]}</span>
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            className="mt-5 max-w-lg text-lg leading-relaxed text-[#6b5640] md:text-xl"
          >
            {t.body[lang]}
          </motion.p>

          <motion.div variants={FADE_UP} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1a1410] px-7 py-3.5 text-sm font-semibold text-[#f6f0ea] shadow-[0_4px_28px_rgba(26,20,16,0.22)] transition-all duration-300 hover:bg-[#c9974a] hover:shadow-[0_6px_32px_rgba(201,151,74,0.45)]"
            >
              {t.cta1[lang]}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <Link
              to="/claire"
              className="group inline-flex items-center gap-2 rounded-full border border-[#1a1410]/20 px-7 py-3.5 text-sm font-semibold text-[#1a1410] transition-all duration-300 hover:border-[#c9974a]/50 hover:bg-[#c9974a]/5"
            >
              <Play size={13} className="fill-current" />
              {t.cta2[lang]}
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            variants={FADE_UP}
            className="mt-10 flex items-center gap-5 border-t border-[#e8ddd2] pt-8"
          >
            {stats.map((stat) => (
              <div key={stat.value} className="flex flex-col">
                <span className="font-display text-xl font-bold text-[#1a1410]">{stat.value}</span>
                <span className="text-xs text-[#9a8070]">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — mockup */}
        <motion.div
          variants={FADE_IN}
          initial="hidden"
          animate="show"
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          {/* Phone shell */}
          <motion.div
            animate={reduce ? {} : {y: [0, -10, 0]}}
            transition={{duration: 5, repeat: Infinity, ease: 'easeInOut'}}
            className="relative mx-auto w-[260px] md:w-[300px]"
          >
            {/* Phone frame */}
            <div className="relative overflow-hidden rounded-[2.8rem] border-4 border-[#1a1410]/10 bg-[#050505] shadow-[0_40px_80px_rgba(26,20,16,0.25),0_0_0_1px_rgba(26,20,16,0.08)]">
              {/* Status bar */}
              <div className="flex items-center justify-between bg-[#050505] px-5 py-3">
                <span className="text-[9px] font-semibold text-white/50">9:41</span>
                <div className="h-4 w-20 rounded-full bg-[#1a1410]" />
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-white/30" />
                  <div className="h-2 w-3 rounded-sm bg-white/30" />
                </div>
              </div>

              {/* Invitation preview */}
              <div className="relative aspect-[9/18] bg-[#050505]">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.5) 60%, rgba(5,5,5,0.92) 100%), linear-gradient(135deg, #1a120a 0%, #2d1f0e 40%, #0d0805 100%)',
                  }}
                />
                <div className="absolute inset-x-4 top-4 border-t border-[#c9974a]/20" />
                <div className="absolute inset-x-4 bottom-4 border-b border-[#c9974a]/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <p className="text-[7px] uppercase tracking-[0.3em] text-[#c9974a]/70">
                    The Wedding of
                  </p>
                  <h2 className="font-display text-2xl font-bold italic leading-tight text-[#f6f0ea]">
                    Dexter
                    <br />
                    &amp; Hualin
                  </h2>
                  <p className="text-[7px] uppercase tracking-[0.25em] text-[#f6f0ea]/50">
                    2 Agustus 2026
                  </p>
                  <div className="mt-3 rounded-full border border-[#c9974a]/40 px-4 py-1.5">
                    <span className="text-[8px] font-medium text-[#c9974a]">
                      {lang === 'id' ? 'Buka Undangan' : 'Open Invitation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification cards */}
            {floaters.map((f) => (
              <motion.div
                key={f.label}
                initial={{opacity: 0, x: f.x.includes('left') ? -20 : 20}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: f.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
                className={`absolute ${f.x} ${f.y} flex items-center gap-2.5 rounded-xl border border-[#e8ddd2] bg-white/95 px-3 py-2 shadow-[0_4px_20px_rgba(26,20,16,0.12)] backdrop-blur-sm`}
              >
                <div className="h-6 w-6 rounded-full bg-[#c9974a]/15 text-center text-[10px] leading-6 text-[#c9974a]">
                  ✦
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#1a1410]">{f.label}</p>
                  <p className="text-[9px] text-[#9a8070]">{f.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom scroll cue */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 1.8}}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-[#9a8070]">Scroll</span>
        <motion.div
          animate={{y: [0, 6, 0]}}
          transition={{duration: 1.4, repeat: Infinity, ease: 'easeInOut'}}
          className="h-8 w-px bg-gradient-to-b from-[#c9974a]/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
