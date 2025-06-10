'use client';

import React, { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MotorizedProduct } from '../data/motorized';
import { motion } from '../lib/motion';

interface MotorizedCardProps {
  product: MotorizedProduct;
  locale?: string;
}

// ================================================================================
// 🚀 성능 최적화된 모터라이즈드 카드 컴포넌트
// ================================================================================

const MotorizedCard = memo(function MotorizedCard({ product, locale = 'ko' }: MotorizedCardProps) {
  // ================================================================================
  // 📊 메모이제이션된 계산
  // ================================================================================
  
  // 가격 포맷팅 메모이제이션
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('ko-KR').format(product.price.from);
  }, [product.price.from]);

  // 카테고리명 정규화 메모이제이션
  const categoryName = useMemo(() => {
    return product.category.replace('-', ' ');
  }, [product.category]);

  // 제품 링크 URL 메모이제이션
  const productUrl = useMemo(() => {
    return `/${locale}/motorized/${product.slug}`;
  }, [locale, product.slug]);

  // 이미지 최적화 설정
  const imageLoader = useCallback((src: string) => {
    return `${src}?w=800&q=75&f=webp`;
  }, []);

  // 주요 특징 슬라이스 메모이제이션
  const displayFeatures = useMemo(() => {
    return product.features.slice(0, 3);
  }, [product.features]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
    >
      <Link href={productUrl} prefetch={false}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.mainImage}
            alt={`${product.title} - 카키샵 모터라이즈드`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            priority={false}
            loading="lazy"
          />
          
          {/* 베스트셀러/신제품 배지 */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.bestseller && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg"
              >
                BEST
              </motion.span>
            )}
            {product.new && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg"
              >
                NEW
              </motion.span>
            )}
          </div>

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-500 flex items-center justify-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 bg-white text-black px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-gray-100"
              type="button"
            >
              자세히 보기
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          {/* 카테고리 */}
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            {categoryName}
          </div>

          {/* 제품명 */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-black transition-colors duration-300 line-clamp-2">
            {product.title}
          </h3>

          {/* 설명 */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* 주요 특징 */}
          <div className="mb-4">
            <ul className="text-xs text-gray-500 space-y-1">
              {displayFeatures.map((feature, index) => (
                <li key={`${product.slug}-feature-${index}`} className="flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 가격 */}
          <div className="flex items-center justify-between">
            <div className="text-right">
              <span className="text-sm text-gray-500">시작가</span>
              <div className="text-xl font-bold text-gray-900">
                ₩{formattedPrice}
              </div>
            </div>
            
            {/* 더보기 화살표 */}
            <motion.div
              whileHover={{ x: 5 }}
              className="text-gray-400 group-hover:text-black transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

MotorizedCard.displayName = 'MotorizedCard';

export default MotorizedCard; 