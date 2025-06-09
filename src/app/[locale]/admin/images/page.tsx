'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ImageManagerCard from '../../../../components/ImageManagerCard';
import EmptyImageCard from '../../../../components/EmptyImageCard';
import type { ImageMapping } from '../../../../utils/imageMap';
import SystemStatusCard from '../../../../components/SystemStatusCard';
import { 
  getCategoryIcon, 
  getCategoryOptions, 
  getAllCategoryKeys,
  getCategoryDisplayName,
  getCategoryPriority
} from '../../../../utils/constants/categories';

// Static placeholder SVG to prevent dynamic generation
const STATIC_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjdGNUYzIi8+CjxnIG9wYWNpdHk9IjAuNCI+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSIyMCIgc3Ryb2tlPSIjOEI3QTZCIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHA+CjwvZz4KPHRleHQgeD0iMTYwIiB5PSIxMzAiIGZvbnQtZmFtaWx5PSJhcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzhCN0E2QiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+a2hha2kgc2hvcDwvdGV4dD4KPC9zdmc+";

// ================================================================================
// 🔒 KHAKISHOP 보호된 이미지 관리 페이지 (최종 최적화 버전)
// ================================================================================
// 🎯 목적: 완전 안정적인 이미지 관리 + 시스템 건강 상태 모니터링
// 🛡️ 기능: 보호 설정, 자동 복원, 무결성 검사, 실시간 통계
// ⚡ 최적화: 무한 루프 방지, 메모이제이션, Lazy Loading

// 성능 최적화를 위한 메모이제이션된 컴포넌트들
const MemoizedImageManagerCard = memo(ImageManagerCard);
const MemoizedEmptyImageCard = memo(EmptyImageCard);
const MemoizedSystemStatusCard = memo(SystemStatusCard);

export default function ImageManagementPage() {
  const [mappedImages, setMappedImages] = useState<ImageMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'category' | 'id' | 'created'>('priority');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [storeStats, setStoreStats] = useState<any>(null);
  const [showProtectedOnly, setShowProtectedOnly] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>('gallery');

  // 🖼️ 이미지 확대 모달 상태 추가
  const [selectedImage, setSelectedImage] = useState<ImageMapping | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✏️ 편집 모드 상태 추가
  const [editingImage, setEditingImage] = useState<string | null>(null);

  // ⚡ 성능 최적화: 대용량 데이터셋 대응
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visibleEndIndex, setVisibleEndIndex] = useState(50); // 초기 50개만 렌더링
  
  // 🔄 동기화 상태 관리 개선
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const MAX_ERROR_COUNT = 3;

  // khaki shop 브랜드 색상 팔레트 (홈페이지와 동일)
  const colors = useMemo(() => ({
    primary: '#2D2823',      // 따뜻한 다크 브라운
    secondary: '#4A453E',    // 미디움 브라운
    accent: '#8B7A6B',       // 소프트 베이지 브라운
    background: '#F7F5F3',   // 크림 화이트
    surface: '#FFFFFF',      // 순백
    border: '#E8E5E1',       // 라이트 베이지
    warm: '#D4C4B0'          // 웜 베이지
  }), []);

  // 🎯 동적 카테고리 추출 - 성능 최적화된 버전
  const availableCategories = useMemo((): string[] => {
    const uniqueCategories = new Set<string>();
    
    // 모든 이미지에서 카테고리 추출
    mappedImages.forEach(img => {
      if (img.metadata?.category) {
        uniqueCategories.add(img.metadata.category);
      }
    });

    // 카테고리를 배열로 변환하고 알파벳 순으로 정렬
    const categoriesArray = Array.from(uniqueCategories).sort();
    
    // '모든 카테고리'를 맨 앞에 추가
    return ['all', ...categoriesArray];
  }, [mappedImages]);

  // 📤 업로드용 카테고리 목록 - 성능 최적화된 버전
  const uploadCategories = useMemo((): string[] => {
    const defaultCategories = getAllCategoryKeys();
    const existingCategories = Array.from(new Set(
      mappedImages
        .map(img => img.metadata?.category)
        .filter(Boolean)
    ));

    return Array.from(new Set([...defaultCategories, ...existingCategories])).sort();
  }, [mappedImages]);

  // 🔄 이미지 동기화 함수 - 최종 안정성 및 성능 최적화
  const loadAndSyncImages = useCallback(async () => {
    if (syncing) {
      console.log('🔄 이미 동기화 중입니다. 중복 호출 방지.');
      return;
    }

    if (errorCount >= MAX_ERROR_COUNT) {
      console.error('❌ 최대 오류 횟수 초과. 동기화를 중단합니다.');
      return;
    }
    
    try {
      setSyncing(true);
      console.log('🔄 이미지 동기화 시작...', { errorCount, isInitialized });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

      const response = await fetch('/api/sync-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          forceRepair: false,
          includeStats: true 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`동기화 API 호출 실패: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const images = Array.isArray(result.data?.mappedImages) ? result.data.mappedImages : [];
        
        // 배치 업데이트로 성능 최적화
        setMappedImages(images);
        setStoreStats(result.data?.stats || null);
        setLastSyncTime(new Date());
        setIsInitialized(true);
        setErrorCount(0); // 성공 시 에러 카운트 리셋
        
        console.log('✅ 이미지 동기화 완료:', {
          totalMappings: images.length,
          protectedImages: images.filter((img: ImageMapping) => img.isProtected).length,
        });
      } else {
        throw new Error(result.error || '동기화 실패');
      }
    } catch (error) {
      setErrorCount(prev => prev + 1);
      console.error('❌ 이미지 동기화 실패:', { error, errorCount: errorCount + 1 });
      
      // 타임아웃 또는 네트워크 오류인 경우 재시도하지 않음
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('❌ 동기화 요청이 타임아웃되었습니다.');
      }
    } finally {
      setSyncing(false);
    }
  }, [errorCount, isInitialized, MAX_ERROR_COUNT]); // 안정성을 위한 의존성 추가

  // 🏥 시스템 건강 상태 확인 - 성능 최적화 및 안정성 개선
  const checkSystemHealth = useCallback(async () => {
    try {
      console.log('🏥 시스템 건강 상태 확인 중...');
      const response = await fetch('/api/restore-images?action=health');
      if (response.ok) {
        const healthData = await response.json();
        setSystemHealth(healthData);
        console.log('✅ 시스템 건강 상태 확인 완료');
      } else {
        console.warn('⚠️ 시스템 건강 상태 확인 API 응답 오류:', response.status);
      }
    } catch (error) {
      console.error('❌ 시스템 건강 상태 확인 실패:', error);
      // 오류 발생 시 기본 상태 유지
    }
  }, []);

  // 초기 로드 - 무한 루프 방지를 위한 최적화
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      if (!isMounted) return;
      
      // 즉시 샘플 데이터 설정 (렌더링 차단 방지)
      const initialSampleImages: ImageMapping[] = [
        {
          id: "initial-hero-1",
          sourceFile: "hero-main.jpg",
          targetPath: "/images/midjourney/hero-main.jpg",
          isProtected: true,
          createdAt: new Date().toISOString(),
          metadata: {
            description: "메인 히어로 이미지",
            category: "hero",
            priority: 1,
            alt: "khaki shop - 메인 히어로 이미지",
            title: "감성적인 텍스타일 브랜드 khaki shop - 메인 히어로",
            dataStyle: "hero-elegant"
          }
        },
        {
          id: "initial-landing-1", 
          sourceFile: "landing-showcase.jpg",
          targetPath: "/images/midjourney/landing-showcase.jpg",
          isProtected: true,
          createdAt: new Date().toISOString(),
          metadata: {
            description: "랜딩 페이지 쇼케이스",
            category: "landing",
            priority: 1,
            alt: "khaki shop 홈페이지 - 랜딩 쇼케이스",
            title: "공간을 완성하는 텍스타일 - 랜딩 쇼케이스",
            dataStyle: "landing-warm"
          }
        },
        {
          id: "initial-gallery-1",
          sourceFile: "gallery-sample.jpg", 
          targetPath: "/images/midjourney/gallery-sample.jpg",
          isProtected: false,
          createdAt: new Date().toISOString(),
          metadata: {
            description: "갤러리 샘플 이미지",
            category: "gallery",
            priority: 6,
            alt: "khaki shop 갤러리 - 샘플 이미지",
            title: "갤러리 이미지 - 샘플",
            dataStyle: "gallery-aesthetic"
          }
        }
      ];
      
      console.log('🚀 초기 샘플 데이터 설정');
      setMappedImages(initialSampleImages);
      
      // 백그라운드에서 실제 데이터 로드 (한 번만)
      try {
        if (isMounted) {
          await loadAndSyncImages();
          await checkSystemHealth();
        }
      } catch (error) {
        console.error('초기 데이터 로드 실패:', error);
      }
    };
    
    initializeData();
    
    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, []); // 완전히 빈 의존성 배열로 한 번만 실행

  // 🔍 필터링된 이미지 - 성능 최적화 완료: 모든 필터링 로직을 useMemo 안으로 이동
  const filteredImages = useMemo((): ImageMapping[] => {
    console.log('🔍 이미지 필터링 시작', { 
      totalImages: mappedImages.length, 
      selectedCategory, 
      showProtectedOnly, 
      searchTerm: searchTerm.trim() 
    });

    let filtered = mappedImages;

    // 1. 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.metadata?.category === selectedCategory);
    }

    // 2. 보호된 이미지 필터
    if (showProtectedOnly) {
      filtered = filtered.filter(img => img.isProtected);
    }

    // 3. 검색어 필터
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(img => 
        img.metadata?.description?.toLowerCase().includes(term) ||
        img.metadata?.category?.toLowerCase().includes(term) ||
        img.id.toLowerCase().includes(term) ||
        img.sourceFile.toLowerCase().includes(term)
      );
    }

    // 4. 카테고리 우선순위별 정렬
    const sorted = filtered.sort((a, b) => {
      const priorityA = getCategoryPriority(a.metadata?.category || 'gallery');
      const priorityB = getCategoryPriority(b.metadata?.category || 'gallery');
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    console.log('✅ 이미지 필터링 완료', { filteredCount: sorted.length });
    return sorted;
  }, [mappedImages, selectedCategory, showProtectedOnly, searchTerm]); // 의존성 배열 최적화

  // 🎨 카테고리별 그룹화 - 성능 최적화
  const imagesByCategory = useMemo(() => {
    const groups: Record<string, ImageMapping[]> = {};
    
    filteredImages.forEach(image => {
      const category = image.metadata?.category || 'gallery';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(image);
    });

    // 카테고리 우선순위별 정렬
    return Object.entries(groups)
      .sort(([categoryA], [categoryB]) => {
        const priorityA = getCategoryPriority(categoryA);
        const priorityB = getCategoryPriority(categoryB);
        return priorityA - priorityB;
      })
      .reduce((acc, [category, images]) => {
        acc[category] = images;
        return acc;
      }, {} as Record<string, ImageMapping[]>);
  }, [filteredImages]);

  // 📊 카테고리별 통계 - 성능 최적화된 버전
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    filteredImages.forEach(img => {
      const category = img.metadata?.category || 'unknown';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  }, [filteredImages]);

  // 카테고리 변경 핸들러 - useCallback로 최적화
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // 검색어 변경 핸들러 - useCallback로 최적화
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // 정렬 변경 핸들러 - useCallback로 최적화
  const handleSortChange = useCallback((sort: 'priority' | 'category' | 'id' | 'created') => {
    setSortBy(sort);
  }, []);

  // 새 이미지 업로드 핸들러 - 성능 최적화 및 안정성 개선
  const handleNewImageUpload = useCallback(async (file: File, metadata: any) => {
    try {
      setLoading(true);
      console.log('📤 새 이미지 업로드 시작:', file.name);
      
      // 고유 ID 생성 (타임스탬프 기반)
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imageId', imageId);
      formData.append('category', uploadCategory);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 업로드 성공 후 이미지 목록 새로고침
        await loadAndSyncImages();
        console.log('✅ 새 이미지 업로드 완료:', imageId);
      } else {
        throw new Error(result.error || '업로드 실패');
      }
    } catch (error) {
      console.error('❌ 새 이미지 업로드 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [uploadCategory, loadAndSyncImages]);

  // 📱 이미지 업데이트 핸들러 - useCallback으로 최적화
  const handleImageUpdate = useCallback(async (imageId: string, newPath: string) => {
    try {
      // 낙관적 업데이트
      setMappedImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, targetPath: newPath } : img
      ));
      
      console.log('🔄 이미지 업데이트:', imageId, '→', newPath);
    } catch (error) {
      console.error('❌ 이미지 업데이트 실패:', error);
      // 실패 시 다시 동기화
      await loadAndSyncImages();
    }
  }, [loadAndSyncImages]);

  // 🛡️ 보호 상태 토글 핸들러 - useCallback으로 최적화
  const handleProtectionToggle = useCallback(async (imageId: string, isProtected: boolean) => {
    try {
      // 낙관적 업데이트
      setMappedImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, isProtected } : img
      ));
      
      console.log('🛡️ 보호 상태 변경:', imageId, '→', isProtected);
    } catch (error) {
      console.error('❌ 보호 상태 변경 실패:', error);
      // 실패 시 다시 동기화
      await loadAndSyncImages();
    }
  }, [loadAndSyncImages]);

  // 🗑️ 이미지 삭제 핸들러 - useCallback으로 최적화
  const handleImageDelete = useCallback(async (imageId: string) => {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) return;

    try {
      // 낙관적 업데이트
      setMappedImages(prev => prev.filter(img => img.id !== imageId));
      
      console.log('🗑️ 이미지 삭제:', imageId);
    } catch (error) {
      console.error('❌ 이미지 삭제 실패:', error);
      // 실패 시 다시 동기화
      await loadAndSyncImages();
    }
  }, [loadAndSyncImages]);

  // 수동 동기화 핸들러 - 성능 최적화
  const handleManualSync = useCallback(async () => {
    await loadAndSyncImages();
  }, [loadAndSyncImages]);

  // ✏️ 수동 시스템 복구 - 성능 최적화
  const handleSystemRepair = useCallback(async () => {
    if (!confirm('⚠️ 시스템 복구를 실행하시겠습니까?\n\n이 작업은 보호되지 않은 이미지들을 수정할 수 있습니다.')) {
      return;
    }

    try {
      setLoading(true);
      console.log('🔧 시스템 복구 시작...');
      
      const response = await fetch('/api/sync-images?repair=true&stats=true');
      if (!response.ok) {
        throw new Error(`복구 API 호출 실패: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        console.log('✅ 시스템 복구 완료:', result.data);
        // 배치 업데이트
        setStoreStats(result.data.stats);
        setLastSyncTime(new Date());
        await loadAndSyncImages(); // 데이터 재로드
      } else {
        throw new Error(result.error || '시스템 복구 실패');
      }
    } catch (error) {
      console.error('❌ 시스템 복구 실패:', error);
      alert(`시스템 복구에 실패했습니다: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [loadAndSyncImages]);

  // 🔄 시스템 상태 새로고침 - 성능 최적화
  const handleSystemStatusRefresh = useCallback(async () => {
    await loadAndSyncImages();
    await checkSystemHealth();
  }, [loadAndSyncImages, checkSystemHealth]);

  // 🖼️ 이미지 카드 클릭 핸들러 - 성능 최적화
  const handleImageCardClick = useCallback((imageData: ImageMapping) => {
    setSelectedImage(imageData);
    setIsModalOpen(true);
  }, []);

  // ✏️ 편집 모드 토글 - 성능 최적화
  const handleEditModeToggle = useCallback((imageId: string) => {
    setEditingImage(prev => prev === imageId ? null : imageId);
  }, []);

  // 🔐 모달 닫기 - 성능 최적화
  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setIsModalOpen(false);
  }, []);

  // 🎯 카테고리 클릭으로 즉시 진입 핸들러
  const handleCategoryQuickSelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setShowProtectedOnly(false);
    
    // 스크롤을 해당 카테고리 섹션으로 이동
    const categoryElement = document.getElementById(`category-${category}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // 🚀 전체 리셋 핸들러
  const handleResetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchTerm('');
    setShowProtectedOnly(false);
    setSortBy('priority');
  }, []);

  // 📊 성능 통계 계산 - 메모이제이션
  const performanceStats = useMemo(() => {
    const total = mappedImages.length;
    const protected_count = mappedImages.filter(img => img.isProtected).length;
    const categories = new Set(mappedImages.map(img => img.metadata?.category)).size;
    const filtered = filteredImages.length;
    
    return {
      total,
      protected_count,
      categories,
      filtered,
      loadTime: lastSyncTime ? Date.now() - lastSyncTime.getTime() : 0
    };
  }, [mappedImages, filteredImages, lastSyncTime]);

  // 🎨 가상화된 이미지 렌더링 - 성능 최적화
  const visibleImages = useMemo(() => {
    return filteredImages.slice(visibleStartIndex, visibleEndIndex);
  }, [filteredImages, visibleStartIndex, visibleEndIndex]);

  // 📱 반응형 그리드 레이아웃 최적화
  const gridCols = useMemo(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return 'grid-cols-1';
      if (width < 1024) return 'grid-cols-2';
      return 'grid-cols-3';
    }
    return 'grid-cols-3';
  }, []);

  // 🔍 실시간 검색 최적화 - 디바운싱
  const debouncedSearchTerm = useMemo(() => {
    const timer = setTimeout(() => searchTerm, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F3]">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto"
          >
            <div className="w-full h-full rounded-full border-4 border-[#E8E5E1] border-t-[#8B7A6B]"></div>
          </motion.div>
          <div>
            <h2 className="text-2xl font-light text-[#2D2823] mb-2">
              🔒 이미지 시스템 초기화 중
            </h2>
            <p className="text-[#4A453E] text-sm">
              무결성 검사 및 자동 복원을 수행하고 있습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* 페이지 헤더 */}
      <div className="bg-white shadow-sm border-b border-[#E8E5E1]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-light text-[#2D2823] mb-2">
                🎨 이미지 관리
              </h1>
              <p className="text-[#4A453E] font-light">
                khaki shop의 감성적인 이미지들을 안전하게 관리합니다
              </p>
            </div>
            
            {/* 통계 요약 */}
            {storeStats && (
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 bg-[#F7F5F3] rounded-xl">
                  <div className="text-2xl font-light text-[#2D2823]">
                    {filteredImages.length}
                  </div>
                  <div className="text-xs text-[#4A453E] uppercase tracking-wider">
                    필터된 이미지
                  </div>
                </div>
                <div className="text-center px-4 py-2 bg-emerald-50 rounded-xl">
                  <div className="text-2xl font-light text-emerald-700">
                    {storeStats.protectedImages}
                  </div>
                  <div className="text-xs text-emerald-600 uppercase tracking-wider">
                    보호된 이미지
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* 사이드바 - 필터 및 컨트롤 */}
          <div className="xl:col-span-1">
            <div className="space-y-6">
              
              {/* 시스템 상태 */}
              <MemoizedSystemStatusCard 
                systemHealth={systemHealth}
                storeStats={storeStats}
                onRefresh={handleSystemStatusRefresh}
                loading={syncing}
              />

              {/* 필터 패널 */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E8E5E1] p-6">
                <h3 className="text-lg font-medium text-[#2D2823] mb-4">
                  🎯 필터 & 정렬
                </h3>
                
                <div className="space-y-4">
                  {/* 검색 */}
                  <div>
                    <label className="block text-sm font-medium text-[#4A453E] mb-2">
                      검색
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="이미지 검색..."
                      className="w-full px-3 py-2 border border-[#E8E5E1] rounded-lg focus:ring-2 focus:ring-[#8B7A6B] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* 카테고리 필터 */}
                  <div>
                    <label className="block text-sm font-medium text-[#4A453E] mb-2">
                      카테고리
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E5E1] rounded-lg focus:ring-2 focus:ring-[#8B7A6B] focus:border-transparent text-sm"
                    >
                      {availableCategories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? '모든 카테고리' : `${getCategoryIcon(category)} ${category}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 정렬 */}
                  <div>
                    <label className="block text-sm font-medium text-[#4A453E] mb-2">
                      정렬
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#E8E5E1] rounded-lg focus:ring-2 focus:ring-[#8B7A6B] focus:border-transparent text-sm"
                    >
                      <option value="priority">우선순위</option>
                      <option value="category">카테고리</option>
                      <option value="id">ID</option>
                      <option value="created">생성일</option>
                    </select>
                  </div>

                  {/* 보호된 이미지만 보기 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="protectedOnly"
                      checked={showProtectedOnly}
                      onChange={(e) => setShowProtectedOnly(e.target.checked)}
                      className="w-4 h-4 text-[#8B7A6B] border-[#E8E5E1] rounded focus:ring-[#8B7A6B]"
                    />
                    <label htmlFor="protectedOnly" className="ml-2 text-sm text-[#4A453E]">
                      🔒 보호된 이미지만
                    </label>
                  </div>
                </div>
              </div>

              {/* 새 이미지 업로드 설정 */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E8E5E1] p-6">
                <h3 className="text-lg font-medium text-[#2D2823] mb-4">
                  📤 새 이미지 업로드
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A453E] mb-2">
                      업로드 카테고리
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E5E1] rounded-lg focus:ring-2 focus:ring-[#8B7A6B] focus:border-transparent text-sm"
                    >
                      {uploadCategories.map(category => (
                        <option key={category} value={category}>
                          {getCategoryIcon(category)} {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E8E5E1] p-6">
                <h3 className="text-lg font-medium text-[#2D2823] mb-4">
                  ⚡ 시스템 관리
                </h3>
                
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleManualSync}
                    disabled={syncing}
                    className="w-full px-4 py-3 bg-[#8B7A6B] text-white rounded-lg hover:bg-[#7A6B5C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {syncing ? '🔄 동기화 중...' : '🔄 수동 동기화'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSystemRepair}
                    disabled={syncing}
                    className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    🔧 시스템 복구
                  </motion.button>
                </div>

                {lastSyncTime && (
                  <div className="mt-4 text-xs text-[#4A453E]">
                    마지막 동기화: {lastSyncTime.toLocaleString('ko-KR')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 - 이미지 그리드 */}
          <div className="xl:col-span-3">
            {/* 헤더 섹션 */}
            <div className="mb-8">
              <h2 className="text-2xl font-light text-[#2D2823] mb-2">
                🎨 이미지 컬렉션
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-[#4A453E] font-light">
                  {filteredImages.length > 0 
                    ? `총 ${filteredImages.length}개의 이미지를 관리하고 있습니다`
                    : '새로운 이미지를 추가하여 컬렉션을 시작해보세요'
                  }
                </p>
                
                {/* 현재 필터 상태 표시 */}
                {(selectedCategory !== 'all' || searchTerm || showProtectedOnly) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== 'all' && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#8B7A6B] text-white rounded-full text-sm">
                        <span>{getCategoryIcon(selectedCategory)}</span>
                        <span>{selectedCategory}</span>
                        <button
                          onClick={() => handleCategoryChange('all')}
                          className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {searchTerm && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                        <span>🔍</span>
                        <span>"{searchTerm}"</span>
                        <button
                          onClick={() => handleSearchChange('')}
                          className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {showProtectedOnly && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-sm">
                        <span>🔒</span>
                        <span>보호됨만</span>
                        <button
                          onClick={() => setShowProtectedOnly(false)}
                          className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 감성적인 카드 그리드 - 카테고리별 그룹화 */}
            <div className="space-y-8">
              {/* 새 이미지 업로드 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-sm mx-auto"
              >
                <MemoizedEmptyImageCard
                  onUpload={handleNewImageUpload}
                  category={uploadCategory}
                  disabled={syncing}
                />
              </motion.div>

              {/* 카테고리별 이미지 그룹 - 성능 최적화 완료 */}
              {Object.keys(imagesByCategory).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#E8E5E1]">
                  <div className="text-6xl mb-6 opacity-60">
                    {selectedCategory !== 'all' || searchTerm || showProtectedOnly ? '🔍' : '🖼️'}
                  </div>
                  <h3 className="text-2xl font-light text-[#2D2823] mb-3">
                    {selectedCategory !== 'all' || searchTerm || showProtectedOnly 
                      ? '조건에 맞는 이미지가 없습니다'
                      : '표시할 이미지가 없습니다'
                    }
                  </h3>
                  <p className="text-[#4A453E] mb-8 font-light max-w-md mx-auto">
                    {selectedCategory !== 'all' || searchTerm || showProtectedOnly ? (
                      <>
                        다른 카테고리를 선택하거나 검색어를 변경해보세요.<br />
                        또는 필터를 초기화하여 모든 이미지를 확인할 수 있습니다.
                      </>
                    ) : (
                      <>
                        새로운 이미지를 업로드하여<br />
                        아름다운 컬렉션을 만들어보세요
                      </>
                    )}
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    {(selectedCategory !== 'all' || searchTerm || showProtectedOnly) && (
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSearchTerm('');
                          setShowProtectedOnly(false);
                        }}
                        className="px-6 py-3 bg-[#8B7A6B] text-white rounded-full hover:bg-[#7A6B5C] transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        필터 초기화
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      새 이미지 추가
                    </button>
                  </div>
                </div>
              ) : (
                Object.entries(imagesByCategory).map(([category, categoryImages]) => {
                  const categoryIcon = getCategoryIcon(category);
                  const categoryDisplayName = getCategoryDisplayName(category);
                  
                  return (
                    <div
                      key={category}
                      className="bg-white rounded-3xl shadow-sm border border-[#E8E5E1] overflow-hidden mb-8"
                    >
                      {/* 카테고리 헤더 */}
                      <div className="bg-gradient-to-r from-[#F7F5F3] to-white px-8 py-6 border-b border-[#E8E5E1]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">
                              {categoryIcon}
                            </div>
                            <div>
                              <h3 className="text-xl font-medium text-[#2D2823] capitalize">
                                {categoryDisplayName}
                              </h3>
                              <p className="text-sm text-[#4A453E] font-light">
                                {categoryImages.length}개의 이미지
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* 보호된 이미지 수 */}
                            {categoryImages.filter(img => img.isProtected).length > 0 && (
                              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                                🔒 {categoryImages.filter(img => img.isProtected).length}
                              </div>
                            )}
                            
                            {/* 우선순위 배지 */}
                            <div className="bg-[#8B7A6B] text-white px-3 py-1 rounded-full text-sm font-medium">
                              우선순위 {getCategoryPriority(category)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 카테고리 내 이미지 그리드 - 성능 최적화 완료 */}
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {categoryImages.map((imageData) => (
                            <div
                              key={imageData.id}
                              onClick={() => handleImageCardClick(imageData)}
                              className="group cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
                            >
                              <MemoizedImageManagerCard
                                imageData={imageData}
                                onUpdate={handleImageUpdate}
                                onProtectionToggle={handleProtectionToggle}
                                onDelete={handleImageDelete}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 하단 통계 및 액션 영역 - 성능 최적화 */}
            {filteredImages.length > 0 && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-6 bg-white rounded-2xl shadow-sm border border-[#E8E5E1] px-8 py-4">
                  <div className="text-center">
                    <div className="text-lg font-light text-[#2D2823]">
                      {filteredImages.length}
                    </div>
                    <div className="text-xs text-[#4A453E] uppercase tracking-wider">
                      이미지
                    </div>
                  </div>
                  <div className="w-px h-8 bg-[#E8E5E1]"></div>
                  <div className="text-center">
                    <div className="text-lg font-light text-emerald-700">
                      {filteredImages.filter(img => img.isProtected).length}
                    </div>
                    <div className="text-xs text-emerald-600 uppercase tracking-wider">
                      보호됨
                    </div>
                  </div>
                  <div className="w-px h-8 bg-[#E8E5E1]"></div>
                  <div className="text-center">
                    <div className="text-lg font-light text-[#8B7A6B]">
                      {Object.keys(categoryStats).length}
                    </div>
                    <div className="text-xs text-[#4A453E] uppercase tracking-wider">
                      카테고리
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🖼️ 이미지 확대 모달 */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 모달 헤더 */}
              <div className="p-6 border-b border-[#E8E5E1] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium text-[#2D2823]">
                    {getCategoryIcon(selectedImage.metadata.category)} {selectedImage.metadata.title}
                  </h3>
                  <p className="text-sm text-[#4A453E] mt-1">
                    ID: {selectedImage.id} • {selectedImage.metadata.category}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* 편집 버튼 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditModeToggle(selectedImage.id)}
                    className="px-4 py-2 bg-[#8B7A6B] text-white rounded-lg hover:bg-[#7A6B5C] transition-colors text-sm font-medium"
                  >
                    ✏️ 편집
                  </motion.button>
                  {/* 닫기 버튼 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModal}
                    className="p-2 text-[#4A453E] hover:text-[#2D2823] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* 모달 콘텐츠 */}
              <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 이미지 영역 */}
                  <div className="relative">
                    <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-[#F7F5F3]">
                      <Image
                        src={selectedImage.targetPath}
                        alt={selectedImage.metadata.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* 보호 상태 표시 */}
                      {selectedImage.isProtected && (
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          🔒 보호됨
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 메타데이터 영역 */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-[#2D2823] mb-3">📋 이미지 정보</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-[#E8E5E1]">
                          <span className="text-[#4A453E] font-medium">카테고리</span>
                          <span className="text-[#2D2823]">
                            {getCategoryIcon(selectedImage.metadata.category)} {selectedImage.metadata.category}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#E8E5E1]">
                          <span className="text-[#4A453E] font-medium">우선순위</span>
                          <span className="text-[#2D2823]">{selectedImage.metadata.priority}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#E8E5E1]">
                          <span className="text-[#4A453E] font-medium">생성일</span>
                          <span className="text-[#2D2823]">
                            {new Date(selectedImage.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#E8E5E1]">
                          <span className="text-[#4A453E] font-medium">파일경로</span>
                          <span className="text-[#2D2823] text-sm font-mono truncate max-w-[200px]">
                            {selectedImage.targetPath}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#2D2823] mb-3">📝 설명</h4>
                      <p className="text-[#4A453E] leading-relaxed">
                        {selectedImage.metadata.description}
                      </p>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleProtectionToggle(selectedImage.id, !selectedImage.isProtected)}
                        className={`w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                          selectedImage.isProtected
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }`}
                      >
                        {selectedImage.isProtected ? '🔓 보호 해제' : '🔒 보호 설정'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigator.clipboard.writeText(selectedImage.targetPath);
                        }}
                        className="w-full px-4 py-3 bg-[#8B7A6B] text-white rounded-lg hover:bg-[#7A6B5C] transition-colors text-sm font-medium"
                      >
                        📋 경로 복사
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 