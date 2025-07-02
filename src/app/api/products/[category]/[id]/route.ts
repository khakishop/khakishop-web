import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 데이터 파일 경로
const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// TypeScript 인터페이스 정의
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  // projects 전용 필드
  client?: string;
  date?: string;
  area?: string;
}

interface ProductsData {
  [category: string]: Product[];
}

/**
 * GET /api/products/[category]/[id]
 * 특정 제품 정보 반환
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { category, id } = params;

    console.log(`🔍 [products] 제품 조회: ${category}/${id}`);

    // 데이터 파일 읽기
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    const productsData: ProductsData = JSON.parse(fileContent);

    // 카테고리 존재 확인
    if (!productsData[category]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
          category,
        },
        { status: 404 }
      );
    }

    // 제품 찾기
    const product = productsData[category].find((p: Product) => p.id === id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          category,
          id,
        },
        { status: 404 }
      );
    }

    console.log(`✅ [products] 제품 조회 성공: ${category}/${id}`);

    return NextResponse.json({
      success: true,
      category,
      product,
    });
  } catch (error) {
    console.error(`❌ [products] 제품 조회 오류:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[category]/[id]
 * 제품 정보 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { category, id } = params;
    const updatedProduct: Product = await request.json();

    console.log(`📝 [products] 제품 수정: ${category}/${id}`, updatedProduct);

    // 지원되는 카테고리 확인 (MASTER_CATEGORIES와 동일하게 확장)
    const supportedCategories = [
      'hero', // 메인 히어로 이미지
      'landing', // 랜딩 페이지 이미지
      'projects', // OUR PROJECTS 페이지용
      'references', // REFERENCES 페이지용
      'curtain', // 개별 커튼 페이지용 (기존 유지)
      'blind', // 개별 블라인드 페이지용 (기존 유지)
      'motorized', // 개별 전동시스템 페이지용 (기존 유지)
      'collection', // 단일 컬렉션 페이지용
      'about', // 회사 소개 페이지용
      'contact', // 연락처 페이지용
      'gallery', // 갤러리 페이지용
    ];
    if (!supportedCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported category',
          supportedCategories,
          category,
        },
        { status: 400 }
      );
    }

    // 데이터 파일 읽기
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    const productsData: ProductsData = JSON.parse(fileContent);

    // 카테고리 존재 확인
    if (!productsData[category]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
          category,
        },
        { status: 404 }
      );
    }

    // 제품 인덱스 찾기
    const productIndex = productsData[category].findIndex(
      (p: Product) => p.id === id
    );

    if (productIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          category,
          id,
        },
        { status: 404 }
      );
    }

    // 제품 정보 업데이트
    productsData[category][productIndex] = { ...updatedProduct, id }; // ID 보존

    // 파일 저장
    fs.writeFileSync(DATA_FILE, JSON.stringify(productsData, null, 2));

    console.log(`✅ [products] 제품 수정 완료: ${category}/${id}`);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      category,
      product: productsData[category][productIndex],
    });
  } catch (error) {
    console.error(`❌ [products] 제품 수정 오류:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[category]/[id]
 * 제품 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { category, id } = params;

    console.log(`🗑️ [products] 제품 삭제: ${category}/${id}`);

    // 지원되는 카테고리 확인 (MASTER_CATEGORIES와 동일하게 확장)
    const supportedCategories = [
      'hero', // 메인 히어로 이미지
      'landing', // 랜딩 페이지 이미지
      'projects', // OUR PROJECTS 페이지용
      'references', // REFERENCES 페이지용
      'curtain', // 개별 커튼 페이지용 (기존 유지)
      'blind', // 개별 블라인드 페이지용 (기존 유지)
      'motorized', // 개별 전동시스템 페이지용 (기존 유지)
      'collection', // 단일 컬렉션 페이지용
      'about', // 회사 소개 페이지용
      'contact', // 연락처 페이지용
      'gallery', // 갤러리 페이지용
    ];
    if (!supportedCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported category',
          supportedCategories,
          category,
        },
        { status: 400 }
      );
    }

    // 데이터 파일 읽기
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    const productsData: ProductsData = JSON.parse(fileContent);

    // 카테고리 존재 확인
    if (!productsData[category]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
          category,
        },
        { status: 404 }
      );
    }

    // 제품 존재 확인
    const productIndex = productsData[category].findIndex(
      (p: Product) => p.id === id
    );

    if (productIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          category,
          id,
        },
        { status: 404 }
      );
    }

    // 제품 정보 백업 (응답용)
    const deletedProduct = productsData[category][productIndex];

    // 제품 삭제
    productsData[category].splice(productIndex, 1);

    // 파일 저장
    fs.writeFileSync(DATA_FILE, JSON.stringify(productsData, null, 2));

    console.log(`✅ [products] 제품 삭제 완료: ${category}/${id}`);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      category,
      deletedProduct,
    });
  } catch (error) {
    console.error(`❌ [products] 제품 삭제 오류:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
