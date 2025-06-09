// ================================================================================
// 🔒 KHAKISHOP 이미지 매핑 시스템 (서버 전용)
// ================================================================================
// 🎯 목적: fs 모듈을 사용하는 서버 사이드 함수들
// 🛡️ 보안: 클라이언트에서 접근 불가, API 라우트에서만 사용

import fs from 'fs';
import path from 'path';
import type { ImageMapping, PersistentImageStore, ImageMetadata } from './imageMap';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'persistent-image-store.json');

// 🔍 서버 환경 확인
function ensureServerEnvironment() {
  if (typeof window !== 'undefined') {
    throw new Error('❌ 이 함수는 서버에서만 사용할 수 있습니다.');
  }
}

// 📁 데이터 폴더 생성
function ensureDataDirectory() {
  ensureServerEnvironment();
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 💾 영구 저장소 로드
function loadPersistentStore(): PersistentImageStore {
  ensureServerEnvironment();
  ensureDataDirectory();
  
  if (!fs.existsSync(STORE_FILE)) {
    const defaultStore: PersistentImageStore = {
      version: "1.0.0",
      lastSync: null,
      protectedImages: {},
      mappings: {}
    };
    savePersistentStore(defaultStore);
    return defaultStore;
  }
  
  try {
    const data = fs.readFileSync(STORE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('🚨 저장소 로드 실패:', error);
    const defaultStore: PersistentImageStore = {
      version: "1.0.0",
      lastSync: null,
      protectedImages: {},
      mappings: {}
    };
    return defaultStore;
  }
}

// 💾 영구 저장소 저장
function savePersistentStore(store: PersistentImageStore): void {
  ensureServerEnvironment();
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (error) {
    console.error('🚨 저장소 저장 실패:', error);
    throw error;
  }
}

// 🎯 카테고리별 우선순위 (1=최고 우선순위)
const categoryPriority: Record<string, number> = {
  hero: 1, landing: 1, projects: 2, collections: 3, references: 4, 
  products: 5, gallery: 6, blog: 7, about: 8, future: 9
};

// 🏷️ 카테고리별 메타데이터 생성
const generateMetadataForCategory = (category: string, description: string): ImageMetadata => {
  const priority = categoryPriority[category] || 5;
  
  const categoryTags: Record<string, Partial<ImageMetadata>> = {
    hero: {
      alt: `khaki shop - ${description}`,
      title: `감성적인 텍스타일 브랜드 khaki shop - ${description}`,
      dataStyle: "hero-elegant"
    },
    landing: {
      alt: `khaki shop 홈페이지 - ${description}`,
      title: `공간을 완성하는 텍스타일 - ${description}`,
      dataStyle: "landing-warm"
    },
    projects: {
      alt: `khaki shop 프로젝트 - ${description}`,
      title: `완성된 공간들 - ${description}`,
      dataStyle: "project-showcase"
    },
    collections: {
      alt: `khaki shop 컬렉션 - ${description}`,
      title: `감성 컬렉션 - ${description}`,
      dataStyle: "collection-curated"
    },
    references: {
      alt: `khaki shop 시공 사례 - ${description}`,
      title: `실제 시공 사례 - ${description}`,
      dataStyle: "reference-proven"
    },
    products: {
      alt: `khaki shop 제품 - ${description}`,
      title: `품질 제품 - ${description}`,
      dataStyle: "product-quality"
    },
    gallery: {
      alt: `khaki shop 갤러리 - ${description}`,
      title: `갤러리 이미지 - ${description}`,
      dataStyle: "gallery-aesthetic"
    },
    blog: {
      alt: `khaki shop 블로그 - ${description}`,
      title: `인사이트 & 팁 - ${description}`,
      dataStyle: "blog-informative"
    },
    about: {
      alt: `khaki shop 소개 - ${description}`,
      title: `브랜드 스토리 - ${description}`,
      dataStyle: "about-authentic"
    },
    future: {
      alt: `khaki shop 미래 계획 - ${description}`,
      title: `앞으로의 비전 - ${description}`,
      dataStyle: "future-vision"
    }
  };

  const baseTemplate = categoryTags[category] || categoryTags.gallery;
  
  return {
    alt: baseTemplate.alt || `khaki shop - ${description}`,
    title: baseTemplate.title || `khaki shop - ${description}`,
    dataStyle: baseTemplate.dataStyle || "default-style",
    category,
    description,
    priority
  };
};

// 🔄 이미지 맵 동기화
export async function syncImageMap(): Promise<void> {
  ensureServerEnvironment();
  
  try {
    const store = loadPersistentStore();
    const imageDir = path.join(process.cwd(), 'public', 'images', 'midjourney');
    
    // 디렉토리가 존재하지 않으면 생성
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    // 물리적 파일 스캔
    const files = fs.readdirSync(imageDir).filter(file => 
      /\.(png|jpg|jpeg|webp)$/i.test(file)
    );
    
    let syncCount = 0;
    
    // 새로운 파일들을 매핑에 추가
    for (const fileName of files) {
      const existingMapping = Object.values(store.mappings).find(
        mapping => mapping.sourceFile === fileName || mapping.targetPath.includes(fileName)
      );
      
      if (!existingMapping) {
        const imageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newMapping: ImageMapping = {
          id: imageId,
          sourceFile: fileName,
          targetPath: `/images/midjourney/${fileName}`,
          isProtected: false,
          createdAt: new Date().toISOString(),
          metadata: generateMetadataForCategory('gallery', `자동 복원된 이미지 ${fileName}`)
        };
        
        store.mappings[imageId] = newMapping;
        syncCount++;
      }
    }
    
    if (syncCount > 0) {
      store.lastSync = new Date().toISOString();
      savePersistentStore(store);
      console.log(`✅ ${syncCount}개의 새로운 이미지가 동기화되었습니다.`);
    }
    
  } catch (error) {
    console.error('🚨 이미지 맵 동기화 실패:', error);
    throw error;
  }
}

// 📋 모든 이미지 정보 가져오기
export function getAllImageInfo(): ImageMapping[] {
  ensureServerEnvironment();
  
  try {
    const store = loadPersistentStore();
    return Object.values(store.mappings);
  } catch (error) {
    console.error('🚨 이미지 정보 조회 실패:', error);
    return [];
  }
}

// 🔒 보호된 이미지 가져오기
export function getProtectedImages(): ImageMapping[] {
  ensureServerEnvironment();
  
  try {
    const store = loadPersistentStore();
    return Object.values(store.mappings).filter(mapping => mapping.isProtected);
  } catch (error) {
    console.error('🚨 보호된 이미지 조회 실패:', error);
    return [];
  }
}

// 📊 저장소 통계
export function getStoreStats() {
  ensureServerEnvironment();
  
  try {
    const store = loadPersistentStore();
    const mappings = Object.values(store.mappings);
    
    const categories = mappings.reduce((acc, mapping) => {
      const category = mapping.metadata.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalImages: mappings.length,
      protectedImages: mappings.filter(m => m.isProtected).length,
      categories,
      lastSync: store.lastSync
    };
  } catch (error) {
    console.error('🚨 통계 조회 실패:', error);
    return {
      totalImages: 0,
      protectedImages: 0,
      categories: {},
      lastSync: null
    };
  }
}

// 🛡️ 이미지 보호 설정
export function setImageProtection(imageId: string, isProtected: boolean): boolean {
  ensureServerEnvironment();
  
  try {
    const store = loadPersistentStore();
    
    if (store.mappings[imageId]) {
      store.mappings[imageId].isProtected = isProtected;
      store.protectedImages[imageId] = isProtected;
      savePersistentStore(store);
      
      console.log(`🔒 이미지 보호 설정 변경: ${imageId} → ${isProtected ? '보호됨' : '보호 해제'}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('🚨 보호 설정 실패:', error);
    return false;
  }
}

// 🔧 무결성 검사 및 복원
export async function validateAndRepairImageStore(): Promise<{
  success: boolean;
  repaired: string[];
  missing: string[];
  error?: string;
}> {
  ensureServerEnvironment();
  
  try {
    const store = loadPersistentStore();
    const imageDir = path.join(process.cwd(), 'public', 'images', 'midjourney');
    const repaired: string[] = [];
    const missing: string[] = [];
    
    // 매핑된 이미지들의 실제 파일 존재 여부 확인
    for (const [imageId, mapping] of Object.entries(store.mappings)) {
      const fileName = mapping.sourceFile;
      const filePath = path.join(imageDir, fileName);
      
      if (!fs.existsSync(filePath)) {
        missing.push(fileName);
      }
    }
    
    // 실제 파일들 중 매핑되지 않은 것들 자동 복원
    if (fs.existsSync(imageDir)) {
      const files = fs.readdirSync(imageDir).filter(file => 
        /\.(png|jpg|jpeg|webp)$/i.test(file)
      );
      
      for (const fileName of files) {
        const existingMapping = Object.values(store.mappings).find(
          mapping => mapping.sourceFile === fileName || mapping.targetPath.includes(fileName)
        );
        
        if (!existingMapping) {
          const imageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          const newMapping: ImageMapping = {
            id: imageId,
            sourceFile: fileName,
            targetPath: `/images/midjourney/${fileName}`,
            isProtected: false,
            createdAt: new Date().toISOString(),
            metadata: generateMetadataForCategory('gallery', `자동 복원된 이미지 ${fileName}`)
          };
          
          store.mappings[imageId] = newMapping;
          repaired.push(fileName);
        }
      }
    }
    
    if (repaired.length > 0) {
      store.lastSync = new Date().toISOString();
      savePersistentStore(store);
    }
    
    console.log(`✅ 무결성 검사 완료: 복원 ${repaired.length}개, 누락 ${missing.length}개`);
    
    return {
      success: true,
      repaired,
      missing
    };
    
  } catch (error) {
    console.error('🚨 무결성 검사 실패:', error);
    return {
      success: false,
      repaired: [],
      missing: [],
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// 📷 이미지 맵에 추가
export function addImageToMap(
  sourceFile: string,
  targetPath: string,
  metadata: ImageMetadata,
  isProtected: boolean = false
): string {
  ensureServerEnvironment();
  
  try {
    const store = loadPersistentStore();
    const imageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newMapping: ImageMapping = {
      id: imageId,
      sourceFile,
      targetPath,
      isProtected,
      createdAt: new Date().toISOString(),
      metadata
    };
    
    store.mappings[imageId] = newMapping;
    if (isProtected) {
      store.protectedImages[imageId] = true;
    }
    
    savePersistentStore(store);
    
    console.log(`📷 이미지 매핑 추가: ${sourceFile} → ${targetPath}`);
    return imageId;
    
  } catch (error) {
    console.error('🚨 이미지 매핑 추가 실패:', error);
    throw error;
  }
}

// 🗑️ 이미지 맵에서 제거
export function removeImageFromMap(imageId: string): boolean {
  ensureServerEnvironment();
  
  try {
    const store = loadPersistentStore();
    
    if (store.mappings[imageId]) {
      delete store.mappings[imageId];
      delete store.protectedImages[imageId];
      savePersistentStore(store);
      
      console.log(`🗑️ 이미지 매핑 제거: ${imageId}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('🚨 이미지 매핑 제거 실패:', error);
    return false;
  }
}

// 보호된 이미지 추가 (별칭)
export const addProtectedImage = (
  sourceFile: string,
  targetPath: string,
  metadata: ImageMetadata
): string => {
  return addImageToMap(sourceFile, targetPath, metadata, true);
}; 