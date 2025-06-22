"use client";

/**
 * ================================================================================
 * 🔧 useImageManager.tsx - 이미지 관리 통합 Hook
 * ================================================================================
 * 
 * 역할:
 * - 카테고리 상태 관리 (선택, 확장, 하위카테고리)
 * - 이미지 데이터 로드 및 동기화
 * - URL 파라미터와 상태 동기화
 * - 이미지 업로드, 편집, 삭제 로직
 * - 통계 데이터 계산
 * 
 * TODO: 다음 단계에서 구현
 * - [ ] 카테고리 상태 관리
 * - [ ] 이미지 CRUD 작업
 * - [ ] URL 동기화
 * - [ ] 통계 계산
 * - [ ] 에러 처리
 */

import { useCallback, useState } from 'react';

export interface ImageItem {
  id: string;
  url: string;
  alt: string;
  category: string;
  subcategory?: string;
  order: number;
  uploadDate: string;
  size: number;
  filename: string;
  tags: string[];
  title?: string;
  description?: string;
  photographer?: string;
  location?: string;
  keywords?: string[];
}

export interface UseImageManagerReturn {
  images: ImageItem[];
  selectedImages: string[];
  isLoading: boolean;
  error: string | null;
  uploadImages: (files: File[], category: string, subcategory?: string) => Promise<void>;
  deleteImages: (imageIds: string[]) => Promise<void>;
  updateImageOrder: (imageId: string, newOrder: number) => Promise<void>;
  toggleImageSelection: (imageId: string) => void;
  selectAllImages: () => void;
  clearSelection: () => void;
  fetchImages: (category?: string, subcategory?: string) => Promise<void>;
}

// 실제 이미지 데이터 - 새로운 카테고리 구조와 100% 일치
const mockImages: ImageItem[] = [
  // COLLECTION > Curtain 이미지들 (실제 존재하는 파일들)
  {
    id: 'essential-linen',
    url: '/images/collections/essential-linen.png',
    alt: '에센셜 리넨 컬렉션',
    category: 'collection',
    subcategory: 'curtain',
    order: 1,
    uploadDate: '2024-01-15',
    size: 5083958,
    filename: 'essential-linen.png',
    tags: ['collection', 'curtain', 'linen', 'essential']
  },
  {
    id: 'modern-sheer',
    url: '/images/collections/modern-sheer.png',
    alt: '모던 셰어 시리즈',
    category: 'collection',
    subcategory: 'curtain',
    order: 2,
    uploadDate: '2024-01-14',
    size: 5897424,
    filename: 'modern-sheer.png',
    tags: ['collection', 'curtain', 'modern', 'sheer']
  },
  {
    id: 'luxury-tieback',
    url: '/images/collections/luxury-tieback.png',
    alt: '럭셔리 타이백',
    category: 'collection',
    subcategory: 'curtain',
    order: 3,
    uploadDate: '2024-01-13',
    size: 6639512,
    filename: 'luxury-tieback.png',
    tags: ['collection', 'curtain', 'luxury', 'tieback']
  },
  {
    id: 'curtain-premium-venetian',
    url: '/images/collections/curtain/premium-venetian-collection_main.png',
    alt: '프리미엄 베네치안 커튼 컬렉션',
    category: 'collection',
    subcategory: 'curtain',
    order: 4,
    uploadDate: '2024-01-12',
    size: 4943228,
    filename: 'premium-venetian-collection_main.png',
    tags: ['collection', 'curtain', 'premium', 'venetian']
  },
  {
    id: 'curtain-sample-11',
    url: '/images/collections/curtain/11.png',
    alt: '커튼 샘플 11',
    category: 'collection',
    subcategory: 'curtain',
    order: 5,
    uploadDate: '2024-01-11',
    size: 6482308,
    filename: '11.png',
    tags: ['collection', 'curtain', 'sample']
  },
  {
    id: 'curtain-smart-automation-main',
    url: '/images/curtain/smart-automation-series/main.jpg',
    alt: '스마트 자동화 커튼 시리즈 메인',
    category: 'collection',
    subcategory: 'curtain',
    order: 6,
    uploadDate: '2024-01-10',
    size: 2800000,
    filename: 'main.jpg',
    tags: ['collection', 'curtain', 'smart', 'automation']
  },
  {
    id: 'curtain-smart-automation-detail1',
    url: '/images/curtain/smart-automation-series/detail-1.jpg',
    alt: '스마트 자동화 커튼 디테일 1',
    category: 'collection',
    subcategory: 'curtain',
    order: 7,
    uploadDate: '2024-01-09',
    size: 2200000,
    filename: 'detail-1.jpg',
    tags: ['collection', 'curtain', 'smart', 'detail']
  },

  // COLLECTION > Blind 이미지들 (실제 존재하는 파일들)
  {
    id: 'venetian-premium',
    url: '/images/collections/venetian-premium.png',
    alt: '프리미엄 베네치안 블라인드',
    category: 'collection',
    subcategory: 'blind',
    order: 1,
    uploadDate: '2024-01-10',
    size: 5153931,
    filename: 'venetian-premium.png',
    tags: ['collection', 'blind', 'venetian', 'premium']
  },
  {
    id: 'wood-texture',
    url: '/images/collections/wood-texture.png',
    alt: '우드 텍스처 블라인드',
    category: 'collection',
    subcategory: 'blind',
    order: 2,
    uploadDate: '2024-01-09',
    size: 5888475,
    filename: 'wood-texture.png',
    tags: ['collection', 'blind', 'wood', 'texture']
  },
  {
    id: 'blind-contemporary-panel-main',
    url: '/images/blind/contemporary-panel-system/main.jpg',
    alt: '컨템포러리 패널 시스템 메인',
    category: 'collection',
    subcategory: 'blind',
    order: 3,
    uploadDate: '2024-01-08',
    size: 3200000,
    filename: 'main.jpg',
    tags: ['collection', 'blind', 'contemporary', 'panel']
  },
  {
    id: 'blind-smart-roller-main',
    url: '/images/blind/smart-roller-collection/main.jpg',
    alt: '스마트 롤러 컬렉션 메인',
    category: 'collection',
    subcategory: 'blind',
    order: 4,
    uploadDate: '2024-01-07',
    size: 3100000,
    filename: 'main.jpg',
    tags: ['collection', 'blind', 'smart', 'roller']
  },
  {
    id: 'blind-premium-venetian-main',
    url: '/images/blind/premium-venetian-collection/main.jpg',
    alt: '프리미엄 베네치안 컬렉션 메인',
    category: 'collection',
    subcategory: 'blind',
    order: 5,
    uploadDate: '2024-01-06',
    size: 2900000,
    filename: 'main.jpg',
    tags: ['collection', 'blind', 'premium', 'venetian']
  },
  {
    id: 'blind-elegant-roman-main',
    url: '/images/blind/elegant-roman-style/main.jpg',
    alt: '엘레강트 로만 스타일 메인',
    category: 'collection',
    subcategory: 'blind',
    order: 6,
    uploadDate: '2024-01-05',
    size: 2700000,
    filename: 'main.jpg',
    tags: ['collection', 'blind', 'elegant', 'roman']
  },

  // COLLECTION > Motorized (실제 존재하는 파일들)
  {
    id: 'smart-automation',
    url: '/images/collections/smart-automation.png',
    alt: '스마트 자동화 시스템',
    category: 'collection',
    subcategory: 'motorized',
    order: 1,
    uploadDate: '2024-01-08',
    size: 4612053,
    filename: 'smart-automation.png',
    tags: ['collection', 'motorized', 'automation', 'system']
  },
  {
    id: 'wireless-motor',
    url: '/images/collections/wireless-motor.png',
    alt: '무선 모터 컬렉션',
    category: 'collection',
    subcategory: 'motorized',
    order: 2,
    uploadDate: '2024-01-07',
    size: 5045671,
    filename: 'wireless-motor.png',
    tags: ['collection', 'motorized', 'wireless', 'motor']
  },
  {
    id: 'designer-hardware',
    url: '/images/collections/designer-hardware.png',
    alt: '디자이너 하드웨어',
    category: 'collection',
    subcategory: 'hardware',
    order: 1,
    uploadDate: '2024-01-06',
    size: 5972893,
    filename: 'designer-hardware.png',
    tags: ['collection', 'hardware', 'designer']
  },

  // Hero 이미지들 (실제 존재하는 파일들)
  {
    id: 'hero-main',
    url: '/images/hero/hero.jpg',
    alt: '메인 히어로 이미지',
    category: 'hero',
    subcategory: 'main-banner',
    order: 1,
    uploadDate: '2024-01-05',
    size: 2100000,
    filename: 'hero.jpg',
    tags: ['hero', 'main', 'banner']
  },
  {
    id: 'hero-mobile',
    url: '/images/hero/hero-mobile.png',
    alt: '모바일용 세로형 히어로',
    category: 'hero',
    subcategory: 'mobile',
    order: 2,
    uploadDate: '2024-01-04',
    size: 1800000,
    filename: 'hero-mobile.png',
    tags: ['hero', 'mobile', 'responsive']
  },
  {
    id: 'hero-khakishop',
    url: '/images/hero/khakishop-hero.jpg',
    alt: 'Khakishop 브랜드 히어로',
    category: 'hero',
    subcategory: 'main-banner',
    order: 3,
    uploadDate: '2024-01-03',
    size: 2300000,
    filename: 'khakishop-hero.jpg',
    tags: ['hero', 'khakishop', 'brand']
  },

  // Landing 이미지들 (실제 존재하는 파일들)
  {
    id: 'landing-hero-main',
    url: '/images/landing/hero-main.png',
    alt: '랜딩 페이지 메인 배경',
    category: 'landing',
    subcategory: 'hero',
    order: 1,
    uploadDate: '2024-01-03',
    size: 2500000,
    filename: 'hero-main.png',
    tags: ['landing', 'hero', 'background']
  },
  {
    id: 'landing-brand-lifestyle',
    url: '/images/landing/brand-lifestyle.png',
    alt: '브랜드 라이프스타일',
    category: 'landing',
    subcategory: 'lifestyle',
    order: 2,
    uploadDate: '2024-01-02',
    size: 2300000,
    filename: 'brand-lifestyle.png',
    tags: ['landing', 'brand', 'lifestyle']
  },
  {
    id: 'landing-collection-overview',
    url: '/images/landing/collection-overview.png',
    alt: '컬렉션 개요 쇼케이스',
    category: 'landing',
    subcategory: 'showcase',
    order: 3,
    uploadDate: '2024-01-01',
    size: 2400000,
    filename: 'collection-overview.png',
    tags: ['landing', 'collection', 'showcase']
  },
  {
    id: 'landing-hero-mobile-main',
    url: '/images/landing/hero-mobile/main.jpg',
    alt: '랜딩 모바일 히어로 메인',
    category: 'landing',
    subcategory: 'hero',
    order: 4,
    uploadDate: '2023-12-31',
    size: 1900000,
    filename: 'main.jpg',
    tags: ['landing', 'hero', 'mobile']
  },

  // PRODUCTS 카테고리 (실제 존재하는 파일들)
  {
    id: 'product-curtain-sheer-lifestyle',
    url: '/images/products/curtain/sheer-curtain/lifestyle.jpg',
    alt: '셰어 커튼 라이프스타일',
    category: 'products',
    subcategory: 'curtain-products',
    order: 1,
    uploadDate: '2023-12-30',
    size: 2600000,
    filename: 'lifestyle.jpg',
    tags: ['products', 'curtain', 'sheer', 'lifestyle']
  },
  {
    id: 'product-curtain-sheer-detail',
    url: '/images/products/curtain/sheer-curtain/detail.jpg',
    alt: '셰어 커튼 디테일',
    category: 'products',
    subcategory: 'curtain-products',
    order: 2,
    uploadDate: '2023-12-29',
    size: 2100000,
    filename: 'detail.jpg',
    tags: ['products', 'curtain', 'sheer', 'detail']
  },

  // Test 이미지들 (실제 존재하는 파일들)
  {
    id: 'test1',
    url: '/images/collections/test/test1.jpg',
    alt: 'Test Image 1',
    category: 'test',
    subcategory: 'samples',
    order: 1,
    uploadDate: '2023-12-30',
    size: 12,
    filename: 'test1.jpg',
    tags: ['test', 'samples']
  },
  {
    id: 'test2',
    url: '/images/collections/test/test2.png',
    alt: 'Test Image 2',
    category: 'test',
    subcategory: 'samples',
    order: 2,
    uploadDate: '2023-12-29',
    size: 12,
    filename: 'test2.png',
    tags: ['test', 'samples']
  }
];

export function useImageManager(): UseImageManagerReturn {
  const [images, setImages] = useState<ImageItem[]>(mockImages);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이미지 가져오기
  const fetchImages = useCallback(async (category?: string, subcategory?: string) => {
    console.log('🔍 fetchImages 호출:', { category, subcategory });
    setIsLoading(true);
    setError(null);

    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredImages = [...mockImages];
      console.log('📊 전체 이미지 수:', filteredImages.length);

      if (category) {
        console.log('🏷️ 카테고리 필터링:', category);
        filteredImages = filteredImages.filter(img => img.category === category);
        console.log('📊 카테고리 필터링 후:', filteredImages.length);

        if (subcategory) {
          console.log('🎯 하위카테고리 필터링:', subcategory);
          filteredImages = filteredImages.filter(img => img.subcategory === subcategory);
          console.log('📊 하위카테고리 필터링 후:', filteredImages.length);
        }
      }

      // 순서대로 정렬
      filteredImages.sort((a, b) => a.order - b.order);

      console.log('✅ 최종 이미지 목록:', filteredImages.map(img => ({
        id: img.id,
        category: img.category,
        subcategory: img.subcategory,
        filename: img.filename
      })));

      setImages(filteredImages);
    } catch (err) {
      const errorMessage = '이미지를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('❌ Fetch images error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 이미지 업로드
  const uploadImages = useCallback(async (
    files: File[],
    category: string,
    subcategory?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // 업로드 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newImages: ImageItem[] = files.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file), // 실제로는 서버에서 반환된 URL 사용
        alt: file.name.split('.')[0],
        category,
        subcategory,
        order: images.length + index + 1,
        uploadDate: new Date().toISOString().split('T')[0],
        size: file.size,
        filename: file.name,
        tags: []
      }));

      setImages(prev => [...prev, ...newImages]);

      // 성공 알림
      const message = `${files.length}개의 이미지가 성공적으로 업로드되었습니다.`;
      alert(message);

    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
      console.error('Upload error:', err);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [images.length]);

  // 이미지 삭제
  const deleteImages = useCallback(async (imageIds: string[]) => {
    if (imageIds.length === 0) return;

    const confirmMessage = `선택된 ${imageIds.length}개의 이미지를 삭제하시겠습니까?`;
    if (!confirm(confirmMessage)) return;

    setIsLoading(true);
    setError(null);

    try {
      // 삭제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      setImages(prev => prev.filter(img => !imageIds.includes(img.id)));
      setSelectedImages([]);

      alert(`${imageIds.length}개의 이미지가 삭제되었습니다.`);

    } catch (err) {
      setError('이미지 삭제에 실패했습니다.');
      console.error('Delete error:', err);
      alert('이미지 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 이미지 순서 업데이트
  const updateImageOrder = useCallback(async (imageId: string, newOrder: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // 순서 업데이트 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));

      setImages(prev =>
        prev.map(img =>
          img.id === imageId
            ? { ...img, order: newOrder }
            : img
        ).sort((a, b) => a.order - b.order)
      );

    } catch (err) {
      setError('순서 변경에 실패했습니다.');
      console.error('Update order error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 이미지 선택 토글
  const toggleImageSelection = useCallback((imageId: string) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  }, []);

  // 모든 이미지 선택
  const selectAllImages = useCallback(() => {
    setSelectedImages(images.map(img => img.id));
  }, [images]);

  // 선택 해제
  const clearSelection = useCallback(() => {
    setSelectedImages([]);
  }, []);

  return {
    images,
    selectedImages,
    isLoading,
    error,
    uploadImages,
    deleteImages,
    updateImageOrder,
    toggleImageSelection,
    selectAllImages,
    clearSelection,
    fetchImages
  };
}
