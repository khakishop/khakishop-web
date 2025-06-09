import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ 
  className = '', 
  width, 
  height, 
  variant = 'rectangular' 
}: SkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClass = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4'
  }[variant];

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
    />
  );
}

// 이미지 카드용 Skeleton
export function ImageCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      {/* 이미지 영역 */}
      <Skeleton className="w-full h-48 rounded-lg" />
      
      {/* 카테고리 배지 */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>
      
      {/* 제목 */}
      <Skeleton className="w-3/4 h-6" />
      
      {/* 설명 */}
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
      
      {/* 파일 정보 */}
      <Skeleton className="w-1/2 h-3" />
    </div>
  );
}

// 그리드용 Skeleton
export function ImageGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ImageCardSkeleton key={index} />
      ))}
    </div>
  );
} 