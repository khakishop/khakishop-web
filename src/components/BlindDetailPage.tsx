'use client';

import React from 'react';
import { motion } from '../lib/motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '../data/blind';
import BlindImageGallery from './BlindImageGallery';

interface BlindDetailPageProps {
  product: Product;
}

export default function BlindDetailPage({ product }: BlindDetailPageProps) {
  const params = useParams();
  const locale = params?.locale as string || 'ko';

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 카테고리 한글명 변환
  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'venetian-blinds': '베네치안 블라인드',
      'vertical-blinds': '버티컬 블라인드',
      'roller-blinds': '롤러 블라인드',
      'roman-blinds': '로만 블라인드',
      'panel-blinds': '패널 블라인드',
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 브레드크럼 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href={`/${locale}`} className="text-gray-400 hover:text-gray-600">
                  홈
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link href={`/${locale}/blind`} className="text-gray-400 hover:text-gray-600">
                  블라인드
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-500 font-medium">{product.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* 이미지 갤러리 */}
          <div className="sticky top-8 h-fit">
            <BlindImageGallery slug={product.slug} title={product.title} />
          </div>

          {/* 제품 정보 */}
          <div className="mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* 배지 */}
              <div className="flex gap-3 mb-4">
                {product.bestseller && (
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 text-sm font-bold rounded-full">
                    BESTSELLER
                  </span>
                )}
                {product.new && (
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-1 text-sm font-bold rounded-full">
                    NEW ARRIVAL
                  </span>
                )}
              </div>

              {/* 카테고리 */}
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {getCategoryName(product.category)}
              </p>

              {/* 제목 */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* 설명 */}
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* 가격 */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">시작가</span>
                    <div className="text-3xl font-bold text-gray-900">
                      ₩{formatPrice(product.price.from)}
                    </div>
                    <span className="text-sm text-gray-500">* 설치비 별도</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all duration-300"
                  >
                    견적 문의
                  </motion.button>
                </div>
              </div>

              {/* 주요 특징 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">주요 특징</h3>
                <div className="grid gap-3">
                  {product.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 소재 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">사용 소재</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* 사이즈 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">사이즈 옵션</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.sizes.map((size, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-gray-400 transition-colors duration-300"
                    >
                      <span className="text-sm font-medium text-gray-700">{size}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 컬러 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">컬러 옵션</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors duration-300"
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          {/* 설치 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
              설치 안내
            </h3>
            <ul className="space-y-2">
              {product.installation.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 관리 방법 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              관리 방법
            </h3>
            <ul className="space-y-2">
              {product.care.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 품질보증 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              품질보증
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.warranty}
            </p>
          </motion.div>
        </div>

        {/* CTA 섹션 */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black rounded-lg p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              전문가 상담받기
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {product.title}에 대해 더 자세한 정보가 필요하시거나 
              맞춤 견적을 받고 싶으시다면 전문가와 상담하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300"
              >
                견적 문의
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300"
              >
                카탈로그 다운로드
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 