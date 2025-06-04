'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const menuItems = [
  {
    english: 'KHAKI COLLECTION',
    korean: '카키샵 커튼 컬렉션',
    path: '/collection'
  },
  {
    english: 'PROJECTS',
    korean: '공간별 커튼 시공 사례',
    path: '/projects'
  },
  {
    english: 'FABRIC STYLING',
    korean: '패브릭이 완성하는 라이프스타일',
    path: '/styling'
  },
  {
    english: 'STUDIO KH',
    korean: '브랜드 이야기와 디자인 철학',
    path: '/about'
  },
  {
    english: 'BLOG',
    korean: '커튼 관리법, 시즌 추천, 인사이트',
    path: '/blog'
  },
  {
    english: 'CONTACT',
    korean: '상담 예약 및 매장 안내',
    path: '/contact'
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

  // Animation variants for overlay
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  // Animation variants for content sections
  const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  // Animation variants for menu container
  const menuContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4
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
  const menuItemVariants = {
    initial: { 
      opacity: 0,
      y: 20
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
      y: 15,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <>
      {/* MENU Trigger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-8 right-8 z-[60] text-black text-[16px] font-light tracking-widest uppercase hover:opacity-70 transition-opacity"
        style={{
          textShadow: '0 0 0.5px white, 0 0 1.5px white'
        }}
        aria-label="메뉴 열기"
      >
        MENU
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-3xl text-white font-light hover:opacity-60 transition-opacity z-10"
              aria-label="메뉴 닫기"
            >
              ×
            </motion.button>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              
              {/* Left Column - Logo */}
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center lg:justify-start lg:pl-16 order-2 lg:order-1"
              >
                <div className="text-white text-6xl md:text-7xl flex items-baseline">
                  <span className="font-montserrat font-bold">khaki</span>
                  <span className="font-dm-serif italic ml-2">shop</span>
                </div>
              </motion.div>

              {/* Center Column - Menu Items */}
              <motion.div
                variants={menuContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center order-1 lg:order-2 py-8 lg:py-0"
              >
                <nav className="text-center">
                  <ul className="space-y-10">
                    {menuItems.map((item, index) => (
                      <motion.li key={index} variants={menuItemVariants}>
                        <Link
                          href={item.path}
                          onClick={closeMenu}
                          className="block group"
                        >
                          <div className="text-5xl font-bold uppercase text-white mb-2 hover:opacity-70 transition-opacity">
                            {item.english}
                          </div>
                          <div className="text-sm text-white/70 tracking-tight">
                            {item.korean}
                          </div>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </motion.div>

              {/* Right Column - Contact Info */}
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center lg:justify-end lg:pr-16 order-3"
              >
                <div className="text-right text-sm text-white/70">
                  <div className="mb-6">
                    <div>경기도 고양시 일산동구</div>
                    <div>호수로 430번길 24</div>
                  </div>
                  <div className="mb-6">
                    <div>Tel: 0507-1372-0358</div>
                  </div>
                  <div className="space-y-2">
                    <div><a href="#" className="hover:text-white transition-colors">Instagram</a></div>
                    <div><a href="#" className="hover:text-white transition-colors">Facebook</a></div>
                    <div><a href="#" className="hover:text-white transition-colors">Pinterest</a></div>
                    <div><a href="#" className="hover:text-white transition-colors">Naver Place</a></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute bottom-0 left-0 right-0 p-8 relative"
            >
              {/* Background Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-[120px] md:text-[180px] font-extrabold text-white opacity-[0.05] tracking-tight leading-none">
                  KHAKI SHOP
                </div>
              </div>

              {/* Footer Content */}
              <div className="relative z-10 flex justify-between items-end text-white/70 text-sm">
                <div>SINCE 2018</div>
                <div>©2025 KHAKI SHOP • by YOURAGENCY</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 