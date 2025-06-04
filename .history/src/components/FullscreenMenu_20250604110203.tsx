'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const menuItems = [
  {
    english: 'ABOUT',
    korean: '브랜드 소개',
    path: '/about'
  },
  {
    english: 'PROJECT',
    korean: '시공 사례',
    path: '/projects'
  },
  {
    english: 'COLLECTION',
    korean: '제품 모음',
    path: '/collection'
  },
  {
    english: 'BLOG',
    korean: '정보 포스팅',
    path: '/blog'
  },
  {
    english: 'CONTACT',
    korean: '상담/후기/지도',
    path: '/contact'
  },
  {
    english: 'SHOP',
    korean: '제품 상세 및 결제',
    path: '/shop'
  }
];

export default function FullscreenMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Animation variants for overlay background
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeIn",
        delay: 0.6 // 마지막에 배경이 사라짐
      }
    }
  };

  // Animation variants for divider lines
  const dividerVariants = {
    initial: { 
      scaleY: 0,
      opacity: 0 
    },
    animate: { 
      scaleY: 1,
      opacity: 0.3,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.3
      }
    },
    exit: {
      scaleY: 0,
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
        duration: 0.4,
        delay: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
        delay: 0.2
      }
    }
  };

  // Animation variants for menu container
  const menuContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1 // 역순으로 사라짐
      }
    }
  };

  // Animation variants for individual menu items
  const menuItemVariants = {
    initial: { 
      opacity: 0,
      y: 30
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
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
        style={{
          filter: 'drop-shadow(0 0 2px white)'
        }}
      >
        <motion.div 
          className="w-6 h-0.5 bg-black transition-colors"
          animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="w-6 h-0.5 bg-black transition-colors"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="w-6 h-0.5 bg-black transition-colors"
          animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
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
            className="fixed top-0 left-0 w-full h-screen bg-black z-[9999] overflow-hidden"
          >
            {/* Close Button */}
            <motion.button
              variants={closeButtonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeMenu}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-3xl text-white font-light hover:opacity-60 transition-opacity z-10"
              aria-label="메뉴 닫기"
            >
              ×
            </motion.button>

            {/* 3-Column Layout with Dividers */}
            <div className="relative h-full">
              {/* Left Divider */}
              <motion.div
                variants={dividerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute left-1/3 top-0 h-full w-px bg-white origin-top"
              />
              
              {/* Right Divider */}
              <motion.div
                variants={dividerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute right-1/3 top-0 h-full w-px bg-white origin-top"
              />

              {/* Center Column - Menu Items */}
              <div className="absolute left-1/3 right-1/3 h-full flex items-end justify-center pb-[100px]">
                <motion.nav
                  variants={menuContainerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center"
                >
                  <ul className="space-y-8">
                    {menuItems.map((item, index) => (
                      <motion.li key={index} variants={menuItemVariants}>
                        <Link
                          href={item.path}
                          onClick={closeMenu}
                          className="block group"
                        >
                          <div className="text-white text-4xl font-montserrat font-bold uppercase tracking-wide mb-2 group-hover:opacity-70 transition-opacity duration-300">
                            {item.english}
                          </div>
                          <div className="text-white/60 text-sm font-noto-kr font-light tracking-wider">
                            {item.korean}
                          </div>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 