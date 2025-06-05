'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface ProductCardProps {
  title: string;
  description: string;
  features: string[];
  slug?: string;
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  title, 
  description, 
  features, 
  slug, 
  image 
}) => {
  const cardContent = (
    <article className="group">
      
      {/* 제품 이미지 */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 mb-8">
        {image ? (
          <Image
            src={image}
            alt={`제품 이미지 - ${title}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
            <div className="text-neutral-400 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-neutral-200 rounded-lg flex items-center justify-center">
                <svg 
                  className="w-8 h-8" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-serif tracking-wide">제품 이미지</p>
            </div>
          </div>
        )}
      </div>

      {/* 제품 정보 */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-serif text-neutral-800 leading-tight tracking-tight group-hover:text-neutral-600 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-sm text-neutral-500 font-light leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* 특징 리스트 */}
        {features.length > 0 && (
          <ul className="text-sm text-neutral-500 space-y-2" role="list">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 mr-3 flex-shrink-0" aria-hidden="true"></span>
                <span className="leading-relaxed font-light">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA 버튼 */}
        <div className="pt-4">
          {slug ? (
            <Link 
              href={`/products/${slug}`}
              className="inline-block text-sm font-serif text-neutral-700 hover:text-neutral-900 hover:underline transition-all duration-300 tracking-wide"
              aria-label={`${title} 제품 자세히 보기`}
              title={`${title} 제품 상세 페이지로 이동`}
            >
              자세히 보기
            </Link>
          ) : (
            <span 
              className="inline-block text-sm font-serif text-neutral-700 tracking-wide"
              aria-label={`${title} 제품 정보`}
            >
              자세히 보기
            </span>
          )}
        </div>
      </div>
    </article>
  );

  return cardContent;
};

export default ProductCard; 