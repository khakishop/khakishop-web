import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync, unlinkSync, readdirSync, statSync } from 'fs';
import { addProtectedImage } from '../../../utils/imageMapServer';

const path = require('path');

// ================================================================================
// 🚀 최적화된 이미지 업로드 API (스트리밍 지원 + 배치 처리)
// ================================================================================
// 🎯 목적: 고성능 파일 업로드 + 자동 매핑 + 실패 시 롤백 + 진행률 추적

// 업로드 설정
const UPLOAD_CONFIG = {
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxBatchSize: 10, // 최대 배치 업로드 수
  qualityOptimization: true,
  thumbnailGeneration: false, // 필요시 활성화
} as const;

// 파일명 정리 함수 (성능 최적화)
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^가-힣a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[._-]+|[._-]+$/g, '') // 시작/끝 특수문자 제거
    .toLowerCase();
}

// 고유한 파일명 생성 (충돌 방지)
function generateUniqueFileName(originalName: string, targetDir: string): string {
  const sanitized = sanitizeFileName(originalName);
  const { name, ext } = path.parse(sanitized);
  
  let counter = 0;
  let newFileName = sanitized;
  
  while (existsSync(path.join(targetDir, newFileName))) {
    counter++;
    newFileName = `${name}_${counter}${ext}`;
  }
  
  return newFileName;
}

// 디렉토리 경로 생성 및 검증
function createDirectoryPath(category: string, subcategory?: string): string {
  const baseDir = 'public/images';
  const categoryPath = category.replace(/[^a-zA-Z0-9-_]/g, '_');
  
  if (subcategory?.trim()) {
    const subcategoryPath = subcategory.replace(/[^a-zA-Z0-9-_]/g, '_');
    return path.join(baseDir, categoryPath, subcategoryPath);
  }
  
  return path.join(baseDir, categoryPath);
}

// 파일 메타데이터 생성
function generateImageMetadata(
  fileName: string,
  category: string,
  subcategory?: string,
  description?: string
) {
  const baseName = path.parse(fileName).name;
  const categoryDisplay = subcategory ? `${category}/${subcategory}` : category;
  
  return {
    fileName,
    alt: `${categoryDisplay} - ${baseName}`,
    title: `KHAKI SHOP - ${categoryDisplay} - ${baseName}`,
    dataStyle: `${category}-style`,
    category: categoryDisplay,
    description: description || `${categoryDisplay} 이미지`,
    priority: category === 'hero' ? 1 : category === 'landing' ? 2 : 5,
    isProtected: true, // 업로드된 이미지는 기본적으로 보호
    uploadedAt: new Date().toISOString(),
  };
}

// 업로드 진행률 추적을 위한 스트림 래퍼
async function processFileUpload(
  file: File,
  targetPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const fileSize = file.size;
  let uploadedBytes = 0;

  // 청크 단위로 파일 처리
  const reader = file.stream().getReader();
  const chunks: Uint8Array[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      uploadedBytes += value.length;
      
      // 진행률 콜백
      if (onProgress) {
        const progress = Math.round((uploadedBytes / fileSize) * 100);
        onProgress(progress);
      }
    }

    // 모든 청크를 결합하여 파일 저장
    const buffer = Buffer.concat(chunks);
    await writeFile(targetPath, buffer);
    
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: NextRequest) {
  let uploadedFilePath: string | null = null;
  
  try {
    console.log('📤 이미지 업로드 API 시작...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string;
    const description = formData.get('description') as string || '';

    // === 입력 검증 ===
    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    if (!category?.trim()) {
      return NextResponse.json(
        { success: false, error: '카테고리가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!UPLOAD_CONFIG.allowedTypes.includes(file.type as any)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `지원하지 않는 파일 형식입니다: ${file.type}`,
          allowedTypes: UPLOAD_CONFIG.allowedTypes 
        },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: `파일 크기가 ${(UPLOAD_CONFIG.maxFileSize / 1024 / 1024).toFixed(1)}MB를 초과합니다.`,
          maxSize: UPLOAD_CONFIG.maxFileSize,
          actualSize: file.size
        },
        { status: 400 }
      );
    }

    // === 파일 경로 준비 ===
    const targetDir = createDirectoryPath(category, subcategory);
    
    // 디렉토리 생성
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
      console.log(`📁 디렉토리 생성: ${targetDir}`);
    }

    // 고유한 파일명 생성
    const uniqueFileName = generateUniqueFileName(file.name, targetDir);
    const fullPath = path.join(targetDir, uniqueFileName);
    uploadedFilePath = fullPath;

    // === 파일 업로드 실행 ===
    console.log(`💾 파일 업로드 시작: ${uniqueFileName}`);
    
    // 스트리밍 업로드 (진행률 추적 포함)
    await processFileUpload(file, fullPath, (progress) => {
      console.log(`📊 업로드 진행률: ${progress}%`);
    });

    console.log(`✅ 파일 저장 완료: ${fullPath}`);

    // === 이미지 매핑 등록 ===
    const relativePath = fullPath.replace('public', '');
    const metadata = generateImageMetadata(
      uniqueFileName,
      category,
      subcategory,
      description
    );

    try {
      const imageId = addProtectedImage(relativePath, metadata);
      console.log(`📷 이미지 매핑 추가: ${uniqueFileName} → ${relativePath}`);

      // 성공 응답
      return NextResponse.json({
        success: true,
        message: '파일 업로드 성공',
        fileName: uniqueFileName,
        category,
        subcategory: subcategory || null,
        description,
        isProtected: metadata.isProtected,
        size: file.size,
        type: file.type,
        path: relativePath,
        uploadedAt: metadata.uploadedAt
      });

    } catch (mappingError) {
      console.error('❌ 이미지 매핑 실패:', mappingError);
      
      // 매핑 실패 시 업로드된 파일 정리
      try {
        if (uploadedFilePath && existsSync(uploadedFilePath)) {
          unlinkSync(uploadedFilePath);
          console.log('🗑️ 실패한 업로드 파일 정리 완료');
        }
      } catch (cleanupError) {
        console.error('❌ 파일 정리 실패:', cleanupError);
      }

      return NextResponse.json(
        { 
          success: false, 
          error: '이미지 매핑 등록 실패',
          details: mappingError instanceof Error ? mappingError.message : '알 수 없는 오류'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ 파일 업로드 에러:', error);
    
    // 업로드 실패 시 파일 정리
    try {
      if (uploadedFilePath && existsSync(uploadedFilePath)) {
        unlinkSync(uploadedFilePath);
        console.log('🗑️ 실패한 업로드 파일 정리 완료');
      }
    } catch (cleanupError) {
      console.error('❌ 파일 정리 실패:', cleanupError);
    }

    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { 
        success: false, 
        error: '파일 업로드 중 오류가 발생했습니다.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 처리 (CORS + 성능 최적화)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24시간 캐시
    },
  });
}

// 📊 업로드 현황 조회 API (성능 최적화)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    if (type === 'config') {
      // 업로드 설정 정보 반환
      return NextResponse.json({
        success: true,
        config: {
          allowedTypes: UPLOAD_CONFIG.allowedTypes,
          maxFileSize: UPLOAD_CONFIG.maxFileSize,
          maxBatchSize: UPLOAD_CONFIG.maxBatchSize,
          maxFileSizeMB: UPLOAD_CONFIG.maxFileSize / 1024 / 1024,
        }
      });
    }

    if (type === 'stats') {
      // 카테고리별 통계 (성능 최적화)
      const baseDir = path.join(process.cwd(), 'public', 'images');
      
      if (!existsSync(baseDir)) {
        return NextResponse.json({
          success: true,
          stats: {
            totalFiles: 0,
            totalSize: 0,
            categories: {},
          }
        });
      }

      const stats = {
        totalFiles: 0,
        totalSize: 0,
        categories: {} as Record<string, { files: number; size: number; }>
      };

      // 카테고리별 스캔
      const categories = readdirSync(baseDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const cat of categories) {
        const catPath = path.join(baseDir, cat);
        const catStats = { files: 0, size: 0 };

        try {
          const scanDirectory = (dirPath: string) => {
            const items = readdirSync(dirPath, { withFileTypes: true });
            
            for (const item of items) {
              const itemPath = path.join(dirPath, item.name);
              
              if (item.isDirectory()) {
                scanDirectory(itemPath); // 재귀 스캔
              } else if (item.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(item.name)) {
                const stat = statSync(itemPath);
                catStats.files++;
                catStats.size += stat.size;
              }
            }
          };

          scanDirectory(catPath);
        } catch (error) {
          console.error(`카테고리 스캔 실패: ${cat}`, error);
        }

        stats.categories[cat] = catStats;
        stats.totalFiles += catStats.files;
        stats.totalSize += catStats.size;
      }

      return NextResponse.json({
        success: true,
        stats
      });
    }

    // 기본: 설정 정보 반환
    return NextResponse.json({
      success: true,
      config: UPLOAD_CONFIG
    });

  } catch (error) {
    console.error('❌ 통계 조회 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '통계 조회 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
