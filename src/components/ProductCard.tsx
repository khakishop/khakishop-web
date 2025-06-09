'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '../data/products';

export interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <Link href={`/products/${product.slug}`}>
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
};

export default ProductCard; 