'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CategoryPage from '../../../components/layouts/CategoryPage';
import ProductCard from '../../../components/ProductCard';
import { motorizedProducts } from '../../../data/products';

export default function MotorizedPage() {
  return (
    <CategoryPage
      title="MOTORIZED"
      description="버튼 하나로 완성되는 편안함, 전동 시스템으로 공간을 완성하세요."
    >
      {/* 제품 소개 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {motorizedProducts.map((product, index) => (
          <ProductCard
            key={index}
            title={product.title}
            description={product.description}
            features={product.features}
            slug={product.slug}
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
          스마트 전동 시스템 상담 받기
        </h2>
        <p className="text-gray-600 mb-8 font-noto-kr font-light">
          생활 패턴과 공간 특성에 맞는 전동 시스템을 제안해드립니다.<br />
          편리함과 에너지 효율성을 동시에 고려한 스마트 솔루션을 경험하세요.
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium font-noto-kr">
          상담 신청하기
        </button>
      </motion.div>
    </CategoryPage>
  );
} 