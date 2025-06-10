import { useMemo } from 'react';

// ================================================================================
// 🚀 KHAKISHOP 성능 최적화 유틸리티
// ================================================================================
// Next.js 성능 최적화를 위한 헬퍼 함수들

// ================================================================================
// 🖼️ 이미지 최적화 헬퍼
// ================================================================================

/**
 * 최적화된 이미지 로더 (Next.js Image 최적화용)
 */
export const optimizedImageLoader = (src: string, width: number = 800, quality: number = 75): string => {
  // 절대 URL인 경우 그대로 반환
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // 로컬 이미지 경로 최적화
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString(),
  });
  
  return `/_next/image?${params.toString()}`;
};

/**
 * 반응형 이미지 sizes 속성 생성
 */
export const getResponsiveImageSizes = (breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
} = {}): string => {
  const { 
    mobile = '100vw', 
    tablet = '50vw', 
    desktop = '33vw' 
  } = breakpoints;
  
  return `(max-width: 768px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
};

/**
 * 블러 데이터 URL 생성 (이미지 로딩 중 placeholder)
 */
export const generateBlurDataURL = (width: number = 8, height: number = 6): string => {
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="20%" y="20%" width="60%" height="60%" fill="#e5e7eb" rx="4"/>
    </svg>`
  )}`;
};

// ================================================================================
// 💰 가격 표시 최적화
// ================================================================================

/**
 * 가격 포맷터 (한국어 통화 형식)
 */
export const createPriceFormatter = () => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
  });
};

export const formatPrice = (price: number): string => {
  return createPriceFormatter().format(price);
};

// ================================================================================
// 🔧 배열 처리 유틸리티
// ================================================================================

/**
 * 배열 청크 분할 (대용량 데이터 처리용)
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * 디바운스 함수 (검색 등에 활용)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 스로틀 함수 (스크롤 이벤트 등에 활용)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ================================================================================
// 🎯 메모이제이션 헬퍼
// ================================================================================

/**
 * 카테고리 정보 메모이제이션 헬퍼
 */
export function useMemoizedCategoryInfo<T>(
  categories: T[],
  selectedId: string,
  idKey: keyof T
) {
  return useMemo(() => {
    return categories.find(category => category[idKey] === selectedId) || null;
  }, [categories, selectedId, idKey]);
}

/**
 * 필터링된 제품 목록 메모이제이션
 */
export function useMemoizedFilteredProducts<T>(
  allProducts: T[],
  filterFn: (product: T) => boolean,
  dependencies: any[]
) {
  return useMemo(() => {
    return allProducts.filter(filterFn);
  }, [allProducts, ...dependencies]);
}

// ================================================================================
// ⚡ 성능 모니터링
// ================================================================================

/**
 * 컴포넌트 렌더링 시간 측정
 */
export const measureRenderTime = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`🎯 [${componentName}] 렌더링 시간: ${(endTime - startTime).toFixed(2)}ms`);
    };
  }
  
  return () => {}; // 운영 환경에서는 아무것도 하지 않음
};

/**
 * 이미지 로딩 성능 측정
 */
export const measureImageLoadTime = (imageSrc: string) => {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`📸 [${imageSrc}] 이미지 로딩 시간: ${(endTime - startTime).toFixed(2)}ms`);
    };
  }
  
  return () => {};
};

// ================================================================================
// 🌐 SEO 최적화 헬퍼
// ================================================================================

/**
 * 메타데이터 생성 헬퍼
 */
export const generateMetadata = (params: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}) => {
  const { title, description, keywords, image, url } = params;
  
  return {
    title: `${title} | 카키샵`,
    description,
    keywords: keywords || '',
    openGraph: {
      title: `${title} | 카키샵`,
      description,
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
      url: url || '',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | 카키샵`,
      description,
      images: image ? [image] : [],
    }
  };
}; 