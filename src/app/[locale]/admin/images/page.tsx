'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { CurrentTimeDisplay } from '../../../../components/LocalTimeDisplay';
import { ImageGridSkeleton } from '../../../../components/ui/Skeleton';
import {
  MASTER_CATEGORIES,
  getCategoryByKey,
  getCategoryDisplayName,
  getCategoryIcon,
  getSubcategories,
  hasSubcategories
} from '../../../../utils/constants/categories';
import type { ImageMapping } from '../../../../utils/imageMap';

// 🔄 Lazy load heavy components
const AdminImagesBrowser = lazy(() => import('../../../../components/admin/AdminImagesBrowser'));
const AdminImageEditPanel = lazy(() => import('../../../../components/admin/AdminImageEditPanel'));
const ImageUploadZone = lazy(() => import('../../../../components/admin/ImageUploadZone'));
const DeleteImageDialog = lazy(() => import('../../../../components/admin/DeleteImageDialog'));
const AdminHomePreview = lazy(() => import('../../../../components/admin/AdminHomePreview'));

// ================================================================================
// 🚀 OPTIMIZED 이미지 관리 메인 페이지 (성능 최적화 버전 + 홈페이지 미리보기)
// ================================================================================
// 🎯 목적: 계층형 카테고리 구조 기반 고성능 이미지 관리 시스템

interface CategoryGridCardProps {
  category: any;
  stats: { count: number; protected: number };
  onClick: () => void;
}

const CategoryGridCard: React.FC<CategoryGridCardProps> = React.memo(({ category, stats, onClick }) => {
  const icon = getCategoryIcon(category.key);
  const displayName = getCategoryDisplayName(category.key);
  const hasChildren = hasSubcategories(category.key);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {displayName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
          </div>
        </div>
        {hasChildren && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {getSubcategories(category.key).length}개 하위분류
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            📷 {stats.count}개 이미지
          </div>
          {stats.protected > 0 && (
            <div className="text-xs text-yellow-600">
              🔒 {stats.protected}개 보호됨
            </div>
          )}
        </div>
        <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
          {hasChildren ? '📁' : '📤'}
        </div>
      </div>
    </div>
  );
});

CategoryGridCard.displayName = 'CategoryGridCard';

export default function AdminImagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log('🚀 AdminImagesPage 렌더링 시작');

  // 상태 관리 (최소화)
  const [mappedImages, setMappedImages] = useState<ImageMapping[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageMapping | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'categories' | 'browser' | 'upload' | 'home-preview'>('categories');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<string | null>(null);

  // 🗑️ 삭제 관련 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageMapping | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log('✅ 모든 useState 초기화 완료');

  // isLoading 상태 변경 감지
  useEffect(() => {
    console.log(`📊 isLoading 상태 변경: ${isLoading}`);
  }, [isLoading]);

  // mappedImages 상태 변경 감지
  useEffect(() => {
    console.log(`📷 mappedImages 상태 변경: ${mappedImages.length}개`);
  }, [mappedImages.length]);

  // URL 파라미터 처리
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const view = searchParams.get('view') as 'categories' | 'browser' | 'upload' | 'home-preview';

    if (category) {
      setCurrentCategory(category);
      setCurrentSubcategory(subcategory);
      setActiveView(view || 'browser');
    } else if (view === 'home-preview') {
      setActiveView('home-preview');
    } else {
      setActiveView('categories');
    }
  }, [searchParams]);

  // 홈페이지 미리보기 모드로 전환
  const switchToHomePreview = useCallback(() => {
    setActiveView('home-preview');
    router.push('/ko/admin/images?view=home-preview');
  }, [router]);

  // 카테고리 모드로 돌아가기
  const backToCategories = useCallback(() => {
    setActiveView('categories');
    setCurrentCategory(null);
    setCurrentSubcategory(null);
    router.push('/ko/admin/images');
  }, [router]);

  // 홈페이지 이미지 업데이트 핸들러
  const handleHomeImageUpdate = useCallback((imageKey: string, newPath: string) => {
    console.log(`🏠 홈페이지 이미지 업데이트: ${imageKey} -> ${newPath}`);
    // 실시간 동기화 로직 (필요시 추가)
  }, []);

  // 🗑️ 이미지 삭제 핸들러
  const handleDeleteImage = useCallback(async (imageId: string): Promise<boolean> => {
    console.log('🗑️ 이미지 삭제 시작:', imageId);
    setIsDeleting(true);

    try {
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          confirmDeletion: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ 이미지 삭제 성공:', result.deletedImage);
        setMappedImages(prev => prev.filter(img => img.id !== imageId));
        if (selectedImage?.id === imageId) {
          setSelectedImage(null);
        }
        return true;
      } else {
        console.error('❌ 이미지 삭제 실패:', result.error);
        setError(result.error || '이미지 삭제에 실패했습니다.');
        return false;
      }
    } catch (error) {
      console.error('❌ 이미지 삭제 요청 오류:', error);
      setError(error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [selectedImage, setMappedImages]);

  // 🗑️ 삭제 다이얼로그 열기
  const openDeleteDialog = useCallback((image: ImageMapping) => {
    console.log('🗑️ 삭제 다이얼로그 열기:', image.sourceFile);
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  }, []);

  // 🗑️ 삭제 다이얼로그 닫기
  const closeDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  }, [isDeleting]);

  // 🔄 이미지 순서 변경 핸들러
  const handleImageReorder = useCallback(async (reorderedImages: ImageMapping[]): Promise<void> => {
    console.log('🔄 이미지 순서 변경:', reorderedImages.length);
  }, []);

  // 📊 카테고리별 통계 계산 (메모이제이션 + metadata 안전성 강화)
  const stats = useMemo(() => {
    console.log('📊 stats useMemo 시작, mappedImages:', mappedImages.length);

    if (!mappedImages || mappedImages.length === 0) {
      const emptyStats = {
        totalImages: 0,
        protectedImages: 0,
        categories: MASTER_CATEGORIES.reduce((acc, cat) => {
          acc[cat.key] = { count: 0, protected: 0 };
          return acc;
        }, {} as Record<string, { count: number; protected: number }>)
      };
      console.log('✅ stats 계산 완료 (빈 데이터):', emptyStats);
      return emptyStats;
    }

    const categoryStats = {} as Record<string, { count: number; protected: number }>;

    // metadata 누락 이미지 사전 검사
    const metadataMissingImages = mappedImages.filter(img => !img.metadata);
    if (metadataMissingImages.length > 0) {
      console.warn('⚠️ 통계 계산 중 metadata 누락 이미지 발견:', metadataMissingImages.length);
    }

    // 안전한 카테고리별 통계 계산
    MASTER_CATEGORIES.forEach(category => {
      try {
        const categoryImages = mappedImages.filter(img =>
          img && img.src && (
            img.src.includes(`/${category.key}/`) ||
            img.src.includes(`/${category.folderName}/`) ||
            img.metadata?.category === category.key ||
            img.category === category.key
          )
        );

        console.log(`📂 카테고리 ${category.key} 이미지:`, categoryImages.length);

        categoryStats[category.key] = {
          count: categoryImages.length,
          protected: categoryImages.filter(img => img && img.isProtected).length
        };
      } catch (error) {
        console.error(`❌ 카테고리 ${category.key} 통계 계산 오류:`, error);
        categoryStats[category.key] = { count: 0, protected: 0 };
      }
    });

    const finalStats = {
      totalImages: mappedImages.filter(img => img && img.src).length,
      protectedImages: mappedImages.filter(img => img && img.isProtected).length,
      categories: categoryStats
    };

    console.log('✅ stats 계산 완료:', finalStats);
    return finalStats;
  }, [mappedImages]);

  // 🔄 이미지 동기화 함수 (debounced + timeout)
  const syncImages = useCallback(async (forceRepair = false, targetCategory?: string) => {
    console.log('🔄 동기화 요청 시작:', { forceRepair, targetCategory });

    try {
      // 타임아웃 설정 (60초)
      const SYNC_TIMEOUT = 60000;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('동기화 타임아웃 (60초 초과)')), SYNC_TIMEOUT)
      );

      const syncPromise = fetch('/api/sync-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forceRepair,
          includeStats: true,
          targetCategory,
          clearCache: forceRepair // 강제 수리 시 캐시 초기화
        }),
      });

      const response = await Promise.race([syncPromise, timeoutPromise]) as Response;

      if (!response.ok) {
        throw new Error(`동기화 API 오류: ${response.status}`);
      }

      const result = await response.json();

      if (result.stats && Array.isArray(result.stats)) {
        console.log('📈 동기화된 이미지 수:', result.stats.length);
        setMappedImages(result.stats);

        // 에러 상태 클리어
        if (error) {
          setError(null);
        }
      }

      return result;
    } catch (error) {
      console.error('❌ 이미지 동기화 실패:', error);
      setError(error instanceof Error ? error.message : '동기화 중 오류 발생');
      throw error;
    }
  }, [error]);

  // 📂 이미지 로드 함수 (초기 로딩 + 새로고침)
  const loadImages = useCallback(async () => {
    console.log('📂 이미지 로드 시작...');
    setIsLoading(true);
    setError(null);

    try {
      await syncImages(true); // 강제 리페어로 무결성 보장
    } catch (error) {
      console.error('📂 이미지 로드 실패:', error);
      // 동기화에서 이미 setError 처리됨
    } finally {
      setIsLoading(false);
    }
  }, [syncImages]);

  // 🔄 이미지 새로고침 핸들러 (사용자 액션)  
  const handleRefresh = useCallback(async () => {
    console.log('🔄 사용자 새로고침 요청');
    await loadImages();
  }, [loadImages]);

  // 🎬 초기 로딩 (컴포넌트 마운트 시)
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // 🔄 이미지 업데이트 핸들러
  const handleImagesUpdate = useCallback(() => {
    console.log('🔄 이미지 업데이트 요청');
    loadImages();
  }, [loadImages]);

  // 🔄 네비게이션 핸들러들
  const handleCategorySelect = useCallback((categoryKey: string) => {
    const category = getCategoryByKey(categoryKey);
    if (!category) return;

    if (hasSubcategories(categoryKey)) {
      // 하위분류가 있는 경우 하위분류 리스트로 이동
      const subcategories = getSubcategories(categoryKey);
      setCurrentCategory(categoryKey);
      setActiveView('browser');
      router.push(`/ko/admin/images?category=${categoryKey}&view=browser`);
    } else {
      // 하위분류가 없는 경우 직접 업로드 페이지로 이동
      setCurrentCategory(categoryKey);
      setActiveView('upload');
      router.push(`/ko/admin/images?category=${categoryKey}&view=upload`);
    }
  }, [router]);

  const handleSubcategorySelect = useCallback((subcategoryKey: string) => {
    setCurrentSubcategory(subcategoryKey);
    setActiveView('upload');
    router.push(`/ko/admin/images?category=${currentCategory}&subcategory=${subcategoryKey}&view=upload`);
  }, [currentCategory, router]);

  // 렌더링
  const renderContent = () => {
    switch (activeView) {
      case 'home-preview':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">홈페이지 미리보기 로딩 중...</div>}>
            <AdminHomePreview onImageUpdate={handleHomeImageUpdate} />
          </Suspense>
        );

      case 'categories':
        return (
          <div className="space-y-8">
            {/* 홈페이지 미리보기 버튼 추가 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">🏠 홈페이지 미리보기 모드</h3>
                  <p className="text-blue-700 text-sm">
                    실제 홈페이지 레이아웃에서 이미지를 직접 편집하고 실시간으로 확인할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={switchToHomePreview}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>🎨</span>
                  <span>미리보기 모드</span>
                </button>
              </div>
            </div>

            {/* 기존 카테고리 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MASTER_CATEGORIES.map((category) => (
                <CategoryGridCard
                  key={category.key}
                  category={category}
                  stats={{ count: 0, protected: 0 }}
                  onClick={() => {
                    setCurrentCategory(category.key);
                    setActiveView('browser');
                    router.push(`/ko/admin/images?category=${category.key}&view=browser`);
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'browser':
        return (
          <Suspense fallback={<ImageGridSkeleton />}>
            <AdminImagesBrowser
              images={mappedImages}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              onImageEdit={setSelectedImage}
              onImageDelete={(image) => {
                setImageToDelete(image);
                setDeleteDialogOpen(true);
              }}
              onImageReorder={handleImageReorder}
              uploadCategory={currentCategory}
              uploadSubcategory={currentSubcategory}
              categoryDisplayName={currentCategory ? getCategoryDisplayName(currentCategory) : undefined}
              enableDragReorder={true}
            />
          </Suspense>
        );

      case 'upload':
        return (
          <Suspense fallback={<div>업로드 컴포넌트 로딩 중...</div>}>
            <ImageUploadZone
              category={currentCategory || ''}
              subcategory={currentSubcategory || undefined}
              onUploadSuccess={() => {
                loadImages();
              }}
            />
          </Suspense>
        );

      default:
        return <div>알 수 없는 뷰입니다.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      {activeView !== 'home-preview' && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">이미지 관리</h1>
                {currentCategory && (
                  <span className="text-sm text-gray-500">
                    / {getCategoryDisplayName(currentCategory)}
                    {currentSubcategory && ` / ${currentSubcategory}`}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <CurrentTimeDisplay />

                {activeView !== 'categories' && (
                  <button
                    onClick={backToCategories}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    ← 카테고리로 돌아가기
                  </button>
                )}

                {activeView === 'categories' && (
                  <button
                    onClick={switchToHomePreview}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🎨 홈페이지 미리보기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 홈페이지 미리보기 모드의 뒤로가기 버튼 */}
      {activeView === 'home-preview' && (
        <div className="fixed top-16 right-4 z-[90]">
          <button
            onClick={backToCategories}
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg border border-gray-200 text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>관리자 모드 종료</span>
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className={activeView === 'home-preview' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {renderContent()}
      </div>

      {/* 삭제 다이얼로그 */}
      <Suspense fallback={null}>
        <DeleteImageDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            if (!isDeleting) {
              setDeleteDialogOpen(false);
              setImageToDelete(null);
            }
          }}
          onConfirm={async () => {
            if (imageToDelete) {
              const success = await handleDeleteImage(imageToDelete.id);
              if (success) {
                setDeleteDialogOpen(false);
                setImageToDelete(null);
              }
              return success;
            }
            return false;
          }}
          image={imageToDelete}
          isDeleting={isDeleting}
        />
      </Suspense>
    </div>
  );
}
