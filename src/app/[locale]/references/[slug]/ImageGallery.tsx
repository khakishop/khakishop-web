'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  projectTitle: string;
}

export function ImageGallery({ images, projectTitle }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-8">
      {/* 선택된 메인 이미지 */}
      <div className="aspect-[16/10] relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
        <Image
          src={images[selectedImageIndex] || '/placeholder-project.jpg'}
          alt={`${projectTitle} - 이미지 ${selectedImageIndex + 1}`}
          fill
          className="object-cover transition-transform duration-700"
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
        />

        {/* 이미지 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent"></div>

        {/* 이미지 네비게이션 (1개 이상일 때만 표시) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImageIndex(
                  selectedImageIndex > 0
                    ? selectedImageIndex - 1
                    : images.length - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setSelectedImageIndex(
                  selectedImageIndex < images.length - 1
                    ? selectedImageIndex + 1
                    : 0
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 썸네일 갤러리 (1개 이상일 때만 표시) */}
      {images.length > 1 && (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-24 h-16 relative rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImageIndex === index
                  ? 'ring-2 ring-gray-900 shadow-lg'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image || '/placeholder-project.jpg'}
                alt={`${projectTitle} 썸네일 ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
