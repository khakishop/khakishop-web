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
        delay: 0.6
      }
    }
  };

  // Animation variants for logo section
  const logoVariants = {
    initial: { 
      opacity: 0,
      x: -50 
    },
    animate: { 
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: -30,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Animation variants for contact section
  const contactVariants = {
    initial: { 
      opacity: 0,
      x: 50 
    },
    animate: { 
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.4
      }
    },
    exit: {
      opacity: 0,
      x: 30,
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
        staggerDirection: -1
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
      {/* Menu Button */}
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-4">
        {/* MENU/CLOSE Text */}
        <span 
          onClick={toggleMenu}
          className="text-sm sm:text-base font-medium tracking-wide cursor-pointer text-white hover:opacity-70 transition-opacity"
          style={{
            WebkitTextStroke: '0.5px white'
          }}
        >
          {isOpen ? 'CLOSE' : 'MENU'}
        </span>
        
        {/* Black Circle Toggle */}
        <div 
          onClick={toggleMenu}
          className="w-3.5 h-3.5 bg-black border border-white rounded-full cursor-pointer hover:opacity-70 transition-opacity"
        />
        
        {/* Search Icon */}
        <div className="cursor-pointer hover:opacity-70 transition-opacity">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="border border-white rounded-sm p-0.5"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="21 21l-4.35-4.35"/>
          </svg>
        </div>
      </div>

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

            {/* 3-Column Grid Layout */}
            <div className="grid grid-cols-3 h-full">
              
              {/* 1. 좌측 영역 - Logo */}
              <motion.div
                variants={logoVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center border-r border-white/20 px-8"
              >
                <div className="text-center">
                  <div className="text-white text-6xl md:text-7xl lg:text-8xl flex flex-col items-center">
                    <span className="font-montserrat font-bold">khaki</span>
                    <span className="font-dm-serif italic">shop</span>
                  </div>
                </div>
              </motion.div>

              {/* 2. 중앙 영역 - Menu Items */}
              <div className="flex items-end justify-center pb-[100px]">
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
                          <div className="text-white text-5xl font-bold uppercase tracking-wide mb-2 group-hover:opacity-70 transition-opacity duration-300">
                            {item.english}
                          </div>
                          <div className="text-sm text-white/70 font-noto-kr font-light tracking-wider">
                            {item.korean}
                          </div>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>
              </div>

              {/* 3. 우측 영역 - Contact Info */}
              <motion.div
                variants={contactVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center border-l border-white/20 px-8"
              >
                <div className="text-right space-y-12">
                  {/* Address */}
                  <div>
                    <div className="text-white text-lg font-semibold mb-3 tracking-wider">
                      ADDRESS
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed">
                      <div>경기도 고양시 일산동구</div>
                      <div>호수로 430번길 24</div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <div className="text-white text-lg font-semibold mb-3 tracking-wider">
                      CONTACT
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed space-y-2">
                      <div>T: 0507-1372-0358</div>
                      <div>
                        <a 
                          href="https://naver.me/F0wo4Ive" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-white/70 transition-colors underline underline-offset-2"
                        >
                          네이버 플레이스
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Social */}
                  <div>
                    <div className="text-white text-lg font-semibold mb-3 tracking-wider">
                      SOCIAL
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed space-y-2">
                      <div><a href="#" className="hover:text-white transition-colors">Instagram</a></div>
                      <div><a href="#" className="hover:text-white transition-colors">Facebook</a></div>
                      <div><a href="#" className="hover:text-white transition-colors">Pinterest</a></div>
                      <div><a href="#" className="hover:text-white transition-colors">Naver Blog</a></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 