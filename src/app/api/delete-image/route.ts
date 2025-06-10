import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { removeImageFromMap, getAllImageInfo } from '../../../utils/imageMapServer';

// ================================================================================
// 🗑️ KHAKISHOP 이미지 삭제 API
// ================================================================================
// 🎯 목적: 안전한 이미지 삭제 + 매핑 정보 제거 + 자동 동기화

interface DeleteImageRequest {
  imageId?: string;
  imagePath?: string;
  confirmDeletion?: boolean;
}

interface DeleteImageResponse {
  success: boolean;
  message: string;
  deletedImage?: {
    id: string;
    fileName: string;
    path: string;
    wasProtected: boolean;
  };
  error?: string;
  syncResult?: any;
}

// 이미지 ID로 매핑 정보 찾기
function findImageById(imageId: string) {
  const allImages = getAllImageInfo();
  return allImages.find(img => img.id === imageId);
}

// 이미지 경로로 매핑 정보 찾기
function findImageByPath(imagePath: string) {
  const allImages = getAllImageInfo();
  return allImages.find(img => img.targetPath === imagePath);
}

// 물리적 파일 경로 생성
function getPhysicalFilePath(targetPath: string): string {
  // targetPath: /images/category/filename.jpg
  // 물리적 경로: public/images/category/filename.jpg
  const relativePath = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
  return join(process.cwd(), 'public', relativePath);
}

// 자동 동기화 호출
async function triggerSyncImages(): Promise<any> {
  try {
    const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sync-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        forceRepair: false,
        includeStats: true,
      }),
    });

    if (syncResponse.ok) {
      return await syncResponse.json();
    } else {
      console.warn('⚠️ 자동 동기화 실패:', syncResponse.status);
      return null;
    }
  } catch (error) {
    console.error('❌ 자동 동기화 호출 실패:', error);
    return null;
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ 이미지 삭제 API 시작...');
    
    const body: DeleteImageRequest = await request.json();
    const { imageId, imagePath, confirmDeletion = false } = body;

    // === 입력 검증 ===
    if (!imageId && !imagePath) {
      return NextResponse.json(
        { 
          success: false, 
          error: '이미지 ID 또는 경로가 필요합니다.' 
        },
        { status: 400 }
      );
    }

    if (!confirmDeletion) {
      return NextResponse.json(
        { 
          success: false, 
          error: '삭제 확인이 필요합니다. confirmDeletion: true를 전송해주세요.' 
        },
        { status: 400 }
      );
    }

    // === 이미지 정보 찾기 ===
    let imageInfo = null;
    
    if (imageId) {
      imageInfo = findImageById(imageId);
      if (!imageInfo) {
        return NextResponse.json(
          { 
            success: false, 
            error: `이미지 ID를 찾을 수 없습니다: ${imageId}` 
          },
          { status: 404 }
        );
      }
    } else if (imagePath) {
      imageInfo = findImageByPath(imagePath);
      if (!imageInfo) {
        return NextResponse.json(
          { 
            success: false, 
            error: `이미지 경로를 찾을 수 없습니다: ${imagePath}` 
          },
          { status: 404 }
        );
      }
    }

    console.log(`🔍 삭제 대상 이미지: ${imageInfo.sourceFile} (${imageInfo.id})`);

    // === 물리적 파일 삭제 ===
    const physicalPath = getPhysicalFilePath(imageInfo.targetPath);
    let fileDeleted = false;

    if (existsSync(physicalPath)) {
      try {
        await unlink(physicalPath);
        fileDeleted = true;
        console.log(`🗂️ 물리적 파일 삭제 완료: ${physicalPath}`);
      } catch (error) {
        console.error('❌ 물리적 파일 삭제 실패:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: `파일 삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}` 
          },
          { status: 500 }
        );
      }
    } else {
      console.warn(`⚠️ 물리적 파일이 존재하지 않음: ${physicalPath}`);
    }

    // === 매핑 정보 제거 ===
    const mappingRemoved = removeImageFromMap(imageInfo.id);
    
    if (!mappingRemoved) {
      console.warn(`⚠️ 매핑 정보 제거 실패: ${imageInfo.id}`);
      return NextResponse.json(
        { 
          success: false, 
          error: '매핑 정보 제거에 실패했습니다.' 
        },
        { status: 500 }
      );
    }

    console.log(`📷 매핑 정보 제거 완료: ${imageInfo.id}`);

    // === 자동 동기화 호출 ===
    const syncResult = await triggerSyncImages();
    
    if (syncResult) {
      console.log('🔄 자동 동기화 완료');
    } else {
      console.warn('⚠️ 자동 동기화 실패 (삭제는 완료됨)');
    }

    // === 응답 생성 ===
    const response: DeleteImageResponse = {
      success: true,
      message: `이미지가 성공적으로 삭제되었습니다: ${imageInfo.sourceFile}`,
      deletedImage: {
        id: imageInfo.id,
        fileName: imageInfo.sourceFile,
        path: imageInfo.targetPath,
        wasProtected: imageInfo.isProtected || false,
      },
      syncResult,
    };

    console.log('✅ 이미지 삭제 완료:', response.deletedImage);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ 이미지 삭제 API 오류:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '이미지 삭제 중 오류가 발생했습니다',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      }, 
      { status: 500 }
    );
  }
}

// POST 요청도 지원 (DELETE 요청을 지원하지 않는 클라이언트용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // method가 DELETE인 경우에만 삭제 처리
    if (body.method === 'DELETE') {
      // DELETE 핸들러를 재사용
      const deleteRequest = new NextRequest(request.url, {
        method: 'DELETE',
        body: JSON.stringify(body),
        headers: request.headers,
      });
      
      return await DELETE(deleteRequest);
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'POST 요청에는 method: "DELETE"가 필요합니다.' 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '요청 처리 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

// OPTIONS 요청 지원 (CORS)
export async function OPTIONS() {
  return NextResponse.json(
    { success: true },
    {
      headers: {
        'Allow': 'DELETE, POST, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
} 