'use client';

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from '../lib/motion';
import { getCurtainImagePaths, generateImageAlt, getImageSizes } from '../utils/imageUtils';

interface CurtainImageGalleryProps {
  slug: string;
  productTitle: string;
  className?: string;
}

const CurtainImageGallery = memo(function CurtainImageGallery({ 
  slug, 
  productTitle, 
  className = '' 
}: CurtainImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  useEffect(() => {
    // displayOrder 순서에 따라 정렬된 이미지 경로 가져오기
    const paths = getCurtainImagePaths(slug);
    setImagePaths(paths);
    setIsLoading(false);
  }, [slug]);

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? imagePaths.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev === imagePaths.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse mb-4" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (imagePaths.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm">이미지가 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* 메인 이미지 */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-4 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={imagePaths[selectedImageIndex]}
              alt={generateImageAlt(productTitle, selectedImageIndex + 1, selectedImageIndex === 0)}
              fill
              sizes={getImageSizes('main')}
              className="object-cover"
              priority={selectedImageIndex === 0}
              quality={85}
            />
          </motion.div>
        </AnimatePresence>

        {/* 네비게이션 버튼 */}
        {imagePaths.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="이전 이미지"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="다음 이미지"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* 이미지 인디케이터 */}
        {imagePaths.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {imagePaths.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`이미지 ${index + 1} 선택`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 썸네일 그리드 */}
      {imagePaths.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imagePaths.slice(0, 4).map((imagePath, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-300 ${
                index === selectedImageIndex 
                  ? 'border-orange-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={imagePath}
                alt={generateImageAlt(productTitle, index + 1)}
                fill
                sizes={getImageSizes('thumbnail')}
                className="object-cover"
                quality={75}
              />
              {/* 오버레이 */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                index === selectedImageIndex 
                  ? 'bg-orange-500/20' 
                  : 'bg-black/0 hover:bg-black/10'
              }`} />
            </motion.button>
          ))}
          
          {/* 더 많은 이미지가 있는 경우 '+N' 표시 */}
          {imagePaths.length > 4 && (
            <div className="relative aspect-square rounded-md overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                +{imagePaths.length - 4}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

CurtainImageGallery.displayName = 'CurtainImageGallery';

export default CurtainImageGallery; 