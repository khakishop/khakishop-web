#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 매핑 정보
const mappings = {
  "1.png": "public/images/curtains/essential-linen-collection/main.jpg",
  "2.png": "public/images/curtains/modern-sheer-series/main.jpg",
  "3.png": "public/images/blind/premium-venetian-collection/main.jpg",
  "4.png": "public/images/motorized/smart-curtain-system/main.jpg",
  "5.png": "public/images/references/modern-office-gangnam/main.jpg",
  "6.png": "public/images/gallery/neutral-living-room/main.jpg",
  "7.png": "public/images/curtains/soft-blackout-collection/main.jpg",
  "8.png": "public/images/products/linen-elegance/main.jpg",
  "9.png": "public/images/projects/residential-hanam-hillstate/main.jpg",
  "10.png": "public/images/products/eco-sheer/main.jpg",
  "11.png": "public/images/landing/hero-main/main.jpg",
  "12.png": "public/images/landing/hero-mobile/main.jpg",
  "13.png": "public/images/hero/brand-lifestyle/main.jpg",
  "14.png": "public/images/hero/khakishop-hero/main.jpg"
};

// 파일을 찾을 가능성이 있는 디렉토리들
const searchDirs = [
  process.cwd(),
  path.join(process.env.HOME, 'Downloads'),
  path.join(process.env.HOME, 'Desktop'),
  '/Users/kiholee/Projects'
];

function findImageFiles() {
  console.log('🔍 이미지 파일 검색 중...\n');

  const foundFiles = {};

  for (let i = 1; i <= 14; i++) {
    const filename = `${i}.png`;
    let found = false;

    for (const dir of searchDirs) {
      const fullPath = path.join(dir, filename);
      if (fs.existsSync(fullPath)) {
        foundFiles[filename] = fullPath;
        console.log(`✅ ${filename} 발견: ${fullPath}`);
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(`❌ ${filename} 찾을 수 없음`);
    }
  }

  return foundFiles;
}

function createDirectoryIfNotExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 디렉토리 생성: ${dir}`);
  }
}

function convertAndMove(sourceFile, targetPath) {
  try {
    // 대상 디렉토리 생성
    createDirectoryIfNotExists(targetPath);

    // sips를 사용해서 PNG를 JPG로 변환
    console.log(`🔄 변환 중: ${path.basename(sourceFile)} → ${targetPath}`);

    const command = `sips -s format jpeg "${sourceFile}" --out "${targetPath}"`;
    execSync(command, { stdio: 'pipe' });

    console.log(`✅ 변환 완료: ${targetPath}`);
    return true;
  } catch (error) {
    console.error(`❌ 변환 실패: ${sourceFile} → ${targetPath}`);
    console.error(`   오류: ${error.message}`);
    return false;
  }
}

function verifyResults() {
  console.log('\n📊 결과 확인 중...\n');

  let successCount = 0;
  let failCount = 0;

  Object.entries(mappings).forEach(([sourceFile, targetPath]) => {
    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      console.log(`✅ ${targetPath} (${Math.round(stats.size / 1024)}KB)`);
      successCount++;
    } else {
      console.log(`❌ ${targetPath} - 파일 없음`);
      failCount++;
    }
  });

  console.log(`\n📈 처리 결과:`);
  console.log(`  ✅ 성공: ${successCount}개`);
  console.log(`  ❌ 실패: ${failCount}개`);
  console.log(`  📊 총계: ${successCount + failCount}개`);

  return { successCount, failCount };
}

// 메인 실행
async function main() {
  console.log('🎨 KHAKISHOP 이미지 처리 시작\n');
  console.log('📋 처리할 이미지: 1.png ~ 14.png');
  console.log('🔄 변환: PNG → JPG (sips 사용)');
  console.log('📁 배치: 매핑된 경로로 이동\n');

  // 1. 파일 찾기
  const foundFiles = findImageFiles();
  const foundCount = Object.keys(foundFiles).length;

  if (foundCount === 0) {
    console.log('\n❌ 처리할 이미지 파일을 찾을 수 없습니다.');
    console.log('💡 다음 위치에 1.png ~ 14.png 파일이 있는지 확인해주세요:');
    searchDirs.forEach(dir => console.log(`   - ${dir}`));
    return;
  }

  console.log(`\n📊 발견된 파일: ${foundCount}/14개\n`);

  // 2. 변환 및 이동
  let processedCount = 0;

  Object.entries(foundFiles).forEach(([filename, sourcePath]) => {
    const targetPath = mappings[filename];
    if (targetPath) {
      const success = convertAndMove(sourcePath, targetPath);
      if (success) processedCount++;
    }
  });

  console.log(`\n🔄 처리 완료: ${processedCount}/${foundCount}개 파일 변환됨\n`);

  // 3. 결과 확인
  const results = verifyResults();

  if (results.successCount === 14) {
    console.log('\n🎉 모든 이미지가 성공적으로 처리되었습니다!');
  } else if (results.successCount > 0) {
    console.log(`\n⚠️  일부 이미지만 처리되었습니다. (${results.successCount}/14)`);
  } else {
    console.log('\n❌ 이미지 처리에 실패했습니다.');
  }

  console.log('\n💡 다음 단계:');
  console.log('1. 웹사이트에서 이미지 확인');
  console.log('2. 필요시 이미지 품질 조정');
  console.log('3. 누락된 이미지 재처리');
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { findImageFiles, convertAndMove, verifyResults }; 