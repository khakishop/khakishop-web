'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from "../lib/motion";
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HeroSection() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';

  // 애니메이션 variants - RIGAS 스타일의 부드러운 페이드인
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const textVariants = {
    initial: {
      opacity: 0,
      y: 40,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const imageVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const buttonVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* 왼쪽: 브랜드 메시지 */}
          <motion.div variants={textVariants} className="space-y-8">
            {/* 메인 제목 */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-gray-900 leading-tight tracking-tight">
              Creative Fabrics for Inspired Living
            </h1>

            {/* 부제목 */}
            <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-lg">
              감성과 기능을 담은 텍스타일, 공간을 바꾸는 한 겹의 아름다움
            </p>

            {/* CTA 버튼 */}
            <motion.div variants={buttonVariants} className="pt-4">
              <Link
                href={`/${locale}/references`}
                className="group inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wider font-medium"
              >
                <span>시공 포트폴리오 보기</span>
                <svg
                  className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* 오른쪽: 메인 이미지 */}
          <motion.div variants={imageVariants} className="relative">
            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero/hero.jpg"
                alt="khaki shop 메인 이미지 - 아름다운 텍스타일과 인테리어"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* 이미지 오버레이 효과 */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent"></div>
            </div>

            {/* 장식적 요소 - RIGAS 스타일 */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gray-100 rounded-full -z-10 opacity-30"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gray-200 rounded-full -z-10 opacity-40"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
