'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

const menuItems = [
  { name: '소개', path: '/about' },
  { name: '시공사례', path: '/projects' },
  { name: '컬렉션', path: '/collection' },
  { name: '블로그', path: '/blog' },
  { name: '문의', path: '/contact' },
  { name: '쇼핑', path: '/shop' },
];

export default function FullscreenMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Animation variants for overlay
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  // Animation variants for menu container
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  // Animation variants for individual menu items
  const itemVariants = {
    initial: { 
      y: 50,
      opacity: 0 
    },
    animate: { 
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      y: 30,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Animation variants for close button
  const closeButtonVariants = {
    initial: { 
      opacity: 0,
      scale: 0.8
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-8 right-8 z-[60] w-10 h-10 flex flex-col justify-center items-center space-y-1 group"
        aria-label="메뉴 열기"
      >
        <motion.div 
          className="w-6 h-0.5 bg-black transition-colors drop-shadow-[0_0_2px_white] hover:drop-shadow-[0_0_3px_white]"
          animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
        />
        <motion.div 
          className="w-6 h-0.5 bg-black transition-colors drop-shadow-[0_0_2px_white] hover:drop-shadow-[0_0_3px_white]"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        />
        <motion.div 
          className="w-6 h-0.5 bg-black transition-colors drop-shadow-[0_0_2px_white] hover:drop-shadow-[0_0_3px_white]"
          animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
        />
      </button>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-0 left-0 w-full h-screen bg-white z-[9999] flex items-center justify-center"
            onClick={closeMenu}
          >
            {/* Close Button */}
            <motion.button
              variants={closeButtonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeMenu}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-3xl text-black font-light hover:opacity-60 transition-opacity"
              aria-label="메뉴 닫기"
            >
              ×
            </motion.button>

            {/* Menu Items Container */}
            <motion.nav
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="space-y-6 md:space-y-8">
                {menuItems.map((item, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      className="text-5xl md:text-7xl font-light text-black hover:opacity-60 transition-opacity duration-300 block py-2"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 