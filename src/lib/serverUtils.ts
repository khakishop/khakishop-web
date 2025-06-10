// ================================================================================
// 🎯 서버 전용 유틸리티 모듈
// ================================================================================
// fs, path 등 Node.js 모듈들을 클라이언트에서 안전하게 처리

import { isServer } from './isServer';

// 서버에서만 fs와 path 모듈 로드
let fs: any = null;
let path: any = null;

if (isServer) {
  try {
    fs = require('fs').promises;
    path = require('path');
  } catch (error) {
    console.error('❌ Node.js 모듈 로드 실패:', error);
  }
}

// 동기 버전의 fs도 필요한 경우
let fsSync: any = null;
if (isServer) {
  try {
    fsSync = require('fs');
  } catch (error) {
    console.error('❌ fs 동기 모듈 로드 실패:', error);
  }
}

// 안전한 fs/path 사용을 위한 체크 함수
export function checkServerModules(functionName?: string): boolean {
  if (!isServer) {
    if (functionName) {
      console.warn(`⚠️ [${functionName}] 클라이언트에서는 fs/path 모듈을 사용할 수 없습니다.`);
    }
    return false;
  }
  
  if (!fs || !path) {
    if (functionName) {
      console.warn(`⚠️ [${functionName}] fs/path 모듈이 로드되지 않았습니다.`);
    }
    return false;
  }
  
  return true;
}

export { fs, path, fsSync }; 