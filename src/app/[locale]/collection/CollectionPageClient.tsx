'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import HomeButton from '../../../components/ui/HomeButton';
import { Product, getCollectionSubcategories } from '../../../data/collections';
import { motion } from '../../../lib/motion';

interface CollectionPageClientProps {
  initialProducts: Product[];
  locale: string;
}

const CollectionPageClient: React.FC<CollectionPageClientProps> = ({
  initialProducts,
  locale
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');

  // 🎯 서브카테고리별 필터링
  const filteredProducts = useMemo(() => {
    if (selectedSubcategory === 'All') {
      return initialProducts;
    }
    return initialProducts.filter(product => product.subcategory === selectedSubcategory);
  }, [initialProducts, selectedSubcategory]);

  const subcategories = ['All', ...getCollectionSubcategories()];

  return (
    <div className="min-h-screen bg-white">
      <HomeButton />
      {/* 🎨 헤더 섹션 */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Premium Collections
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            KHAKISHOP의 엄선된 프리미엄 컬렉션을 만나보세요
          </motion.p>
        </div>
      </div>

      {/* 🎯 컨텐츠 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 🏷️ 서브카테고리 필터 */}
        <motion.div
          className="flex flex-wrap gap-4 mb-12 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => setSelectedSubcategory(subcategory)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedSubcategory === subcategory
                ? 'bg-black text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {subcategory === 'All' ? '전체' : subcategory}
            </button>
          ))}
        </motion.div>

        {/* 📊 제품 개수 표시 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-600">
            총 <span className="font-semibold text-black">{filteredProducts.length}</span>개의 컬렉션
          </p>
        </motion.div>

        {/* 🎨 제품 그리드 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group cursor-pointer"
              onClick={() => window.location.href = `/${locale}/collection/${product.slug}`}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* 🖼️ 제품 이미지 */}
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={320}
                    height={256}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero/hero.jpg';
                    }}
                  />
                  {/* 🏷️ 뱃지 */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.bestseller && (
                      <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                        BESTSELLER
                      </span>
                    )}
                    {product.new && (
                      <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                {/* 📝 제품 정보 */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* 🏷️ 서브카테고리 */}
                  {product.subcategory && (
                    <div className="mb-3">
                      <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                        {product.subcategory}
                      </span>
                    </div>
                  )}

                  {/* 💰 가격 정보 */}
                  {product.price && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {product.price.from.toLocaleString()}원
                        </span>
                        {product.price.to && (
                          <span className="text-sm text-gray-500 ml-1">
                            ~ {product.price.to.toLocaleString()}원
                          </span>
                        )}
                        {product.price.unit && (
                          <span className="text-sm text-gray-500 ml-1">
                            /{product.price.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🔍 빈 상태 */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-500 text-lg">선택한 카테고리에 제품이 없습니다.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollectionPageClient;
