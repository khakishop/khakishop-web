'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from "../../../../../../lib/motion";
import type { ImageMapping } from '../../../../../../utils/imageMap';
import AdminImagesBrowser from '../../../../../../components/admin/AdminImagesBrowser';
import AdminImageEditPanel from '../../../../../../components/admin/AdminImageEditPanel';
import ImageUploadZone from '../../../../../../components/admin/ImageUploadZone';
import { 
  getCategoryByKey,
  getSubcategoryByKey,
  getCategoryBreadcrumb,
  getCategoryFolderPath,
  getCategoryPathDisplayName 
} from '../../../../../../utils/constants/categories';
import { LocalTimeDisplay } from '../../../../../../components/LocalTimeDisplay';

// ================================================================================
// 🔒 KHAKISHOP 하위 분류별 이미지 관리 페이지
// ================================================================================
// 🎯 목적: 특정 카테고리/하위분류의 이미지를 관리할 수 있는 페이지

// 클라이언트 전용 시간 표시 컴포넌트
function ClientTime({ date }: { date: Date }) {
  const [timeString, setTimeString] = useState<string | null>(null);
  
  useEffect(() => {
    setTimeString(date.toLocaleTimeString('ko-KR'));
  }, [date]);
  
  if (!timeString) return null;
  return <span>{timeString}</span>;
}

export default function SubcategoryImageManagementPage() {
  console.log('🚀 SubcategoryImageManagementPage 렌더링 시작');

  const params = useParams();
  const categoryKey = params.category as string;
  const subcategoryKey = params.subcategory as string;

  // 카테고리 정보 가져오기
  const category = getCategoryByKey(categoryKey);
  const subcategory = getSubcategoryByKey(categoryKey, subcategoryKey);
  const breadcrumb = getCategoryBreadcrumb(categoryKey, subcategoryKey);
  const folderPath = getCategoryFolderPath(categoryKey, subcategoryKey);
  const displayName = getCategoryPathDisplayName(categoryKey, subcategoryKey);

  // 🎯 상태 관리
  const [mappedImages, setMappedImages] = useState<ImageMapping[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageMapping | null>(null);
  const [editingImage, setEditingImage] = useState<ImageMapping | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // 🔄 동기화 상태 관리
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const MAX_ERROR_COUNT = 3;

  console.log('✅ SubcategoryImageManagementPage 상태 초기화 완료');

  // 📊 카테고리별 필터링된 이미지 및 통계
  const filteredImages = useMemo(() => {
    return mappedImages.filter((img) => {
      const imgCategory = img.metadata?.category || '';
      const expectedPath = subcategory ? `${categoryKey}/${subcategoryKey}` : categoryKey;
      return imgCategory.includes(expectedPath) || img.targetPath.includes(folderPath);
    });
  }, [mappedImages, folderPath, categoryKey, subcategoryKey, subcategory]);

  const stats = useMemo(() => {
    return {
      totalImages: filteredImages.length,
      protectedImages: filteredImages.filter((img) => img.isProtected).length,
      folderPath: folderPath,
    };
  }, [filteredImages, folderPath]);

  // 🔄 데이터 초기화 함수
  const initializeData = useCallback(async () => {
    if (isInitialized || errorCount >= MAX_ERROR_COUNT) {
      console.log('🚫 초기화 건너뜀:', { isInitialized, errorCount });
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 하위분류 이미지 시스템 초기화 시작:', { categoryKey, subcategoryKey, folderPath });

      const syncResponse = await fetch('/api/sync-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          forceRepair: false, 
          includeStats: true 
        }),
      });

      if (!syncResponse.ok) {
        throw new Error(`Sync API 응답 실패: ${syncResponse.status}`);
      }

      const syncData = await syncResponse.json();
      console.log('✅ 동기화 완료:', syncData);

      if (syncData.mappedImages && Array.isArray(syncData.mappedImages)) {
        setMappedImages(syncData.mappedImages);
        setLastSyncTime(new Date());
        setIsInitialized(true);
        setErrorCount(0);
        console.log('✅ 하위분류 이미지 시스템 초기화 완료');
      }

    } catch (error) {
      console.error('❌ 초기화 실패:', error);
      setErrorCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [isInitialized, errorCount, categoryKey, subcategoryKey, folderPath]);

  // 🎯 이미지 관련 핸들러들
  const handleImageSelect = useCallback((image: ImageMapping) => {
    setSelectedImage(image);
  }, []);

  const handleImageEdit = useCallback((image: ImageMapping) => {
    setEditingImage(image);
    setIsEditPanelOpen(true);
  }, []);

  const handleImageSave = useCallback(async (updatedImage: ImageMapping) => {
    try {
      console.log('이미지 저장:', updatedImage);
      setMappedImages(prev => 
        prev.map(img => img.id === updatedImage.id ? updatedImage : img)
      );
      setIsEditPanelOpen(false);
      setEditingImage(null);
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      throw error;
    }
  }, []);

  const handleImageDelete = useCallback(async (imageId: string) => {
    try {
      console.log('이미지 삭제:', imageId);
      setMappedImages(prev => prev.filter(img => img.id !== imageId));
      setIsEditPanelOpen(false);
      setEditingImage(null);
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      throw error;
    }
  }, []);

  const handleCloseEditPanel = useCallback(() => {
    setIsEditPanelOpen(false);
    setEditingImage(null);
  }, []);

  // 🔄 이미지 업데이트 핸들러 - 카테고리 경로 포함
  const handleImagesUpdate = useCallback(async () => {
    console.log('🔄 하위분류 이미지 업데이트 감지:', { categoryKey, subcategoryKey });
    
    try {
      const syncResponse = await fetch('/api/sync-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          forceRepair: false, 
          includeStats: false 
        }),
      });

      if (syncResponse.ok) {
        const syncData = await syncResponse.json();
        if (syncData.mappedImages && Array.isArray(syncData.mappedImages)) {
          setMappedImages(syncData.mappedImages);
          setLastSyncTime(new Date());
          console.log('✅ 하위분류 이미지 업데이트 완료');
        }
      }
      
    } catch (error) {
      console.error('❌ 하위분류 이미지 업데이트 실패:', error);
    }
  }, [categoryKey, subcategoryKey]);

  // 🚀 컴포넌트 마운트 시 초기화
  useEffect(() => {
    try {
      console.log('🚀 하위분류 페이지 useEffect 시작:', { isInitialized, errorCount });
      if (!isInitialized && errorCount < MAX_ERROR_COUNT) {
        initializeData();
      }
    } catch (error) {
      console.error('❌ useEffect 실패:', error);
    }
  }, [initializeData, isInitialized, errorCount]);

  console.log('🎨 하위분류 페이지 렌더링 준비 완료');

  // 카테고리 또는 하위분류가 없는 경우
  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            카테고리를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">
            요청하신 카테고리 또는 하위분류가 존재하지 않습니다.
          </p>
          <Link
            href="/admin/images"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* 브레드크럼 */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link 
                  href="/admin/images"
                  className="hover:text-blue-600"
                >
                  📂 이미지 관리
                </Link>
                <span>/</span>
                <Link
                  href={`/admin/images/${categoryKey}`}
                  className="hover:text-blue-600"
                >
                  {category.icon} {category.displayName}
                </Link>
                <span>/</span>
                <span className="font-medium text-gray-900">
                  {subcategory.icon} {subcategory.displayName}
                </span>
              </nav>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>총 {stats.totalImages}개</span>
                <span>•</span>
                <span>보호됨 {stats.protectedImages}개</span>
                {lastSyncTime && (
                  <>
                    <span>•</span>
                    <span>
                      마지막 동기화: <ClientTime date={lastSyncTime} />
                    </span>
                  </>
                )}
              </div>
            </div>
            <Link
              href={`/admin/images/${categoryKey}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← 뒤로 가기
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">이미지 데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <AdminImagesBrowser
            images={filteredImages}
            onImageSelect={handleImageSelect}
            onImageEdit={handleImageEdit}
            selectedImage={selectedImage}
            onImagesUpdate={handleImagesUpdate}
            // 카테고리별 업로드 경로 설정
            uploadCategory={categoryKey}
            uploadSubcategory={subcategoryKey}
            categoryDisplayName={displayName}
          />
        )}
      </div>

      {/* 이미지 편집 패널 */}
      {editingImage && (
        <AdminImageEditPanel
          image={editingImage}
          onSave={handleImageSave}
          onClose={handleCloseEditPanel}
          onDelete={handleImageDelete}
          isOpen={isEditPanelOpen}
        />
      )}
    </div>
  );
} 