'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Reference 카드 타입 정의
export interface ReferenceCardProps {
  title: string;
  location: string;
  href: string;
  thumbnail?: string;
}

// ReferenceCard 컴포넌트 - RIGAS 스타일로 업데이트
export default function ReferenceCard({ 
  title, 
  location, 
  href, 
  thumbnail 
}: ReferenceCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* 이미지 영역 */}
        <div className="aspect-[4/3] relative bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={`${title} - ${location}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg 
                className="w-16 h-16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        
        {/* 콘텐츠 영역 */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 mb-4">
            {location}
          </p>
          <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
            <span>자세히 보기</span>
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
} 