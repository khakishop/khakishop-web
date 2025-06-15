#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 제품별 프롬프트 템플릿
const promptTemplates = {
  curtain: {
    'essential-linen-collection': 'Elegant linen curtains in modern living room, natural fabric texture, soft lighting, Korean textile quality, architectural digest style',
    'modern-sheer-series': 'Modern sheer curtains with soft natural light filtering, contemporary interior design, minimalist aesthetic, clean lines',
    'venetian-premium-line': 'Premium venetian curtains in luxury living space, sophisticated fabric draping, warm ambient lighting, high-end interior',
    'wood-texture-natural': 'Natural wood texture curtains in Scandinavian style room, organic materials, cozy atmosphere, Nordic design',
    'smart-automation-series': 'Smart automated curtains with sleek motor system, modern technology integration, contemporary home automation',
    'sheer-curtain': 'Delicate sheer curtains with ethereal light diffusion, romantic ambiance, soft flowing fabric, elegant interior'
  },

  blind: {
    'premium-venetian-collection': 'Premium venetian blinds in contemporary office, precise slat control, soft natural daylight, clean minimal decor',
    'modern-vertical-system': 'Modern vertical blinds in floor-to-ceiling windows, sleek linear design, professional workspace aesthetic',
    'smart-roller-collection': 'Smart roller blinds with motorized control, seamless integration, modern home automation, clean design',
    'elegant-roman-style': 'Elegant Roman style blinds with soft fabric folds, classic interior design, sophisticated window treatment',
    'contemporary-panel-system': 'Contemporary panel blinds in modern office space, geometric patterns, professional environment',
    'wood-blind': 'Natural wood blinds with warm grain texture, organic materials, cozy residential interior',
    'aluminum-blind': 'Sleek aluminum blinds in modern commercial space, industrial aesthetic, precise light control',
    'fabric-blind': 'Soft fabric blinds with textured weave, comfortable residential setting, warm natural lighting'
  },

  motorized: {
    'smart-curtain-system-pro': 'Smart automated curtains with app control, wireless motor system, modern luxury living room, cinematic lighting',
    'motorized-venetian-deluxe': 'Motorized venetian blinds with precision control, high-tech home automation, sleek contemporary design',
    'ai-home-integration-suite': 'AI-powered smart window treatments, futuristic home automation, voice control interface, modern technology',
    'voice-control-roller-system': 'Voice-controlled roller blinds, smart home integration, seamless automation, contemporary interior',
    'smartphone-vertical-elite': 'Smartphone-controlled vertical blinds, modern office automation, professional workspace technology',
    'solar-powered-eco-system': 'Solar-powered automated window treatments, eco-friendly technology, sustainable home design',
    'smart-home-integration': 'Integrated smart home window system, comprehensive automation, modern luxury interior',
    'motorized-curtain-system': 'Motorized curtain system with remote control, convenient home automation, elegant operation',
    'motorized-blind-system': 'Motorized blind system with precise positioning, advanced window treatment technology'
  }
};

// 레퍼런스 프로젝트별 프롬프트 템플릿
const referenceTemplates = {
  'modern-office-gangnam': 'Modern office interior in Gangnam Seoul, professional curtain installation, natural lighting, Korean workspace design',
  'minimal-residence-bundang': 'Minimalist residential interior in Bundang, clean window treatments, Scandinavian influence, Korean modern home',
  'classic-cafe-hongdae': 'Classic cafe interior in Hongdae, vintage window treatments, warm atmospheric lighting, Korean coffee culture',
  'contemporary-house-goyang': 'Contemporary house interior in Goyang, modern window solutions, family-friendly design, Korean residential',
  'scandinavian-apartment-mapo': 'Scandinavian style apartment in Mapo, Nordic window treatments, natural materials, Korean urban living',
  'industrial-lobby-yongsan': 'Industrial style lobby in Yongsan, modern commercial window treatments, urban aesthetic, Korean architecture',
  'luxury-penthouse-seocho': 'Luxury penthouse interior in Seocho, premium window treatments, high-end design, Korean luxury living',
  'modern-clinic-seongnam': 'Modern medical clinic in Seongnam, professional window solutions, clean healthcare environment',
  'art-gallery-jongno': 'Contemporary art gallery in Jongno, museum-quality window treatments, cultural space design',
  'luxury-residence-gangnam': 'Luxury residential interior in Gangnam, premium curtain installation, sophisticated Korean home design',
  'modern-office-seoul': 'Modern corporate office in Seoul, professional window treatments, Korean business environment',
  'boutique-hotel-busan': 'Boutique hotel interior in Busan, hospitality window solutions, Korean coastal design aesthetic',
  'medical-center-ilsan': 'Medical center interior in Ilsan, healthcare window treatments, clean professional environment',
  'university-library-daejeon': 'University library in Daejeon, academic window solutions, study-friendly lighting control',
  'premium-apartment-songdo': 'Premium apartment interior in Songdo, luxury window treatments, modern Korean residential design'
};

// 공통 스타일 키워드
const commonStyles = {
  quality: '8K resolution, professional photography, architectural digest style',
  lighting: 'natural lighting, soft shadows, warm ambient light',
  composition: '--ar 16:10, --style raw, --v 6',
  brand: 'khaki shop quality, Korean interior design excellence'
};

function generatePrompt(category, subcategory, slug, imageType) {
  let basePrompt = '';

  if (category === 'products') {
    const template = promptTemplates[subcategory]?.[slug];
    if (template) {
      basePrompt = template;
    } else {
      // 기본 템플릿
      const categoryName = subcategory === 'curtain' ? 'curtains' :
        subcategory === 'blind' ? 'blinds' :
          'motorized window treatments';
      basePrompt = `Premium ${categoryName} in modern interior, professional installation, elegant design`;
    }
  } else if (category === 'references') {
    const template = referenceTemplates[slug];
    if (template) {
      basePrompt = template;
    } else {
      basePrompt = `Modern interior project ${slug}, professional window treatment installation, Korean design aesthetic`;
    }
  }

  // 이미지 타입별 추가 키워드
  if (imageType === 'detail.jpg') {
    basePrompt += ', close-up detail shot, fabric texture, material quality';
  } else if (imageType === 'lifestyle.jpg') {
    basePrompt += ', lifestyle photography, people using space, daily life scene';
  } else if (imageType === 'tech.jpg') {
    basePrompt += ', technology focus, motor system detail, smart home features';
  }

  // 최종 프롬프트 조합
  return `${basePrompt}, ${commonStyles.quality}, ${commonStyles.lighting} ${commonStyles.composition}`;
}

function generateMidjourneyPrompts() {
  console.log('🎨 KHAKISHOP Midjourney 프롬프트 생성 시작...\n');

  let promptContent = `=== KHAKISHOP 이미지 프롬프트 ===
생성일: ${new Date().toLocaleDateString('ko-KR')}
총 High Priority 이미지: 약 100개

`;

  // 커튼 제품 프롬프트
  promptContent += `[커튼 제품]\n\n`;
  const curtainSlugs = [
    'essential-linen-collection',
    'modern-sheer-series',
    'venetian-premium-line',
    'wood-texture-natural',
    'smart-automation-series',
    'sheer-curtain'
  ];

  curtainSlugs.forEach(slug => {
    const prompt = generatePrompt('products', 'curtain', slug, 'main.jpg');
    promptContent += `- ${slug}/main.jpg: "${prompt}"\n\n`;
  });

  // 블라인드 제품 프롬프트
  promptContent += `[블라인드 제품]\n\n`;
  const blindSlugs = [
    'premium-venetian-collection',
    'modern-vertical-system',
    'smart-roller-collection',
    'elegant-roman-style',
    'contemporary-panel-system',
    'wood-blind',
    'aluminum-blind',
    'fabric-blind'
  ];

  blindSlugs.forEach(slug => {
    const prompt = generatePrompt('products', 'blind', slug, 'main.jpg');
    promptContent += `- ${slug}/main.jpg: "${prompt}"\n\n`;
  });

  // 모터라이즈드 제품 프롬프트
  promptContent += `[모터라이즈드 제품]\n\n`;
  const motorizedSlugs = [
    'smart-curtain-system-pro',
    'motorized-venetian-deluxe',
    'ai-home-integration-suite',
    'voice-control-roller-system',
    'smartphone-vertical-elite',
    'solar-powered-eco-system',
    'smart-home-integration',
    'motorized-curtain-system',
    'motorized-blind-system'
  ];

  motorizedSlugs.forEach(slug => {
    const prompt = generatePrompt('products', 'motorized', slug, 'main.jpg');
    promptContent += `- ${slug}/main.jpg: "${prompt}"\n\n`;
  });

  // 레퍼런스 프로젝트 프롬프트
  promptContent += `[레퍼런스 프로젝트]\n\n`;
  const referenceSlugs = [
    'modern-office-gangnam',
    'minimal-residence-bundang',
    'classic-cafe-hongdae',
    'contemporary-house-goyang',
    'scandinavian-apartment-mapo',
    'industrial-lobby-yongsan',
    'luxury-penthouse-seocho',
    'modern-clinic-seongnam',
    'art-gallery-jongno',
    'luxury-residence-gangnam',
    'modern-office-seoul',
    'boutique-hotel-busan',
    'medical-center-ilsan',
    'university-library-daejeon',
    'premium-apartment-songdo'
  ];

  referenceSlugs.forEach(slug => {
    const prompt = generatePrompt('references', null, slug, 'main.jpg');
    promptContent += `- ${slug}/main.jpg: "${prompt}"\n\n`;
  });

  // 추가 홈페이지 이미지
  promptContent += `[홈페이지 핵심 이미지]\n\n`;
  promptContent += `- curtain-modern-livingroom-1.png: "Modern living room with elegant curtains, Korean interior design, natural lighting, contemporary furniture, 8K resolution, architectural photography --ar 16:10"\n\n`;
  promptContent += `- blind-minimal-bedroom-1.png: "Minimal bedroom with sleek blinds, Scandinavian influence, Korean modern home, soft morning light, clean aesthetic, 8K resolution --ar 16:10"\n\n`;
  promptContent += `- motorized-luxury-office-1/main.png: "Luxury office with motorized window treatments, smart automation, Korean corporate design, professional environment, 8K resolution --ar 16:10"\n\n`;

  // 사용 가이드 추가
  promptContent += `
=== 사용 가이드 ===

1. 각 프롬프트를 Midjourney에 복사하여 사용
2. 필요시 키워드 조정 가능 (색상, 스타일 등)
3. --ar 16:10 비율로 통일 (웹사이트 최적화)
4. --v 6 버전 사용 권장
5. 생성 후 파일명에 맞게 저장

=== 품질 기준 ===

- 해상도: 8K 이상
- 스타일: 건축 다이제스트 수준
- 조명: 자연광 중심
- 구도: 전문 인테리어 사진
- 브랜드: 한국적 감성 + 모던 디자인

=== 우선순위 ===

1. 제품 메인 이미지 (커튼 6개 + 블라인드 8개 + 모터라이즈드 9개)
2. 레퍼런스 프로젝트 메인 (15개)
3. 홈페이지 핵심 이미지 (3개)

총 41개 High Priority 이미지
`;

  return promptContent;
}

// 메인 실행
try {
  const promptContent = generateMidjourneyPrompts();

  // 파일 저장
  fs.writeFileSync('missing-prompts.txt', promptContent, 'utf8');

  console.log('✅ Midjourney 프롬프트 생성 완료!');
  console.log('📄 파일: missing-prompts.txt');
  console.log('📊 총 High Priority 이미지: 41개');
  console.log('\n📋 카테고리별 개수:');
  console.log('  🎨 커튼 제품: 6개');
  console.log('  🎨 블라인드 제품: 8개');
  console.log('  🎨 모터라이즈드 제품: 9개');
  console.log('  🏢 레퍼런스 프로젝트: 15개');
  console.log('  🏠 홈페이지 핵심: 3개');

  console.log('\n💡 다음 단계:');
  console.log('1. missing-prompts.txt 파일 확인');
  console.log('2. Midjourney에서 프롬프트 사용');
  console.log('3. 생성된 이미지를 해당 경로에 저장');
  console.log('4. 파일명 규칙에 맞게 정리');

} catch (error) {
  console.error('❌ 프롬프트 생성 실패:', error.message);
} 