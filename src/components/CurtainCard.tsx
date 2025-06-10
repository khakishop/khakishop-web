'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../data/curtain';
import { motion } from '../lib/motion';

interface CurtainCardProps {
  product: Product;
  locale?: string;
}

const CurtainCard = memo(function CurtainCard({ product, locale = 'ko' }: CurtainCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/${locale}/curtain/${product.slug}`} className="block">
        {/* 🖼️ 제품 이미지 */}
        <div className="relative w-full h-64 overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />
          
          {/* 📊 배지들 */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestseller && (
              <span className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded-md">
                BEST
              </span>
            )}
            {product.new && (
              <span className="bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-md">
                NEW
              </span>
            )}
          </div>

          {/* 💰 가격 */}
          {product.price && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
              {product.price.from.toLocaleString()}원~
            </div>
          )}

          {/* 🎯 Hover 오버레이 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* 📝 제품 정보 */}
        <div className="p-6">
          {/* 카테고리 */}
          <div className="text-sm text-gray-500 mb-2 font-medium">
            {product.subcategory || product.category}
          </div>

          {/* 제목 */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
            {product.title}
          </h3>

          {/* 설명 */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
            {product.description}
          </p>

          {/* 주요 특징 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
              >
                {feature}
              </span>
            ))}
            {product.features.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.features.length - 3}개 더
              </span>
            )}
          </div>

          {/* CTA 버튼 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {product.warranty}
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center text-orange-600 font-semibold text-sm group-hover:text-orange-700"
            >
              자세히 보기
              <svg 
                className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default CurtainCard; 