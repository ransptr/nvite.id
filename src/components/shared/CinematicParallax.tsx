import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type SpringOptions,
} from 'framer-motion';
import type {MouseEventHandler} from 'react';
import {useEffect, useRef, useState} from 'react';

type UseSectionParallaxOptions = {
  offset?: [string, string];
  y?: [number, number];
  x?: [number, number];
  scale?: [number, number];
  rotate?: [number, number];
  opacity?: [number, number];
};

const defaultSpring: SpringOptions = {
  stiffness: 120,
  damping: 22,
  mass: 0.45,
};

export function useSectionParallax<T extends HTMLElement>({
  offset = ['start end', 'end start'],
  y = [-72, 72],
  x = [0, 0],
  scale = [1, 1],
  rotate = [0, 0],
  opacity,
}: UseSectionParallaxOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) {
      setIsHydrated(false);
      return;
    }

    setIsHydrated(true);
  });

  const {scrollYProgress} = useScroll({
    target: isHydrated ? ref : undefined,
    offset: offset as any,
  });

  const safeY = shouldReduceMotion ? [0, 0] : y;
  const safeX = shouldReduceMotion ? [0, 0] : x;
  const safeScale = shouldReduceMotion ? [1, 1] : scale;
  const safeRotate = shouldReduceMotion ? [0, 0] : rotate;
  const safeOpacity = opacity
    ? shouldReduceMotion
      ? [opacity[1], opacity[1]]
      : opacity
    : undefined;

  const yValue = useTransform(scrollYProgress, [0, 1], safeY);
  const xValue = useTransform(scrollYProgress, [0, 1], safeX);
  const scaleValue = useTransform(scrollYProgress, [0, 1], safeScale);
  const rotateValue = useTransform(scrollYProgress, [0, 1], safeRotate);
  const opacityValue = safeOpacity
    ? useTransform(scrollYProgress, [0, 1], safeOpacity)
    : undefined;

  const style: MotionStyle = {
    x: xValue,
    y: yValue,
    scale: scaleValue,
    rotateZ: rotateValue,
  };

  if (opacityValue) {
    style.opacity = opacityValue;
  }

  return {
    ref,
    progress: scrollYProgress,
    style,
    x: xValue,
    y: yValue,
    scale: scaleValue,
    rotate: rotateValue,
    opacity: opacityValue,
    shouldReduceMotion,
  };
}

type UsePointerParallaxOptions = {
  strength?: number;
  rotate?: number;
  disabled?: boolean;
};

export function usePointerParallax({
  strength = 18,
  rotate = 8,
  disabled = false,
}: UsePointerParallaxOptions = {}) {
  const shouldReduceMotion = useReducedMotion();
  const active = !disabled && !shouldReduceMotion;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  const x = useSpring(rawX, defaultSpring);
  const y = useSpring(rawY, defaultSpring);
  const rotateX = useSpring(rawRotateX, defaultSpring);
  const rotateY = useSpring(rawRotateY, defaultSpring);

  const onMouseMove: MouseEventHandler<HTMLElement> = (event) => {
    if (!active) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    rawX.set(px * strength);
    rawY.set(py * strength);
    rawRotateX.set(py * -rotate);
    rawRotateY.set(px * rotate);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  const style: MotionStyle = active
    ? {
        x,
        y,
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }
    : {};

  return {
    active,
    style,
    bind: active
      ? {
          onMouseMove,
          onMouseLeave: reset,
        }
      : {},
  };
}
