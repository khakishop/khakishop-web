#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 데이터 파일에서 참조되는 이미지 경로 추출
function extractImagePaths() {
  const imagePaths = new Set();

  // src/data 폴더의 모든 .ts 파일 검색
  const dataDir = './src/data';
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.ts'));

  files.forEach(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');

    // 이미지 경로 패턴 매칭
    const imageMatches = content.match(/['"`]\/images\/[^'"`]+['"`]/g);
    if (imageMatches) {
      imageMatches.forEach(match => {
        const cleanPath = match.replace(/['"`]/g, '');
        imagePaths.add(cleanPath);
      });
    }
  });

  return Array.from(imagePaths).sort();
}

// 실제 존재하는 이미지 파일 목록 생성
function getExistingImages() {
  const existingImages = new Set();

  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (/\.(jpg|jpeg|png|svg|webp)$/i.test(item)) {
        const relativePath = fullPath.replace('public', '');
        existingImages.add(relativePath);
      }
    });
  }

  scanDirectory('./public/images');
  return Array.from(existingImages).sort();
}

// 컴포넌트 파일에서 참조되는 이미지 경로 추출
function extractComponentImagePaths() {
  const imagePaths = new Set();

  function scanComponents(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanComponents(fullPath);
      } else if (/\.(tsx|ts|jsx|js)$/.test(item)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const imageMatches = content.match(/['"`]\/images\/[^'"`]+['"`]/g);
        if (imageMatches) {
          imageMatches.forEach(match => {
            const cleanPath = match.replace(/['"`]/g, '');
            imagePaths.add(cleanPath);
          });
        }
      }
    });
  }

  scanComponents('./src');
  return Array.from(imagePaths).sort();
}

// 메인 분석 함수
function analyzeImages() {
  console.log('🔍 이미지 누락 분석 시작...\n');

  const dataImagePaths = extractImagePaths();
  const componentImagePaths = extractComponentImagePaths();
  const existingImages = getExistingImages();

  // 모든 참조된 이미지 경로 합치기
  const allReferencedImages = [...new Set([...dataImagePaths, ...componentImagePaths])].sort();

  console.log('📊 분석 결과:');
  console.log(`- 데이터 파일에서 참조: ${dataImagePaths.length}개`);
  console.log(`- 컴포넌트에서 참조: ${componentImagePaths.length}개`);
  console.log(`- 전체 참조된 이미지: ${allReferencedImages.length}개`);
  console.log(`- 실제 존재하는 이미지: ${existingImages.length}개\n`);

  // 누락된 이미지 찾기
  const missingImages = allReferencedImages.filter(imagePath =>
    !existingImages.includes(imagePath)
  );

  // 사용되지 않는 이미지 찾기
  const unusedImages = existingImages.filter(imagePath =>
    !allReferencedImages.includes(imagePath)
  );

  console.log('❌ 누락된 이미지 파일들:');
  if (missingImages.length === 0) {
    console.log('   없음 ✅');
  } else {
    missingImages.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img}`);
    });
  }

  console.log('\n📁 카테고리별 누락 현황:');
  const missingByCategory = {};
  missingImages.forEach(img => {
    const category = img.split('/')[2]; // /images/category/...
    if (!missingByCategory[category]) {
      missingByCategory[category] = [];
    }
    missingByCategory[category].push(img);
  });

  Object.keys(missingByCategory).forEach(category => {
    console.log(`   ${category}: ${missingByCategory[category].length}개`);
    missingByCategory[category].forEach(img => {
      console.log(`     - ${img}`);
    });
  });

  console.log('\n🗑️ 사용되지 않는 이미지 파일들:');
  if (unusedImages.length === 0) {
    console.log('   없음 ✅');
  } else {
    unusedImages.slice(0, 10).forEach((img, index) => {
      console.log(`   ${index + 1}. ${img}`);
    });
    if (unusedImages.length > 10) {
      console.log(`   ... 및 ${unusedImages.length - 10}개 더`);
    }
  }

  // 결과를 JSON 파일로 저장
  const result = {
    timestamp: new Date().toISOString(),
    summary: {
      totalReferenced: allReferencedImages.length,
      totalExisting: existingImages.length,
      totalMissing: missingImages.length,
      totalUnused: unusedImages.length
    },
    missingImages,
    unusedImages,
    missingByCategory,
    allReferencedImages,
    existingImages
  };

  fs.writeFileSync('image-analysis-report.json', JSON.stringify(result, null, 2));
  console.log('\n📄 상세 분석 결과가 image-analysis-report.json에 저장되었습니다.');

  return result;
}

// 스크립트 실행
if (require.main === module) {
  analyzeImages();
}

module.exports = { analyzeImages }; 