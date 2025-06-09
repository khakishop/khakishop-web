import { NextRequest, NextResponse } from 'next/server';
import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import {
  syncImageMap,
  getAllImageInfo,
  getProtectedImages
} from '../../../utils/imageMapServer';

// 🚀 캐시 구조체
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // TTL in milliseconds
}

// 전역 캐시 저장소
const cache = new Map<string, CacheEntry>();

// 캐시 TTL (30초)
const CACHE_TTL = 30 * 1000;

// 캐시 헬퍼 함수들
function getCacheKey(request: any): string {
  const { forceRepair, includeStats, targetCategory } = request;
  return `sync-images:${forceRepair}:${includeStats}:${targetCategory || 'all'}`;
}

function getCachedData(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  
  console.log(`🎯 캐시 히트: ${key} (${Math.round((entry.ttl - (now - entry.timestamp)) / 1000)}초 남음)`);
  return entry.data;
}

function setCachedData(key: string, data: any, ttl: number = CACHE_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
  console.log(`💾 캐시 저장: ${key} (TTL: ${ttl/1000}초)`);
}

// 캐시 정리 (선택적)
function cleanExpiredCache(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  cache.forEach((entry, key) => {
    if (now - entry.timestamp > entry.ttl) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => cache.delete(key));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forceRepair = false, includeStats = true, targetCategory } = body;

    console.log('🔄 이미지 동기화 API 시작... (POST)', { forceRepair, includeStats });

    // 캐시 키 생성
    const cacheKey = getCacheKey({ forceRepair, includeStats, targetCategory });
    
    // forceRepair가 아닌 경우에만 캐시 확인
    if (!forceRepair) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }
    }

    // 실제 동기화 로직 실행
    const result = await performSyncLogic({ forceRepair, includeStats, targetCategory });
    
    // 결과를 캐시에 저장 (forceRepair인 경우 TTL을 짧게)
    const ttl = forceRepair ? 5000 : CACHE_TTL; // forceRepair: 5초, 일반: 30초
    setCachedData(cacheKey, result, ttl);
    
    // 만료된 캐시 정리
    cleanExpiredCache();

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ 이미지 동기화 실패:', error);
    return NextResponse.json(
      { 
        error: '이미지 동기화 중 오류가 발생했습니다',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      }, 
      { status: 500 }
    );
  }
}

// 기존 로직을 별도 함수로 분리
async function performSyncLogic({ forceRepair, includeStats, targetCategory }: any) {
  const projectsDir = join(process.cwd(), 'public', 'images', 'projects');
  if (existsSync(projectsDir)) {
    const projectFiles = readdirSync(projectsDir)
      .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    console.log(`📁 projects 폴더에서 ${projectFiles.length}개 파일 발견`);
  }

  // 🔄 이미지 맵 동기화
  await syncImageMap();
  
  // 📊 동기화된 이미지 정보 가져오기
  const allImages = getAllImageInfo();
  const protectedImages = getProtectedImages();
  
  let result: any = {
    success: true,
    mappedImages: allImages,
    totalImages: allImages.length,
    protectedImages: protectedImages.length
  };

  // 📊 통계 포함 모드
  if (includeStats) {
    result = {
      ...result,
      stats: allImages,
      timestamp: new Date().toISOString()
    };
  }

  // 📂 카테고리별 필터링
  if (targetCategory && targetCategory !== 'all') {
    const filteredImages = allImages.filter((img: any) => 
      img.metadata?.category === targetCategory
    ) || [];
    
    result.categoryImages = filteredImages;
    result.categoryCount = filteredImages.length;
  }

  console.log('✅ 이미지 동기화 완료:', { 
    mappedImages: result.totalImages, 
    protectedImages: result.protectedImages 
  });

  return result;
}

export async function GET(request: NextRequest) {
  // GET 요청도 캐시 적용
  const url = new URL(request.url);
  const forceRepair = url.searchParams.get('forceRepair') === 'true';
  const includeStats = url.searchParams.get('includeStats') !== 'false';
  const targetCategory = url.searchParams.get('category');

  const cacheKey = getCacheKey({ forceRepair, includeStats, targetCategory });
  
  if (!forceRepair) {
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
  }

  const result = await performSyncLogic({ forceRepair, includeStats, targetCategory });
  setCachedData(cacheKey, result);
  
  return NextResponse.json(result);
}
