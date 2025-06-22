import { NextRequest, NextResponse } from 'next/server';
import { isServer } from '../../../../lib/isServer';
import { loadPersistentStore, savePersistentStore } from '../../../../utils/imageMapServer';

// ================================================================================
// 🔄 이미지 순서 변경 API
// ================================================================================

interface ReorderRequest {
  imageIds: string[]; // 새로운 순서대로 정렬된 이미지 ID 배열
  category?: string;  // 선택적으로 특정 카테고리만 처리
}

export async function POST(request: NextRequest) {
  try {
    // 서버 환경 확인
    if (!isServer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server-only operation',
          code: 'SERVER_ONLY'
        },
        { status: 500 }
      );
    }

    const body = await request.json() as ReorderRequest;
    const { imageIds, category } = body;

    // 입력 검증
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid imageIds array',
          code: 'INVALID_INPUT'
        },
        { status: 400 }
      );
    }

    console.log(`🔄 이미지 순서 변경 시작: ${imageIds.length}개 이미지`);
    console.log(`📂 카테고리: ${category || '전체'}`);

    // 현재 저장소 로드
    const store = loadPersistentStore();
    let updatedCount = 0;
    const errors: string[] = [];

    // 배치 업데이트 - displayOrder만 변경
    imageIds.forEach((imageId, newIndex) => {
      if (store.mappings[imageId]) {
        const oldOrder = store.mappings[imageId].displayOrder;
        store.mappings[imageId].displayOrder = newIndex;
        store.mappings[imageId].metadata = {
          ...store.mappings[imageId].metadata,
          updatedAt: new Date().toISOString()
        };

        console.log(`📍 ${imageId}: ${oldOrder} → ${newIndex}`);
        updatedCount++;
      } else {
        errors.push(`Image not found: ${imageId}`);
      }
    });

    // 저장소 업데이트
    if (updatedCount > 0) {
      store.lastUpdated = new Date().toISOString();
      savePersistentStore(store);

      console.log(`✅ 순서 변경 완료: ${updatedCount}개 이미지 업데이트`);
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount}개 이미지 순서가 변경되었습니다`,
      updatedCount,
      errors: errors.length > 0 ? errors : undefined,
      performance: {
        processedImages: imageIds.length,
        updatedImages: updatedCount,
        category: category || 'all'
      }
    });

  } catch (error) {
    console.error('❌ 이미지 순서 변경 실패:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reorder images',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'REORDER_FAILED'
      },
      { status: 500 }
    );
  }
}

// GET 요청 - 현재 순서 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // 서버 환경 확인
    if (!isServer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server-only operation'
        },
        { status: 500 }
      );
    }

    const store = loadPersistentStore();
    let images = Object.values(store.mappings);

    // 카테고리 필터링
    if (category && category !== 'all') {
      images = images.filter(img =>
        img.metadata?.category === category ||
        img.targetPath.includes(`/${category}/`)
      );
    }

    // displayOrder로 정렬
    images.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return NextResponse.json({
      success: true,
      images: images.map(img => ({
        id: img.id,
        displayOrder: img.displayOrder || 0,
        targetPath: img.targetPath,
        category: img.metadata?.category
      })),
      total: images.length,
      category: category || 'all'
    });

  } catch (error) {
    console.error('❌ 이미지 순서 조회 실패:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get image order'
      },
      { status: 500 }
    );
  }
} 