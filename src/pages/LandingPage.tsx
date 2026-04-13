import {LanguageProvider} from '@/src/contexts/LanguageContext';
import {LandingNav} from '@/src/components/landing/LandingNav';
import {HeroSection} from '@/src/components/landing/HeroSection';
import {HowItWorksSection} from '@/src/components/landing/HowItWorksSection';
import {TemplatesSection} from '@/src/components/landing/TemplatesSection';
import {PricingSection} from '@/src/components/landing/PricingSection';
import {TestimonialsSection} from '@/src/components/landing/TestimonialsSection';
import {CtaBand, LandingFooter} from '@/src/components/landing/LandingFooter';

export function LandingPage() {
  return (
    <LanguageProvider>
      <div className="landing-page min-h-screen bg-[#fdfaf6] font-copy text-[#1a1410]">
        <LandingNav />
        <HeroSection />
        <HowItWorksSection />
        <TemplatesSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaBand />
        <LandingFooter />
      </div>
    </LanguageProvider>
  );
}
