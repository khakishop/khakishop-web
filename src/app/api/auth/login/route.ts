/**
 * KHAKISHOP 어드민 로그인 API
 * JWT 토큰 기반 인증 시스템
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 환경 설정
const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-for-development',
  jwtExpiresIn: '7d',
  cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초)
};

// 임시 관리자 계정 데이터
const TEMP_ADMIN_ACCOUNT = {
  id: 'admin-001',
  email: 'admin@khakishop.com',
  name: 'KHAKISHOP Admin',
  role: 'admin' as const,
  // admin123! 실제 해시값 (bcrypt 12 라운드)
  hashedPassword:
    '$2b$12$Nmf1wV/lezgLHMnNhHLvuu62/CriQCLAqHradMa74KqKyh2W12/F.',
  isActive: true,
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
};

/**
 * POST /api/auth/login
 * 사용자 로그인 처리
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 데이터 파싱
    let credentials;
    try {
      credentials = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: '잘못된 요청 형식입니다.',
          errors: ['INVALID_REQUEST_FORMAT'],
        },
        { status: 400 }
      );
    }

    // 입력 검증
    if (!credentials.email || !credentials.password) {
      return NextResponse.json(
        {
          success: false,
          message: '이메일과 비밀번호를 모두 입력해주세요.',
          errors: ['MISSING_CREDENTIALS'],
        },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return NextResponse.json(
        {
          success: false,
          message: '올바른 이메일 형식을 입력해주세요.',
          errors: ['INVALID_EMAIL_FORMAT'],
        },
        { status: 400 }
      );
    }

    // 사용자 찾기 (임시 계정 확인)
    let user = null;

    if (credentials.email === TEMP_ADMIN_ACCOUNT.email) {
      // 비밀번호 검증
      const passwordValid = await bcrypt.compare(
        credentials.password,
        TEMP_ADMIN_ACCOUNT.hashedPassword
      );

      if (passwordValid) {
        user = TEMP_ADMIN_ACCOUNT;
      }
    }

    // 인증 실패
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
          errors: ['INVALID_CREDENTIALS'],
        },
        { status: 401 }
      );
    }

    // 계정 상태 확인
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: '비활성화된 계정입니다. 관리자에게 문의하세요.',
          errors: ['USER_INACTIVE'],
        },
        { status: 403 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: '이메일 인증이 필요합니다.',
          errors: ['EMAIL_NOT_VERIFIED'],
        },
        { status: 403 }
      );
    }

    // JWT 토큰 생성
    const jwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, AUTH_CONFIG.jwtSecret, {
      expiresIn: AUTH_CONFIG.jwtExpiresIn,
      issuer: 'khakishop',
      audience: 'khakishop-users',
    } as jwt.SignOptions);

    // 쿠키 설정
    const cookieStore = cookies();
    cookieStore.set('khakishop-auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_CONFIG.cookieMaxAge / 1000, // seconds
    });

    // 응답 데이터 준비 (비밀번호 제외)
    const { hashedPassword, ...safeUser } = user;

    // 성공 응답
    return NextResponse.json(
      {
        success: true,
        user: safeUser,
        tokens: {
          accessToken,
          expiresIn: AUTH_CONFIG.cookieMaxAge / 1000,
        },
        message: '로그인에 성공했습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('로그인 API 오류:', error);

    return NextResponse.json(
      {
        success: false,
        message: '서버 내부 오류가 발생했습니다.',
        errors: ['INTERNAL_ERROR'],
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/login
 * 로그인 상태 확인
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'KHAKISHOP 인증 API',
      endpoints: {
        'POST /api/auth/login': '로그인',
      },
    },
    { status: 200 }
  );
}
