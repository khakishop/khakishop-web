/**
 * 🚪 KHAKISHOP 로그아웃 API
 * JWT 토큰 쿠키 삭제 및 로그아웃 처리
 */

import { NextRequest, NextResponse } from 'next/server';

// JWT 설정
const AUTH_CONFIG = {
  cookieName: 'khakishop-auth-token',
} as const;

/**
 * POST /api/auth/logout
 * 로그아웃 처리 - JWT 토큰 쿠키 삭제
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚪 로그아웃 요청 처리 시작');

    // 성공 응답 생성
    const response = NextResponse.json(
      {
        success: true,
        message: '로그아웃되었습니다.',
      },
      { status: 200 }
    );

    // JWT 토큰 쿠키 삭제
    response.cookies.set({
      name: AUTH_CONFIG.cookieName,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // 과거 날짜로 설정하여 즉시 만료
    });

    console.log('✅ 로그아웃 완료 - JWT 토큰 쿠키 삭제됨');

    return response;
  } catch (error) {
    console.error('❌ 로그아웃 처리 오류:', error);

    return NextResponse.json(
      {
        success: false,
        message: '로그아웃 처리 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/logout
 * 로그아웃 상태 확인
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'KHAKISHOP 로그아웃 API',
      endpoints: {
        'POST /api/auth/logout': '로그아웃',
      },
    },
    { status: 200 }
  );
}
