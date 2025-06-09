'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "../lib/motion";
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

const menuItems = [
  {
    english: 'ABOUT',
    korean: '브랜드 소개',
    path: '/about',
  },
  {
    english: 'COLLECTION',
    korean: '컬렉션',
    path: '/collection',
  },
  {
    english: 'PRODUCTS',
    korean: '전체 제품',
    path: '/products',
  },
  {
    english: 'PROJECT',
    korean: '시공 사례',
    path: '/project',
  },
  {
    english: 'REFERENCES',
    korean: '레퍼런스',
    path: '/references',
  },
  {
    english: 'CURTAIN',
    korean: '커튼',
    path: '/curtain',
  },
  {
    english: 'BLIND',
    korean: '블라인드',
    path: '/blind',
  },
  {
    english: 'MOTORIZED',
    korean: '모터 제품',
    path: '/motorized',
  },
  {
    english: 'CONTACT',
    korean: '상담/후기/지도',
    path: '/contact',
  },
];

export default function FullscreenMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const locale = params?.locale || 'ko'; // 기본값을 'ko'로 설정

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // locale이 포함된 경로를 생성하는 함수
  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

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
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
        delay: 0.4,
      },
    },
  };

  // DESKTOP Animation variants
  const desktopLogoVariants = {
    initial: {
      opacity: 0,
      x: -50,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: -30,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  const desktopContactVariants = {
    initial: {
      opacity: 0,
      x: 50,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.4,
      },
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  // MOBILE Animation variants
  const mobileLogoVariants = {
    initial: {
      opacity: 0,
      y: -30,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: 'easeIn',
      },
    },
  };

  const mobileContactVariants = {
    initial: {
      opacity: 0,
      y: 30,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.6,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  // Animation variants for close button
  const closeButtonVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      rotate: -90,
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.4,
        delay: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotate: 90,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  // DESKTOP Menu container variants
  const desktopMenuContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
  };

  // MOBILE Menu container variants
  const mobileMenuContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.35,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  // DESKTOP Menu item variants
  const desktopMenuItemVariants = {
    initial: {
      opacity: 0,
      y: 30,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  // MOBILE Menu item variants
  const mobileMenuItemVariants = {
    initial: {
      opacity: 0,
      y: 20,
      x: -10,
    },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      x: 5,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <>
      {/* Menu Button */}
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-4">
        {/* MENU/CLOSE Text */}
        <span
          onClick={toggleMenu}
          className="text-sm sm:text-base font-medium tracking-wide uppercase cursor-pointer text-black hover:opacity-70 transition-opacity"
          style={{
            WebkitTextStroke: '1px white',
            textShadow: 'none',
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
            <circle cx="11" cy="11" r="8" />
            <path d="21 21l-4.35-4.35" />
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
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl text-white font-light hover:opacity-60 transition-opacity z-10"
              aria-label="메뉴 닫기"
            >
              ×
            </motion.button>

            {/* Mobile Layout */}
            <div className="block lg:hidden h-full">
              <div className="flex flex-col h-full">
                {/* Mobile Logo Section - 상단 */}
                <motion.div
                  variants={mobileLogoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex items-center justify-center pt-20 pb-8"
                >
                  <div className="text-center">
                    <div className="text-white text-4xl sm:text-5xl flex flex-col items-center">
                      <span className="font-serif font-bold tracking-tight">
                        khaki
                      </span>
                      <span className="font-serif italic opacity-90">shop</span>
                    </div>
                  </div>
                </motion.div>

                {/* Mobile Menu Items - 중앙 */}
                <div className="flex-1 flex items-center justify-center px-6">
                  <motion.nav
                    variants={mobileMenuContainerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full text-center"
                  >
                    <ul className="space-y-6 sm:space-y-8">
                      {menuItems.map((item, index) => (
                        <motion.li
                          key={index}
                          variants={mobileMenuItemVariants}
                        >
                          <Link
                            href={getLocalizedPath(item.path)}
                            onClick={closeMenu}
                            className="block group"
                          >
                            <div className="text-white text-2xl sm:text-3xl font-serif font-medium uppercase tracking-wider mb-1 group-hover:opacity-70 transition-opacity duration-300 leading-tight">
                              {item.english}
                            </div>
                            <div className="text-xs sm:text-sm text-white/60 font-light tracking-wide leading-relaxed">
                              {item.korean}
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.nav>
                </div>

                {/* Mobile Contact Info - 하단 */}
                <motion.div
                  variants={mobileContactVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="pb-8 px-6"
                >
                  <div className="text-center space-y-6">
                    {/* Contact */}
                    <div>
                      <div className="text-white text-sm font-medium mb-2 tracking-widest uppercase">
                        CONTACT
                      </div>
                      <div className="text-white/60 text-xs leading-relaxed space-y-1">
                        <div>T: 0507-1372-0358</div>
                        <div>
                          <a
                            href="https://naver.me/F0wo4Ive"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
                          >
                            네이버 플레이스
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <div className="text-white text-sm font-medium mb-2 tracking-widest uppercase">
                        ADDRESS
                      </div>
                      <div className="text-white/60 text-xs leading-relaxed">
                        <div>경기도 고양시 일산동구 호수로 430번길 24</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Desktop Layout - 기존 3-column 유지 */}
            <div className="hidden lg:grid grid-cols-3 h-full">
              {/* 1. 좌측 영역 - Logo */}
              <motion.div
                variants={desktopLogoVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center border-r border-white/20 px-8"
              >
                <div className="text-center">
                  <div className="text-white text-6xl md:text-7xl lg:text-8xl flex flex-col items-center">
                    <span className="font-serif font-bold tracking-tight">
                      khaki
                    </span>
                    <span className="font-serif italic opacity-90">shop</span>
                  </div>
                </div>
              </motion.div>

              {/* 2. 중앙 영역 - Menu Items */}
              <div className="flex items-center justify-center">
                <motion.nav
                  variants={desktopMenuContainerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center"
                >
                  <ul className="space-y-8 lg:space-y-10">
                    {menuItems.map((item, index) => (
                      <motion.li key={index} variants={desktopMenuItemVariants}>
                        <Link
                          href={getLocalizedPath(item.path)}
                          onClick={closeMenu}
                          className="block group"
                        >
                          <div className="text-white text-4xl lg:text-5xl font-serif font-medium uppercase tracking-wider mb-2 group-hover:opacity-70 transition-opacity duration-300 leading-tight">
                            {item.english}
                          </div>
                          <div className="text-sm text-white/60 font-light tracking-wider">
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
                variants={desktopContactVariants}
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
                      <div>
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          Instagram
                        </a>
                      </div>
                      <div>
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          Facebook
                        </a>
                      </div>
                      <div>
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          Pinterest
                        </a>
                      </div>
                      <div>
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          Naver Blog
                        </a>
                      </div>
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
