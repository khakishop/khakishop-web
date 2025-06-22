const fs = require('fs');
const path = require('path');

console.log('🔧 누락된 이미지 파일 해결 스크립트 시작...\n');

// 누락된 이미지 목록 (분석 결과 기반)
const missingImages = [
  // 커튼 관련 (20개)
  '/images/curtain/essential-linen-collection/main.jpg',
  '/images/curtain/essential-linen-collection/detail-1.jpg',
  '/images/curtain/essential-linen-collection/detail-2.jpg',
  '/images/curtain/essential-linen-collection/lifestyle.jpg',
  '/images/curtain/modern-sheer-series/main.jpg',
  '/images/curtain/modern-sheer-series/detail-1.jpg',
  '/images/curtain/modern-sheer-series/detail-2.jpg',
  '/images/curtain/modern-sheer-series/lifestyle.jpg',
  '/images/curtain/venetian-premium-line/main.jpg',
  '/images/curtain/venetian-premium-line/detail-1.jpg',
  '/images/curtain/venetian-premium-line/detail-2.jpg',
  '/images/curtain/venetian-premium-line/lifestyle.jpg',
  '/images/curtain/wood-texture-natural/main.jpg',
  '/images/curtain/wood-texture-natural/detail-1.jpg',
  '/images/curtain/wood-texture-natural/detail-2.jpg',
  '/images/curtain/wood-texture-natural/lifestyle.jpg',
  '/images/curtain/smart-automation-series/main.jpg',
  '/images/curtain/smart-automation-series/detail-1.jpg',
  '/images/curtain/smart-automation-series/detail-2.jpg',
  '/images/curtain/smart-automation-series/lifestyle.jpg',

  // 레퍼런스/프로젝트 관련 (중요한 것들만)
  '/images/references/curtain-modern-livingroom-1.png',
  '/images/references/blind-minimal-bedroom-1.png',
  '/images/references/motorized-smart-livingroom-1.png',
  '/images/hero/khakishop-hero.jpg',

  // 플레이스홀더
  '/images/placeholder.jpg',
  '/images/placeholder-dev.jpg',
  '/images/placeholder-test.jpg'
];

// 기존 이미지 매핑 (유사한 이미지로 대체)
const imageReplacements = {
  // 커튼 이미지들을 컬렉션 이미지로 대체
  '/images/curtain/essential-linen-collection/main.jpg': '/images/collections/essential-linen.png',
  '/images/curtain/modern-sheer-series/main.jpg': '/images/collections/modern-sheer.png',
  '/images/curtain/venetian-premium-line/main.jpg': '/images/collections/venetian-premium.png',
  '/images/curtain/wood-texture-natural/main.jpg': '/images/collections/wood-texture.png',
  '/images/curtain/smart-automation-series/main.jpg': '/images/collections/smart-automation.png',

  // 히어로 이미지
  '/images/hero/khakishop-hero.jpg': '/images/hero/hero.jpg',

  // 레퍼런스 이미지들
  '/images/references/curtain-modern-livingroom-1.png': '/images/references/luxury-residence-gangnam/main.jpg',
  '/images/references/blind-minimal-bedroom-1.png': '/images/references/modern-office-seoul/main.jpg',
  '/images/references/motorized-smart-livingroom-1.png': '/images/references/boutique-hotel-busan/main.jpg'
};

// 디렉토리 생성 함수
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 디렉토리 생성: ${dir}`);
  }
}

// 심볼릭 링크 생성 함수
function createSymbolicLink(target, link) {
  try {
    const targetPath = path.resolve(`public${target}`);
    const linkPath = path.resolve(`public${link}`);

    ensureDirectoryExists(linkPath);

    if (fs.existsSync(targetPath)) {
      if (fs.existsSync(linkPath)) {
        fs.unlinkSync(linkPath);
      }
      fs.symlinkSync(targetPath, linkPath);
      console.log(`🔗 심볼릭 링크 생성: ${link} -> ${target}`);
      return true;
    } else {
      console.warn(`⚠️  대상 파일이 존재하지 않음: ${target}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 심볼릭 링크 생성 실패: ${link}`, error.message);
    return false;
  }
}

// 플레이스홀더 SVG 생성 함수
function createPlaceholderSVG(imagePath, width = 800, height = 600) {
  const filename = path.basename(imagePath, path.extname(imagePath));
  const category = imagePath.split('/')[2] || 'image';

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <rect x="50" y="50" width="${width - 100}" height="${height - 100}" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2" stroke-dasharray="10,5"/>
    <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
      KHAKI SHOP
    </text>
    <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af">
      ${category.charAt(0).toUpperCase() + category.slice(1)} Image
    </text>
    <text x="50%" y="65%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#d1d5db">
      ${filename}
    </text>
  </svg>`;

  return svg;
}

// 플레이스홀더 이미지 생성 함수
function createPlaceholderImage(imagePath) {
  try {
    const fullPath = path.resolve(`public${imagePath}`);
    ensureDirectoryExists(fullPath);

    const ext = path.extname(imagePath).toLowerCase();

    if (ext === '.svg') {
      const svg = createPlaceholderSVG(imagePath);
      fs.writeFileSync(fullPath, svg);
      console.log(`🎨 플레이스홀더 SVG 생성: ${imagePath}`);
    } else {
      // JPG/PNG의 경우 SVG를 먼저 생성
      const svgPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.svg');
      const svgFullPath = path.resolve(`public${svgPath}`);
      const svg = createPlaceholderSVG(imagePath);
      fs.writeFileSync(svgFullPath, svg);

      // 원본 확장자로 심볼릭 링크 생성
      if (fs.existsSync(svgFullPath)) {
        fs.symlinkSync(svgFullPath, fullPath);
        console.log(`🎨 플레이스홀더 이미지 생성: ${imagePath} (SVG 기반)`);
      }
    }
    return true;
  } catch (error) {
    console.error(`❌ 플레이스홀더 생성 실패: ${imagePath}`, error.message);
    return false;
  }
}

// 메인 해결 함수
function fixMissingImages() {
  console.log('🔍 누락된 이미지 해결 중...\n');

  let fixedCount = 0;
  let placeholderCount = 0;

  for (const missingImage of missingImages) {
    console.log(`처리 중: ${missingImage}`);

    // 1. 기존 이미지로 대체 가능한지 확인
    if (imageReplacements[missingImage]) {
      const replacement = imageReplacements[missingImage];
      if (createSymbolicLink(replacement, missingImage)) {
        fixedCount++;
        continue;
      }
    }

    // 2. 디테일 이미지의 경우 메인 이미지로 대체
    if (missingImage.includes('/detail-') || missingImage.includes('/lifestyle')) {
      const mainImage = missingImage.replace(/\/(detail-\d+|lifestyle)\./, '/main.');
      const mainImagePath = `public${mainImage}`;

      if (fs.existsSync(mainImagePath)) {
        if (createSymbolicLink(mainImage, missingImage)) {
          fixedCount++;
          continue;
        }
      }

      // 메인 이미지도 없으면 컬렉션에서 찾기
      const category = missingImage.split('/')[2];
      const collectionImage = `/images/collections/${category.replace(/-collection|-series|-line|-natural/, '')}.png`;
      const collectionPath = `public${collectionImage}`;

      if (fs.existsSync(collectionPath)) {
        if (createSymbolicLink(collectionImage, missingImage)) {
          fixedCount++;
          continue;
        }
      }
    }

    // 3. 갤러리 이미지의 경우 메인 이미지로 대체
    if (missingImage.includes('/gallery-')) {
      const mainImage = missingImage.replace(/\/gallery-\d+\.svg/, '/main.jpg');
      const mainImagePath = `public${mainImage}`;

      if (fs.existsSync(mainImagePath)) {
        if (createSymbolicLink(mainImage, missingImage)) {
          fixedCount++;
          continue;
        }
      }
    }

    // 4. 플레이스홀더 생성
    if (createPlaceholderImage(missingImage)) {
      placeholderCount++;
    }
  }

  console.log('\n✅ 해결 완료!');
  console.log(`🔗 기존 이미지로 대체: ${fixedCount}개`);
  console.log(`🎨 플레이스홀더 생성: ${placeholderCount}개`);
  console.log(`📊 총 처리: ${fixedCount + placeholderCount}개`);
}

// 추가: 일반적인 플레이스홀더 이미지들 생성
function createCommonPlaceholders() {
  console.log('\n📋 일반적인 플레이스홀더 이미지 생성...');

  const commonPlaceholders = [
    '/images/placeholder.jpg',
    '/images/placeholder-dev.jpg',
    '/images/placeholder-test.jpg'
  ];

  commonPlaceholders.forEach(placeholder => {
    if (!fs.existsSync(`public${placeholder}`)) {
      createPlaceholderImage(placeholder);
    }
  });
}

// 스크립트 실행
fixMissingImages();
createCommonPlaceholders();

console.log('\n🎉 모든 작업이 완료되었습니다!');
console.log('\n💡 추천사항:');
console.log('   1. 개발 서버를 재시작하여 변경사항을 확인하세요');
console.log('   2. 실제 고품질 이미지로 교체하는 것을 고려하세요');
console.log('   3. SEO를 위해 적절한 alt 텍스트를 확인하세요'); 