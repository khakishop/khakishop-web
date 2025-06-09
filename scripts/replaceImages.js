#!/usr/bin/env node

// ================================================================================
// 🎨 KHAKISHOP 이미지 자동 교체 스크립트
// ================================================================================
// 🎯 목적: /Midjourney 폴더의 이미지를 순서대로 교체 (5번 스킵)
// 🔄 자동화: imageMap.ts의 매핑 배열 기반으로 동작

const fs = require('fs');
const path = require('path');

// 경로 설정
const MIDJOURNEY_SOURCE = '/Users/kiholee/Projects/Midjourney';
const TARGET_DIR = path.join(__dirname, '../public/images/midjourney');
const SVG_PATTERN = /\.svg$/;

// 🗺️ 이미지 매핑 (5번 제외)
const imageMapping = [
  { id: "1", sourceFile: "1.png", targetFile: "1.png" },
  { id: "2", sourceFile: "2.png", targetFile: "2.png" },
  { id: "3", sourceFile: "3.png", targetFile: "3.png" },
  { id: "4", sourceFile: "4.png", targetFile: "4.png" },
  // 5번은 기존 사용중이므로 스킵
  { id: "6", sourceFile: "6.png", targetFile: "6.png" },
  { id: "7", sourceFile: "7.png", targetFile: "7.png" },
  { id: "8", sourceFile: "8.png", targetFile: "8.png" },
  { id: "9", sourceFile: "9.png", targetFile: "9.png" },
  { id: "10", sourceFile: "10.png", targetFile: "10.png" },
  { id: "11", sourceFile: "11.png", targetFile: "11.png" },
  { id: "12", sourceFile: "12.png", targetFile: "12.png" },
  { id: "13", sourceFile: "13.png", targetFile: "13.png" },
  { id: "15", sourceFile: "15.png", targetFile: "15.png" },
  { id: "16", sourceFile: "16.png", targetFile: "16.png" }
];

// 🎨 RIGAS 모티브 로깅 스타일
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}${colors.bright}🎨 ${msg}${colors.reset}\n`)
};

// 📁 디렉토리 생성
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log.success(`디렉토리 생성: ${dirPath}`);
  }
}

// 🗑️ 기존 SVG 파일 삭제
function deleteExistingSvgFiles() {
  log.info('기존 SVG 파일 검색 및 삭제...');
  
  const files = fs.readdirSync(TARGET_DIR);
  let deletedCount = 0;
  
  files.forEach(file => {
    if (SVG_PATTERN.test(file)) {
      const filePath = path.join(TARGET_DIR, file);
      fs.unlinkSync(filePath);
      log.success(`SVG 삭제: ${file}`);
      deletedCount++;
    }
  });
  
  if (deletedCount === 0) {
    log.info('삭제할 SVG 파일이 없습니다.');
  } else {
    log.success(`총 ${deletedCount}개 SVG 파일 삭제 완료`);
  }
}

// 🔄 이미지 복사 함수
function copyImageFile(sourceFile, targetFile) {
  const sourcePath = path.join(MIDJOURNEY_SOURCE, sourceFile);
  const targetPath = path.join(TARGET_DIR, targetFile);
  
  if (!fs.existsSync(sourcePath)) {
    log.error(`소스 파일 없음: ${sourcePath}`);
    return false;
  }
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    log.success(`복사 완료: ${sourceFile} → ${targetFile}`);
    return true;
  } catch (error) {
    log.error(`복사 실패: ${sourceFile} → ${error.message}`);
    return false;
  }
}

// 📊 이미지 교체 실행
function replaceImages() {
  log.header('KHAKISHOP 이미지 자동 교체 시작');
  
  // 1. 대상 디렉토리 확인/생성
  ensureDirectoryExists(TARGET_DIR);
  
  // 2. 기존 SVG 파일 삭제
  deleteExistingSvgFiles();
  
  console.log('\n' + '='.repeat(60));
  log.info('Midjourney 이미지 교체 시작...');
  console.log('='.repeat(60));
  
  let successCount = 0;
  let errorCount = 0;
  
  // 3. 매핑 배열 기반 이미지 교체
  imageMapping.forEach((mapping, index) => {
    log.info(`[${index + 1}/${imageMapping.length}] 처리중: ${mapping.id}번`);
    
    const success = copyImageFile(mapping.sourceFile, mapping.targetFile);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  });
  
  // 4. 결과 요약
  console.log('\n' + '='.repeat(60));
  log.header('🎉 이미지 교체 완료!');
  console.log(`${colors.green}✅ 성공: ${successCount}개${colors.reset}`);
  console.log(`${colors.red}❌ 실패: ${errorCount}개${colors.reset}`);
  console.log(`${colors.blue}⏭️  건너뜀: 5번 (기존 사용중)${colors.reset}`);
  
  console.log('\n📁 저장 위치:', TARGET_DIR);
  console.log('🔗 웹사이트 경로: /images/midjourney/[번호].png');
  
  console.log('\n💡 다음 단계:');
  console.log('   1. npm run dev - 개발 서버 실행');
  console.log('   2. /ko/admin/images - 이미지 관리 페이지 확인');
  console.log('   3. 메타데이터 자동 적용 확인');
  
  console.log('\n🎨 RIGAS 모티브 감성으로 완성!');
}

// 🚀 스크립트 실행
if (require.main === module) {
  replaceImages();
}

module.exports = { replaceImages, imageMapping }; 