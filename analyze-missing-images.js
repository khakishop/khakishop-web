#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 프로젝트 이미지 파일 분석 시작...\n');

// 1. 실제 존재하는 이미지 파일들 수집
function getActualImages() {
  const actualImages = new Set();

  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
          // public/images/ 형태로 정규화
          const relativePath = fullPath.replace(/\\/g, '/').replace('public/', '/');
          actualImages.add(relativePath);
        }
      }
    } catch (error) {
      console.warn(`디렉토리 스캔 실패: ${dir}`, error.message);
    }
  }

  scanDirectory('public/images');
  return Array.from(actualImages).sort();
}

// 2. 소스 코드에서 참조되는 이미지 경로들 수집
function getReferencedImages() {
  const referencedImages = new Set();

  function scanSourceFiles(dir) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanSourceFiles(fullPath);
        } else if (item.match(/\.(tsx?|jsx?|json)$/)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');

            // 다양한 패턴으로 이미지 경로 추출
            const patterns = [
              /['"]\/images\/[^'"]+['"]/g,
              /src\s*=\s*['"]\/images\/[^'"]+['"]/g,
              /image\s*:\s*['"]\/images\/[^'"]+['"]/g,
              /mainImage\s*:\s*['"]\/images\/[^'"]+['"]/g,
              /backgroundImage\s*:\s*['"]url\(["']?\/images\/[^'"]+["']?\)['"]/g
            ];

            patterns.forEach(pattern => {
              const matches = content.match(pattern);
              if (matches) {
                matches.forEach(match => {
                  // 경로 추출
                  const pathMatch = match.match(/\/images\/[^'"]+/);
                  if (pathMatch) {
                    let imagePath = pathMatch[0];
                    // URL 패턴에서 괄호 제거
                    imagePath = imagePath.replace(/\)$/, '');
                    referencedImages.add(imagePath);
                  }
                });
              }
            });
          } catch (error) {
            console.warn(`파일 읽기 실패: ${fullPath}`, error.message);
          }
        }
      }
    } catch (error) {
      console.warn(`디렉토리 스캔 실패: ${dir}`, error.message);
    }
  }

  scanSourceFiles('src');
  return Array.from(referencedImages).sort();
}

// 3. 분석 실행
const actualImages = getActualImages();
const referencedImages = getReferencedImages();

console.log('📊 분석 결과\n');
console.log(`✅ 실제 존재하는 이미지: ${actualImages.length}개`);
console.log(`🔗 참조되는 이미지: ${referencedImages.length}개\n`);

// 4. 누락된 이미지 찾기
const missingImages = referencedImages.filter(refImg => {
  // /images/path -> public/images/path 변환하여 비교
  const actualPath = refImg.replace('/images/', '/images/');
  return !actualImages.includes(actualPath);
});

console.log('🔴 누락된 이미지 파일들:');
if (missingImages.length === 0) {
  console.log('   없음 - 모든 참조된 이미지가 존재합니다! ✅');
} else {
  missingImages.forEach((img, index) => {
    console.log(`   ${index + 1}. ${img}`);
  });
}

// 5. 카테고리별 누락 분석
console.log('\n📁 카테고리별 누락 분석:');
const categories = {};
missingImages.forEach(img => {
  const parts = img.split('/');
  if (parts.length >= 3) {
    const category = parts[2]; // /images/category/...
    if (!categories[category]) categories[category] = [];
    categories[category].push(img);
  }
});

Object.keys(categories).forEach(category => {
  console.log(`   ${category}: ${categories[category].length}개 누락`);
  categories[category].forEach(img => {
    console.log(`     - ${img}`);
  });
});

// 6. 컬렉션과 프로젝트 페이지 우선 분석
console.log('\n🎯 컬렉션 & 프로젝트 페이지 누락 이미지:');
const collectionMissing = missingImages.filter(img => img.includes('/collections/'));
const projectMissing = missingImages.filter(img => img.includes('/projects/') || img.includes('/references/'));

console.log(`   컬렉션 페이지: ${collectionMissing.length}개 누락`);
collectionMissing.forEach(img => console.log(`     - ${img}`));

console.log(`   프로젝트 페이지: ${projectMissing.length}개 누락`);
projectMissing.forEach(img => console.log(`     - ${img}`));

// 7. 해결 방안 제시
console.log('\n💡 해결 방안:');
console.log('   1. 플레이스홀더 이미지 생성');
console.log('   2. 기존 이미지로 대체');
console.log('   3. 새로운 이미지 추가');

// 8. 결과를 JSON 파일로 저장
const analysis = {
  timestamp: new Date().toISOString(),
  summary: {
    totalActualImages: actualImages.length,
    totalReferencedImages: referencedImages.length,
    totalMissingImages: missingImages.length
  },
  actualImages,
  referencedImages,
  missingImages,
  categorizedMissing: categories,
  collectionMissing,
  projectMissing
};

fs.writeFileSync('image-analysis-report.json', JSON.stringify(analysis, null, 2));
console.log('\n📄 상세 분석 결과가 image-analysis-report.json에 저장되었습니다.');

console.log('\n🏁 분석 완료!');

// 스크립트 실행
if (require.main === module) {
  analyzeImages();
}

module.exports = { analyzeImages }; 