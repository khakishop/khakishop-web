'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from '../lib/motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAllBlindProducts, getBlindCategories, getBlindProductsByCategory, Product, blindCategories } from '../data/blind';
import BlindCard from './BlindCard';

// ================================================================================
// 🚀 성능 최적화된 블라인드 페이지 클라이언트
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
const ProductGrid = memo(({ products, locale }: { products: Product[], locale: string }) => (
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
        <BlindCard product={product} locale={locale} />
      </motion.div>
    ))}
  </motion.div>
));
ProductGrid.displayName = 'ProductGrid';

export default function BlindPageClient() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ================================================================================
  // 📊 메모이제이션된 데이터 처리
  // ================================================================================
  
  // 전체 제품 데이터 메모이제이션
  const allProducts = useMemo(() => getAllBlindProducts(), []);
  
  // 카테고리별 제품 필터링 메모이제이션
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allProducts;
    }
    return allProducts.filter(product => product.subcategory === selectedCategory);
  }, [selectedCategory, allProducts]);

  // 카테고리 정보 메모이제이션
  const categoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return { id: selectedCategory, name: selectedCategory };
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
              블라인드 컬렉션
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              정밀한 빛 조절과 공간의 미학을 완성하는 프리미엄 블라인드 컬렉션을 만나보세요. 
              베네치안부터 모던 롤러까지, 다양한 스타일과 기능을 제공합니다.
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
            {blindCategories.map((categoryName) => (
              <CategoryButton
                key={categoryName}
                category={{ id: categoryName, name: categoryName }}
                isSelected={selectedCategory === categoryName}
                onClick={() => handleCategoryFilter(categoryName)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
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
              맞춤 블라인드 상담받기
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              공간에 완벽하게 맞는 블라인드를 찾고 계신가요? 
              전문가와 상담하여 최적의 솔루션을 찾아보세요.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg"
                prefetch={false}
              >
                무료 상담 신청
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 