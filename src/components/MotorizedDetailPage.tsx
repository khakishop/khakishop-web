'use client';

import React from 'react';
import { motion } from '../lib/motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MotorizedProduct } from '../data/motorized';
import MotorizedImageGallery from './MotorizedImageGallery';

interface MotorizedDetailPageProps {
  product: MotorizedProduct;
}

export default function MotorizedDetailPage({ product }: MotorizedDetailPageProps) {
  const params = useParams();
  const locale = params?.locale as string || 'ko';

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 카테고리 한글명 변환
  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'smart-curtains': '스마트 커튼',
      'smart-blinds': '스마트 블라인드',
      'home-automation': '홈 오토메이션',
      'voice-control': '음성 제어',
      'app-control': '앱 제어',
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
                <Link href={`/${locale}/motorized`} className="text-gray-400 hover:text-gray-600">
                  모터라이즈드
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
            <MotorizedImageGallery slug={product.slug} title={product.title} />
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
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 text-sm font-bold rounded-full">
                    NEW TECH
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
              <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">시스템 시작가</span>
                    <div className="text-3xl font-bold text-gray-900">
                      ₩{formatPrice(product.price.from)}
                    </div>
                    <span className="text-sm text-gray-500">* 설치 및 설정 포함</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    시스템 상담
                  </motion.button>
                </div>
              </div>

              {/* 스마트 기능 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  스마트 기능
                </h3>
                <div className="grid gap-3">
                  {product.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center bg-blue-50 p-3 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 시스템 구성품 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  시스템 구성품
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* 사이즈 옵션 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">시스템 규모</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.sizes.map((size, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-300"
                    >
                      <span className="text-sm font-medium text-gray-700">{size}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 컬러/스타일 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">색상 옵션</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 transition-colors duration-300"
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>

              {/* 설치 및 관리 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  설치 및 설정
                </h3>
                <div className="grid gap-3">
                  {product.installation.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 유지보수 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  시스템 관리
                </h3>
                <div className="grid gap-3">
                  {product.care.map((care, index) => (
                    <div key={index} className="flex items-center bg-purple-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      <span className="text-gray-700">{care}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 보증 */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  품질 보증
                </h3>
                <p className="text-gray-700">{product.warranty}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              스마트홈 통합 상담을 받아보세요
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              전문가가 직접 방문하여 맞춤형 모터라이즈드 시스템을 제안해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                무료 상담 신청
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href={`/${locale}/motorized`}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-300"
              >
                다른 시스템 보기
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 