import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {cn} from '@/src/lib/utils';
import {useAuth} from '@/src/hooks/useAuth';
import {useLanguage} from '@/src/contexts/LanguageContext';
import {translations} from '@/src/i18n/translations';

export function LandingNav() {
  const {lang, toggle} = useLanguage();
  const {session} = useAuth();
  const t = translations.nav;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({behavior: 'smooth'});
    }
  };

  const navLinks = t.links[lang];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-[#e8ddd2]/60 bg-[#fdfaf6]/90 shadow-[0_2px_24px_rgba(120,80,30,0.06)] backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10 md:py-5">
        {/* Wordmark */}
        <Link to="/" className="group flex items-baseline gap-0.5">
          <span className="font-display text-[1.45rem] font-bold italic leading-none tracking-tight text-[#1a1410]">
            nvite
          </span>
          <span className="pb-0.5 text-[0.7rem] font-semibold tracking-widest text-[#c9974a]">.id</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group relative text-sm font-medium text-[#5c4a35] transition-colors hover:text-[#1a1410]"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c9974a] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop CTAs + lang toggle */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Language toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="flex items-center gap-1 rounded-full border border-[#e8ddd2] px-3 py-1.5 text-xs font-semibold text-[#9a8070] transition-all hover:border-[#c9974a]/40 hover:text-[#c9974a]"
          >
            <span className={cn('transition-opacity', lang === 'id' ? 'opacity-100' : 'opacity-40')}>ID</span>
            <span className="text-[#e8ddd2]">|</span>
            <span className={cn('transition-opacity', lang === 'en' ? 'opacity-100' : 'opacity-40')}>EN</span>
          </button>
          <Link
            to={session ? '/dashboard' : '/login'}
            className="text-sm font-medium text-[#5c4a35] transition-colors hover:text-[#1a1410]"
          >
            {session ? 'Dashboard' : t.login[lang]}
          </Link>
          {!session ? (
            <Link
              to="/signup"
              className="rounded-full bg-[#1a1410] px-5 py-2 text-sm font-semibold text-[#f6f0ea] transition-all duration-200 hover:bg-[#c9974a] hover:shadow-[0_4px_20px_rgba(201,151,74,0.4)]"
            >
              {t.signup[lang]}
            </Link>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={cn(
              'block h-px w-6 bg-[#1a1410] transition-all duration-300',
              menuOpen && 'translate-y-[7px] rotate-45',
            )}
          />
          <span
            className={cn(
              'block h-px w-6 bg-[#1a1410] transition-all duration-300',
              menuOpen && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'block h-px w-6 bg-[#1a1410] transition-all duration-300',
              menuOpen && '-translate-y-[7px] -rotate-45',
            )}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        ref={menuRef}
        className={cn(
          'overflow-hidden border-b border-[#e8ddd2]/60 bg-[#fdfaf6] transition-all duration-300 md:hidden',
          menuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="flex flex-col gap-1 px-5 pb-5 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="rounded-xl px-3 py-3 text-base font-medium text-[#5c4a35] transition-colors hover:bg-[#f0e8dc] hover:text-[#1a1410]"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-[#e8ddd2]/60 pt-4">
            {/* Mobile lang toggle */}
            <button
              onClick={toggle}
              className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#9a8070] transition-colors hover:bg-[#f0e8dc]"
            >
              <span className={cn(lang === 'id' ? 'text-[#c9974a]' : 'text-[#b0a090]')}>ID</span>
              <span className="text-[#e8ddd2]">/</span>
              <span className={cn(lang === 'en' ? 'text-[#c9974a]' : 'text-[#b0a090]')}>EN</span>
            </button>
            <Link
              to={session ? '/dashboard' : '/login'}
              className="rounded-xl px-3 py-3 text-center text-base font-medium text-[#5c4a35] transition-colors hover:bg-[#f0e8dc]"
            >
              {session ? 'Dashboard' : t.login[lang]}
            </Link>
            {!session ? (
              <Link
                to="/signup"
                className="rounded-full bg-[#1a1410] py-3 text-center text-base font-semibold text-[#f6f0ea] transition-colors hover:bg-[#c9974a]"
              >
                {t.signup[lang]}
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
