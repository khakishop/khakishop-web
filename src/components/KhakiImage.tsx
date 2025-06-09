
// ================================================================================
// 🎨 KHAKISHOP 이미지 폴백 컴포넌트
// ================================================================================

import React, { useState } from 'react';
import Image from 'next/image';

interface KhakiImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackType?: 'hero' | 'collection' | 'product' | 'gallery';
  priority?: boolean;
}

export default function KhakiImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackType = 'collection',
  priority = false
}: KhakiImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const fallbackClasses = {
    hero: 'khaki-fallback-hero',
    collection: 'khaki-fallback-collection', 
    product: 'khaki-fallback-product',
    gallery: 'khaki-fallback-gallery'
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div 
        className={`khaki-image-container ${fallbackClasses[fallbackType]} ${className}`}
        style={{ width: width || '100%', height: height || 'auto', minHeight: '200px' }}
      >
        <div className="khaki-hero-text">
          <h3 style={{ color: 'var(--khaki-text-primary)', margin: 0 }}>
            khakishop
          </h3>
          <p style={{ color: 'var(--khaki-text-secondary)', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            {alt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`khaki-image-container ${className}`}>
      {imageLoading && (
        <div 
          className="khaki-image-loading"
          style={{ width: width || '100%', height: height || 'auto', minHeight: '200px' }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={imageLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}
      />
    </div>
  );
}
