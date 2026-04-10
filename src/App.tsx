/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Music,
  Music2,
  ChevronDown,
  Mail,
  ArrowRight,
  Menu,
} from 'lucide-react';
import { cn } from './lib/utils';

// ─── Parallax Components ───────────────────────────────────────────────────

const RevealOnScroll = ({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const dirs: Record<string, [number, number]> = {
    up: [60, 0],
    down: [-60, 0],
    left: [0, -60],
    right: [0, 60],
  };
  const [yOff, xOff] = dirs[direction] || dirs.up;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOff, x: xOff }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ParallaxImage = ({
  src,
  alt,
  speed = 0.15,
  className,
  overlay = true,
  overlayOpacity = 0.4,
  children,
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-speed * 100}%`, `${speed * 100}%`],
  );

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y }} className="absolute -inset-[10%]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {overlay && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        )}
      </motion.div>
      {children}
    </div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-white/40 z-[100] origin-left"
    />
  );
};

const HorizontalScrollGallery = ({ images }: { images: string[] }) => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ['2%', `-${Math.max(0, images.length - 2) * 25}%`]);

  return (
    <div className="py-8 overflow-hidden">
      <motion.div style={{ x }} className="flex gap-6 md:gap-8 pl-[2%]">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-[75vw] md:w-[35vw] aspect-[4/5] overflow-hidden"
          >
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// ─── Data ──────────────────────────────────────────────────────────────────

const timelineData = [
  {
    year: '2023',
    title: 'The First Encounter',
    text: 'It all began in the spring of 2023 when Dexter, a kind-hearted and adventurous soul, arrived in Japan for work. New to the country, he found himself walking along the bustling streets of Tokyo, captivated by the neon lights and the mix of tradition and modernity. On one of his many explorations, Dexter stumbled upon a cozy café hidden in a quiet alley, its warm ambiance calling him inside.\n\nInside the café, Hualin, a soft-spoken artist with a passion for storytelling through her paintings, was sipping tea and sketching. Their eyes met briefly, and there was an instant connection. Dexter couldn\'t resist walking up to her and struck up a conversation about the art on the café walls. What started as a casual chat about creativity soon turned into hours of deep conversation. They shared stories of their lives, their dreams, and the serendipity that had led them to Japan.',
  },
  {
    year: '2024',
    title: 'Growing Together',
    text: 'Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan – from the serene temples of Kyoto to the cherry blossoms in full bloom. With every passing moment, their bond deepened. Dexter admired Hualin\'s gentle spirit and her ability to find beauty in the simplest things. Hualin, on the other hand, was drawn to Dexter\'s adventurous nature and how he always made her laugh, even on the hardest days.\n\nTheir love story wasn\'t just about grand adventures but also about the quiet moments shared in the comfort of their home in Japan – cooking meals together, long walks in the park, and nights filled with laughter and dreams of the future. They both knew, deep down, that this was more than just a passing connection. It was something meant to last a lifetime.',
  },
  {
    year: '2025',
    title: 'The Proposal',
    text: 'By early 2025, it was clear to both Dexter and Hualin that they were meant to be together forever. Dexter planned a special evening for Hualin, taking her to the very café where they first met. As they sat by the same window, looking out at the Tokyo skyline, Dexter took Hualin\'s hand and spoke from the heart. He told her how much she meant to him and how he couldn\'t imagine his life without her.\n\nWith a smile that lit up her face, Hualin said yes.\n\nTheir love story was about to take the next step as they began planning their wedding for later that year, excited to build a future together, full of love, laughter, and the beautiful memories they would create in Japan and beyond.',
  },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=2074&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1465495910483-0d6749ee9f4a?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
];

const weddingDetails = [
  {
    title: 'HOLY MATRIMONY',
    time: '8 AM - 10 PM',
    loc: 'Jl. Taman Palem Lestari Barat No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia',
  },
  {
    title: 'RECEPTION',
    time: '10 AM - 12 PM',
    loc: 'Jl. Taman Palem Lestari Barat No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia',
  },
  {
    title: 'A GUIDE TO DRESS CODES',
    time: '',
    loc: 'We kindly encourage our guests to wear these colors for our special day: Black, Maroon, Sage',
  },
  {
    title: 'JOIN US VIRTUALLY',
    time: '8 AM - 10 PM',
    loc: 'If you are unable to attend in person, we invite you to celebrate with us through our live streaming.',
  },
];

// ─── Main App ──────────────────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('Guest Name');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll();
  const heroBgY = useTransform(heroScroll, [0, 1], ['0%', '25%']);
  const heroContentY = useTransform(heroScroll, [0, 1], ['0%', '80%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroMarqueeY = useTransform(heroScroll, [0, 1], ['0%', '50%']);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setGuestName(to);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) audioRef.current.play().catch(() => {});
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#f2f2f2] flex items-center justify-center z-[100]">
        <div className="flex items-center gap-8 md:gap-16">
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-60">
            The Wedding of
          </span>
          <div className="w-16 h-16 overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-60">
            Dexter - Hualin
          </span>
        </div>
        <div className="absolute bottom-10 left-10 text-[10px] tracking-[0.2em] uppercase opacity-40">
          Loading... {Math.min(progress, 100)}%
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        loop
      />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ─── COVER ─── */
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white text-center px-6"
          >
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
                alt="Cover"
                className="w-full h-full object-cover brightness-75"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] tracking-[0.4em] uppercase font-light">
                The Wedding of
              </p>
              <h1 className="serif text-6xl md:text-9xl italic font-light tracking-tight">
                Dexter - Hualin
              </h1>
              <p className="text-[10px] tracking-[0.4em] uppercase font-light pt-4">
                Saturday, 21 August 2025
              </p>
              <div className="pt-12 space-y-2">
                <p className="text-sm font-light">
                  Dear{' '}
                  <span className="font-medium underline underline-offset-4">
                    {guestName}
                  </span>
                  .
                </p>
                <p className="text-[10px] opacity-70">
                  We apologize if there is any misspelling of name or title
                </p>
              </div>
              <button
                onClick={handleOpen}
                className="mt-12 px-8 py-3 bg-black/20 backdrop-blur-md border border-white/20 rounded-sm hover:bg-white/10 transition-all duration-300 flex items-center gap-2 mx-auto uppercase text-[10px] tracking-[0.3em]"
              >
                <Mail className="w-3 h-3" />
                Let's Open
              </button>
            </div>
          </motion.div>
        ) : (
          /* ─── MAIN CONTENT ─── */
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <ScrollProgress />

            <div className="fixed top-6 right-6 z-[60] text-white mix-blend-difference cursor-pointer">
              <Menu className="w-6 h-6" />
            </div>

            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (audioRef.current) {
                  isMuted
                    ? audioRef.current.play()
                    : audioRef.current.pause();
                }
              }}
              className="fixed bottom-6 left-6 z-50 text-white mix-blend-difference"
            >
              {isMuted ? (
                <Music2 className="w-5 h-5 opacity-50" />
              ) : (
                <Music className="w-5 h-5" />
              )}
            </button>

            {/* ─── HERO ─── */}
            <section
              ref={heroRef}
              className="relative h-screen overflow-hidden"
            >
              <motion.div
                style={{ y: heroBgY }}
                className="absolute inset-0 z-0"
              >
                <img
                  src="https://images.unsplash.com/photo-1465495910483-0d6749ee9f4a?q=80&w=2070&auto=format&fit=crop"
                  alt="Hero"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40" />
              </motion.div>

              <motion.div
                style={{ y: heroMarqueeY }}
                className="absolute inset-0 z-[1] flex flex-col justify-center overflow-hidden opacity-[0.07] pointer-events-none select-none"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <p
                    key={i}
                    className="serif text-[10vw] text-white whitespace-nowrap leading-none"
                  >
                    Dexter — Hualin &nbsp;&nbsp;&nbsp; Dexter — Hualin
                    &nbsp;&nbsp;&nbsp; Dexter — Hualin &nbsp;&nbsp;&nbsp;
                  </p>
                ))}
              </motion.div>

              <motion.div
                style={{ y: heroContentY, opacity: heroOpacity }}
                className="relative z-10 flex items-center justify-center h-full"
              >
                <div className="text-center text-white px-6 max-w-4xl">
                  <p className="text-[10px] tracking-[0.5em] uppercase mb-6">
                    The Wedding of
                  </p>
                  <h2 className="serif text-7xl md:text-[12vw] font-bold leading-none flex items-center justify-center gap-4 md:gap-8">
                    lin <span className="text-4xl md:text-8xl">*</span> Dexter
                  </h2>
                  <div className="max-w-md mx-auto mt-16 text-left">
                    <p className="text-sm md:text-base font-light leading-relaxed opacity-90 italic">
                      "But at the beginning of creation God 'made them male and
                      female.' 'For this reason a man will leave his father and
                      mother and be united to his wife, and the two will become
                      one flesh.' So they are no longer two, but one flesh.
                      Therefore what God has joined together, let no one
                      separate."
                    </p>
                    <p className="mt-4 text-[10px] tracking-[0.2em] uppercase opacity-70">
                      Mark 10:6-9
                    </p>
                  </div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-20"
                  >
                    <ChevronDown className="w-5 h-5 mx-auto opacity-60" />
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* ─── QUOTE ─── */}
            <section className="bg-black text-white py-40 px-6">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-20">
                <RevealOnScroll className="relative w-full md:w-1/3 aspect-[3/4] overflow-hidden">
                  <ParallaxImage
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
                    alt="Couple"
                    speed={0.15}
                    overlay={false}
                    className="w-full h-full"
                  />
                </RevealOnScroll>
                <RevealOnScroll delay={0.2} className="md:w-2/3 space-y-8">
                  <h3 className="serif text-5xl md:text-7xl text-[#c5a47e] leading-tight">
                    Two are better than one, for they have a good return for
                    their labor
                  </h3>
                  <div className="w-1/2 h-px bg-[#c5a47e]/30" />
                </RevealOnScroll>
              </div>
            </section>

            {/* ─── STORY PARALLAX ─── */}
            <ParallaxImage
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
              alt="Story"
              speed={0.2}
              overlay
              overlayOpacity={0.5}
              className="h-screen"
            >
              <div className="relative z-10 flex items-center justify-center h-full text-white">
                <RevealOnScroll>
                  <h2 className="serif text-5xl md:text-8xl italic font-light text-center">
                    A Journey in Love
                  </h2>
                </RevealOnScroll>
              </div>
            </ParallaxImage>

            {/* ─── TIMELINE ─── */}
            {timelineData.map((item, i) => (
              <section
                key={i}
                className={cn(
                  'py-32 px-6',
                  i % 2 === 0 ? 'bg-black text-white' : 'bg-[#111] text-white',
                )}
              >
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
                  <RevealOnScroll className="space-y-4">
                    <p className="serif text-3xl text-[#c5a47e]">{item.year}</p>
                    <p className="text-xl font-light tracking-wide">
                      / {item.title}
                    </p>
                  </RevealOnScroll>
                  <RevealOnScroll
                    delay={0.2}
                    className="space-y-8 text-sm md:text-base font-light leading-relaxed opacity-80"
                  >
                    {item.text.split('\n\n').map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </RevealOnScroll>
                </div>
              </section>
            ))}

            {/* ─── GALLERY ─── */}
            <section className="bg-[#d9d9d9] py-32 px-6">
              <div className="max-w-7xl mx-auto">
                <RevealOnScroll>
                  <h2 className="serif text-6xl md:text-8xl leading-[0.9] text-[#1a1a1a] mb-16">
                    Our Pre-
                    <br />
                    wedding
                    <br />
                    Celebration.
                  </h2>
                </RevealOnScroll>
                <HorizontalScrollGallery images={galleryImages} />
              </div>
            </section>

            {/* ─── WEDDING DETAILS ─── */}
            <section className="bg-white py-32 px-6">
              <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20">
                <RevealOnScroll className="md:col-span-1">
                  <p className="text-sm font-light tracking-widest uppercase opacity-60">
                    Wedding / Details
                  </p>
                </RevealOnScroll>
                <div className="md:col-span-2 space-y-20">
                  <RevealOnScroll>
                    <h2 className="serif text-6xl md:text-9xl text-[#1a1a1a]">
                      Thursday 20.08.2025
                    </h2>
                  </RevealOnScroll>
                  <div className="space-y-12">
                    {weddingDetails.map((item, i) => (
                      <RevealOnScroll key={i} delay={i * 0.1}>
                        <div className="group border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between gap-8">
                          <div className="md:w-1/3 space-y-1">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase">
                              {item.title}
                            </p>
                            {item.time && (
                              <p className="text-[10px] opacity-60">
                                {item.time}
                              </p>
                            )}
                          </div>
                          <div className="md:w-1/2 text-sm font-light leading-relaxed opacity-70">
                            {item.loc}
                          </div>
                          <div className="hidden md:block">
                            <ArrowRight className="w-6 h-6 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                          </div>
                        </div>
                      </RevealOnScroll>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ─── GIFT ─── */}
            <section className="bg-white py-32 px-6 overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
                <RevealOnScroll className="md:w-1/2 space-y-12">
                  <h2 className="text-4xl md:text-6xl font-medium leading-tight">
                    For those of you who want to give a token of love to the
                    bride and groom, you can use the account number below:
                  </h2>
                  <button className="text-sm font-bold tracking-widest uppercase border-b border-black pb-1">
                    Click Here
                  </button>
                </RevealOnScroll>
                <RevealOnScroll delay={0.2} className="md:w-1/2 relative">
                  <ParallaxImage
                    src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop"
                    alt="Gift"
                    speed={0.1}
                    overlay={false}
                    className="aspect-[4/5]"
                  />
                </RevealOnScroll>
              </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-black text-white py-20 text-center">
              <RevealOnScroll className="space-y-4">
                <p className="text-[10px] tracking-[0.5em] uppercase opacity-40">
                  Created by Groove Public
                </p>
                <p className="text-[10px] tracking-[0.5em] uppercase opacity-40">
                  &copy; All rights reserved
                </p>
              </RevealOnScroll>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
