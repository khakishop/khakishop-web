// ================================================================================
// 🔒 KHAKISHOP 이미지 매핑 시스템 (클라이언트 안전 버전)
// ================================================================================
// 🎯 목적: 타입 정의와 클라이언트 사이드 유틸리티 제공

import { 
  getCategoryByKey, 
  getCategoryPriority as getGlobalCategoryPriority,
  getCategoryIcon as getGlobalCategoryIcon,
  CATEGORY_METADATA_TEMPLATES
} from './constants/categories';

export interface ImageMetadata {
  alt: string;
  title: string;
  dataStyle: string;
  category: string;
  description: string;
  priority: number;
}

export interface ImageMapping {
  id: string;
  sourceFile: string;
  targetPath: string;
  isProtected: boolean;
  createdAt: string;
  metadata: ImageMetadata;
}

export interface PersistentImageStore {
  version: string;
  lastSync: string | null;
  protectedImages: Record<string, boolean>;
  mappings: Record<string, ImageMapping>;
}

// 🏷️ 카테고리별 메타데이터 생성 (중앙화된 시스템 사용)
const getMetadataByCategory = (category: string, description: string, priority: number): ImageMetadata => {
  const template = CATEGORY_METADATA_TEMPLATES[category] || CATEGORY_METADATA_TEMPLATES.gallery;
  
  return {
    alt: `${template.altPrefix} - ${description}`,
    title: `${template.titlePrefix} - ${description}`,
    dataStyle: template.dataStyle,
    category,
    description,
    priority
  };
};

// 🎯 카테고리 타입 정의 (중앙화된 시스템 기반)
export type CategoryType = string;

// 🏷️ 업로드용 메타데이터 생성 (클라이언트 안전)
export const generateMetadataForUpload = (
  fileName: string, 
  category: string = "gallery", 
  description?: string
): ImageMetadata => {
  const finalDescription = description || `새로운 이미지 ${fileName}`;
  const priority = getGlobalCategoryPriority(category);
  
  return getMetadataByCategory(category, finalDescription, priority);
};

// 🔍 이미지 ID로 경로 생성 (클라이언트 안전)
export const getImagePath = (imageId: string): string => {
  return `/images/midjourney/${imageId}`;
};

// 📊 카테고리 통계 계산 (클라이언트 안전)
export const calculateCategoryStats = (mappings: ImageMapping[]) => {
  const stats = mappings.reduce((acc, mapping) => {
    const category = mapping.metadata.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalImages: mappings.length,
    protectedImages: mappings.filter(m => m.isProtected).length,
    categories: stats
  };
};

// 🎨 카테고리별 아이콘 반환 (중앙화된 시스템 사용)
export const getCategoryIcon = (category: string): string => {
  return getGlobalCategoryIcon(category);
};

// 🎨 우선순위별 배지 반환 (클라이언트 안전)
export const getPriorityBadge = (priority: number): string => {
  if (priority === 1) return "🔥";
  if (priority === 2) return "⭐";
  return "";
};

// 🔒 보호 상태 아이콘 반환 (클라이언트 안전)
export const getProtectionIcon = (isProtected: boolean): string => {
  return isProtected ? "🔒" : "";
};

// ⚠️ 더 이상 사용되지 않는 함수들 (호환성을 위해 유지)
export const addImageToMap = () => {
  console.warn("⚠️ addImageToMap은 서버 사이드 API를 사용하세요");
};

export const syncImageMap = () => {
  console.warn("⚠️ syncImageMap은 서버 사이드 API를 사용하세요");
};

export const getAllImageInfo = (): ImageMapping[] => {
  console.warn("⚠️ getAllImageInfo는 서버 사이드 API를 사용하세요");
  return [];
};

export const getProtectedImages = (): ImageMapping[] => {
  console.warn("⚠️ getProtectedImages는 서버 사이드 API를 사용하세요");
  return [];
};

export const getStoreStats = () => {
  console.warn("⚠️ getStoreStats는 서버 사이드 API를 사용하세요");
  return {
    totalImages: 0,
    protectedImages: 0,
    categories: {},
    lastSync: null
  };
}; 