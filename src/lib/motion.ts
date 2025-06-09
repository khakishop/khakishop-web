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