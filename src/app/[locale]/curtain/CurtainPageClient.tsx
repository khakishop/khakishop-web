'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CategoryPage from '../../../components/layouts/CategoryPage';
import ProductCard from '../../../components/ProductCard';
import { curtainProducts } from '../../../data/products';

export default function CurtainPageClient() {
  return (
    <CategoryPage
      title="CURTAIN"
      description="공간을 감싸는 텍스타일의 미학, 다양한 커튼 스타일을 소개합니다."
    >
      {/* 제품 소개 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {curtainProducts.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            index={index}
          />
        ))}
      </div>

      {/* 하단 CTA 섹션 */}
      <motion.div 
        className="bg-gray-100 rounded-lg p-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-noto-kr">
          맞춤 커튼 상담 받기
        </h2>
        <p className="text-gray-600 mb-8 font-noto-kr font-light">
          공간의 특성과 취향에 맞는 커튼을 제안해드립니다.<br />
          전문가와 상담을 통해 완벽한 커튼을 찾아보세요.
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium font-noto-kr">
          상담 신청하기
        </button>
      </motion.div>
    </CategoryPage>
  );
} 