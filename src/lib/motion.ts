// ================================================================================
// 🎯 KHAKISHOP - Framer Motion Client Components
// ================================================================================
// 목적: Framer Motion 컴포넌트들을 client-side에서만 사용하도록 분리

'use client';

// 📦 Motion Library - Client-Only
export { motion, AnimatePresence } from 'framer-motion';
export { 
  useAnimation, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useInView 
} from 'framer-motion';

// Types
export type { Variants, Transition, MotionProps } from 'framer-motion'; 
// 애니메이션 헬퍼 함수들
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const createStaggerContainer = (staggerChildren = 0.1) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren
    }
  }
});

export const createStaggerItem = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { delay }
  }
});
