'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface CollectionCardProps {
  slug: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  categoryLabel: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  slug,
  title,
  summary,
  image,
  category,
  categoryLabel
}) => {
  return (
    <article className="group">
      
      {/* 컬렉션 이미지 */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 mb-8">
        <Image
          src={image}
          alt={`${categoryLabel} 컬렉션 - ${title}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={80}
        />
        
        {/* 카테고리 배지 */}
        <div className="absolute top-6 left-6">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-600 text-xs font-serif tracking-wider rounded-full">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* 컬렉션 정보 */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-neutral-800 leading-tight tracking-tight group-hover:text-neutral-600 transition-colors duration-300">
            <Link 
              href={`/collection/${slug}`}
              aria-label={`${title} 컬렉션 상세보기`}
              title={`${title} 컬렉션 자세히 보기`}
            >
              {title}
            </Link>
          </h2>
          
          <p className="text-sm text-neutral-500 font-light leading-relaxed">
            {summary}
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="pt-4">
          <Link 
            href={`/collection/${slug}`}
            className="inline-block text-sm font-serif text-neutral-700 hover:text-neutral-900 hover:underline transition-all duration-300 tracking-wide"
            aria-label={`${title} 컬렉션 자세히 보기`}
            title={`${title} 컬렉션 상세 페이지로 이동`}
          >
            자세히 보기
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CollectionCard; 