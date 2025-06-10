'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ImageMapping } from '../../../../utils/imageMap';
import { 
  MASTER_CATEGORIES, 
  getCategoryIcon, 
  getCategoryDisplayName, 
  hasSubcategories,
  getSubcategories,
  getCategoryByKey
} from '../../../../utils/constants/categories';
import { CurrentTimeDisplay } from '../../../../components/LocalTimeDisplay';
import { ImageGridSkeleton } from '../../../../components/ui/Skeleton';

// 🔄 Lazy load heavy components
const AdminImagesBrowser = lazy(() => import('../../../../components/admin/AdminImagesBrowser'));
const AdminImageEditPanel = lazy(() => import('../../../../components/admin/AdminImageEditPanel'));
const ImageUploadZone = lazy(() => import('../../../../components/admin/ImageUploadZone'));
const DeleteImageDialog = lazy(() => import('../../../../components/admin/DeleteImageDialog'));

// ================================================================================
// 🚀 OPTIMIZED 이미지 관리 메인 페이지 (성능 최적화 버전)
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
  const [activeView, setActiveView] = useState<'categories' | 'browser' | 'upload'>('categories');
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
    const view = searchParams.get('view') as 'categories' | 'browser' | 'upload';
    
    if (category) {
      setCurrentCategory(category);
      setCurrentSubcategory(subcategory);
      setActiveView(view || 'browser');
    } else {
      setActiveView('categories');
    }
  }, [searchParams]);

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
        
        // 로컬 상태에서 즉시 제거
        setMappedImages(prev => prev.filter(img => img.id !== imageId));
        
        // 선택된 이미지가 삭제된 이미지라면 선택 해제
        if (selectedImage?.id === imageId) {
          setSelectedImage(null);
        }
        
        // 이미지 목록 새로고침 (백그라운드에서)
        setTimeout(() => {
          loadImages();
        }, 1000);
        
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
    console.log('🔄 이미지 순서 변경 시작:', reorderedImages.length, '개 이미지');
    
    try {
      // 순서 정보 준비
      const imageOrders = reorderedImages.map((image, index) => ({
        id: image.id,
        displayOrder: index,
      }));

      const response = await fetch('/api/reorder-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageOrders,
          category: currentCategory, // 현재 카테고리 전달
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ 이미지 순서 변경 성공:', result.updatedCount, '개 업데이트');
        
        // 로컬 상태 즉시 업데이트
        setMappedImages(reorderedImages);
        
        // 백그라운드에서 전체 이미지 목록 새로고침
        setTimeout(async () => {
          try {
            const syncResponse = await fetch('/api/sync-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ forceRepair: false, includeStats: true }),
            });
            if (syncResponse.ok) {
              const syncResult = await syncResponse.json();
              setMappedImages(syncResult.images || []);
            }
          } catch (error) {
            console.warn('백그라운드 새로고침 실패:', error);
          }
        }, 500);
      } else {
        console.error('❌ 이미지 순서 변경 실패:', result.error);
        throw new Error(result.error || '순서 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 이미지 순서 변경 오류:', error);
      setError(error instanceof Error ? error.message : '순서 변경 중 오류가 발생했습니다.');
      throw error; // DraggableImageGrid에서 원래 순서로 복원할 수 있도록
    }
  }, [currentCategory, setMappedImages]);

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

  const handleBackToCategories = useCallback(() => {
    setCurrentCategory(null);
    setCurrentSubcategory(null);
    setActiveView('categories');
    router.push('/ko/admin/images');
  }, [router]);

  // 로딩 스피너 컴포넌트
  const LoadingSpinner = () => (
    <div className="p-6">
      <ImageGridSkeleton count={6} />
    </div>
  );

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              syncImages(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {activeView !== 'categories' && (
                <button
                  onClick={handleBackToCategories}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>←</span>
                  <span>카테고리로 돌아가기</span>
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  📂 이미지 관리 시스템
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeView === 'categories' && '카테고리를 선택하여 이미지를 관리하세요'}
                  {activeView === 'browser' && currentCategory && `${getCategoryDisplayName(currentCategory)} 관리`}
                  {activeView === 'upload' && currentCategory && `${getCategoryDisplayName(currentCategory)} 업로드`}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => syncImages(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>동기화</span>
            </button>
          </div>
        </div>

        {/* 통계 섹션 */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 총 이미지 카드 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalImages}</div>
                  <div className="text-sm text-gray-600">총 이미지</div>
                </div>
                <div className="text-2xl">📷</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">전체 관리되는 이미지 수</div>
            </div>
            
            {/* 보호된 이미지 카드 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.protectedImages}</div>
                  <div className="text-sm text-gray-600">보호된 이미지</div>
                </div>
                <div className="text-2xl">🔒</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">삭제 방지 설정된 이미지</div>
            </div>
            
            {/* 활성 카테고리 카드 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Object.values(stats.categories).filter(cat => cat.count > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">활성 카테고리</div>
                </div>
                <div className="text-2xl">📁</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">이미지가 있는 카테고리 수</div>
            </div>
            
            {/* 평균 분산도 카드 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(stats.totalImages / MASTER_CATEGORIES.length)}
                  </div>
                  <div className="text-sm text-gray-600">평균 분산도</div>
                </div>
                <div className="text-2xl">📊</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">카테고리당 평균 이미지 수</div>
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* 카테고리 그리드 뷰 */}
              {activeView === 'categories' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">카테고리 선택</h2>
                  {MASTER_CATEGORIES.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {MASTER_CATEGORIES.map(category => (
                        <CategoryGridCard
                          key={category.key}
                          category={category}
                          stats={stats.categories[category.key] || { count: 0, protected: 0 }}
                          onClick={() => handleCategorySelect(category.key)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">📂</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">카테고리가 없습니다</h3>
                      <p className="text-gray-600">시스템 설정을 확인해주세요.</p>
                    </div>
                  )}
                </div>
              )}

              {/* 하위분류 브라우저 뷰 */}
              {activeView === 'browser' && currentCategory && hasSubcategories(currentCategory) && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {getCategoryDisplayName(currentCategory)} - 하위분류 선택
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getSubcategories(currentCategory).map(subcategory => {
                      const subcategoryImages = mappedImages.filter(img => 
                        img && img.src && (
                          img.src.includes(`/${currentCategory}/${subcategory.key}/`) ||
                          img.src.includes(`/${subcategory.folderName}/`)
                        )
                      );
                      
                      return (
                        <CategoryGridCard
                          key={subcategory.key}
                          category={subcategory}
                          stats={{
                            count: subcategoryImages.length,
                            protected: subcategoryImages.filter(img => img && img.isProtected).length
                          }}
                          onClick={() => handleSubcategorySelect(subcategory.key)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 이미지 업로드/관리 뷰 */}
              {activeView === 'upload' && currentCategory && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* 이미지 브라우저 */}
                  <div className="lg:col-span-2">
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminImagesBrowser
                        images={mappedImages.filter(img => {
                          if (!img || !img.src) return false;
                          
                          if (currentSubcategory) {
                            return img.src.includes(`/${currentCategory}/${currentSubcategory}/`) ||
                                   img.src.includes(`/${currentSubcategory}/`);
                          }
                          return img.src.includes(`/${currentCategory}/`);
                        })}
                        onImageSelect={setSelectedImage}
                        onImageEdit={setSelectedImage}
                        onImageDelete={openDeleteDialog}
                        selectedImage={selectedImage}
                        onImagesUpdate={handleImagesUpdate}
                        uploadCategory={currentCategory}
                        uploadSubcategory={currentSubcategory}
                        categoryDisplayName={getCategoryDisplayName(currentCategory)}
                        onImageReorder={handleImageReorder}
                        enableDragReorder={true}
                      />
                    </Suspense>

                    {/* 업로드 존 */}
                    <div className="mt-6">
                      <Suspense fallback={<LoadingSpinner />}>
                        <ImageUploadZone
                          category={currentSubcategory || currentCategory}
                          subcategory={currentSubcategory ? undefined : undefined}
                          onUploadSuccess={handleImagesUpdate}
                          maxFiles={10}
                          maxSizeMB={10}
                        />
                      </Suspense>
                    </div>
                  </div>

                  {/* 이미지 편집 패널 */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-6">
                      {selectedImage ? (
                        <Suspense fallback={<LoadingSpinner />}>
                          <AdminImageEditPanel
                            image={selectedImage}
                            onSave={(updatedImage) => {
                              // 이미지 업데이트 로직
                              console.log('이미지 업데이트:', updatedImage);
                              handleImagesUpdate();
                            }}
                            onClose={() => setSelectedImage(null)}
                            onDelete={() => openDeleteDialog(selectedImage)}
                            isOpen={true}
                          />
                        </Suspense>
                      ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                          <div className="text-4xl mb-4">🖼️</div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">이미지를 선택하세요</h3>
                          <p className="text-gray-600">편집할 이미지를 클릭하여 선택해주세요.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 예상치 못한 상태에 대한 fallback */}
              {!activeView || (activeView === 'browser' && !currentCategory) || (activeView === 'upload' && !currentCategory) ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🤔</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">알 수 없는 상태입니다</h3>
                  <p className="text-gray-600 mb-4">페이지를 새로고침하거나 카테고리로 돌아가세요.</p>
                  <button
                    onClick={handleBackToCategories}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    카테고리로 돌아가기
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* 🗑️ 삭제 확인 다이얼로그 */}
        <Suspense fallback={null}>
          <DeleteImageDialog
            isOpen={deleteDialogOpen}
            image={imageToDelete}
            onClose={closeDeleteDialog}
            onConfirm={handleDeleteImage}
            isDeleting={isDeleting}
          />
        </Suspense>

        {/* 푸터 정보 */}
        <div className="text-center text-sm text-gray-500 bg-white rounded-lg p-4 border border-gray-200">
          <p>🚀 최적화된 이미지 관리 시스템 v3.0</p>
          <p className="mt-1">
            마지막 동기화: <CurrentTimeDisplay /> · 
            총 {MASTER_CATEGORIES.length}개 카테고리 관리 중
          </p>
        </div>
      </div>
    </div>
  );
}
