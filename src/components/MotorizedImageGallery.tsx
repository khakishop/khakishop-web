'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from '../lib/motion';
import { generateImageAlt, getImageSizes, getMotorizedImagePaths } from '../utils/imageUtils';

interface MotorizedImageGalleryProps {
  slug: string;
  title: string;
}

export default function MotorizedImageGallery({ slug, title }: MotorizedImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    // 이미지 경로들 가져오기
    const imagePaths = getMotorizedImagePaths(slug);
    setImages(imagePaths);
    setIsLoading(false);
  }, [slug]);

  // 이미지 로딩 완료 처리
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(Array.from(prev).concat([index])));
  }, []);

  // 다음 이미지
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // 이전 이미지
  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  if (isLoading) {
    return (
      <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-blue-400">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-blue-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <p>이미지를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={generateImageAlt(title, currentIndex + 1, currentIndex === 0)}
              fill
              className="object-cover"
              sizes={getImageSizes('gallery')}
              priority={currentIndex === 0}
              onLoad={() => handleImageLoad(currentIndex)}
            />

            {/* 로딩 오버레이 */}
            {!loadedImages.has(currentIndex) && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse flex items-center justify-center">
                <div className="text-blue-400">
                  <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 네비게이션 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="이전 이미지"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="다음 이미지"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* 이미지 카운터 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 썸네일 */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentIndex
                ? 'border-blue-600 shadow-lg'
                : 'border-gray-200 hover:border-blue-400'
                }`}
            >
              <Image
                src={image}
                alt={generateImageAlt(title, index + 1)}
                fill
                className="object-cover"
                sizes="80px"
              />

              {/* 선택된 썸네일 오버레이 */}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-blue-600 bg-opacity-20" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* 이미지 정보 */}
      <div className="text-sm text-gray-500 text-center">
        <p>🖱️ 마우스로 네비게이션 버튼 클릭 | ⌨️ 화살표 키로 이동</p>
      </div>
    </div>
  );
} 