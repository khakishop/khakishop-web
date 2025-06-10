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
                  className="w-4 h-4 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* 매장 방문 상담 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-8 text-center">
                매장 방문 상담
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 매장 정보 */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      매장 주소
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      경기도 고양시 일산동구 호수로 430번길 24<br />
                      카키샵 (KHAKI SHOP)
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      대표 번호
                    </h4>
                    <p className="text-gray-600">031-123-4567</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      운영 시간
                    </h4>
                    <div className="text-gray-600 space-y-1">
                      <p>오전 10:00 ~ 오후 8:00</p>
                      <p className="text-sm text-gray-500">*정기휴무: 매주 일요일 (1일 가능)</p>
                    </div>
                  </div>

                  {/* 추가 예약 버튼 */}
                  <div className="pt-4">
                    <a
                      href="https://m.booking.naver.com/booking/13/bizes/966895/items/5342959?area=ple&lang=ko&startDate=2025-03-16&theme=place"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm font-medium"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      상담 예약하기
                      <svg
                        className="w-3 h-3 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Google Maps */}
                <div>
                  <h4 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    오시는 길
                  </h4>
                  <div className="relative rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.6835027562447!2d126.76872847539089!3d37.65983207200516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c9fb9bb8b9b43%3A0x7e7e7e7e7e7e7e7e!2z6rK96riw64-EIOqzoOyalee2nCDsnbzsgqDrj5nqtawg7Zi47IiY66GcIDQzMOuyhOq4uCAyNA!5e0!3m2!1sko!2skr!4v1735539600000!5m2!1sko!2skr"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="KHAKI SHOP 매장 위치"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 