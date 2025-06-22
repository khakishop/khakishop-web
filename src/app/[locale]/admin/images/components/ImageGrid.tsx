"use client";

/**
 * ================================================================================
 * 🖼️ ImageGrid.tsx - 실제 이미지 관리 시스템과 연동된 그리드
 * ================================================================================
 * 
 * 역할:
 * - useImageManager와 연동하여 실제 이미지 데이터 표시
 * - 이미지 선택, 편집, 삭제 기능
 * - 정렬 및 필터링
 * - 메타데이터 표시
 */

import { useState } from 'react';
import { ImageItem } from '../hooks/useImageManager';
import ImageDetailModal from './ImageDetailModal';

// SVG 아이콘 컴포넌트들 (lucide-react 대신 인라인 SVG 사용)
const MoreVerticalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7,10 12,15 17,10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Trash2Icon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

interface ImageGridProps {
  images: ImageItem[];
  onImageDelete: (imageId: string) => void;
  selectedCategory: string;
  selectedSubcategory: string;
}

export default function ImageGrid({
  images,
  onImageDelete,
  selectedCategory,
  selectedSubcategory
}: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {!images ? '이미지를 불러오는 중...' : '이미지가 없습니다'}
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-sm">
          {!images
            ? '잠시만 기다려주세요.'
            : selectedCategory
              ? `${selectedCategory}${selectedSubcategory ? ` > ${selectedSubcategory}` : ''} 카테고리에 업로드된 이미지가 없습니다.`
              : '카테고리를 선택하여 이미지를 확인하세요.'
          }
        </p>
        {images && (
          <p className="text-xs text-gray-500 mt-2">
            드래그 앤 드롭으로 이미지를 업로드할 수 있습니다.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      {/* 이미지 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => handleImageClick(image)}
          >
            {/* 이미지 썸네일 */}
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gray-200">
                        <div class="text-center text-gray-500">
                          <div class="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center text-xl">
                            📷
                          </div>
                          <p class="text-xs">이미지 로드 실패</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />

              {/* 호버 오버레이 */}
              {hoveredImage === image.id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(image);
                      }}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      title="상세보기"
                    >
                      <EyeIcon />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement('a');
                        link.href = image.url;
                        link.download = image.filename;
                        link.click();
                      }}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      title="다운로드"
                    >
                      <DownloadIcon />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
                          onImageDelete(image.id);
                        }
                      }}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      title="삭제"
                    >
                      <Trash2Icon />
                    </button>
                  </div>
                </div>
              )}

              {/* 카테고리 배지 */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  {image.subcategory}
                </span>
              </div>

              {/* 파일 크기 배지 */}
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                  {formatFileSize(image.size)}
                </span>
              </div>
            </div>

            {/* 이미지 정보 */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1 truncate" title={image.filename}>
                {image.filename.replace(/\.[^/.]+$/, "")} {/* 확장자 제거 */}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>{formatDate(image.uploadDate)}</span>
                <span>#{image.id}</span>
              </div>

              {/* 태그들 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {image.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {image.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                    +{image.tags.length - 3}
                  </span>
                )}
              </div>

              {/* 클릭 힌트 */}
              <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                클릭하여 상세보기 →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 상세 모달 */}
      <ImageDetailModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={onImageDelete}
      />
    </>
  );
}
