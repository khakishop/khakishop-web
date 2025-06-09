// 특정 폴더들에 대한 Midjourney V7 프롬프트 생성 스크립트
// khakishop 이미지 폴더 중 사용자 지정 폴더만 처리

const fs = require('fs');
const path = require('path');

// 기본 설정 (기존 generatePrompts.js와 동일)
const BASE_TECHNICAL = "ultra-photorealistic, 8K interior magazine photography, cinematic natural lighting, eye-level shot, 50mm prime lens, shallow depth of field f/2.2, realistic materials and textures";
const BASE_BRAND_MOOD = "afternoon sunlight filtering through windows and curtains, minimal styling with quiet warm atmosphere, sophisticated neutral color palette, wide spacious interior layout, realistic high-end furniture including USM modular systems";
const BASE_QUALITY = "professional interior design photography, architectural digest style, soft shadows, natural color grading, premium textile details";

// References 스타일 정의
const REFERENCE_SPACE_STYLES = {
  'modern-office-gangnam': 'spacious modern corporate office with floor-to-ceiling windows, urban midcentury furniture, glass conference table, minimalist workstations, city skyline view'
};

// 제품 스타일 정의
const PRODUCT_STYLES = {
  curtain: {
    'sheer-curtain': 'ethereal sheer curtains creating soft light diffusion, airy atmosphere, bedroom or study setting, gentle breeze effect'
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

// 특정 폴더들에 대한 프롬프트 생성
function generateSpecificPrompts() {
  console.log('🎨 KHAKISHOP 특정 폴더 MIDJOURNEY V7 프롬프트 생성');
  console.log('===================================================\n');
  
  const specificPrompts = {};
  
  // 1. modern-office-gangnam (References)
  console.log('📌 REFERENCES - modern-office-gangnam:');
  console.log('-'.repeat(50));
  
  const officeMainPrompt = generatePrompt('references', 'modern-office-gangnam', 'main');
  const officeGalleryPrompt = generatePrompt('references', 'modern-office-gangnam', 'gallery');
  
  specificPrompts['/public/images/references/modern-office-gangnam/main.jpg'] = officeMainPrompt;
  specificPrompts['/public/images/references/modern-office-gangnam/gallery-1.jpg'] = officeGalleryPrompt;
  specificPrompts['/public/images/references/modern-office-gangnam/gallery-2.jpg'] = officeGalleryPrompt;
  specificPrompts['/public/images/references/modern-office-gangnam/gallery-3.jpg'] = officeGalleryPrompt;
  
  console.log(`\n🏢 Main 이미지:`);
  console.log(`${officeMainPrompt}`);
  console.log(`\n🏢 Gallery 이미지:`);
  console.log(`${officeGalleryPrompt}`);
  
  // 2. sheer-curtain (Curtain 제품)
  console.log('\n\n🎭 CURTAIN - sheer-curtain:');
  console.log('-'.repeat(50));
  
  const sheerMainPrompt = generatePrompt('curtain', 'sheer-curtain', 'main');
  const sheerDetailPrompt = generatePrompt('curtain', 'sheer-curtain', 'detail');
  const sheerLifestylePrompt = generatePrompt('curtain', 'sheer-curtain', 'lifestyle');
  
  specificPrompts['/public/images/products/curtain/sheer-curtain/main.jpg'] = sheerMainPrompt;
  specificPrompts['/public/images/products/curtain/sheer-curtain/detail.jpg'] = sheerDetailPrompt;
  specificPrompts['/public/images/products/curtain/sheer-curtain/lifestyle.jpg'] = sheerLifestylePrompt;
  specificPrompts['/public/images/products/curtain/sheer-curtain/gallery-1.jpg'] = sheerMainPrompt;
  specificPrompts['/public/images/products/curtain/sheer-curtain/gallery-2.jpg'] = sheerDetailPrompt;
  
  console.log(`\n🪟 Main 이미지:`);
  console.log(`${sheerMainPrompt}`);
  console.log(`\n🪟 Detail 이미지:`);
  console.log(`${sheerDetailPrompt}`);
  console.log(`\n🪟 Lifestyle 이미지:`);
  console.log(`${sheerLifestylePrompt}`);
  
  // JSON 파일로 저장
  const outputFile = path.join(__dirname, '../khakishop-midjourney-prompts.json');
  fs.writeFileSync(outputFile, JSON.stringify(specificPrompts, null, 2), 'utf8');
  
  console.log('\n\n💾 특정 폴더 프롬프트 저장 완료:');
  console.log(`파일 위치: ${outputFile}`);
  console.log(`생성된 프롬프트 개수: ${Object.keys(specificPrompts).length}개`);
  console.log('\n📁 대상 폴더:');
  console.log('- /public/images/references/modern-office-gangnam/');
  console.log('- /public/images/products/curtain/sheer-curtain/');
  
  return specificPrompts;
}

// 스크립트 실행
if (require.main === module) {
  generateSpecificPrompts();
}

module.exports = { generateSpecificPrompts }; 