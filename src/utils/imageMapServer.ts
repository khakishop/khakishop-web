// ================================================================================
// 🎯 KHAKISHOP 이미지 매핑 서버 유틸리티
// ================================================================================
// 🎨 디자인 모티브: https://www.rigas-furniture.gr/
// 🔧 관리자 연동: /ko/admin/images

import { isServer, ensureServerEnvironment } from '../lib/isServer';
import { fs, path, fsSync, checkServerModules } from '../lib/serverUtils';

// ================================================================================
// 💾 이미지 매핑 저장소 타입 정의
// ================================================================================

export interface ImageMapping {
  id: string;
  originalPath: string;
  targetPath: string;
  displayOrder: number;
  metadata?: {
    category?: string;
    slug?: string;
    description?: string;
    isProtected?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface ImageStore {
  version: string;
  lastUpdated: string;
  mappings: { [id: string]: ImageMapping };
  categories: string[];
  stats: {
    totalImages: number;
    protectedImages: number;
  };
}

// ================================================================================
// 📁 저장소 파일 관리
// ================================================================================

const STORE_FILE_PATH = 'persistent-image-store.json';

/**
 * 이미지 저장소를 메모리에서 로드
 * @returns 이미지 저장소 객체
 */
export function loadPersistentStore(): ImageStore {
  if (!checkServerModules('loadPersistentStore')) {
    return getDefaultStore();
  }

  try {
    const storePath = path!.join(process.cwd(), STORE_FILE_PATH);
    
    if (!fsSync!.existsSync(storePath)) {
      console.log('📁 새로운 이미지 저장소 파일 생성');
      const defaultStore = getDefaultStore();
      savePersistentStore(defaultStore);
      return defaultStore;
    }

    const fileContent = fsSync!.readFileSync(storePath, 'utf-8');
    const store = JSON.parse(fileContent) as ImageStore;
    
    // 버전 호환성 체크
    if (!store.version || store.version !== '1.0') {
      console.log('🔄 저장소 버전 업그레이드');
      return migrateLegacyStore(store);
    }

    return store;
  } catch (error) {
    console.error('❌ 저장소 로드 실패:', error);
    return getDefaultStore();
  }
}

/**
 * 이미지 저장소를 파일에 저장
 * @param store 저장할 이미지 저장소
 */
export function savePersistentStore(store: ImageStore): void {
  if (!checkServerModules('savePersistentStore')) {
    console.warn('⚠️ 클라이언트에서는 저장소를 저장할 수 없습니다.');
    return;
  }

  try {
    const storePath = path!.join(process.cwd(), STORE_FILE_PATH);
    store.lastUpdated = new Date().toISOString();
    
    // 원자적 쓰기를 위한 임시 파일 사용
    const tempPath = `${storePath}.tmp`;
    fsSync!.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf-8');
    fsSync!.renameSync(tempPath, storePath);
    
    console.log('💾 이미지 저장소 저장 완료');
  } catch (error) {
    console.error('❌ 저장소 저장 실패:', error);
  }
}

/**
 * 기본 저장소 구조 생성
 * @returns 기본 이미지 저장소
 */
function getDefaultStore(): ImageStore {
  return {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    mappings: {},
    categories: ['gallery', 'collections', 'hero', 'landing', 'projects', 'references', 'curtain', 'blind'],
    stats: {
      totalImages: 0,
      protectedImages: 0,
    },
  };
}

/**
 * 레거시 저장소 마이그레이션
 * @param legacyStore 기존 저장소
 * @returns 새로운 버전의 저장소
 */
function migrateLegacyStore(legacyStore: any): ImageStore {
  const newStore = getDefaultStore();
  
  // 기존 매핑 데이터가 있다면 마이그레이션
  if (legacyStore.mappings) {
    Object.entries(legacyStore.mappings).forEach(([id, mapping]: [string, any]) => {
      newStore.mappings[id] = {
        id,
        originalPath: mapping.originalPath || mapping.targetPath,
        targetPath: mapping.targetPath,
        displayOrder: mapping.displayOrder || 0,
        metadata: {
          category: mapping.metadata?.category || 'gallery',
          description: mapping.metadata?.description || '',
          isProtected: mapping.metadata?.isProtected || false,
          createdAt: mapping.metadata?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  savePersistentStore(newStore);
  return newStore;
}

// ================================================================================
// 🔄 이미지 동기화 및 매핑
// ================================================================================

/**
 * 이미지 파일들을 스캔하고 저장소와 동기화
 * @param forceRepair 강제 복구 모드
 * @returns 동기화 결과
 */
export async function syncImageMap(forceRepair: boolean = false): Promise<{
  mappedImages: number;
  unmappedFiles: number;
  missingFiles: number;
  protectedImages: number;
  newlyAdded?: number;
}> {
  if (!checkServerModules('syncImageMap')) {
    return { mappedImages: 0, unmappedFiles: 0, missingFiles: 0, protectedImages: 0 };
  }

  console.log('🔄 이미지 동기화 시작...');

  try {
    const store = loadPersistentStore();
    let newlyAdded = 0;

    // 다양한 이미지 디렉토리들 스캔
    const imageDirs = [
      { path: path!.join(process.cwd(), 'public', 'images', 'midjourney'), category: 'gallery' },
      { path: path!.join(process.cwd(), 'public', 'images', 'curtain'), category: 'curtain' },
      { path: path!.join(process.cwd(), 'public', 'images', 'blind'), category: 'blind' },
      { path: path!.join(process.cwd(), 'public', 'images', 'references'), category: 'references' },
      { path: path!.join(process.cwd(), 'public', 'images', 'projects'), category: 'projects' },
      { path: path!.join(process.cwd(), 'public', 'images', 'collections'), category: 'collections' },
      { path: path!.join(process.cwd(), 'public', 'images', 'hero'), category: 'hero' },
      { path: path!.join(process.cwd(), 'public', 'images', 'landing'), category: 'landing' },
    ];

    // 각 디렉토리의 이미지 파일들 스캔
    for (const dir of imageDirs) {
      if (fsSync!.existsSync(dir.path)) {
        await scanDirectoryRecursively(dir.path, dir.category, store);
      }
    }

    // 특별 처리: projects 폴더 디렉토리별 스캔
    const projectsPath = path!.join(process.cwd(), 'public', 'images', 'projects');
    if (fsSync!.existsSync(projectsPath)) {
      const projectFolders = fsSync!.readdirSync(projectsPath)
        .filter(item => fsSync!.statSync(path!.join(projectsPath, item)).isDirectory());
      
      console.log(`📁 projects 폴더에서 ${projectFolders.length}개 파일 발견`);
      
      for (const folder of projectFolders) {
        const folderPath = path!.join(projectsPath, folder);
        await scanDirectoryRecursively(folderPath, 'projects', store, folder);
      }
    }

    // 강제 복구 모드 시 무결성 검사 실행
    if (forceRepair) {
      console.log('🔧 강제 무결성 검사 및 복원 시작...');
      const repairResult = await validateAndRepairImageStore();
      console.log(`✅ 시스템 복원 완료: 복원 ${repairResult.repairedMappings}개, 누락 ${repairResult.missingFiles}개`);
    }

    // 통계 업데이트
    const mappedImages = Object.keys(store.mappings).length;
    const protectedImages = Object.values(store.mappings)
      .filter(mapping => mapping.metadata?.isProtected).length;

    store.stats = {
      totalImages: mappedImages,
      protectedImages,
    };

    savePersistentStore(store);

    console.log('✅ 이미지 동기화 완료:', {
      mappedImages,
      protectedImages,
    });

    return {
      mappedImages,
      unmappedFiles: 0,
      missingFiles: 0,
      protectedImages,
      newlyAdded,
    };

  } catch (error) {
    console.error('❌ 이미지 동기화 실패:', error);
    return { mappedImages: 0, unmappedFiles: 0, missingFiles: 0, protectedImages: 0 };
  }
}

/**
 * 디렉토리를 재귀적으로 스캔하여 이미지 파일들 매핑
 * @param dirPath 스캔할 디렉토리 경로
 * @param category 카테고리
 * @param store 이미지 저장소
 * @param slug 프로젝트 slug (옵션)
 */
async function scanDirectoryRecursively(
  dirPath: string,
  category: string,
  store: ImageStore,
  slug?: string
): Promise<void> {
  if (!checkServerModules('scanDirectoryRecursively')) {
    return;
  }

  try {
    const items = fsSync!.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path!.join(dirPath, item);
      const stat = fsSync!.statSync(itemPath);

      if (stat.isDirectory()) {
        // 하위 디렉토리 재귀 처리
        await scanDirectoryRecursively(itemPath, category, store, slug || item);
      } else if (isImageFile(item)) {
        // 이미지 파일 매핑
        const relativePath = path!.relative(
          path!.join(process.cwd(), 'public'),
          itemPath
        ).replace(/\\/g, '/');
        const targetPath = `/${relativePath}`;

        const id = generateImageId(targetPath);
        
        if (!store.mappings[id]) {
          store.mappings[id] = {
            id,
            originalPath: targetPath,
            targetPath,
            displayOrder: Object.keys(store.mappings).length,
            metadata: {
              category,
              slug: slug || extractSlugFromPath(targetPath),
              description: '',
              isProtected: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          };
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️ 디렉토리 스캔 실패: ${dirPath}`, error);
  }
}

/**
 * 파일이 이미지인지 확인
 * @param fileName 파일명
 * @returns 이미지 파일 여부
 */
function isImageFile(fileName: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const ext = path!.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * 이미지 경로에서 고유 ID 생성
 * @param imagePath 이미지 경로
 * @returns 고유 ID
 */
function generateImageId(imagePath: string): string {
  return imagePath.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
}

/**
 * 경로에서 slug 추출
 * @param imagePath 이미지 경로
 * @returns 추출된 slug
 */
function extractSlugFromPath(imagePath: string): string {
  const pathParts = imagePath.split('/').filter(Boolean);
  if (pathParts.length >= 3) {
    return pathParts[pathParts.length - 2] || 'unknown';
  }
  return 'unknown';
}

// ================================================================================
// 🔧 무결성 검사 및 복구
// ================================================================================

/**
 * 이미지 저장소 무결성 검사 및 자동 복구
 * @returns 복구 결과
 */
export async function validateAndRepairImageStore(): Promise<{
  repairedMappings: number;
  missingFiles: number;
  isHealthy: boolean;
}> {
  if (!checkServerModules('validateAndRepairImageStore')) {
    return { repairedMappings: 0, missingFiles: 0, isHealthy: false };
  }

  try {
    const store = loadPersistentStore();
    let repairedMappings = 0;
    let missingFiles = 0;

    // 매핑된 파일들의 실제 존재 여부 확인
    for (const [id, mapping] of Object.entries(store.mappings)) {
      const filePath = path!.join(process.cwd(), 'public', mapping.targetPath.substring(1));
      
      if (!fsSync!.existsSync(filePath)) {
        console.warn(`⚠️ 누락된 파일: ${mapping.targetPath}`);
        missingFiles++;
      } else {
        // 메타데이터 복구
        if (!mapping.metadata?.updatedAt) {
          mapping.metadata = {
            ...mapping.metadata,
            updatedAt: new Date().toISOString(),
          };
          repairedMappings++;
        }
      }
    }

    if (repairedMappings > 0) {
      savePersistentStore(store);
    }

    console.log(`✅ 무결성 검사 완료: 복원 ${repairedMappings}개, 누락 ${missingFiles}개`);

    return {
      repairedMappings,
      missingFiles,
      isHealthy: missingFiles === 0,
    };

  } catch (error) {
    console.error('❌ 무결성 검사 실패:', error);
    return { repairedMappings: 0, missingFiles: 0, isHealthy: false };
  }
}

/**
 * 이미지 보호 설정
 * @param imageId 이미지 ID
 * @param isProtected 보호 여부
 * @returns 설정 성공 여부
 */
export function setImageProtection(imageId: string, isProtected: boolean): boolean {
  if (!checkServerModules('setImageProtection')) {
    return false;
  }

  try {
    const store = loadPersistentStore();
    
    if (store.mappings[imageId]) {
      store.mappings[imageId].metadata = {
        ...store.mappings[imageId].metadata,
        isProtected,
        updatedAt: new Date().toISOString(),
      };
      
      savePersistentStore(store);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ 이미지 보호 설정 실패:', error);
    return false;
  }
}
