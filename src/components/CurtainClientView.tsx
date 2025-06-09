'use client';

import React from 'react';
import { motion } from "../lib/motion";
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { curtainProducts } from '../data/products';

export default function CurtainClientView() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';
  const allCurtainProducts = curtainProducts;

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
            <span className="text-gray-700">커튼</span>
          </motion.div>

          {/* 페이지 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-tight mb-6">
              Curtain Collection
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              자연광을 감싸는 세심한 배려와 공간의 감성적 완성도를 추구하는 KHAKISHOP의 커튼 컬렉션입니다. 
              고급 원단과 정교한 기술력으로 완성된 각각의 커튼이 당신의 공간에 새로운 이야기를 더해드립니다.
            </p>
          </motion.div>

          {/* 커튼 특징 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">자연광 조절</h3>
              <p className="text-gray-600 text-sm">빛의 양과 각도를 세심하게 조절하여 완벽한 분위기를 연출합니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">프리미엄 원단</h3>
              <p className="text-gray-600 text-sm">엄선된 고급 원단으로 제작하여 품질과 내구성을 보장합니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2M9 3h6a2 2 0 012 2v12a4 4 0 01-4 4H9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">맞춤 제작</h3>
              <p className="text-gray-600 text-sm">공간의 특성에 맞는 완벽한 맞춤 제작 서비스를 제공합니다</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🎨 커튼 제품 그리드 (RIGAS 스타일) */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCurtainProducts.map((product, index) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/${locale}/curtain/${product.slug}`}>
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={product.image || '/placeholder-curtain.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 text-gray-700 text-sm font-medium rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl lg:text-2xl font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
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
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 소재 정보 */}
                    {product.specifications?.material && (
                      <div className="pt-2">
                        <p className="text-gray-500 text-sm">
                          소재: {product.specifications.material}
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

      {/* 🎨 맞춤 상담 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-6">
              완벽한 커튼을 찾고 계신가요?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              공간의 특성과 취향에 맞는 최적의 커튼 솔루션을 제안해드립니다. 
              전문 컨설턴트와 함께 이상적인 커튼을 완성해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-lg font-medium"
              >
                <span>맞춤 상담 요청</span>
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
                <span>컬렉션 둘러보기</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 