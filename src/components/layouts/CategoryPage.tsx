'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CategoryPageProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function CategoryPage({ title, description, children }: CategoryPageProps) {
  // 페이지 애니메이션 variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
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
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center"
      >
        {/* 메인 이미지 영역 - RIGAS 스타일로 더 크게 */}
        <motion.div 
          variants={itemVariants}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="aspect-[21/9] sm:aspect-[5/2] lg:aspect-[21/8] max-w-5xl mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm sm:text-lg lg:text-xl font-medium">{title} 메인 이미지</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 페이지 타이틀 - RIGAS 스타일로 더 큰 타이틀 */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-10 font-montserrat tracking-tight"
        >
          {title}
        </motion.h1>

        {/* 서브텍스트 - 더 넓은 여백과 더 큰 텍스트 */}
        <motion.p 
          variants={itemVariants}
          className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 mb-16 sm:mb-20 lg:mb-24 font-noto-kr font-light leading-relaxed max-w-4xl mx-auto"
        >
          {description}
        </motion.p>

        {/* 콘텐츠 영역 */}
        <motion.div
          variants={itemVariants}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
} 