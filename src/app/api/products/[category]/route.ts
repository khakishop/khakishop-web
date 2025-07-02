import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 🎯 KHAKISHOP 전체 카테고리 - 8개 카테고리 완전 지원
const SUPPORTED_CATEGORIES = [
  'curtain', // 커튼 카테고리
  'blind', // 블라인드 카테고리
  'motorized', // 전동시스템 카테고리
  'collection', // 컬렉션 카테고리
  'projects', // 프로젝트 카테고리
  'references', // 시공사례 카테고리
  'about', // 회사소개 카테고리
  'contact', // 연락처 카테고리
  'gallery', // 갤러리 카테고리
  'hero', // 메인 히어로 이미지 (호환성)
  'landing', // 랜딩 페이지 이미지 (호환성)
];

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;

    console.log(`🔍 [products] 카테고리 요청: ${category}`);

    if (!SUPPORTED_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported category',
          supportedCategories: SUPPORTED_CATEGORIES,
          category,
        },
        { status: 404 }
      );
    }

    const dataPath = path.join(process.cwd(), 'data', 'products.json');
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContent);

    // 🔧 올바른 products.json 구조 사용: data[category] (categories 필드 없음)
    const products = data[category] || [];

    console.log(
      `✅ [products] ${category} 카테고리 제품 수: ${products.length}`
    );

    return NextResponse.json({
      success: true,
      category,
      products,
      count: products.length,
      timestamp: new Date().toISOString(),
      version: data.version || '3.0',
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    console.error('❌ [products] API 에러:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
