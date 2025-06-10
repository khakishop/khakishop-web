// ================================================================================
// 🎯 서버 환경 체크 유틸리티
// ================================================================================
// 클라이언트/서버 환경을 안전하게 구분하는 유틸리티

export const isServer = typeof window === 'undefined';
export const isClient = typeof window !== 'undefined';

// 개발 환경에서의 추가 정보
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';

// 서버 전용 작업을 위한 안전 체크 함수
export function ensureServerEnvironment(functionName?: string): boolean {
  if (!isServer) {
    if (functionName) {
      console.warn(`⚠️ [${functionName}] 이 함수는 서버에서만 실행되어야 합니다.`);
    }
    return false;
  }
  return true;
} 