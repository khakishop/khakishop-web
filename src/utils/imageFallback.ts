// ================================================================================
// 🖼️ KHAKISHOP 이미지 폴백 시스템
// ================================================================================
// 🎯 목적: 누락된 이미지에 대한 자동 폴백 처리

// 🎨 카테고리별 폴백 이미지 매핑
const fallbackImages: Record<string, string> = {
  // SEO & OG
  'og-image.jpg': '/images/hero/hero.jpg',
  'favicon.ico': '/images/hero/hero.jpg',

  // 컬렉션 이미지들 (.jpg → .png 변환)
  'essential-linen.jpg': '/images/collections/essential-linen.png',
  'modern-sheer.jpg': '/images/collections/modern-sheer.png',
  'venetian-premium.jpg': '/images/collections/venetian-premium.png',
  'wood-texture.jpg': '/images/collections/wood-texture.png',
  'smart-automation.jpg': '/images/collections/smart-automation.png',
  'wireless-motor.jpg': '/images/collections/wireless-motor.png',
  'designer-hardware.jpg': '/images/collections/designer-hardware.png',
  'luxury-tieback.jpg': '/images/collections/luxury-tieback.png',

  // 랜딩/히어로 이미지들
  'hero-main.jpg': '/images/landing/hero-main.png',
  'collection-overview.jpg': '/images/landing/collection-overview.png',
  'brand-lifestyle.jpg': '/images/landing/brand-lifestyle.png',

  // 제품 카테고리별 기본 이미지
  'classic.jpg': '/images/hero/hero.jpg',
  'modern.jpg': '/images/hero/hero.jpg',
  'sheer.jpg': '/images/hero/hero.jpg',
  'wood.jpg': '/images/hero/hero.jpg',
  'motorized-blind.jpg': '/images/hero/hero.jpg',
  'fabric.jpg': '/images/hero/hero.jpg',
  'aluminum.jpg': '/images/hero/hero.jpg',
  'motorized-curtain.jpg': '/images/hero/hero.jpg',
  'smart.jpg': '/images/hero/hero.jpg',

  // 제품별 세부 이미지들 (존재하는 이미지로 매핑)
  'linen-white.jpg': '/images/products/curtain/sheer-curtain/lifestyle.jpg',
  'pleats-ivory.jpg': '/images/products/curtain/sheer-curtain/detail.jpg',

  // 프로젝트 이미지들
  'project-showcase.jpg': '/images/projects/project-showcase.png',
  'portfolio-header.jpg': '/images/projects/our-projects-bg.jpg',
  'consultation-bg.jpg': '/images/projects/our-projects-bg.jpg',

  // 레퍼런스 이미지들 (.jpg → .png 변환)
  'blind-minimal-bedroom-1.jpg':
    '/images/references/blind-minimal-bedroom-1.png',
  'curtain-modern-livingroom-1.jpg':
    '/images/references/curtain-modern-livingroom-1.png',
  'motorized-smart-livingroom-1.jpg':
    '/images/references/motorized-smart-livingroom-1.png',

  // 기본 플레이스홀더
  'placeholder.jpg': '/images/hero/hero.jpg',
  'default.jpg': '/images/hero/hero.jpg',
};

// 🔄 이미지 경로 변환 함수
export const getValidImagePath = (originalPath: string): string => {
  // 절대 경로에서 파일명 추출
  const fileName = originalPath.split('/').pop() || '';

  // 폴백 매핑에서 찾기
  if (fallbackImages[fileName]) {
    console.log(
      `🔄 이미지 폴백: ${originalPath} → ${fallbackImages[fileName]}`
    );
    return fallbackImages[fileName];
  }

  // .jpg를 .png로 변환해서 시도
  if (fileName.endsWith('.jpg')) {
    const pngFileName = fileName.replace('.jpg', '.png');
    if (fallbackImages[pngFileName]) {
      console.log(
        `🔄 JPG→PNG 변환: ${originalPath} → ${fallbackImages[pngFileName]}`
      );
      return fallbackImages[pngFileName];
    }

    // 직접 .png 경로로 변환
    const pngPath = originalPath.replace('.jpg', '.png');
    console.log(`🔄 직접 변환: ${originalPath} → ${pngPath}`);
    return pngPath;
  }

  // 폴백을 찾지 못한 경우 기본 히어로 이미지
  console.log(
    `⚠️ 폴백 없음, 기본 이미지 사용: ${originalPath} → /images/hero/hero.jpg`
  );
  return '/images/hero/hero.jpg';
};

// 🎨 카테고리별 폴백 이미지 생성
export const getCategoryFallback = (category: string): string => {
  const categoryMap: Record<string, string> = {
    hero: '/images/hero/hero.jpg',
    landing: '/images/landing/hero-main.png',
    projects: '/images/projects/our-projects-bg.jpg',
    collections: '/images/collections/essential-linen.png',
    references: '/images/references/modern-office-gangnam/main.jpg',
    products: '/images/products/curtain/sheer-curtain/lifestyle.jpg',
    gallery: '/images/midjourney/1.png',
    blog: '/images/landing/collection-overview.png',
    about: '/images/landing/brand-lifestyle.png',
    future: '/images/hero/hero.jpg',
  };

  return categoryMap[category] || '/images/hero/hero.jpg';
};

// 🛡️ Next.js Image 컴포넌트용 에러 핸들러
export const handleImageError = (event: any, fallbackSrc?: string) => {
  const img = event.target;
  const originalSrc = img.src;

  if (fallbackSrc) {
    img.src = fallbackSrc;
  } else {
    img.src = '/images/hero/hero.jpg';
  }

  console.log(`🚨 이미지 로드 실패: ${originalSrc} → ${img.src}`);
};

// 📋 존재하지 않는 이미지 목록 (로깅용)
export const logMissingImages = (missingPaths: string[]) => {
  console.log('📋 누락된 이미지 목록:');
  missingPaths.forEach((path) => {
    const fallback = getValidImagePath(path);
    console.log(`  ❌ ${path} → ✅ ${fallback}`);
  });
};
