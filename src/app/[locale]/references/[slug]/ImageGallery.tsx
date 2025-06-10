'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import { 
  generateImageAlt, 
  getImageSizes,
  IMAGE_OPTIMIZATION
} from '../../../../utils/imageUtils';

interface ImageGalleryProps {
  images: string[];
  projectTitle: string;
  projectSlug: string;
}

const ImageGallery = memo(function ImageGallery({ images, projectTitle, projectSlug }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // 이미지 변경 핸들러
  const handleImageChange = (newIndex: number) => {
    if (newIndex !== selectedImageIndex) {
      setIsImageLoading(true);
      setSelectedImageIndex(newIndex);
    }
  };

  // 이미지 로드 완료 핸들러
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* 선택된 메인 이미지 - RIGAS 스타일 */}
      <div className="aspect-[16/10] relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 group">
        {/* 로딩 스피너 */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}

        <Image
          src={images[selectedImageIndex] || `/images/references/${projectSlug}/main.jpg`}
          alt={generateImageAlt(projectTitle, selectedImageIndex, true)}
          fill
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={selectedImageIndex === 0} // 첫 번째 이미지만 priority
          quality={IMAGE_OPTIMIZATION.quality}
          sizes={getImageSizes('main')}
          placeholder={IMAGE_OPTIMIZATION.placeholder}
          blurDataURL={IMAGE_OPTIMIZATION.blurDataURL}
          onLoad={handleImageLoad}
          onError={handleImageLoad}
        />

        {/* 이미지 오버레이 - RIGAS 스타일 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* 이미지 네비게이션 (1개 이상일 때만 표시) */}
        {images.length > 1 && (
          <>
            {/* 이전 버튼 */}
            <button
              onClick={() =>
                handleImageChange(
                  selectedImageIndex > 0
                    ? selectedImageIndex - 1
                    : images.length - 1
                )
              }
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="이전 이미지"
            >
              <svg
                className="w-6 h-6 -ml-0.5"
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

            {/* 다음 버튼 */}
            <button
              onClick={() =>
                handleImageChange(
                  selectedImageIndex < images.length - 1
                    ? selectedImageIndex + 1
                    : 0
                )
              }
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="다음 이미지"
            >
              <svg
                className="w-6 h-6 ml-0.5"
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

            {/* 이미지 인디케이터 */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedImageIndex === index
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`이미지 ${index + 1}번으로 이동`}
                />
              ))}
            </div>
          </>
        )}

        {/* 이미지 카운터 */}
        <div className="absolute top-6 right-6 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* 썸네일 갤러리 (2개 이상일 때만 표시) - RIGAS 스타일 */}
      {images.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 tracking-tight">
            더 많은 사진 보기
          </h3>
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageChange(index)}
                className={`flex-shrink-0 w-32 h-20 relative rounded-xl overflow-hidden transition-all duration-300 group/thumb ${
                  selectedImageIndex === index
                    ? 'ring-2 ring-gray-900 shadow-lg scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                aria-label={`${projectTitle} ${index + 1}번째 이미지로 이동`}
              >
                <Image
                  src={image || `/images/references/${projectSlug}/main.jpg`}
                  alt={generateImageAlt(projectTitle, index)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                  sizes={getImageSizes('thumbnail')}
                  quality={75} // 썸네일은 품질을 낮춤
                  loading="lazy" // 썸네일은 lazy loading
                  placeholder={IMAGE_OPTIMIZATION.placeholder}
                  blurDataURL={IMAGE_OPTIMIZATION.blurDataURL}
                />
                
                {/* 썸네일 오버레이 */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  selectedImageIndex === index 
                    ? 'bg-blue-600/20' 
                    : 'bg-black/0 group-hover/thumb:bg-black/10'
                }`} />

                {/* 선택된 썸네일 표시 */}
                {selectedImageIndex === index && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 이미지 정보 - RIGAS 스타일 */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 font-light">
          고품질 시공 사례 이미지 • {images.length}장
        </p>
        <p className="text-xs text-gray-500 tracking-wider uppercase">
          Professional Interior Photography by khaki shop
        </p>
      </div>
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery';

export { ImageGallery };
export default ImageGallery;
