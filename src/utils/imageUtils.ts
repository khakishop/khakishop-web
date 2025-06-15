// ================================================================================
// 🎯 KHAKISHOP 이미지 유틸리티 함수들
// ================================================================================
// 🎨 디자인 모티브: https://www.rigas-furniture.gr/
// 🔧 관리자 연동: /ko/admin/images

import { checkServerModules, isServer } from '../lib/serverUtils';

// ================================================================================
// 🎨 KHAKISHOP 이미지 유틸리티 - RIGAS 스타일 통일
// ================================================================================

// 이미지 최적화 상수
export const IMAGE_OPTIMIZATION = {
  quality: 85,
  placeholder: 'blur' as const,
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAhEQACAQIHAQAAAAAAAAAAAAABAgMABAUGITFhkbHR/9oADAMBAAIRAxEAPwCdwLjU9IAEcLgb7jUWpyriaMqeAOzgB85B1BAAi9H9CXUAA/RAAIHfAA='
} as const;

// ================================================================================
// 💾 서버 사이드 이미지 경로 정렬 함수들
// ================================================================================

/**
 * 서버 사이드에서 순서가 정렬된 Reference 이미지 경로들 가져오기
 * @param slug 프로젝트 slug
 * @returns 정렬된 이미지 경로 배열
 */
function getSortedReferenceImagePaths(slug: string): string[] {
  if (!checkServerModules('getSortedReferenceImagePaths')) {
    return [];
  }

  try {
    // 서버 사이드에서만 실행
    const { loadPersistentStore } = require('./imageMapServer');
    const store = loadPersistentStore();

    const referenceImages = Object.values(store.mappings)
      .filter((mapping: any) =>
        mapping.targetPath.includes(`/references/${slug}/`) ||
        (mapping.metadata?.slug === slug && mapping.metadata?.category === 'references')
      )
      .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((mapping: any) => mapping.targetPath);

    return referenceImages;
  } catch (error) {
    console.warn('저장소에서 레퍼런스 이미지 순서 가져오기 실패:', error);
    return [];
  }
}

/**
 * 서버 사이드에서 순서가 정렬된 Curtain 이미지 경로들 가져오기
 * @param slug 제품 slug
 * @returns 정렬된 이미지 경로 배열
 */
function getSortedCurtainImagePaths(slug: string): string[] {
  if (!checkServerModules('getSortedCurtainImagePaths')) {
    return [];
  }

  try {
    // 서버 사이드에서만 실행
    const { loadPersistentStore } = require('./imageMapServer');
    const store = loadPersistentStore();

    const curtainImages = Object.values(store.mappings)
      .filter((mapping: any) =>
        mapping.targetPath.includes(`/curtain/${slug}/`) ||
        (mapping.metadata?.slug === slug && mapping.metadata?.category === 'curtain')
      )
      .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((mapping: any) => mapping.targetPath);

    return curtainImages;
  } catch (error) {
    console.warn('저장소에서 커튼 이미지 순서 가져오기 실패:', error);
    return [];
  }
}

/**
 * 서버 사이드에서 순서가 정렬된 Blind 이미지 경로들 가져오기
 * @param slug 제품 slug
 * @returns 정렬된 이미지 경로 배열
 */
function getSortedBlindImagePaths(slug: string): string[] {
  if (!checkServerModules('getSortedBlindImagePaths')) {
    return [];
  }

  try {
    // 서버 사이드에서만 실행
    const { loadPersistentStore } = require('./imageMapServer');
    const store = loadPersistentStore();

    const blindImages = Object.values(store.mappings)
      .filter((mapping: any) =>
        mapping.targetPath.includes(`/blind/${slug}/`) ||
        (mapping.metadata?.slug === slug && mapping.metadata?.category === 'blind')
      )
      .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((mapping: any) => mapping.targetPath);

    return blindImages;
  } catch (error) {
    console.warn('저장소에서 블라인드 이미지 순서 가져오기 실패:', error);
    return [];
  }
}

/**
 * 서버 사이드에서 순서가 정렬된 Motorized 이미지 경로들 가져오기
 * @param slug 제품 slug
 * @returns 정렬된 이미지 경로 배열
 */
function getSortedMotorizedImagePaths(slug: string): string[] {
  if (!checkServerModules('getSortedMotorizedImagePaths')) {
    return [];
  }

  try {
    // 서버 사이드에서만 실행
    const { loadPersistentStore } = require('./imageMapServer');
    const store = loadPersistentStore();

    const motorizedImages = Object.values(store.mappings)
      .filter((mapping: any) =>
        mapping.targetPath.includes(`/motorized/${slug}/`) ||
        (mapping.metadata?.slug === slug && mapping.metadata?.category === 'motorized')
      )
      .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((mapping: any) => mapping.targetPath);

    return motorizedImages;
  } catch (error) {
    console.warn('저장소에서 모터라이즈드 이미지 순서 가져오기 실패:', error);
    return [];
  }
}

// ================================================================================
// 🖼️ 클라이언트/서버 호환 이미지 경로 함수들
// ================================================================================

/**
 * Reference 프로젝트의 이미지 경로들을 자동으로 생성
 * @param slug 프로젝트 slug
 * @returns 이미지 경로 배열 (최대 10개)
 */
export function getReferenceImagePaths(slug: string): string[] {
  // 서버 사이드에서 이미지 저장소에서 순서 정보 가져오기
  if (isServer) {
    try {
      const sortedPaths = getSortedReferenceImagePaths(slug);
      if (sortedPaths.length > 0) {
        return sortedPaths;
      }
    } catch (error) {
      console.warn('저장소에서 레퍼런스 이미지 순서 가져오기 실패, fallback 사용:', error);
    }
  }

  // 클라이언트 사이드나 실패 시 기존 로직 사용
  const basePath = `/images/references/${slug}`;

  // SEO 최적화된 파일명 패턴들
  const possibleFileNames = [
    'main.jpg',
    'detail-1.jpg',
    'detail-2.jpg',
    'lifestyle.jpg',
    'gallery-1.jpg',
    'gallery-2.jpg',
    'gallery-3.jpg',
    // 대체 파일명 패턴
    `${slug}-main.jpg`,
    `${slug}-1.jpg`,
    `${slug}-2.jpg`,
    `${slug}-3.jpg`,
    `${slug}-4.jpg`,
    `${slug}-5.jpg`,
    'image-1.jpg',
    'image-2.jpg',
    'image-3.jpg',
  ];

  return possibleFileNames.map(fileName => `${basePath}/${fileName}`);
}

// ================================================================================
// 🏷️ 이미지 메타데이터 및 SEO 유틸리티
// ================================================================================

/**
 * 이미지 alt 텍스트 자동 생성 (SEO 최적화)
 * @param projectTitle 프로젝트 제목
 * @param imageIndex 이미지 순서 (1부터 시작)
 * @param isMainImage 대표 이미지 여부
 * @returns SEO 최적화된 alt 텍스트
 */
export function generateImageAlt(
  projectTitle: string,
  imageIndex: number,
  isMainImage: boolean = false
): string {
  if (isMainImage) {
    return `${projectTitle} - 카키샵 인테리어 프로젝트 대표 이미지`;
  }
  return `${projectTitle} - 카키샵 인테리어 프로젝트 상세 이미지 ${imageIndex}`;
}

/**
 * Next.js Image 컴포넌트용 sizes 속성 생성
 * @param type 이미지 타입
 * @returns 반응형 sizes 문자열
 */
export function getImageSizes(type: 'main' | 'thumbnail' | 'gallery' = 'main'): string {
  switch (type) {
    case 'main':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'thumbnail':
      return '(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw';
    case 'gallery':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw';
    default:
      return '100vw';
  }
}

/**
 * 이미지 경로에서 slug 추출
 * @param imagePath 이미지 경로
 * @returns 추출된 slug 또는 null
 */
export function extractSlugFromImagePath(imagePath: string): string | null {
  const matches = imagePath.match(/\/references\/([^\/]+)\//);
  return matches ? matches[1] : null;
}

/**
 * 프로젝트 메인 이미지 URL 생성 (OpenGraph 등에 사용)
 * @param slug 프로젝트 slug
 * @param baseUrl 기본 URL
 * @returns 완전한 이미지 URL
 */
export function getProjectMainImageUrl(slug: string, baseUrl: string = 'https://khakishop.kr'): string {
  const imagePaths = getReferenceImagePaths(slug);
  const mainImage = imagePaths[0] || '/images/hero/hero.jpg';
  return `${baseUrl}${mainImage}`;
}

/**
 * Curtain 제품의 이미지 경로들을 자동으로 생성
 * @param slug 제품 slug
 * @returns 이미지 경로 배열 (최대 10개)
 */
export function getCurtainImagePaths(slug: string): string[] {
  // 서버 사이드에서 이미지 저장소에서 순서 정보 가져오기
  if (isServer) {
    try {
      const sortedPaths = getSortedCurtainImagePaths(slug);
      if (sortedPaths.length > 0) {
        return sortedPaths;
      }
    } catch (error) {
      console.warn('저장소에서 커튼 이미지 순서 가져오기 실패, fallback 사용:', error);
    }
  }

  // 클라이언트 사이드나 실패 시 기존 로직 사용
  const basePath = `/images/curtain/${slug}`;

  // SEO 최적화된 파일명 패턴들
  const possibleFileNames = [
    'main.jpg',
    'detail-1.jpg',
    'detail-2.jpg',
    'lifestyle.jpg',
    'gallery-1.jpg',
    'gallery-2.jpg',
    'gallery-3.jpg',
    // 대체 파일명 패턴
    `${slug}-main.jpg`,
    `${slug}-1.jpg`,
    `${slug}-2.jpg`,
    `${slug}-3.jpg`,
    `${slug}-4.jpg`,
    `${slug}-5.jpg`,
    'image-1.jpg',
    'image-2.jpg',
    'image-3.jpg',
  ];

  return possibleFileNames.map(fileName => `${basePath}/${fileName}`);
}

/**
 * Blind 제품의 이미지 경로들을 자동으로 생성
 * @param slug 제품 slug
 * @returns 이미지 경로 배열 (최대 10개)
 */
export function getBlindImagePaths(slug: string): string[] {
  // 서버 사이드에서 이미지 저장소에서 순서 정보 가져오기
  if (isServer) {
    try {
      const sortedPaths = getSortedBlindImagePaths(slug);
      if (sortedPaths.length > 0) {
        return sortedPaths;
      }
    } catch (error) {
      console.warn('저장소에서 블라인드 이미지 순서 가져오기 실패, fallback 사용:', error);
    }
  }

  // 클라이언트 사이드나 실패 시 기존 로직 사용
  const basePath = `/images/blind/${slug}`;

  // SEO 최적화된 파일명 패턴들
  const possibleFileNames = [
    'main.jpg',
    'detail-1.jpg',
    'detail-2.jpg',
    'lifestyle.jpg',
    'gallery-1.jpg',
    'gallery-2.jpg',
    'gallery-3.jpg',
    // 대체 파일명 패턴
    `${slug}-main.jpg`,
    `${slug}-1.jpg`,
    `${slug}-2.jpg`,
    `${slug}-3.jpg`,
    `${slug}-4.jpg`,
    `${slug}-5.jpg`,
    'image-1.jpg',
    'image-2.jpg',
    'image-3.jpg',
  ];

  return possibleFileNames.map(fileName => `${basePath}/${fileName}`);
}

/**
 * Motorized 제품의 이미지 경로들을 자동으로 생성
 * @param slug 제품 slug
 * @returns 이미지 경로 배열 (최대 10개)
 */
export function getMotorizedImagePaths(slug: string): string[] {
  // 서버 사이드에서 이미지 저장소에서 순서 정보 가져오기
  if (isServer) {
    try {
      const sortedPaths = getSortedMotorizedImagePaths(slug);
      if (sortedPaths.length > 0) {
        return sortedPaths;
      }
    } catch (error) {
      console.warn('저장소에서 모터라이즈드 이미지 순서 가져오기 실패, fallback 사용:', error);
    }
  }

  // 클라이언트 사이드나 실패 시 기존 로직 사용
  const basePath = `/images/motorized/${slug}`;

  // SEO 최적화된 파일명 패턴들
  const possibleFileNames = [
    'main.jpg',
    'detail-1.jpg',
    'detail-2.jpg',
    'lifestyle.jpg',
    'gallery-1.jpg',
    'gallery-2.jpg',
    'gallery-3.jpg',
    // 대체 파일명 패턴
    `${slug}-main.jpg`,
    `${slug}-1.jpg`,
    `${slug}-2.jpg`,
    `${slug}-3.jpg`,
    `${slug}-4.jpg`,
    `${slug}-5.jpg`,
    'image-1.jpg',
    'image-2.jpg',
    'image-3.jpg',
  ];

  return possibleFileNames.map(fileName => `${basePath}/${fileName}`);
} 