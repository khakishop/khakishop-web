'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from "../lib/motion";
import Link from 'next/link';
import { Collection } from '../data/collections';
import { getValidImagePath, handleImageError } from '../utils/imageFallback';

export interface CollectionCardProps {
  collection: Collection;
  index?: number;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  index = 0,
}) => {
  // 안전성 검사
  if (!collection || !collection.slug) {
    console.error(
      'CollectionCard: collection is undefined or missing slug',
      collection
    );
    return null;
  }

  // 이미지 경로 폴백 적용
  const safeImagePath = getValidImagePath(
    collection.image || '/placeholder-collection.jpg'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <Link href={`/collection/${collection.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={safeImagePath}
            alt={collection.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => handleImageError(e, safeImagePath)}
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 text-[#8B7A6B] text-xs font-medium rounded-full">
              {collection.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-medium text-[#8B7A6B] mb-2 group-hover:text-[#D4C4A8] transition-colors">
            {collection.title}
          </h3>
          <p className="text-[#8B7A6B]/70 text-sm mb-4 line-clamp-2">
            {collection.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
