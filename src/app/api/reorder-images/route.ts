import { NextRequest, NextResponse } from 'next/server';
import {
  loadPersistentStore,
  savePersistentStore,
} from '../../../utils/imageMapServer';

interface ReorderImageRequest {
  imageOrders: Array<{
    id: string;
    displayOrder: number;
  }>;
  category?: string; // 카테고리별 순서 변경 지원
}

interface ReorderImageResponse {
  success: boolean;
  message: string;
  updatedCount?: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  console.log('🔄 이미지 순서 변경 API 시작...');

  try {
    const body: ReorderImageRequest = await request.json();
    const { imageOrders, category } = body;

    if (!imageOrders || !Array.isArray(imageOrders)) {
      return NextResponse.json(
        {
          success: false,
          message: '이미지 순서 정보가 필요합니다.',
          error: 'INVALID_REQUEST',
        } as ReorderImageResponse,
        { status: 400 }
      );
    }

    // 저장소 로드
    const store = loadPersistentStore();
    let updatedCount = 0;

    // 각 이미지의 순서 업데이트
    for (const orderInfo of imageOrders) {
      const { id, displayOrder } = orderInfo;
      
      if (store.mappings[id]) {
        // 카테고리 필터링 (선택사항)
        if (category && store.mappings[id].metadata?.category !== category) {
          continue;
        }
        
        store.mappings[id].displayOrder = displayOrder;
        updatedCount++;
      }
    }

    // 저장소 업데이트
    store.lastUpdated = new Date().toISOString();
    savePersistentStore(store);

    console.log(
      `✅ 이미지 순서 변경 완료: ${updatedCount}개 이미지 업데이트`
    );

    const response: ReorderImageResponse = {
      success: true,
      message: `${updatedCount}개 이미지의 순서가 변경되었습니다.`,
      updatedCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('🚨 이미지 순서 변경 실패:', error);

    const response: ReorderImageResponse = {
      success: false,
      message: '이미지 순서 변경 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 