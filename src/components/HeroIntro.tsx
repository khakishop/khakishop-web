'use client';
import { motion, AnimatePresence } from '../lib/motion';
import { useEffect, useState } from 'react';

export default function HeroIntro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2 }}
            className="text-white text-4xl md:text-6xl font-bold text-center tracking-wide"
          >
            Design Beyond Time
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
