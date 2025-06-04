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

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      x: -50,
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const closeButtonVariants = {
    hidden: { 
      opacity: 0,
      rotate: -90 
    },
    visible: { 
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.3,
        delay: 0.2,
        ease: "easeOut"
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
          className="w-6 h-0.5 bg-black transition-colors"
          animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
        />
        <motion.div 
          className="w-6 h-0.5 bg-black transition-colors"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        />
        <motion.div 
          className="w-6 h-0.5 bg-black transition-colors"
          animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
        />
      </button>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            onClick={closeMenu}
          >
            {/* Close Button */}
            <motion.button
              variants={closeButtonVariants}
              initial="hidden"
              animate="visible"
              onClick={closeMenu}
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-2xl font-light hover:opacity-60 transition-opacity"
              aria-label="메뉴 닫기"
            >
              ×
            </motion.button>

            {/* Menu Items Container */}
            <motion.nav
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="space-y-8">
                {menuItems.map((item, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      className="text-4xl md:text-5xl lg:text-6xl font-light text-black hover:opacity-60 transition-opacity duration-300 block py-2"
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