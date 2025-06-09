// Midjourney V7 프롬프트 자동 생성기 for khakishop
// RIGAS 가구 디자인 모티브 유지

interface PromptConfig {
  category: 'references' | 'curtain' | 'blind' | 'motorized' | 'landing' | 'hero';
  slug: string;
  imageType?: 'main' | 'gallery' | 'detail' | 'lifestyle';
}

// 공통 기본 프롬프트 구성 요소
const BASE_TECHNICAL = "ultra-photorealistic, 8K interior magazine photography, cinematic natural lighting, eye-level shot, 50mm prime lens, shallow depth of field f/2.2, realistic materials and textures";

const BASE_BRAND_MOOD = "afternoon sunlight filtering through windows and curtains, minimal styling with quiet warm atmosphere, sophisticated neutral color palette, wide spacious interior layout, realistic high-end furniture including USM modular systems";

const BASE_QUALITY = "professional interior design photography, architectural digest style, soft shadows, natural color grading, premium textile details";

// References 카테고리별 공간 스타일 맵핑
const REFERENCE_SPACE_STYLES = {
  'modern-office-gangnam': 'spacious modern corporate office with floor-to-ceiling windows, urban midcentury furniture, glass conference table, minimalist workstations, city skyline view',
  'minimal-residence-bundang': 'serene minimalist living room with clean lines, Scandinavian furniture, white oak floors, large windows overlooking garden, cozy reading corner',
  'classic-cafe-hongdae': 'warm inviting café interior with exposed brick walls, vintage wood furniture, ambient pendant lighting, cozy seating areas, artisanal coffee bar',
  'contemporary-house-goyang': 'contemporary residential living space with double-height ceilings, modern sectional sofa, natural stone accent wall, panoramic windows',
  'scandinavian-apartment-mapo': 'bright Scandinavian-style apartment with white walls, natural wood furniture, hygge atmosphere, cozy textiles, plants',
  'industrial-lobby-yongsan': 'sophisticated industrial lobby with concrete walls, steel beams, modern reception desk, dramatic ceiling height, urban aesthetic',
  'luxury-penthouse-seocho': 'ultra-luxurious penthouse living room with panoramic city views, designer furniture, marble accents, premium finishes, sophisticated lighting',
  'modern-clinic-seongnam': 'clean modern medical facility with calming color palette, comfortable seating areas, natural lighting, wellness-focused design',
  'art-gallery-jongno': 'minimalist white cube art gallery with pristine walls, track lighting, polished concrete floors, artwork display areas'
};

// 제품별 스타일 특성
const PRODUCT_STYLES = {
  curtain: {
    'classic-curtain': 'elegant classic curtains with rich fabric texture, traditional pleating, formal dining room setting, warm ambient lighting',
    'modern-curtain': 'sleek modern curtains with clean lines, minimal hardware, contemporary living space, abundant natural light',
    'sheer-curtain': 'ethereal sheer curtains creating soft light diffusion, airy atmosphere, bedroom or study setting, gentle breeze effect',
    'linen-white': 'premium white linen curtains with natural texture, organic draping, serene bedroom or living room, morning sunlight',
    'pleats-ivory': 'sophisticated pleated curtains in ivory tone, precise geometric folds, elegant sitting room, refined styling'
  },
  blind: {
    'wood-blind': 'natural wood blinds with rich grain texture, warm honey tones, traditional study or office, controlled natural lighting',
    'aluminum-blind': 'sleek aluminum blinds with modern aesthetic, precise slat control, contemporary office or kitchen, urban setting',
    'fabric-blind': 'soft fabric roller blinds with textured weave, cozy residential setting, filtered daylight, comfortable living space'
  },
  motorized: {
    'motorized-curtain-system': 'automated curtain system with remote control, smart home integration, modern bedroom or living room, technology showcase',
    'motorized-blind-system': 'precision motorized blinds with smartphone control, contemporary office setting, automated light management',
    'smart-home-integration': 'fully integrated smart window treatment system, futuristic home interior, voice control interface, seamless automation'
  }
};

// 랜딩/히어로 이미지 스타일
const HERO_STYLES = {
  'hero-main': 'iconic khakishop brand image with premium curtains as focal point, luxurious residential setting, golden hour lighting, brand essence capture',
  'hero-mobile': 'mobile-optimized hero shot with elegant window treatment, intimate interior space, premium textile focus, warm atmosphere',
  'brand-lifestyle': 'lifestyle shot showcasing khakishop aesthetic, people enjoying beautiful interior, natural interaction with window treatments',
  'collection-overview': 'curated display of various curtain and blind styles, showroom setting, professional product presentation'
};

// 공간 유형별 추가 디테일
const SPACE_TYPE_DETAILS = {
  office: 'professional atmosphere, ergonomic furniture, natural productivity lighting, corporate sophistication',
  residential: 'homey comfort, personal touches, family-friendly layout, relaxed elegance',
  cafe: 'social gathering space, artisanal details, warm hospitality, community atmosphere',
  gallery: 'cultural sophistication, artistic ambiance, pristine presentation, contemplative space',
  clinic: 'healing environment, calming presence, wellness focus, clean aesthetics',
  lobby: 'welcoming grandeur, impressive scale, professional reception, architectural drama'
};

// slug 분석으로 공간 유형 자동 감지
function detectSpaceType(slug: string): string {
  if (slug.includes('office')) return 'office';
  if (slug.includes('residence') || slug.includes('apartment') || slug.includes('house') || slug.includes('penthouse')) return 'residential';
  if (slug.includes('cafe')) return 'cafe';
  if (slug.includes('gallery')) return 'gallery';
  if (slug.includes('clinic')) return 'clinic';
  if (slug.includes('lobby')) return 'lobby';
  return 'residential'; // 기본값
}

// 메인 프롬프트 생성 함수
export function generateMidjourneyPrompt(config: PromptConfig): string {
  const { category, slug, imageType = 'main' } = config;
  
  let specificStyle = '';
  let additionalDetails = '';
  
  switch (category) {
    case 'references':
      specificStyle = REFERENCE_SPACE_STYLES[slug as keyof typeof REFERENCE_SPACE_STYLES] || 
                     'sophisticated interior space with premium window treatments';
      const spaceType = detectSpaceType(slug);
      additionalDetails = SPACE_TYPE_DETAILS[spaceType as keyof typeof SPACE_TYPE_DETAILS] || '';
      break;
      
    case 'curtain':
      specificStyle = PRODUCT_STYLES.curtain[slug as keyof typeof PRODUCT_STYLES.curtain] || 
                     'premium curtains in elegant interior setting';
      additionalDetails = 'textile focus, fabric texture detail, window treatment showcase';
      break;
      
    case 'blind':
      specificStyle = PRODUCT_STYLES.blind[slug as keyof typeof PRODUCT_STYLES.blind] || 
                     'modern blinds with precise light control';
      additionalDetails = 'light management demonstration, slat detail, functional elegance';
      break;
      
    case 'motorized':
      specificStyle = PRODUCT_STYLES.motorized[slug as keyof typeof PRODUCT_STYLES.motorized] || 
                     'smart automated window treatment system';
      additionalDetails = 'technology integration, modern convenience, seamless operation';
      break;
      
    case 'hero':
    case 'landing':
      specificStyle = HERO_STYLES[slug as keyof typeof HERO_STYLES] || 
                     'premium khakishop brand aesthetic';
      additionalDetails = 'brand identity, lifestyle aspiration, premium positioning';
      break;
  }
  
  // 이미지 타입별 추가 조정
  const typeModifiers = {
    main: 'hero shot composition, primary focal point',
    gallery: 'multiple angle showcase, comprehensive view',
    detail: 'close-up texture focus, material emphasis',
    lifestyle: 'human interaction, living scenario, emotional connection'
  };
  
  const prompt = [
    specificStyle,
    BASE_TECHNICAL,
    BASE_BRAND_MOOD,
    additionalDetails,
    typeModifiers[imageType],
    BASE_QUALITY,
    '--ar 16:9 --style raw --v 6.1'
  ].filter(Boolean).join(', ');
  
  return prompt;
}

// 폴더 경로에서 자동으로 프롬프트 생성
export function generatePromptFromPath(imagePath: string, imageType?: string): string {
  const pathParts = imagePath.split('/');
  
  // /public/images/category/slug/ 구조 파싱
  if (pathParts.includes('references')) {
    const slug = pathParts[pathParts.indexOf('references') + 1];
    return generateMidjourneyPrompt({ 
      category: 'references', 
      slug, 
      imageType: imageType as any 
    });
  }
  
  if (pathParts.includes('curtain')) {
    const slug = pathParts[pathParts.indexOf('curtain') + 1];
    return generateMidjourneyPrompt({ 
      category: 'curtain', 
      slug, 
      imageType: imageType as any 
    });
  }
  
  if (pathParts.includes('blind')) {
    const slug = pathParts[pathParts.indexOf('blind') + 1];
    return generateMidjourneyPrompt({ 
      category: 'blind', 
      slug, 
      imageType: imageType as any 
    });
  }
  
  if (pathParts.includes('motorized')) {
    const slug = pathParts[pathParts.indexOf('motorized') + 1];
    return generateMidjourneyPrompt({ 
      category: 'motorized', 
      slug, 
      imageType: imageType as any 
    });
  }
  
  if (pathParts.includes('landing')) {
    const filename = pathParts[pathParts.length - 1]?.replace(/\.[^/.]+$/, '') || 'hero-main';
    return generateMidjourneyPrompt({ 
      category: 'landing', 
      slug: filename, 
      imageType: imageType as any 
    });
  }
  
  if (pathParts.includes('hero')) {
    const filename = pathParts[pathParts.length - 1]?.replace(/\.[^/.]+$/, '') || 'hero-main';
    return generateMidjourneyPrompt({ 
      category: 'hero', 
      slug: filename, 
      imageType: imageType as any 
    });
  }
  
  // 기본 프롬프트
  return generateMidjourneyPrompt({ 
    category: 'landing', 
    slug: 'hero-main',
    imageType: imageType as any 
  });
}

// 모든 생성된 폴더에 대한 프롬프트 배치 생성
export function generateAllPrompts(): Record<string, string> {
  const allPrompts: Record<string, string> = {};
  
  // References 프롬프트
  Object.keys(REFERENCE_SPACE_STYLES).forEach(slug => {
    allPrompts[`/public/images/references/${slug}/main.jpg`] = 
      generatePromptFromPath(`/public/images/references/${slug}/main.jpg`, 'main');
    allPrompts[`/public/images/references/${slug}/gallery-1.jpg`] = 
      generatePromptFromPath(`/public/images/references/${slug}/gallery-1.jpg`, 'gallery');
  });
  
  // Product 프롬프트 - Curtain
  Object.keys(PRODUCT_STYLES.curtain).forEach(slug => {
    allPrompts[`/public/images/products/curtain/${slug}/main.jpg`] = 
      generatePromptFromPath(`/public/images/products/curtain/${slug}/main.jpg`, 'main');
    allPrompts[`/public/images/products/curtain/${slug}/detail.jpg`] = 
      generatePromptFromPath(`/public/images/products/curtain/${slug}/detail.jpg`, 'detail');
  });
  
  // Product 프롬프트 - Blind
  Object.keys(PRODUCT_STYLES.blind).forEach(slug => {
    allPrompts[`/public/images/products/blind/${slug}/main.jpg`] = 
      generatePromptFromPath(`/public/images/products/blind/${slug}/main.jpg`, 'main');
    allPrompts[`/public/images/products/blind/${slug}/lifestyle.jpg`] = 
      generatePromptFromPath(`/public/images/products/blind/${slug}/lifestyle.jpg`, 'lifestyle');
  });
  
  // Product 프롬프트 - Motorized
  Object.keys(PRODUCT_STYLES.motorized).forEach(slug => {
    allPrompts[`/public/images/products/motorized/${slug}/main.jpg`] = 
      generatePromptFromPath(`/public/images/products/motorized/${slug}/main.jpg`, 'main');
    allPrompts[`/public/images/products/motorized/${slug}/tech.jpg`] = 
      generatePromptFromPath(`/public/images/products/motorized/${slug}/tech.jpg`, 'detail');
  });
  
  // Hero 프롬프트
  allPrompts['/public/images/landing/hero-main.jpg'] = 
    generatePromptFromPath('/public/images/landing/hero-main.jpg', 'main');
  allPrompts['/public/images/landing/hero-mobile.jpg'] = 
    generatePromptFromPath('/public/images/landing/hero-mobile.jpg', 'main');
  allPrompts['/public/images/hero/brand-lifestyle.jpg'] = 
    generatePromptFromPath('/public/images/hero/brand-lifestyle.jpg', 'lifestyle');
  
  return allPrompts;
}

// 사용 예시 및 테스트용 함수
export function logExamplePrompts(): void {
  console.log('=== KHAKISHOP MIDJOURNEY V7 프롬프트 예시 ===\n');
  
  // References 예시
  console.log('📌 REFERENCES - Modern Office:');
  console.log(generatePromptFromPath('/public/images/references/modern-office-gangnam/main.jpg', 'main'));
  console.log('\n');
  
  // Curtain 제품 예시
  console.log('🎭 CURTAIN - Sheer Curtain:');
  console.log(generatePromptFromPath('/public/images/products/curtain/sheer-curtain/main.jpg', 'main'));
  console.log('\n');
  
  // Motorized 제품 예시
  console.log('⚙️ MOTORIZED - Smart System:');
  console.log(generatePromptFromPath('/public/images/products/motorized/smart-home-integration/main.jpg', 'main'));
  console.log('\n');
  
  // Hero 예시
  console.log('🌟 HERO - Brand Main:');
  console.log(generatePromptFromPath('/public/images/landing/hero-main.jpg', 'main'));
  console.log('\n');
} 