import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageKey, newPath } = await request.json();

    if (!imageKey || !newPath) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    // Next.js 캐시 무효화
    revalidatePath('/');
    revalidatePath('/[locale]');

    // 특정 이미지 경로 캐시 무효화
    revalidatePath(newPath);

    console.log(`✅ 홈페이지 동기화 완료: ${imageKey} -> ${newPath}`);

    return NextResponse.json({
      success: true,
      message: '홈페이지가 성공적으로 동기화되었습니다.',
      imageKey,
      newPath
    });

  } catch (error) {
    console.error('❌ 홈페이지 동기화 오류:', error);
    return NextResponse.json(
      { error: '동기화 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 