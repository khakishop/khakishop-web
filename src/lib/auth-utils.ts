/**
 * 🔐 KHAKISHOP 인증 유틸리티
 * 미들웨어 및 서버 컴포넌트에서 사용하는 JWT 인증 헬퍼 함수들
 */

import { NextRequest } from 'next/server';
import { jwtVerify, SignJWT, type JWTPayload as JoseJWTPayload } from 'jose';

// ================================================================================
// 🔒 JWT 설정 및 타입
// ================================================================================

export interface KhakishopJWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthConfig {
  jwtSecret: string;
  cookieName: string;
  issuer: string;
  audience: string;
  expiresIn: string;
}

export const AUTH_CONFIG: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-for-development',
  cookieName: 'khakishop-auth-token',
  issuer: 'khakishop',
  audience: 'khakishop-users',
  expiresIn: '7d',
} as const;

// ================================================================================
// 🔐 JWT 토큰 생성 및 검증
// ================================================================================

/**
 * JWT 토큰 생성
 * @param payload JWT 페이로드
 * @returns 생성된 JWT 토큰
 */
export async function createJWT(
  payload: Omit<KhakishopJWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>
): Promise<string> {
  const secret = new TextEncoder().encode(AUTH_CONFIG.jwtSecret);

  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(AUTH_CONFIG.issuer)
    .setAudience(AUTH_CONFIG.audience)
    .setExpirationTime(AUTH_CONFIG.expiresIn)
    .sign(secret);
}

/**
 * JWT 토큰 검증 (Edge Runtime 호환)
 * @param token JWT 토큰
 * @returns 검증된 페이로드 또는 null
 */
export async function verifyJWT(
  token: string
): Promise<KhakishopJWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(AUTH_CONFIG.jwtSecret);

    const { payload } = await jwtVerify(token, secret, {
      issuer: AUTH_CONFIG.issuer,
      audience: AUTH_CONFIG.audience,
    });

    // 타입 안전성 확보 - 먼저 unknown으로 변환 후 우리 타입으로 변환
    const unknownPayload = payload as unknown;
    const typedPayload = unknownPayload as KhakishopJWTPayload & JoseJWTPayload;

    // 필수 필드 검증
    if (!typedPayload.userId || !typedPayload.email || !typedPayload.role) {
      return null;
    }

    return {
      userId: typedPayload.userId,
      email: typedPayload.email,
      role: typedPayload.role,
      iat: typedPayload.iat,
      exp: typedPayload.exp,
      iss: typedPayload.iss,
      aud:
        typeof typedPayload.aud === 'string'
          ? typedPayload.aud
          : typedPayload.aud?.[0],
    };
  } catch (error) {
    console.warn(
      'JWT 검증 실패:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return null;
  }
}

// ================================================================================
// 🍪 쿠키 및 토큰 추출
// ================================================================================

/**
 * Next.js 요청에서 JWT 토큰 추출
 * @param request NextRequest 객체
 * @returns JWT 토큰 또는 null
 */
export function extractJWTFromRequest(request: NextRequest): string | null {
  // 1. 쿠키에서 토큰 추출 (우선순위)
  const cookieToken = request.cookies.get(AUTH_CONFIG.cookieName)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // 2. Authorization 헤더에서 Bearer 토큰 추출
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * JWT 토큰이 만료되었는지 확인
 * @param payload JWT 페이로드
 * @returns 만료 여부
 */
export function isJWTExpired(payload: KhakishopJWTPayload): boolean {
  if (!payload.exp) {
    return false; // exp가 없으면 만료되지 않은 것으로 간주
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

// ================================================================================
// 🌐 경로 및 로케일 유틸리티
// ================================================================================

export type SupportedLocale = 'ko' | 'en';

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = [
  'ko',
  'en',
] as const;

/**
 * 경로에서 로케일 추출
 * @param pathname URL 경로
 * @returns 로케일 정보
 */
export function parseLocaleFromPath(pathname: string): {
  locale: SupportedLocale | null;
  pathWithoutLocale: string;
} {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { locale: null, pathWithoutLocale: '/' };
  }

  const firstSegment = segments[0] as SupportedLocale;
  const isValidLocale = SUPPORTED_LOCALES.includes(firstSegment);

  if (isValidLocale) {
    const pathWithoutLocale = '/' + segments.slice(1).join('/');
    return {
      locale: firstSegment,
      pathWithoutLocale: pathWithoutLocale === '/' ? '/' : pathWithoutLocale,
    };
  }

  return { locale: null, pathWithoutLocale: pathname };
}

/**
 * 로케일을 포함한 완전한 URL 생성
 * @param path 경로
 * @param locale 로케일
 * @param baseUrl 기본 URL
 * @returns 완전한 URL
 */
export function createLocalizedURL(
  path: string,
  locale: SupportedLocale | null,
  baseUrl: string
): URL {
  if (!locale) {
    return new URL(path, baseUrl);
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(`/${locale}${cleanPath}`, baseUrl);
}

// ================================================================================
// 🛡️ 보안 검증 함수들
// ================================================================================

/**
 * 관리자 권한 확인
 * @param payload JWT 페이로드
 * @returns 관리자 권한 여부
 */
export function isAdmin(payload: KhakishopJWTPayload | null): boolean {
  return payload?.role === 'admin';
}

/**
 * 사용자 권한 확인
 * @param payload JWT 페이로드
 * @param requiredRole 필요한 권한
 * @returns 권한 만족 여부
 */
export function hasRole(
  payload: KhakishopJWTPayload | null,
  requiredRole: string
): boolean {
  return payload?.role === requiredRole;
}

/**
 * 토큰 유효성 종합 검증
 * @param token JWT 토큰
 * @returns 검증 결과
 */
export async function validateJWTToken(token: string): Promise<{
  isValid: boolean;
  payload: KhakishopJWTPayload | null;
  error?: string;
}> {
  try {
    const payload = await verifyJWT(token);

    if (!payload) {
      return { isValid: false, payload: null, error: 'Invalid token format' };
    }

    if (isJWTExpired(payload)) {
      return { isValid: false, payload: null, error: 'Token expired' };
    }

    return { isValid: true, payload };
  } catch (error) {
    return {
      isValid: false,
      payload: null,
      error:
        error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

// ================================================================================
// 🔄 토큰 갱신 (향후 확장용)
// ================================================================================

/**
 * JWT 토큰 갱신 (리프레시)
 * @param oldToken 기존 토큰
 * @returns 새로운 토큰 또는 null
 */
export async function refreshJWT(oldToken: string): Promise<string | null> {
  try {
    const payload = await verifyJWT(oldToken);

    if (!payload) {
      return null;
    }

    // 만료 임박 시에만 갱신 (예: 1시간 이내)
    const now = Math.floor(Date.now() / 1000);
    const expiryThreshold = 3600; // 1시간

    if (payload.exp && payload.exp - now > expiryThreshold) {
      return oldToken; // 아직 갱신할 필요 없음
    }

    // 새 토큰 생성
    return await createJWT({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  } catch (error) {
    console.warn('JWT 갱신 실패:', error);
    return null;
  }
}
