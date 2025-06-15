// ================================================================================
// 🔧 KHAKISHOP 서버 전용 유틸리티 - 안전한 서버 모듈 로딩
// ================================================================================

// 서버 환경에서만 사용되는 모듈들을 안전하게 로드
const serverModules: {
  fs?: any;
  path?: any;
} = {};

// 서버 환경 체크 및 모듈 로드
if (typeof window === 'undefined') {
  try {
    serverModules.fs = require('fs');
    serverModules.path = require('path');
  } catch (error) {
    console.warn('⚠️ 서버 모듈 로드 실패:', error);
  }
}

export function isServerEnvironment(): boolean {
  return typeof window === 'undefined';
}

export function ensureServerEnvironment(functionName: string): boolean {
  if (!isServerEnvironment()) {
    console.warn(`⚠️ ${functionName}은 서버 환경에서만 사용 가능합니다.`);
    return false;
  }
  return true;
}

// 안전한 fs 모듈 접근
export function getServerFS() {
  if (!ensureServerEnvironment('getServerFS')) return null;
  return serverModules.fs;
}

// 안전한 path 모듈 접근
export function getServerPath() {
  if (!ensureServerEnvironment('getServerPath')) return null;
  return serverModules.path;
}

// 기존 코드 호환성을 위한 exports
export const fs = serverModules.fs;
export const path = serverModules.path;
export const fsSync = serverModules.fs;

// 추가 호환성 함수들
export function checkServerModules(functionName: string): boolean {
  return ensureServerEnvironment(functionName) && !!serverModules.fs && !!serverModules.path;
}

export const isServer = isServerEnvironment; 