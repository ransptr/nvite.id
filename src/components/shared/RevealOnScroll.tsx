import {motion, useReducedMotion} from 'framer-motion';
import type {ReactNode} from 'react';

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
};

const offsets = {
  up: {x: 0, y: 56},
  down: {x: 0, y: -56},
  left: {x: 56, y: 0},
  right: {x: -56, y: 0},
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = 'up',
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = offsets[direction];

  return (
    <motion.div
      initial={shouldReduceMotion ? {opacity: 0} : {opacity: 0, x: offset.x, y: offset.y}}
      whileInView={{opacity: 1, x: 0, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{duration: shouldReduceMotion ? 0.18 : 0.9, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : delay}}
      className={className}
    >
      {children}
    </motion.div>
  );
}
