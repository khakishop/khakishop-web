'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from '../lib/motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAllMotorizedProducts, getMotorizedCategories, getMotorizedProductsByCategory, MotorizedProduct, motorizedCategories } from '../data/motorized';
import MotorizedCard from './MotorizedCard';

// ================================================================================
// 🚀 성능 최적화된 모터라이즈드 페이지 클라이언트
// ================================================================================

// 카테고리 버튼 컴포넌트 메모이제이션
const CategoryButton = memo(({ 
  category, 
  isSelected, 
  onClick 
}: { 
  category: { id: string; name: string }, 
  isSelected: boolean, 
  onClick: () => void 
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
      isSelected
        ? 'bg-black text-white shadow-lg'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {category.name}
  </motion.button>
));
CategoryButton.displayName = 'CategoryButton';

// 제품 그리드 컴포넌트 메모이제이션
const ProductGrid = memo(({ products, locale }: { products: MotorizedProduct[], locale: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  >
    {products.map((product, index) => (
      <motion.div
        key={product.slug}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <MotorizedCard product={product} locale={locale} />
      </motion.div>
    ))}
  </motion.div>
));
ProductGrid.displayName = 'ProductGrid';

export default function MotorizedPageClient() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ================================================================================
  // 📊 메모이제이션된 데이터 처리
  // ================================================================================
  
  // 전체 제품 데이터 메모이제이션
  const allProducts = useMemo(() => getAllMotorizedProducts(), []);
  
  // 카테고리별 제품 필터링 메모이제이션
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allProducts;
    }
    return getMotorizedProductsByCategory(selectedCategory);
  }, [selectedCategory, allProducts]);

  // 카테고리 정보 메모이제이션
  const categoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return motorizedCategories.find(cat => cat.id === selectedCategory);
  }, [selectedCategory]);

  // ================================================================================
  // 🎯 최적화된 이벤트 핸들러
  // ================================================================================
  
  // 카테고리 필터 핸들러 메모이제이션
  const handleCategoryFilter = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // "전체보기" 버튼 클릭 핸들러
  const handleShowAll = useCallback(() => {
    setSelectedCategory('all');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              모터라이즈드 컬렉션
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              미래형 스마트홈을 위한 모터라이즈드 시스템을 만나보세요. 
              음성 제어, 앱 제어, AI 자동화로 편리하고 스마트한 창호 솔루션을 제공합니다.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 py-6">
            {/* 전체보기 버튼 */}
            <CategoryButton
              category={{ id: 'all', name: '전체보기' }}
              isSelected={selectedCategory === 'all'}
              onClick={handleShowAll}
            />
            
            {/* 카테고리 버튼들 */}
            {motorizedCategories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryFilter(category.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 카테고리 설명 */}
      {categoryInfo && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {categoryInfo.name}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {categoryInfo.description}
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* 제품 그리드 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} locale={locale} />
        ) : (
          // 제품이 없을 때
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <p className="text-xl text-gray-500">해당 카테고리의 제품이 없습니다.</p>
          </motion.div>
        )}
      </div>

      {/* CTA 섹션 */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              스마트홈 통합 상담받기
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              전문가가 맞춤형 모터라이즈드 시스템을 제안해드립니다
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              무료 상담 신청하기
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 