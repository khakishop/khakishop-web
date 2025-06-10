'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { motion } from "../lib/motion";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '../data/products';

export interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = memo(function ProductCard({ product, index = 0 }: ProductCardProps) {
  const params = useParams();
  const locale = params?.locale || 'ko'; // 기본값을 'ko'로 설정

  // 카테고리별 링크 생성 (locale 포함)
  const getProductLink = (product: Product) => {
    let path = '';
    switch (product.category.toLowerCase()) {
      case 'curtain':
      case 'curtains':
        path = `/curtain/${product.slug}`;
        break;
      case 'blind':
      case 'blinds':
        path = `/blind/${product.slug}`;
        break;
      case 'motorized':
      case 'smart':
        path = `/motorized/${product.slug}`;
        break;
      case 'collection':
        path = `/collection/${product.slug}`;
        break;
      default:
        path = `/products/${product.slug}`;
        break;
    }
    return `/${locale}${path}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <Link href={getProductLink(product)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-[#F7F5F3] flex items-center justify-center">
              <span className="text-[#8B7A6B] text-sm">이미지 준비중</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 text-[#8B7A6B] text-xs font-medium rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-medium text-[#8B7A6B] mb-2 group-hover:text-[#D4C4A8] transition-colors">
            {product.title}
          </h3>
          <p className="text-[#8B7A6B]/70 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-[#F7F5F3] text-[#8B7A6B] text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
