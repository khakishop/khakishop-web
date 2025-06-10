'use client';

import React, { useState } from 'react';
import { motion } from '../lib/motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAllCurtainProducts, getCurtainCategories, getCurtainProductsByCategory, Product } from '../data/curtain';
import CurtainCard from './CurtainCard';

export default function CurtainPageClient() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const allProducts = getAllCurtainProducts();
  const categories = getCurtainCategories();
  
  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : getCurtainProductsByCategory(selectedCategory as Product['category']);

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

      {/* 🎨 카테고리 필터 */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체보기
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🎨 커튼 제품 그리드 (3열 레이아웃) */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* 제품 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="text-gray-600">
              {selectedCategory === 'all' ? '전체' : selectedCategory} • {filteredProducts.length}개 제품
            </p>
          </motion.div>

          {/* 제품 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CurtainCard product={product} locale={locale} />
              </motion.div>
            ))}
          </div>

          {/* 제품이 없는 경우 */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 text-lg mb-4">선택한 카테고리에 제품이 없습니다.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                전체 제품 보기
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 🎨 맞춤 상담 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-6">
              완벽한 커튼을 찾고 계신가요?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              공간의 특성과 취향에 맞는 최적의 커튼 솔루션을 제안해드립니다. 
              전문 컨설턴트와 함께 이상적인 커튼을 완성해보세요.
            </p>
            
            {/* 맞춤 상담 요청 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <a
                href="https://m.booking.naver.com/booking/13/bizes/966895/items/5342959?area=ple&lang=ko&startDate=2025-03-16&theme=place"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gray-900 text-white px-10 py-5 rounded-full hover:bg-gray-800 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </motion.div>

            {/* 상담 특징 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">무료 측정</h3>
                <p className="text-gray-600 text-sm">전문가가 직접 방문하여 정확한 측정을 진행합니다</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">빠른 설치</h3>
                <p className="text-gray-600 text-sm">주문 후 1-2주 내 전문 설치팀이 완벽하게 시공합니다</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">품질 보증</h3>
                <p className="text-gray-600 text-sm">설치 후 1년간 무상 A/S를 통해 완벽한 품질을 유지합니다</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 