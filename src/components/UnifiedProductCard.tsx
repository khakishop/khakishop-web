'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from '../lib/motion';
import { useParams } from 'next/navigation';

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

interface UnifiedProductCardProps {
  product: Product;
  index?: number;
}

// 🎨 RIGAS 스타일 통일 카드 컴포넌트
export default function UnifiedProductCard({ product, index = 0 }: UnifiedProductCardProps) {
  const params = useParams();
  const locale = params?.locale as string || 'ko';
  
  // 카테고리별 링크 경로 생성
  const getProductLink = () => {
    if (product.category === 'references') {
      return `/${locale}/references/${product.slug}`;
    }
    return `/${locale}/${product.category}/${product.slug}`;
  };

  // 카테고리별 배지 색상
  const getBadgeColor = () => {
    switch (product.category) {
      case 'curtains': return 'bg-amber-100 text-amber-800';
      case 'blinds': return 'bg-blue-100 text-blue-800';
      case 'references': return 'bg-green-100 text-green-800';
      case 'motorized': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 가격 포맷팅
  const formatPrice = (price?: Product['price']) => {
    if (!price) return null;
    const formatted = new Intl.NumberFormat('ko-KR').format(price.from);
    return `₩${formatted}${price.to ? `~${new Intl.NumberFormat('ko-KR').format(price.to)}` : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="group"
    >
      <Link href={getProductLink()}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
          {/* 🖼️ 이미지 섹션 */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* 배지들 */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.bestseller && (
                <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                  BEST
                </span>
              )}
              {product.new && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  NEW
                </span>
              )}
            </div>

            {/* 카테고리 배지 */}
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor()}`}>
                {product.subcategory || product.category.toUpperCase()}
              </span>
            </div>

            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg">
                  자세히 보기
                </span>
              </div>
            </div>
          </div>

          {/* 📝 콘텐츠 섹션 */}
          <div className="p-6">
            {/* 제목 */}
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
              {product.title}
            </h3>

            {/* 설명 */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {product.description}
            </p>

            {/* 시공사례 전용 정보 */}
            {product.category === 'references' && (
              <div className="mb-4 space-y-1">
                {product.location && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-1">📍</span>
                    <span>{product.location}</span>
                  </div>
                )}
                {product.clientType && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-1">🏢</span>
                    <span>{product.clientType}</span>
                  </div>
                )}
                {product.projectDate && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-1">📅</span>
                    <span>{product.projectDate}</span>
                  </div>
                )}
              </div>
            )}

            {/* 가격 정보 */}
            {formatPrice(product.price) && (
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-amber-600">
                  {formatPrice(product.price)}
                </span>
                {product.price?.unit && (
                  <span className="text-sm text-gray-500">
                    / {product.price.unit}
                  </span>
                )}
              </div>
            )}

            {/* 하단 구분선 및 액션 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  {product.category}
                </span>
                <div className="flex items-center text-amber-600 text-sm font-medium">
                  <span className="mr-1">자세히 보기</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 