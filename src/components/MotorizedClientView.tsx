'use client';

import React from 'react';
import { motion } from "../lib/motion";
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motorizedProducts } from '../data/products';

export default function MotorizedClientView() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';
  const allMotorizedProducts = motorizedProducts;

  return (
    <div className="min-h-screen bg-white">
      {/* 🎨 RIGAS 스타일: 깔끔한 헤더 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* 브레드크럼 네비게이션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-8"
          >
            <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
              홈
            </Link>
            <span>•</span>
            <span className="text-gray-700">전동 시스템</span>
          </motion.div>

          {/* 페이지 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-tight mb-6">
              Motorized System
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              미래의 라이프스타일을 앞당기는 KHAKISHOP의 스마트 전동 시스템입니다. 
              첨단 기술과 우아한 디자인의 만남으로 편리함과 감성적 만족을 동시에 선사하는 혁신적인 솔루션을 경험해보세요.
            </p>
          </motion.div>

          {/* 전동 시스템 특징 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">스마트 제어</h3>
              <p className="text-gray-600 text-sm">스마트폰 앱과 음성 명령으로 언제든지 간편하게 조작할 수 있습니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">자동 스케줄</h3>
              <p className="text-gray-600 text-sm">시간대별 자동 제어로 에너지 효율과 편의성을 극대화합니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">에너지 절약</h3>
              <p className="text-gray-600 text-sm">지능형 센서로 최적의 에너지 효율을 자동으로 관리합니다</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🎨 전동 제품 그리드 (RIGAS 스타일) */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allMotorizedProducts.map((product, index) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/${locale}/motorized/${product.slug}`}>
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={product.image || '/placeholder-motorized.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex items-center gap-1">
                        <span>⚡</span>
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                        SMART
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl lg:text-2xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* 제품 특징 */}
                    {product.features && product.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 시스템 정보 */}
                    {product.specifications?.material && (
                      <div className="pt-2">
                        <p className="text-gray-500 text-sm">
                          시스템: {product.specifications.material}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎨 기술 특화 섹션 */}
      <section className="py-20 lg:py-32 bg-blue-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-6">
              첨단 기술의 차이
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              KHAKISHOP의 전동 시스템은 단순한 자동화를 넘어 지능형 라이프스타일을 제안합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '📱', title: '모바일 제어', desc: 'iOS/Android 앱' },
              { icon: '🔇', title: '무소음 작동', desc: '프리미엄 모터' },
              { icon: '🔋', title: '저전력 설계', desc: '에코 모드 지원' },
              { icon: '🛡️', title: '안전 시스템', desc: '장애물 감지' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎨 스마트 상담 섹션 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-6">
              스마트 홈을 꿈꾸시나요?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              전문 엔지니어와 함께 당신의 공간에 최적화된 스마트 전동 시스템을 설계해보세요. 
              설치부터 A/S까지 완벽한 토탈 서비스를 제공합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 text-lg font-medium"
              >
                <span>⚡ 스마트 솔루션 상담</span>
                <svg
                  className="w-5 h-5 ml-3"
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
              <Link
                href={`/${locale}/collection`}
                className="inline-flex items-center bg-gray-100 text-gray-700 px-8 py-4 rounded-full hover:bg-gray-200 transition-all duration-300 text-lg font-medium"
              >
                <span>설치 사례 보기</span>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              🔧 전문 설치 서비스 및 3년 품질보증 포함
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 