#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Canvas 라이브러리가 없으므로 SVG를 사용해서 placeholder 이미지 생성
function generateSVGPlaceholder(width, height, text, filename) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #f4f4f4; }
      .text { 
        fill: #6b7280; 
        font-family: 'Montserrat', 'Arial', sans-serif; 
        font-weight: bold; 
        font-size: ${Math.min(width, height) / 15}px;
        text-anchor: middle;
        dominant-baseline: middle;
      }
      .subtitle {
        fill: #9ca3af;
        font-family: 'Montserrat', 'Arial', sans-serif;
        font-weight: normal;
        font-size: ${Math.min(width, height) / 25}px;
        text-anchor: middle;
        dominant-baseline: middle;
      }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" class="bg"/>
  
  <!-- Grid pattern -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  
  <!-- Main text -->
  <text x="${width / 2}" y="${height / 2 - 20}" class="text">${text}</text>
  
  <!-- Subtitle -->
  <text x="${width / 2}" y="${height / 2 + 20}" class="subtitle">${width} × ${height}</text>
  
  <!-- Corner info -->
  <text x="20" y="30" class="subtitle">PLACEHOLDER</text>
  <text x="${width - 20}" y="${height - 20}" class="subtitle" text-anchor="end">${filename}</text>
</svg>`;

  return svg;
}

// 이미지 정보 정의
const images = [
  {
    path: 'public/images/hero/hero.jpg',
    width: 1920,
    height: 1200,
    text: 'KHAKI SHOP',
    description: '메인 히어로 이미지'
  },
  {
    path: 'public/images/hero/khakishop-hero.jpg',
    width: 1920,
    height: 1200,
    text: 'KHAKI SHOP',
    description: 'SEO 메타데이터용 기본 이미지'
  },
  {
    path: 'public/images/hero/brand-lifestyle.jpg',
    width: 1920,
    height: 1200,
    text: 'BRAND LIFESTYLE',
    description: '브랜드 라이프스타일 이미지'
  },
  {
    path: 'public/images/landing/hero-main.jpg',
    width: 1920,
    height: 1200,
    text: 'HERO MAIN',
    description: '랜딩 페이지 메인 히어로 이미지'
  },
  {
    path: 'public/images/landing/hero-mobile.jpg',
    width: 1200,
    height: 800,
    text: 'HERO MOBILE',
    description: '모바일용 히어로 이미지'
  }
];

console.log('🎨 KHAKISHOP 핵심 이미지 생성 시작...\n');

// 각 이미지 생성
images.forEach((img, index) => {
  try {
    // 디렉토리 생성
    const dir = path.dirname(img.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 디렉토리 생성: ${dir}`);
    }

    // SVG 생성
    const filename = path.basename(img.path);
    const svg = generateSVGPlaceholder(img.width, img.height, img.text, filename);

    // SVG 파일로 저장 (임시)
    const svgPath = img.path.replace(/\.(jpg|png)$/, '.svg');
    fs.writeFileSync(svgPath, svg);

    console.log(`✅ ${index + 1}/${images.length} 생성 완료: ${img.path}`);
    console.log(`   📐 해상도: ${img.width}×${img.height}`);
    console.log(`   📝 설명: ${img.description}`);
    console.log(`   📄 임시 SVG: ${svgPath}\n`);

  } catch (error) {
    console.error(`❌ ${img.path} 생성 실패:`, error.message);
  }
});

console.log('🎉 핵심 이미지 생성 완료!');
console.log('\n📋 생성된 이미지 목록:');
images.forEach((img, index) => {
  const svgPath = img.path.replace(/\.(jpg|png)$/, '.svg');
  console.log(`${index + 1}. ${svgPath} (${img.width}×${img.height})`);
});

console.log('\n💡 참고사항:');
console.log('- SVG 형식으로 생성되었습니다 (브라우저에서 이미지로 표시됨)');
console.log('- 실제 이미지가 준비되면 해당 경로에 교체하세요');
console.log('- 모든 이미지는 반응형으로 설계되었습니다');
console.log('- 그리드 패턴과 텍스트로 구성되어 있습니다'); 