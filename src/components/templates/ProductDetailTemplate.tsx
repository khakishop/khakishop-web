'use client';

import React from 'react';
import { motion } from '../../lib/motion';
import { Image, Link } from '../../lib/imports';
import { useParams } from 'next/navigation';

interface Product {
  slug: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  price?: string;
  features?: string[];
  specifications?: {
    material?: string;
    size?: string;
    color?: string;
    installation?: string;
  };
  gallery?: string[];
}

interface ProductDetailTemplateProps {
  product: Product;
  relatedProducts: Product[];
  categoryName: string;
  categoryPath: string;
}

export default function ProductDetailTemplate({ 
  product, 
  relatedProducts,
  categoryName,
  categoryPath
}: ProductDetailTemplateProps) {
  const params = useParams();
  const locale = params?.locale as string || 'ko';

  const getLocalizedPath = (path: string) => `/${locale}${path}`;

  return (
    <div className="min-h-screen bg-white">
      {/* 브레드크럼 네비게이션 */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 lg:px-12 pt-8 pb-4"
      >
        <div className="text-sm text-neutral-500 font-light tracking-wider">
          <Link href={getLocalizedPath('/')} className="hover:text-neutral-800 transition-colors">
            홈
          </Link>
          <span className="mx-3">/</span>
          <Link 
            href={getLocalizedPath(categoryPath)} 
            className="hover:text-neutral-800 transition-colors"
          >
            {categoryName}
          </Link>
          <span className="mx-3">/</span>
          <span className="text-neutral-800">{product.title}</span>
        </div>
      </motion.nav>

      {/* 메인 콘텐츠 그리드 */}
      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* 이미지 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* 메인 이미지 */}
            <div className="aspect-[4/5] relative overflow-hidden bg-neutral-50">
              <Image
                src={product.image || '/images/hero/hero.jpg'}
                alt={product.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>

            {/* 갤러리 이미지들 */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {product.gallery.slice(0, 3).map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="aspect-square relative overflow-hidden bg-neutral-50 cursor-pointer group"
                  >
                    <Image
                      src={img || '/images/hero/hero.jpg'}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/hero/hero.jpg';
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 제품 정보 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8 space-y-10"
          >
            {/* 제품명 */}
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl lg:text-5xl font-light text-neutral-900 tracking-tight leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {product.title}
              </motion.h1>
              
              {product.price && (
                <motion.div 
                  className="text-2xl font-light text-neutral-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {product.price}
                </motion.div>
              )}
            </div>

            {/* 구분선 */}
            <motion.div 
              className="w-20 h-px bg-neutral-300"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />

            {/* 제품 설명 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <p className="text-lg leading-relaxed text-neutral-700 font-light">
                {product.description}
              </p>
            </motion.div>

            {/* 기능 특징 */}
            {product.features && product.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-neutral-900 tracking-wide">
                  주요 특징
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-1 h-1 bg-neutral-400 rounded-full mt-3 flex-shrink-0" />
                      <span className="text-neutral-700 font-light leading-relaxed">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* 제품 사양 */}
            {product.specifications && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-neutral-900 tracking-wide">
                  제품 사양
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    value && (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                        className="flex justify-between items-center py-3 border-b border-neutral-100 last:border-b-0"
                      >
                        <span className="font-light text-neutral-600 capitalize">
                          {key === 'material' ? '소재' : 
                           key === 'size' ? '크기' : 
                           key === 'color' ? '색상' : 
                           key === 'installation' ? '설치' : key}
                        </span>
                        <span className="text-neutral-900 font-light">
                          {value}
                        </span>
                      </motion.div>
                    )
                  ))}
                </div>
              </motion.div>
            )}

            {/* 문의 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="pt-8"
            >
              <a 
                href="https://m.booking.naver.com/booking/13/bizes/966895/items/5342959?area=ple&lang=ko&startDate=2025-03-16&theme=place"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full lg:w-auto px-12 py-4 bg-neutral-900 text-white font-light tracking-wider hover:bg-neutral-800 transition-colors duration-300 min-w-[200px] text-center"
              >
                맞춤 상담 요청
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 상담 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="bg-white border-t border-neutral-100 py-20"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-3xl lg:text-4xl font-light text-neutral-900 tracking-tight"
            >
              매장 방문 상담
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="w-20 h-px bg-neutral-300 mx-auto mt-8" 
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-lg text-neutral-600 font-light mt-6 max-w-2xl mx-auto"
            >
              전문 상담사와 함께 공간에 맞는 최적의 커튼을 선택해보세요.<br />
              실제 원단을 보고 만져보며 상담받으실 수 있습니다.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* 매장 정보 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-light text-neutral-900 mb-6">매장 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-neutral-900 font-medium">주소</p>
                      <p className="text-neutral-600 font-light mt-1">경기도 고양시 일산동구 호수로 430번길 24</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-neutral-900 font-medium">전화번호</p>
                      <p className="text-neutral-600 font-light mt-1">031-123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-neutral-900 font-medium">운영시간</p>
                      <p className="text-neutral-600 font-light mt-1">
                        평일 09:00 - 18:00<br />
                        토요일 09:00 - 17:00<br />
                        일요일, 공휴일 휴무
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 예약 버튼 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <a 
                  href="https://m.booking.naver.com/booking/13/bizes/966895/items/5342959?area=ple&lang=ko&startDate=2025-03-16&theme=place"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-neutral-900 text-white font-light tracking-wider hover:bg-neutral-800 transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>네이버 예약으로 상담 신청</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>

            {/* 지도 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-light text-neutral-900">매장 위치</h3>
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.926899999999!2d126.7745!3d37.6574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDM5JzI2LjYiTiAxMjbCsDQ2JzI4LjIiRQ!5e0!3m2!1sko!2skr!4v1620000000000!5m2!1sko!2skr&q=경기도+고양시+일산동구+호수로+430번길+24"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 관련 제품 섹션 */}
      {relatedProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="bg-neutral-50 py-20"
        >
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-light text-neutral-900 tracking-tight">
                관련 제품
              </h2>
              <div className="w-20 h-px bg-neutral-300 mx-auto mt-8" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedProducts.slice(0, 3).map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <Link 
                    href={getLocalizedPath(`${categoryPath}/${relatedProduct.slug}`)}
                    className="group block"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-white mb-6">
                      <Image
                        src={relatedProduct.image || '/images/hero/hero.jpg'}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/hero/hero.jpg';
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-light text-neutral-900 group-hover:text-neutral-600 transition-colors">
                        {relatedProduct.title}
                      </h3>
                      <p className="text-sm text-neutral-600 font-light line-clamp-2">
                        {relatedProduct.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
} 