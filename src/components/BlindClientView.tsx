'use client';

import React from 'react';
import { motion } from "../lib/motion";
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { blindProducts } from '../data/products';

export default function BlindClientView() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';
  const allBlindProducts = blindProducts;

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
            <span className="text-gray-700">블라인드</span>
          </motion.div>

          {/* 페이지 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-tight mb-6">
              Blind Collection
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              정확한 광량 조절과 프라이버시를 동시에 완성하는 KHAKISHOP의 블라인드 컬렉션입니다. 
              기능성과 미적 완성도를 모두 충족하는 다양한 소재와 디자인으로 공간에 질서와 품격을 더해드립니다.
            </p>
          </motion.div>

          {/* 블라인드 특징 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">정밀 조광</h3>
              <p className="text-gray-600 text-sm">각도 조절을 통한 정확한 채광량 컨트롤이 가능합니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">프라이버시</h3>
              <p className="text-gray-600 text-sm">외부 시선을 차단하며 내부 프라이버시를 완벽히 보호합니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">내구성</h3>
              <p className="text-gray-600 text-sm">고품질 소재로 제작하여 오랜 사용에도 변형이 없습니다</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🎨 블라인드 제품 그리드 (RIGAS 스타일) */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allBlindProducts.map((product, index) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/${locale}/blind/${product.slug}`}>
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={product.image || '/placeholder-blind.jpg'}
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
              완벽한 블라인드를 찾고 계신가요?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              공간의 특성과 용도에 맞는 최적의 블라인드 솔루션을 제안해드립니다. 
              기능성과 디자인을 겸비한 이상적인 블라인드를 만나보세요.
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