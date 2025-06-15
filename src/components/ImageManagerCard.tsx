'use client';

import Image from 'next/image';
import React, { memo, useCallback, useRef, useState } from 'react';
import type { ImageMapping } from '../utils/imageMap';
import { generateMetadataForUpload } from '../utils/imageMap';
import { ERROR_PLACEHOLDER_URL, PLACEHOLDER_CARD_URL } from '../utils/placeholder';
import {
  getAcceptMimeTypesString,
  validateImageFile
} from '../utils/validateImageFile';
import { LocalTimeDisplay } from './LocalTimeDisplay';

// Static placeholder - 성능 최적화: 동적 생성 방지
const STATIC_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjdGNUYzIi8+CjxnIG9wYWNpdHk9IjAuNCI+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSIyMCIgc3Ryb2tlPSIjOEI3QTZCIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9nPgo8dGV4dCB4PSIxNjAiIHk9IjEzMCIgZm9udC1mYW1pbHk9ImFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOEI3QTZCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5raGFraSBzaG9wPC90ZXh0Pgo8L3N2Zz4K';

// ================================================================================
// 🎨 KHAKISHOP 감성적 이미지 관리 카드 (성능 최적화 버전)
// ================================================================================
// 🚀 최적화: React.memo, static placeholder, 렌더링 성능 개선

interface ImageManagerCardProps {
  imageData: ImageMapping;
  onUpdate: (imageId: string, newPath: string) => void;
  onProtectionToggle?: (imageId: string, isProtected: boolean) => void;
  onDelete?: (imageId: string) => void;
}

// 🎨 카테고리 아이콘 맵 (성능 최적화)
const CATEGORY_ICONS = {
  hero: '🌟',
  landing: '🏠',
  projects: '🏗️',
  collections: '🎨',
  references: '🏢',
  products: '🛍️',
  gallery: '🖼️',
  blog: '📝',
  about: '👥',
  future: '🚀',
} as const;

// 🎨 카테고리 색상 맵 (성능 최적화)
const CATEGORY_COLORS = {
  hero: { bg: '#2D2823', text: '#FFFFFF', badge: '#D4C4B0' },
  landing: { bg: '#4A453E', text: '#FFFFFF', badge: '#E8E5E1' },
  gallery: { bg: '#8B7A6B', text: '#FFFFFF', badge: '#F7F5F3' },
  projects: { bg: '#6B5B73', text: '#FFFFFF', badge: '#E1D4E8' },
  collections: { bg: '#73826B', text: '#FFFFFF', badge: '#E8F0E1' },
  references: { bg: '#826B73', text: '#FFFFFF', badge: '#F0E1E8' },
  products: { bg: '#5B7382', text: '#FFFFFF', badge: '#D4E1E8' },
  blog: { bg: '#735B82', text: '#FFFFFF', badge: '#E1D4F0' },
  about: { bg: '#82735B', text: '#FFFFFF', badge: '#F0E8D4' },
  future: { bg: '#5B8273', text: '#FFFFFF', badge: '#D4F0E8' },
  default: { bg: '#8B7A6B', text: '#FFFFFF', badge: '#F7F5F3' },
};

const ImageManagerCard = memo(function ImageManagerCard({
  imageData,
  onUpdate,
  onProtectionToggle,
  onDelete,
}: ImageManagerCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'success' | 'error' | 'validation-error'
  >('idle');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [hasImageError, setHasImageError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProtectionDialog, setShowProtectionDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 🎨 카테고리별 색상 계산 (useMemo로 캐싱)
  const categoryColor = React.useMemo(() => {
    const category = imageData.metadata?.category || 'default';
    return (
      CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ||
      CATEGORY_COLORS.default
    );
  }, [imageData.metadata?.category]);

  // 🎯 최적화된 카테고리 아이콘 반환
  const getCategoryIcon = useCallback((category: string) => {
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '📷';
  }, []);

  // 우선순위 색상
  const getPriorityColor = useCallback((priority: number) => {
    if (priority === 1) return 'bg-red-100 text-red-700 border-red-200';
    if (priority === 2) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }, []);

  // 메타데이터 적용 함수
  const applyImageMetadata = useCallback(
    (imgElement: HTMLImageElement, fileName: string) => {
      const metadata =
        imageData.metadata ||
        generateMetadataForUpload(
          fileName,
          imageData.metadata?.category || 'gallery',
          imageData.metadata?.description || '자동 생성 설명'
        );

      if (metadata) {
        imgElement.alt = metadata.alt;
        imgElement.title = metadata.title;
        imgElement.setAttribute('data-style', metadata.dataStyle);
        imgElement.setAttribute('data-category', metadata.category);
        imgElement.setAttribute('data-priority', (metadata.priority || 0).toString());

        imgElement.classList.add('khaki-shop-image');
        imgElement.classList.add(`style-${metadata.dataStyle}`);
        imgElement.classList.add(`category-${metadata.category}`);
      }
    },
    [imageData.metadata]
  );

  // 파일 업로드 처리
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      const validationResult = validateImageFile(file, 10);
      if (!validationResult.isValid) {
        setValidationMessage(
          validationResult.message +
          (validationResult.suggestedAction
            ? ` ${validationResult.suggestedAction}`
            : '')
        );
        setUploadStatus('validation-error');
        setTimeout(() => {
          setUploadStatus('idle');
          setValidationMessage('');
        }, 4000);
        return;
      }

      setIsUploading(true);
      setUploadStatus('idle');
      setValidationMessage('');

      try {
        const uploadMetadata = generateMetadataForUpload(
          file.name,
          imageData.metadata?.category || 'gallery',
          imageData.metadata?.description || '업로드된 이미지'
        );

        const formData = new FormData();
        formData.append('file', file);
        formData.append('imageId', imageData.id);
        formData.append('category', imageData.metadata?.category || 'gallery');
        formData.append('targetPath', imageData.targetPath);
        formData.append('metadata', JSON.stringify(uploadMetadata));

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setUploadStatus('success');
          setHasImageError(false);
          onUpdate(imageData.id, result.imagePath);

          setTimeout(() => {
            const imgElement = document.querySelector(
              `[data-image-id="${imageData.id}"]`
            );
            if (imgElement instanceof HTMLImageElement) {
              applyImageMetadata(imgElement, file.name);
            }
          }, 100);

          setValidationMessage(
            `✅ 업로드 완료! ${(file.size / 1024 / 1024).toFixed(2)}MB`
          );

          setTimeout(() => {
            setUploadStatus('idle');
            setValidationMessage('');
          }, 5000);
        } else {
          throw new Error(result.error || '업로드 실패');
        }
      } catch (error) {
        console.error('업로드 오류:', error);
        setUploadStatus('error');
        setValidationMessage(
          `❌ 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
        );

        setTimeout(() => {
          setUploadStatus('idle');
          setValidationMessage('');
        }, 5000);
      } finally {
        setIsUploading(false);
      }
    },
    [imageData, onUpdate, applyImageMetadata]
  );

  // 드래그 앤 드롭 이벤트 핸들러들
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // 파일 입력 변경 핸들러
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // 🛡️ 보호 설정 토글 (useCallback로 최적화)
  const handleProtectionToggle = useCallback(async () => {
    if (onProtectionToggle) {
      onProtectionToggle(imageData.id, !imageData.isProtected);
      setShowProtectionDialog(false);
    }
  }, [imageData.id, imageData.isProtected, onProtectionToggle]);

  // 🗑️ 삭제 핸들러 (useCallback로 최적화)
  const handleDelete = useCallback(async () => {
    if (imageData.isProtected) {
      alert('🔒 보호된 이미지는 삭제할 수 없습니다.');
      return;
    }

    if (
      window.confirm(
        `정말로 "${imageData.metadata?.description || imageData.id}" 이미지를 삭제하시겠습니까?`
      )
    ) {
      if (onDelete) {
        onDelete(imageData.id);
      }
    }
  }, [
    imageData.id,
    imageData.isProtected,
    imageData.metadata?.description,
    onDelete,
  ]);

  // 메인 렌더링 - 최적화된 버전
  return (
    <div className="group relative">
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptMimeTypesString()}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* 🎨 감성적 이미지 카드 - 성능 최적화 버전 */}
      <div
        className={`
          relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg
          transition-all duration-300 ease-out cursor-pointer
          ${isDragOver ? 'scale-[0.98] shadow-2xl ring-4 ring-blue-200' : 'hover:scale-105 hover:shadow-xl'}
          ${isUploading ? 'scale-[0.98] brightness-75' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 📸 메인 이미지 */}
        <div className="relative w-full h-full">
          {!hasImageError ? (
            <Image
              src={imageData.targetPath}
              alt={imageData.metadata?.alt || imageData.sourceFile}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              data-image-id={imageData.id}
              onError={() => setHasImageError(true)}
              onLoad={(e) => {
                applyImageMetadata(
                  e.target as HTMLImageElement,
                  imageData.sourceFile
                );
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={imageData.metadata?.priority ? imageData.metadata.priority <= 2 : false}
              loading={imageData.metadata?.priority && imageData.metadata.priority <= 2 ? 'eager' : 'lazy'}
              placeholder="blur"
              blurDataURL={PLACEHOLDER_CARD_URL}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Image
                src={ERROR_PLACEHOLDER_URL}
                alt="이미지 로드 실패"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* 🌓 베이스 오버레이 */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
          transition-opacity duration-300
          ${isHovered ? 'opacity-80' : 'opacity-40'}
        `}
        />

        {/* 📋 카드 정보 - 좌하단 */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="text-white space-y-2">
            {/* 카테고리 + 우선순위 배지 */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                backdrop-blur-sm bg-white/90 ${categoryColor.bg} ${categoryColor.text}
              `}
              >
                {getCategoryIcon(imageData.metadata?.category || 'gallery')}
                {imageData.metadata?.category || 'gallery'}
              </span>

              {imageData.metadata?.priority && imageData.metadata.priority <= 2 && (
                <span
                  className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                  backdrop-blur-sm ${getPriorityColor(imageData.metadata.priority)}
                `}
                >
                  {imageData.metadata.priority === 1 ? '🔥' : '⭐'}
                  우선순위 {imageData.metadata.priority}
                </span>
              )}

              {imageData.isProtected && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-amber-100 text-amber-700 border border-amber-200">
                  🔒 보호됨
                </span>
              )}
            </div>

            {/* 제목 */}
            <h3 className="text-lg font-semibold text-white drop-shadow-lg">
              {imageData.metadata?.title || imageData.sourceFile || '제목 없음'}
            </h3>

            {/* 설명 */}
            <p className="text-sm text-white/90 drop-shadow line-clamp-2">
              {imageData.metadata?.description || '설명 없음'}
            </p>

            {/* 파일 정보 */}
            <div className="text-xs text-white/80 drop-shadow">
              ID: {imageData.id} • <LocalTimeDisplay date={imageData.createdAt} format="date" />
            </div>
          </div>
        </div>

        {/* 🎛️ 관리 액션 버튼들 - 우상단 (호버 시 표시) */}
        {isHovered && (
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            {/* 이미지 교체 버튼 */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
              title="이미지 교체"
            >
              <svg
                className="w-4 h-4 text-gray-700 group-hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </button>

            {/* 보호 설정 토글 */}
            {onProtectionToggle && (
              <button
                onClick={() => setShowProtectionDialog(true)}
                className={`
                  p-2 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200
                  ${imageData.isProtected
                    ? 'bg-amber-200/90 hover:bg-amber-300/90'
                    : 'bg-white/90 hover:bg-white'
                  }
                `}
                title={imageData.isProtected ? '보호 해제' : '보호 설정'}
              >
                <svg
                  className={`w-4 h-4 ${imageData.isProtected ? 'text-amber-700' : 'text-gray-700'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      imageData.isProtected
                        ? 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        : 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2 2v6a2 2 0 002 2z'
                    }
                  />
                </svg>
              </button>
            )}

            {/* 삭제 버튼 */}
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 bg-red-100/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-200/90 transition-all duration-200 group"
                title="이미지 삭제"
              >
                <svg
                  className="w-4 h-4 text-red-600 group-hover:text-red-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 🔄 업로드 진행상태 오버레이 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
              <div className="text-white font-medium">이미지 업로드 중...</div>
            </div>
          </div>
        )}

        {/* 📂 드래그 앤 드롭 안내 */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm border-4 border-dashed border-blue-400 flex items-center justify-center z-30">
            <div className="text-center">
              <div className="text-4xl mb-2">📸</div>
              <div className="text-white font-medium">이미지를 드롭하세요</div>
              <div className="text-white/80 text-sm">JPG, PNG만 허용</div>
            </div>
          </div>
        )}
      </div>

      {/* 📊 상태 메시지 - 최적화 */}
      {validationMessage && (
        <div
          className={`
          mt-3 p-2 rounded-lg text-sm text-center
          ${uploadStatus === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : uploadStatus === 'error' || uploadStatus === 'validation-error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }
        `}
        >
          {validationMessage}
        </div>
      )}

      {/* 🗑️ 삭제 확인 다이얼로그 - 최적화 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              이미지 삭제
            </h3>
            <p className="text-gray-600 mb-4">
              정말로 이 이미지를 삭제하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛡️ 보호 설정 다이얼로그 - 최적화 */}
      {showProtectionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              보호 설정
            </h3>
            <p className="text-gray-600 mb-4">
              {imageData.isProtected
                ? '이 이미지의 보호를 해제하시겠습니까?'
                : '이 이미지를 보호하시겠습니까?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowProtectionDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleProtectionToggle}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${imageData.isProtected
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-amber-500 hover:bg-amber-600'
                  }`}
              >
                {imageData.isProtected ? '보호 해제' : '보호 설정'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ImageManagerCard;
