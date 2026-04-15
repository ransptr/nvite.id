import {ArrowRight, Lock} from 'lucide-react';
import {Link} from 'react-router-dom';
import {RevealOnScroll} from '@/src/components/shared/RevealOnScroll';
import {useLanguage} from '@/src/contexts/LanguageContext';
import {translations} from '@/src/i18n/translations';

type TemplateSlug = 'lumiere' | 'bloom' | 'sage' | 'onyx';

const TEMPLATES: Array<{
  slug: TemplateSlug;
  name: string;
  available: boolean;
  palette: string[];
  previewBg: string;
  accentColor: string;
}> = [
  {
    slug: 'lumiere',
    name: 'Lumière',
    available: true,
    palette: ['#050505', '#c9974a', '#f6f0ea', '#2d1f0e'],
    previewBg: 'linear-gradient(160deg, #0d0805 0%, #1e140a 45%, #0a0603 100%)',
    accentColor: '#c9974a',
  },
  {
    slug: 'bloom',
    name: 'Bloom',
    available: false,
    palette: ['#fdf6ee', '#d4896a', '#8c5e3c', '#f0e0d0'],
    previewBg: 'linear-gradient(160deg, #fdf6ee 0%, #fae8d5 50%, #f0d8c0 100%)',
    accentColor: '#d4896a',
  },
  {
    slug: 'sage',
    name: 'Sage',
    available: false,
    palette: ['#f4f7f0', '#6b8c5e', '#3d5c32', '#c8d9bf'],
    previewBg: 'linear-gradient(160deg, #f4f7f0 0%, #dfebd5 50%, #c8d9bf 100%)',
    accentColor: '#6b8c5e',
  },
  {
    slug: 'onyx',
    name: 'Onyx',
    available: false,
    palette: ['#0a0a0a', '#e0e0e0', '#ffffff', '#333333'],
    previewBg: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
    accentColor: '#e0e0e0',
  },
];

function TemplatePaletteSwatches({colors}: {colors: string[]}) {
  return (
    <div className="flex gap-1">
      {colors.map((c) => (
        <div key={c} className="h-3 w-3 rounded-full border border-black/10" style={{background: c}} />
      ))}
    </div>
  );
}

function TemplateCard({template}: {template: (typeof TEMPLATES)[number]}) {
  const {lang} = useLanguage();
  const t = translations.templates;
  const tagline = t.taglines[template.slug][lang];

  const card = (
    <div
      className={`group relative flex h-[420px] flex-col overflow-hidden rounded-[2rem] border transition-all duration-300 ${
        template.available
          ? 'cursor-pointer border-transparent hover:-translate-y-2 hover:shadow-[0_28px_72px_rgba(0,0,0,0.18)]'
          : 'cursor-default border-[#e8ddd2]'
      }`}
    >
      <div className="relative flex-1" style={{background: template.previewBg}}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          {template.available ? (
            <>
              <p className="text-[8px] uppercase tracking-[0.35em]" style={{color: `${template.accentColor}99`}}>
                The Wedding of
              </p>
              <p
                className="font-display text-2xl font-bold italic leading-tight"
                style={{color: template.palette[2]}}
              >
                Dexter
                <br />
                &amp; Hualin
              </p>
              <p
                className="text-[8px] uppercase tracking-[0.2em] opacity-60"
                style={{color: template.palette[2]}}
              >
                2 Agustus 2026
              </p>
              <div className="mt-2 rounded-full border px-4 py-1" style={{borderColor: `${template.accentColor}50`}}>
                <span className="text-[7px] font-medium" style={{color: template.accentColor}}>
                  {lang === 'id' ? 'Buka Undangan' : 'Open Invitation'}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{background: `${template.accentColor}20`}}
              >
                <Lock size={18} style={{color: template.accentColor}} />
              </div>
              <p
                className="font-display text-lg font-semibold italic"
                style={{color: template.palette[2] ?? template.palette[1]}}
              >
                {t.comingSoonLabel[lang]}
              </p>
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{color: `${template.palette[2] ?? template.palette[1]}80`}}
              >
                Coming Soon
              </p>
            </div>
          )}
        </div>

        {template.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-[#1a1410]">
              {t.viewDemo[lang]} <ArrowRight size={14} />
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-[#e8ddd2]/40 bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-[#1a1410]">{template.name}</h3>
              {!template.available && (
                <span className="rounded-full bg-[#f0e8dc] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#9a6f2e]">
                  Soon
                </span>
              )}
            </div>
            <p className="text-xs text-[#9a8070]">{tagline}</p>
          </div>
          <TemplatePaletteSwatches colors={template.palette} />
        </div>
      </div>
    </div>
  );

  return <Link to={`/templates/${template.slug}`}>{card}</Link>;
}

export function TemplatesSection() {
  const {lang} = useLanguage();
  const t = translations.templates;

  return (
    <section id="templates" className="relative bg-[#f7f2ec] px-5 py-24 md:px-10 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9974a]/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9974a]">
                {t.sectionLabel[lang]}
              </p>
              <h2 className="font-display text-[2.4rem] font-bold leading-tight text-[#1a1410] md:text-[3.2rem]">
                {t.h2Line1[lang]}
                <br />
                <span className="italic">{t.h2Line2[lang]}</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#6b5640] md:text-right">
              {t.subtext[lang]}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((tmpl, i) => (
            <RevealOnScroll key={tmpl.slug} delay={i * 0.08}>
              <TemplateCard template={tmpl} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.3}>
          <p className="mt-8 text-center text-xs text-[#9a8070]">
            {t.footerNote[lang]}{' '}
            <a href="/signup" className="font-medium text-[#c9974a] underline underline-offset-2 hover:text-[#a07840]">
              {t.footerCta[lang]}
            </a>{' '}
            {t.footerCtaSuffix[lang]}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
