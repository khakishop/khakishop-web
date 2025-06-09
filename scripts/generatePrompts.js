// Midjourney V7 프롬프트 생성 테스트 및 출력 스크립트
// khakishop 이미지 폴더 구조용

const fs = require('fs');
const path = require('path');

// TypeScript 파일을 직접 실행하기 위한 임시 구현
// 실제 프로덕션에서는 TypeScript를 컴파일하여 사용

// 기본 설정
const BASE_TECHNICAL = "ultra-photorealistic, 8K interior magazine photography, cinematic natural lighting, eye-level shot, 50mm prime lens, shallow depth of field f/2.2, realistic materials and textures";
const BASE_BRAND_MOOD = "afternoon sunlight filtering through windows and curtains, minimal styling with quiet warm atmosphere, sophisticated neutral color palette, wide spacious interior layout, realistic high-end furniture including USM modular systems";
const BASE_QUALITY = "professional interior design photography, architectural digest style, soft shadows, natural color grading, premium textile details";

// References 스타일 정의
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

// 제품 스타일 정의
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

// 프롬프트 생성 함수
function generatePrompt(category, slug, imageType = 'main') {
  let specificStyle = '';
  let additionalDetails = '';
  
  switch (category) {
    case 'references':
      specificStyle = REFERENCE_SPACE_STYLES[slug] || 'sophisticated interior space with premium window treatments';
      additionalDetails = 'professional atmosphere, homey comfort, refined elegance';
      break;
      
    case 'curtain':
      specificStyle = PRODUCT_STYLES.curtain[slug] || 'premium curtains in elegant interior setting';
      additionalDetails = 'textile focus, fabric texture detail, window treatment showcase';
      break;
      
    case 'blind':
      specificStyle = PRODUCT_STYLES.blind[slug] || 'modern blinds with precise light control';
      additionalDetails = 'light management demonstration, slat detail, functional elegance';
      break;
      
    case 'motorized':
      specificStyle = PRODUCT_STYLES.motorized[slug] || 'smart automated window treatment system';
      additionalDetails = 'technology integration, modern convenience, seamless operation';
      break;
      
    case 'landing':
    case 'hero':
      specificStyle = 'iconic khakishop brand image with premium curtains as focal point, luxurious residential setting, golden hour lighting';
      additionalDetails = 'brand identity, lifestyle aspiration, premium positioning';
      break;
  }
  
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

// 메인 실행 함수
function generateAllPrompts() {
  console.log('🎨 KHAKISHOP MIDJOURNEY V7 프롬프트 생성기');
  console.log('===================================================\n');
  
  const allPrompts = {};
  
  // 1. References 프롬프트 생성
  console.log('📌 REFERENCES 프롬프트:');
  console.log('-'.repeat(50));
  Object.keys(REFERENCE_SPACE_STYLES).forEach(slug => {
    const mainPrompt = generatePrompt('references', slug, 'main');
    const galleryPrompt = generatePrompt('references', slug, 'gallery');
    
    allPrompts[`/public/images/references/${slug}/main.jpg`] = mainPrompt;
    allPrompts[`/public/images/references/${slug}/gallery-1.jpg`] = galleryPrompt;
    
    console.log(`\n🏢 ${slug}:`);
    console.log(`Main: ${mainPrompt}`);
    console.log(`Gallery: ${galleryPrompt}`);
  });
  
  // 2. Curtain 제품 프롬프트
  console.log('\n\n🎭 CURTAIN 제품 프롬프트:');
  console.log('-'.repeat(50));
  Object.keys(PRODUCT_STYLES.curtain).forEach(slug => {
    const mainPrompt = generatePrompt('curtain', slug, 'main');
    const detailPrompt = generatePrompt('curtain', slug, 'detail');
    
    allPrompts[`/public/images/products/curtain/${slug}/main.jpg`] = mainPrompt;
    allPrompts[`/public/images/products/curtain/${slug}/detail.jpg`] = detailPrompt;
    
    console.log(`\n🪟 ${slug}:`);
    console.log(`Main: ${mainPrompt}`);
    console.log(`Detail: ${detailPrompt}`);
  });
  
  // 3. Blind 제품 프롬프트
  console.log('\n\n🪟 BLIND 제품 프롬프트:');
  console.log('-'.repeat(50));
  Object.keys(PRODUCT_STYLES.blind).forEach(slug => {
    const mainPrompt = generatePrompt('blind', slug, 'main');
    const lifestylePrompt = generatePrompt('blind', slug, 'lifestyle');
    
    allPrompts[`/public/images/products/blind/${slug}/main.jpg`] = mainPrompt;
    allPrompts[`/public/images/products/blind/${slug}/lifestyle.jpg`] = lifestylePrompt;
    
    console.log(`\n🎛️ ${slug}:`);
    console.log(`Main: ${mainPrompt}`);
    console.log(`Lifestyle: ${lifestylePrompt}`);
  });
  
  // 4. Motorized 제품 프롬프트
  console.log('\n\n⚙️ MOTORIZED 제품 프롬프트:');
  console.log('-'.repeat(50));
  Object.keys(PRODUCT_STYLES.motorized).forEach(slug => {
    const mainPrompt = generatePrompt('motorized', slug, 'main');
    const techPrompt = generatePrompt('motorized', slug, 'detail');
    
    allPrompts[`/public/images/products/motorized/${slug}/main.jpg`] = mainPrompt;
    allPrompts[`/public/images/products/motorized/${slug}/tech.jpg`] = techPrompt;
    
    console.log(`\n🤖 ${slug}:`);
    console.log(`Main: ${mainPrompt}`);
    console.log(`Tech: ${techPrompt}`);
  });
  
  // 5. Hero/Landing 프롬프트
  console.log('\n\n🌟 HERO/LANDING 프롬프트:');
  console.log('-'.repeat(50));
  const heroMain = generatePrompt('hero', 'hero-main', 'main');
  const heroMobile = generatePrompt('hero', 'hero-mobile', 'main');
  const brandLifestyle = generatePrompt('hero', 'brand-lifestyle', 'lifestyle');
  
  allPrompts['/public/images/landing/hero-main.jpg'] = heroMain;
  allPrompts['/public/images/landing/hero-mobile.jpg'] = heroMobile;
  allPrompts['/public/images/hero/brand-lifestyle.jpg'] = brandLifestyle;
  
  console.log(`\n✨ Hero Main: ${heroMain}`);
  console.log(`\n📱 Hero Mobile: ${heroMobile}`);
  console.log(`\n👥 Brand Lifestyle: ${brandLifestyle}`);
  
  // JSON 파일로 저장
  const outputFile = path.join(__dirname, '../khakishop-midjourney-prompts.json');
  fs.writeFileSync(outputFile, JSON.stringify(allPrompts, null, 2), 'utf8');
  
  console.log('\n\n💾 저장 완료:');
  console.log(`파일 위치: ${outputFile}`);
  console.log(`총 프롬프트 개수: ${Object.keys(allPrompts).length}개`);
  
  return allPrompts;
}

// 스크립트 실행
if (require.main === module) {
  generateAllPrompts();
}

module.exports = { generateAllPrompts, generatePrompt }; 