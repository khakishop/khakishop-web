'use client';

import React from 'react';
import { motion } from '../lib/motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CurtainProduct } from '../data/curtain';
import CurtainImageGallery from './CurtainImageGallery';

interface CurtainDetailPageProps {
  product: CurtainProduct;
}

export default function CurtainDetailPage({ product }: CurtainDetailPageProps) {
  const params = useParams();
  const locale = params?.locale as string || 'ko';

  return (
    <div className="min-h-screen bg-white">
      {/* 브레드크럼 네비게이션 */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-sm text-gray-500"
          >
            <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
              홈
            </Link>
            <span>•</span>
            <Link href={`/${locale}/curtain`} className="hover:text-gray-700 transition-colors">
              커튼
            </Link>
            <span>•</span>
            <span className="text-gray-700">{product.title}</span>
          </motion.div>
        </div>
      </section>

      {/* 제품 메인 섹션 */}
      <section className="py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* 이미지 갤러리 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <CurtainImageGallery 
                slug={product.slug}
                productTitle={product.title}
                className="lg:sticky lg:top-8"
              />
            </motion.div>

            {/* 제품 정보 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* 카테고리 & 배지 */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-medium">{product.category}</span>
                {product.bestseller && (
                  <span className="bg-orange-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                    BESTSELLER
                  </span>
                )}
                {product.new && (
                  <span className="bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {/* 제품명 & 부제목 */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-3">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-xl text-gray-600 font-medium">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* 가격 */}
              {product.price && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {product.price.from.toLocaleString()}원
                    </span>
                    {product.price.to && (
                      <span className="text-xl text-gray-600">
                        ~ {product.price.to.toLocaleString()}원
                      </span>
                    )}
                    <span className="text-sm text-gray-500">/ {product.price.unit}</span>
                  </div>
                </div>
              )}

              {/* 설명 */}
              <div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* 주요 특징 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 특징</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA 버튼 */}
              <div className="pt-6">
                <a
                  href="https://m.booking.naver.com/booking/13/bizes/966895/items/5342959?area=ple&lang=ko&startDate=2025-03-16&theme=place"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-semibold text-center block hover:bg-gray-800 transition-colors duration-300"
                >
                  상담 예약하기
                </a>
                <p className="text-center text-sm text-gray-500 mt-3">
                  전문 컨설턴트와 함께 완벽한 커튼을 선택해보세요
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 상세 정보 섹션 */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 소재 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                </svg>
                사용 소재
              </h3>
              <ul className="space-y-2">
                {product.materials.map((material, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    • {material}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 사이즈 정보 */}
            {product.sizes && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  사이즈 옵션
                </h3>
                <ul className="space-y-2">
                  {product.sizes.map((size, index) => (
                    <li key={index} className="text-gray-700 text-sm">
                      • {size}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* 컬러 옵션 */}
            {product.colors && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2M9 3h6a2 2 0 012 2v12a4 4 0 01-4 4H9" />
                  </svg>
                  컬러 옵션
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.colors.map((color, index) => (
                    <div key={index} className="text-gray-700 text-sm">
                      • {color}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 설치 및 관리 정보 */}
      <section className="py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 설치 서비스 */}
            {product.installation && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-orange-50 rounded-lg p-8"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  설치 서비스
                </h3>
                <ul className="space-y-3">
                  {product.installation.map((service, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{service}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* 관리 방법 */}
            {product.care && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-blue-50 rounded-lg p-8"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  관리 방법
                </h3>
                <ul className="space-y-3">
                  {product.care.map((method, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{method}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* 보증 정보 */}
          {product.warranty && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-8 bg-green-50 rounded-lg p-8 text-center"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                품질 보증
              </h3>
              <p className="text-gray-700 text-lg">{product.warranty}</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
} 