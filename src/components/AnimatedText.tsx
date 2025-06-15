'use client';

import { useRef } from 'react';
import { motion } from '../lib/motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number;
}

export const AnimatedText = ({ text, className = '', once = true, delay = 0 }: AnimatedTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // RIGAS 스타일의 부드러운 이징
  const ease = [0.25, 0.1, 0.25, 1];

  // 글자별 애니메이션 variants
  const charVariants = {
    initial: {
      opacity: 0,
      y: 120,
      scale: 0.9,
      rotateX: -45,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1.1,
      }
    }
  };

  // 컨테이너 variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      }
    }
  };

  if (!text) return null;

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`flex flex-wrap justify-center ${className}`}
      aria-label={text}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={charVariants}
          className="inline-block will-change-transform"
          style={{
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            perspective: 1000,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
}; 