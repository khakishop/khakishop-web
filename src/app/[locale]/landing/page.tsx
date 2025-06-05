'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// 메타데이터 export
export const metadata = {
  title: 'khaki shop - 커튼과 블라인드의 새로운 기준',
  description: '고품질 커튼, 블라인드, 전동 시스템으로 공간을 완성하는 khaki shop. 전문 컨설팅부터 시공까지 원스톱 서비스.',
  keywords: '커튼, 블라인드, 전동커튼, 인테리어, khaki shop',
  openGraph: {
    title: 'khaki shop - 커튼과 블라인드의 새로운 기준',
    description: '고품질 커튼, 블라인드, 전동 시스템으로 공간을 완성하는 khaki shop',
    type: 'website',
  }
};

// 애니메이션 variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// 소개 카드 데이터
const introCards = [
  {
    title: '컬렉션',
    description: '엄선된 커튼과 블라인드로\n공간의 품격을 높입니다',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
      </svg>
    ),
    href: '/collection'
  },
  {
    title: '레퍼런스',
    description: '다양한 공간에서의\n성공적인 프로젝트를 확인하세요',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    ),
    href: '/references'
  },
  {
    title: '브랜드 철학',
    description: '품질과 디자인을 통해\n특별한 공간을 만들어갑니다',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    href: '/about'
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero 섹션 - RIGAS 스타일 전체 너비 이미지 + 중앙 정렬 텍스트 */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 (placeholder) */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-900">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* 실제 배경 이미지가 들어갈 자리 */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-neutral-300 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-600 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-serif tracking-wider opacity-60">HERO BACKGROUND IMAGE</p>
            </div>
          </div>
        </div>

        {/* Hero 텍스트 콘텐츠 */}
        <motion.div 
          className="relative z-10 text-center text-white px-6 md:px-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 leading-tight tracking-tight"
            variants={fadeInUp}
          >
            <span className="block">khaki shop</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl font-light mb-12 leading-relaxed max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            공간을 완성하는 커튼과 블라인드<br />
            품질과 디자인의 조화로 만나는 새로운 기준
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
          >
            <Link 
              href="/collection"
              className="bg-white text-neutral-800 px-8 py-4 rounded-lg font-medium hover:bg-neutral-100 transition-colors duration-300 text-center min-w-[160px]"
            >
              컬렉션 보기
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-neutral-800 transition-colors duration-300 text-center min-w-[160px]"
            >
              상담 문의
            </Link>
          </motion.div>
        </motion.div>

        {/* 스크롤 다운 표시 */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex flex-col items-center">
            <p className="text-sm font-light mb-4 tracking-wider">SCROLL DOWN</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 소개 카드 섹션 */}
      <section className="py-24 px-6 md:px-8 lg:px-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-neutral-800 mb-6 leading-tight">
              khaki shop과 함께하는<br />특별한 여정
            </h2>
            <p className="text-lg text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
              품질 높은 소재와 정교한 시공으로 공간의 가치를 높이는 파트너
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {introCards.map((card, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Link 
                  href={card.href}
                  className="group block p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-neutral-800 group-hover:text-white transition-colors duration-300">
                      {card.icon}
                    </div>
                    
                    <h3 className="text-2xl font-serif text-neutral-800 mb-4 group-hover:text-neutral-600 transition-colors duration-300">
                      {card.title}
                    </h3>
                    
                    <p className="text-neutral-600 font-light leading-relaxed whitespace-pre-line flex-1">
                      {card.description}
                    </p>
                    
                    <div className="mt-6 text-neutral-400 group-hover:text-neutral-600 transition-colors duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 bg-neutral-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8 leading-tight">
              당신의 공간을 완성해보세요
            </h2>
            
            <p className="text-lg md:text-xl font-light mb-12 leading-relaxed text-neutral-300 max-w-2xl mx-auto">
              전문 컨설팅부터 맞춤 제작, 시공까지<br />
              khaki shop이 함께합니다
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/contact"
                className="bg-white text-neutral-800 px-10 py-4 rounded-lg font-medium hover:bg-neutral-100 transition-colors duration-300 text-center min-w-[180px] text-lg"
              >
                지금 문의하기
              </Link>
              <Link 
                href="/collection"
                className="border-2 border-white text-white px-10 py-4 rounded-lg font-medium hover:bg-white hover:text-neutral-800 transition-colors duration-300 text-center min-w-[180px] text-lg"
              >
                제품 둘러보기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 