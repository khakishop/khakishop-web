'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getAllProducts } from '../../data/products';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsPage() {
  const allProducts = getAllProducts();

  // 페이지 애니메이션 variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { 
      opacity: 0, 
      y: 30 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-screen-xl mx-auto py-20 px-6"
      >
        {/* RIGAS 스타일 페이지 타이틀 */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h1 className="text-5xl font-serif tracking-tight text-gray-900 mb-6">
            All Products
          </h1>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            공간을 완성하는 모든 제품을 한눈에 확인하세요. 커튼부터 블라인드, 전동 시스템까지 다양한 컬렉션을 만나보실 수 있습니다.
          </p>
        </motion.div>

        {/* 제품 그리드 - RIGAS 스타일 */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {allProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              variants={itemVariants}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group block"
              >
                {/* RIGAS 스타일 미니멀 제품 카드 */}
                <div className="space-y-4">
                  {/* 제품 이미지 */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <div className="text-gray-400 text-center">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded flex items-center justify-center">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium">제품 이미지</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 카테고리 배지 */}
                  <div>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs uppercase tracking-widest rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* 제품 정보 */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* 제품 특징 (간략하게) */}
                  <div className="space-y-2">
                    <ul className="text-xs text-gray-500 space-y-1">
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                    <span className="text-sm text-gray-900 group-hover:text-gray-600 transition-colors border-b border-transparent group-hover:border-gray-600">
                      자세히 보기 →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 하단 CTA 섹션 - RIGAS 스타일 */}
        <motion.div variants={itemVariants} className="text-center mt-32">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-serif tracking-tight text-gray-900">
              맞춤 상담 서비스
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              전문가와 함께 공간에 가장 적합한 제품을 찾아보세요.<br />
              무료 상담을 통해 완벽한 솔루션을 제안해드립니다.
            </p>
            <div className="pt-4">
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm uppercase tracking-wider font-medium">
                상담 신청하기
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 