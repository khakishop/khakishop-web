'use client';

import React, { useState, useCallback, useMemo, memo, Suspense } from 'react';
import Image from 'next/image';
import type { ImageMapping } from '../../utils/imageMap';
import { getCategoryIcon, getCategoryDisplayName } from '../../utils/constants/categories';
import ImageUploadZone from './ImageUploadZone';
import { LocalDateDisplay } from '../LocalTimeDisplay';
import VirtualizedImageGrid from './VirtualizedImageGrid';
import DraggableImageGrid from './DraggableImageGrid';
import { ImageGridSkeleton } from '../ui/Skeleton';

interface AdminImagesBrowserProps {
  images: ImageMapping[];
  onImageSelect?: (image: ImageMapping) => void;
  onImageEdit?: (image: ImageMapping) => void;
  onImageDelete?: (image: ImageMapping) => void;
  onImageReorder?: (reorderedImages: ImageMapping[]) => Promise<void>;
  selectedImage?: ImageMapping | null;
  onImagesUpdate?: () => void;
  uploadCategory?: string;
  uploadSubcategory?: string;
  categoryDisplayName?: string;
  enableDragReorder?: boolean; // 드래그 순서 변경 활성화 여부
}

// 🖼️ 최적화된 이미지 카드 컴포넌트
const ImageCard = memo(({ 
  image, 
  isSelected, 
  onClick, 
  onEdit,
  onDelete
}: { 
  image: ImageMapping; 
  isSelected: boolean; 
  onClick: () => void; 
  onEdit: () => void; 
  onDelete?: () => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
  }, []);

  // 이미지 데이터 안전성 검사
  if (!image || !image.src) {
    return (
      <div className="group relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="relative aspect-square bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <span className="text-2xl mb-2">📷</span>
          <span className="text-xs">잘못된 이미지 데이터</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative bg-white border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-blue-500 shadow-lg scale-102' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square bg-gray-100">
        {!imageError ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <Image
              src={image.src}
              alt={image.alt || image.fileName || 'Unknown image'}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <span className="text-2xl mb-2">📷</span>
            <span className="text-xs">이미지 로드 실패</span>
          </div>
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm hover:scale-110 transition-transform shadow-md"
            >
              편집
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:scale-110 hover:bg-red-600 transition-all shadow-md"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* 보호 상태 표시 */}
        {image.isProtected && (
          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            🔒
          </div>
        )}
      </div>

      {/* 이미지 정보 (metadata 안전 접근) */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate text-sm">
          {image.fileName || image.metadata?.title || 'Unknown'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {image.category || image.metadata?.category || 'uncategorized'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {image.metadata?.description || '설명 없음'}
        </p>
        {image.uploadedAt && (
          <p className="text-xs text-gray-400 mt-1">
            <LocalDateDisplay date={image.uploadedAt} />
          </p>
        )}
        {image.metadata?.subject && image.metadata?.subject.length > 0 && (
          <p className="text-xs text-blue-500 mt-1">
            태그: {image.metadata.subject?.join(', ') || '태그 없음'}
          </p>
        )}
      </div>
    </div>
  );
});

ImageCard.displayName = 'ImageCard';

// 🔍 검색 및 필터 컴포넌트
const SearchAndFilter = memo(({ 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy,
  showProtectedOnly,
  setShowProtectedOnly 
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showProtectedOnly: boolean;
  setShowProtectedOnly: (show: boolean) => void;
}) => (
  <div className="bg-gray-50 p-4 border-b border-gray-200">
    <div className="flex flex-col md:flex-row gap-4">
      {/* 검색 */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="파일명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 정렬 */}
      <div className="flex space-x-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">이름순</option>
          <option value="date">최신순</option>
          <option value="size">크기순</option>
        </select>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showProtectedOnly}
            onChange={(e) => setShowProtectedOnly(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">보호된 이미지만</span>
        </label>
      </div>
    </div>
  </div>
));

SearchAndFilter.displayName = 'SearchAndFilter';

// 📄 Pagination 컴포넌트
const Pagination = memo(({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 p-4 border-t border-gray-200">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        이전
      </button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const page = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded-md ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        다음
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default function AdminImagesBrowser({ 
  images, 
  onImageSelect, 
  onImageEdit, 
  onImageDelete,
  onImageReorder,
  selectedImage,
  onImagesUpdate,
  uploadCategory,
  uploadSubcategory,
  categoryDisplayName,
  enableDragReorder
}: AdminImagesBrowserProps) {
  // 📊 디버깅 로그 추가
  console.log('🖼️ AdminImagesBrowser 초기화:', {
    카테고리명: categoryDisplayName || 'Unknown',
    이미지수: images.length,
    업로드카테고리: uploadCategory || 'None',
    하위폴더: uploadSubcategory || 'None',
    선택된이미지: selectedImage?.fileName || 'None'
  });

  // metadata 누락 이미지 검사
  const metadataMissingImages = images.filter(img => !img.metadata);
  if (metadataMissingImages.length > 0) {
    console.warn('⚠️ metadata 누락 이미지들:', metadataMissingImages.map(img => ({
      fileName: img.fileName,
      src: img.src,
      hasMetadata: !!img.metadata
    })));
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showProtectedOnly, setShowProtectedOnly] = useState(false);
  const ITEMS_PER_PAGE = 24;
  const [uploadKey, setUploadKey] = useState(0);
  const [isImageGridLoading, setIsImageGridLoading] = useState(false);

  // 🔍 필터링 및 정렬된 이미지 목록
  const filteredAndSortedImages = useMemo(() => {
    let result = [...images];

    // 기본 안전성 검사 - src가 없는 이미지 제외
    result = result.filter(img => img && img.src && img.fileName);

    // 검색 필터
    if (searchTerm) {
      result = result.filter(img => 
        img.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.alt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 보호 상태 필터
    if (showProtectedOnly) {
      result = result.filter(img => img.isProtected);
    }

    // 정렬
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.fileName || '').localeCompare(b.fileName || '');
        case 'date':
          const dateA = new Date(a.uploadedAt || 0).getTime();
          const dateB = new Date(b.uploadedAt || 0).getTime();
          return dateB - dateA; // 최신순
        case 'size':
          return (b.fileSize || 0) - (a.fileSize || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [images, searchTerm, sortBy, showProtectedOnly]);

  // 📄 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedImages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedImages = filteredAndSortedImages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 페이지 변경 시 맨 위로 스크롤
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.querySelector('.image-grid')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 검색어 변경 시 첫 페이지로 리셋
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((show: boolean) => {
    setShowProtectedOnly(show);
    setCurrentPage(1);
  }, []);

  // 이미지 선택 핸들러
  const handleImageClick = useCallback((image: ImageMapping) => {
    onImageSelect?.(image);
  }, [onImageSelect]);

  const handleImageEdit = useCallback((image: ImageMapping) => {
    onImageEdit?.(image);
  }, [onImageEdit]);

  const handleImageDelete = useCallback((image: ImageMapping) => {
    onImageDelete?.(image);
  }, [onImageDelete]);

  // 업로드 새로고침
  const handleUploadSuccess = useCallback(() => {
    setUploadKey(prev => prev + 1);
    onImagesUpdate?.();
  }, [onImagesUpdate]);

  // 이미지 그리드 로딩 핸들러
  const handleImagesUpdate = useCallback(() => {
    setIsImageGridLoading(true);
    onImagesUpdate?.();
    // 짧은 지연 후 로딩 상태 해제
    setTimeout(() => setIsImageGridLoading(false), 500);
  }, [onImagesUpdate]);

  const renderCategoryGrid = () => {
    if (images.length > 0) return null;

    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📂</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {categoryDisplayName || uploadCategory} 이미지가 없습니다
        </h3>
        <p className="text-gray-600 mb-6">
          이 카테고리에 첫 번째 이미지를 업로드해보세요.
        </p>
        {onImagesUpdate && (
          <button
            onClick={onImagesUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            새로고침
          </button>
        )}
      </div>
    );
  };

  // 이미지 그리드 렌더링 - 가상화 적용
  const renderImageGrid = () => {
    console.log(`🖼️ 이미지 그리드 렌더링: ${images.length}개 이미지`);
    
    return (
      <div className="space-y-6">
        {/* 헤더 정보 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {categoryDisplayName || '전체 이미지'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              총 {images.length}개의 이미지
            </p>
          </div>
          
          {/* 업로드 존 */}
          <div className="w-64">
            <Suspense fallback={<div className="h-16 bg-gray-100 rounded animate-pulse" />}>
              <ImageUploadZone
                key={uploadKey}
                category={uploadCategory || 'gallery'}
                subcategory={uploadSubcategory}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) => {
                  console.error('업로드 실패:', error);
                }}
              />
            </Suspense>
          </div>
        </div>

        {/* 가상화된 이미지 그리드 */}
        <div className="relative">
          <Suspense fallback={<ImageGridSkeleton count={12} />}>
            <DraggableImageGrid
              images={images}
              onImageSelect={onImageSelect}
              onImageEdit={onImageEdit}
              onImageDelete={onImageDelete}
              onImageReorder={onImageReorder}
              selectedImage={selectedImage}
              onImagesUpdate={handleImagesUpdate}
              uploadCategory={uploadCategory}
              uploadSubcategory={uploadSubcategory}
              loading={isImageGridLoading}
              enableDrag={enableDragReorder}
            />
          </Suspense>
        </div>
      </div>
    );
  };

  // 카테고리 계층 결정 로직
  const categoryHierarchy = useMemo(() => {
    // 이미지가 있으면 이미지 그리드 표시
    if (images.length > 0) {
      return [];
    }
    // 이미지가 없고 카테고리 정보가 있으면 카테고리 그리드 표시
    return uploadCategory ? [] : ['categories'];
  }, [images.length, uploadCategory]);

  // 카테고리 계층이 있으면 카테고리 그리드, 없으면 이미지 그리드
  return (
    <div className="w-full">
      {categoryHierarchy.length > 0 ? renderCategoryGrid() : renderImageGrid()}
    </div>
  );
} 