'use client';

import React, { memo } from 'react';
import { motion } from '../lib/motion';
import UnifiedProductCard from './UnifiedProductCard';

// 🎯 통일된 Product 인터페이스 
interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'curtains' | 'blinds' | 'references' | 'motorized';
  subcategory?: string;
  displayOrder?: number;
  bestseller?: boolean;
  new?: boolean;
  price?: {
    from: number;
    to?: number;
    currency: string;
    unit?: string;
  };
  // 시공사례 전용
  location?: string;
  clientType?: string;
  projectDate?: string;
}

interface UnifiedProductGridProps {
  products: Product[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  emptyMessage?: string;
  className?: string;
}

// 🎨 RIGAS 스타일 통일 그리드 컴포넌트
const UnifiedProductGrid = memo(function UnifiedProductGrid({
  products,
  loading = false,
  title,
  subtitle,
  showViewAll = false,
  viewAllLink = '#',
  emptyMessage = '등록된 제품이 없습니다.',
  className = ''
}: UnifiedProductGridProps) {

  // 로딩 스켈레톤
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-[4/3] rounded-t-lg"></div>
      <div className="p-6 bg-white rounded-b-lg">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🏷️ 헤더 섹션 */}
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
            
            {/* 장식 라인 */}
            <div className="flex items-center justify-center mt-6">
              <div className="w-12 h-0.5 bg-amber-600"></div>
              <div className="w-3 h-3 bg-amber-600 rounded-full mx-4"></div>
              <div className="w-12 h-0.5 bg-amber-600"></div>
            </div>
          </motion.div>
        )}

        {/* 🔗 View All 링크 */}
        {showViewAll && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-end mb-8"
          >
            <a
              href={viewAllLink}
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors duration-300"
            >
              <span className="mr-2">전체 보기</span>
              <svg className="w-5 h-5 transform hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        )}

        {/* 📱 로딩 상태 */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        )}

        {/* 📋 빈 상태 */}
        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M12 11l8-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {emptyMessage}
            </h3>
            <p className="text-gray-500">
              곧 새로운 제품들을 선보일 예정입니다.
            </p>
          </motion.div>
        )}

        {/* 🎯 제품 그리드 - 3열 레이아웃 */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product, index) => (
              <UnifiedProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* 📊 제품 수 표시 */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 text-sm">
              총 <span className="font-semibold text-amber-600">{products.length}</span>개의 제품
            </p>
          </motion.div>
        )}

        {/* 🎨 하단 장식 */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center mt-16"
          >
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full mx-4"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
          </motion.div>
        )}
      </div>
    </section>
  );
});

UnifiedProductGrid.displayName = 'UnifiedProductGrid';

export default UnifiedProductGrid; 