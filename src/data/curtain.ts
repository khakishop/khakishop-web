// ================================================================================
// 🪟 KHAKISHOP 커튼 제품 데이터 - RIGAS 스타일 통일
// ================================================================================
// 🎨 디자인 모티브: https://www.rigas-furniture.gr/
// 📁 이미지 경로: /public/images/curtains/[slug]/
// 🔧 관리자 연동: displayOrder 드래그앤드롭 지원

// 🎯 통일된 Product interface
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'curtains';
  subcategory?: string;
  displayOrder?: number;
  features?: string[];
  materials?: string[];
  sizes?: string[];
  colors?: string[];
  price?: {
    from: number;
    to?: number;
    currency: string;
    unit?: string;
  };
  installation?: string[];
  care?: string[];
  warranty?: string;
  bestseller?: boolean;
  new?: boolean;
  gallery?: string[];
}

// 🏷️ 커튼 서브카테고리 정의
export const curtainSubcategories = [
  'Essential Linen',
  'Modern Sheer', 
  'Venetian Premium',
  'Wood Texture',
  'Custom Solution'
] as const;

// 🎯 커튼 제품 데이터 - RIGAS 스타일
export const curtainProducts: Product[] = [
  {
    id: 'cur-001',
    slug: 'essential-linen-collection',
    title: 'Essential Linen Collection',
    description: '천연 리넨 소재로 제작된 에센셜 컬렉션입니다. 자연스러운 질감과 부드러운 드레이프가 공간에 편안함과 세련됨을 더해줍니다.',
    image: '/images/curtains/essential-linen-collection/main.jpg',
    category: 'curtains',
    subcategory: 'Essential Linen',
    displayOrder: 1,
    features: [
      '100% 천연 리넨 소재',
      '자연스러운 드레이프',
      '우수한 통기성',
      '친환경 염료 사용',
      '세탁 가능',
      '다양한 컬러 옵션'
    ],
    materials: ['프리미엄 벨기에 리넨', '천연 염료', '무소음 레일 시스템', '스테인리스 고리'],
    sizes: ['Width: 100-300cm', 'Height: 160-280cm', '맞춤 제작 가능'],
    colors: ['Natural Beige', 'Soft Grey', 'Warm White', 'Sage Green', 'Dusty Pink'],
    price: {
      from: 89000,
      to: 189000,
      currency: 'KRW',
      unit: '평'
    },
    installation: ['전문 측정 서비스', '무료 설치', 'A/S 1년'],
    care: ['30도 물세탁 가능', '자연 건조 권장', '다림질 중온'],
    warranty: '제품 하자 1년 보증',
    bestseller: true,
    gallery: [
      '/images/curtains/essential-linen-collection/main.jpg',
      '/images/curtains/essential-linen-collection/detail-1.jpg',
      '/images/curtains/essential-linen-collection/detail-2.jpg',
      '/images/curtains/essential-linen-collection/lifestyle.jpg'
    ]
  },
  {
    id: 'cur-002',
    slug: 'modern-sheer-series',
    title: 'Modern Sheer Series',
    description: '현대적인 공간에 완벽한 모던 쉬어 커튼입니다. 부드러운 빛 투과로 프라이버시를 보호하면서도 자연광을 적절히 유입시켜 밝고 쾌적한 실내 환경을 만들어줍니다.',
    image: '/images/curtains/modern-sheer-series/main.jpg',
    category: 'curtains',
    subcategory: 'Modern Sheer',
    displayOrder: 2,
    features: [
      '고급 쉬어 원단',
      '우아한 빛 투과',
      '프라이버시 보호',
      '모던 디자인',
      '쉬운 관리',
      '내구성 우수'
    ],
    materials: ['폴리에스터 쉬어 원단', '은사 라인', '메탈 레일', '소음 방지 링'],
    sizes: ['Width: 120-280cm', 'Height: 180-300cm', '맞춤 제작 가능'],
    colors: ['Pure White', 'Ivory', 'Light Grey', 'Champagne', 'Pearl'],
    price: {
      from: 69000,
      to: 149000,
      currency: 'KRW',
      unit: '평'
    },
    installation: ['전문 측정', '당일 설치', 'A/S 6개월'],
    care: ['기계 세탁 가능', '저온 건조', '다림질 저온'],
    warranty: '6개월 품질보증',
    new: true,
    gallery: [
      '/images/curtains/modern-sheer-series/main.jpg',
      '/images/curtains/modern-sheer-series/detail-1.jpg',
      '/images/curtains/modern-sheer-series/detail-2.jpg',
      '/images/curtains/modern-sheer-series/lifestyle.jpg'
    ]
  },
  {
    id: 'cur-003',
    slug: 'venetian-premium-line',
    title: 'Venetian Premium Line',
    description: '베네치안 스타일에서 영감을 받은 프리미엄 커튼 라인입니다. 풍부한 질감과 깊이 있는 색상으로 공간에 고급스러움과 우아함을 선사합니다.',
    image: '/images/curtains/venetian-premium-line/main.jpg',
    category: 'curtains',
    subcategory: 'Venetian Premium',
    displayOrder: 3,
    features: [
      '베네치안 스타일 디자인',
      '프리미엄 원단',
      '수작업 마감',
      '풍부한 색감',
      '완벽한 차광',
      '럭셔리 피니시'
    ],
    materials: ['이탈리아 수입 원단', '24K 금사 장식', '수작업 태슬', '프리미엄 브라스 액세서리'],
    sizes: ['Width: 150-350cm', 'Height: 200-350cm', '완전 맞춤 제작'],
    colors: ['Deep Burgundy', 'Royal Navy', 'Forest Green', 'Antique Gold', 'Midnight Black'],
    price: {
      from: 189000,
      to: 389000,
      currency: 'KRW',
      unit: '평'
    },
    installation: ['전문 컨설팅', '프리미엄 설치', '평생 A/S'],
    care: ['드라이클리닝 전용', '전문 관리 서비스', '정기 점검'],
    warranty: '3년 품질보증 + 평생 A/S',
    bestseller: true,
    gallery: [
      '/images/curtains/venetian-premium-line/main.jpg',
      '/images/curtains/venetian-premium-line/detail-1.jpg',
      '/images/curtains/venetian-premium-line/detail-2.jpg',
      '/images/curtains/venetian-premium-line/lifestyle.jpg'
    ]
  },
  {
    id: 'cur-004',
    slug: 'wood-texture-natural',
    title: 'Wood Texture Natural',
    description: '천연 나무의 질감을 모티브로 한 독특한 텍스처 커튼입니다. 자연친화적인 패턴과 부드러운 촉감으로 공간에 따뜻함과 안정감을 제공합니다.',
    image: '/images/curtains/wood-texture-natural/main.jpg',
    category: 'curtains',
    subcategory: 'Wood Texture',
    displayOrder: 4,
    features: [
      '우드 텍스처 패턴',
      '자연친화적 디자인',
      '부드러운 촉감',
      '북유럽 스타일',
      '따뜻한 색감',
      '친환경 소재'
    ],
    materials: ['텍스처 가공 원단', '천연 목재 패턴', '친환경 염료', '우드 액세서리'],
    sizes: ['Width: 100-250cm', 'Height: 160-250cm', '표준 사이즈'],
    colors: ['Natural Oak', 'Walnut Brown', 'Pine Light', 'Cherry Red', 'Ash Grey'],
    price: {
      from: 99000,
      to: 199000,
      currency: 'KRW',
      unit: '평'
    },
    installation: ['표준 설치', '측정 서비스', 'A/S 1년'],
    care: ['드라이클리닝 권장', '직사광선 피함', '습기 주의'],
    warranty: '1년 제품보증',
    gallery: [
      '/images/curtains/wood-texture-natural/main.jpg',
      '/images/curtains/wood-texture-natural/detail-1.jpg',
      '/images/curtains/wood-texture-natural/detail-2.jpg',
      '/images/curtains/wood-texture-natural/lifestyle.jpg'
    ]
  },
  {
    id: 'cur-005',
    slug: 'smart-automation-series',
    title: 'Smart Automation Series',
    description: '최신 IoT 기술이 적용된 스마트 커튼 시스템입니다. 앱으로 제어하거나 음성 명령으로 조작할 수 있으며, 시간에 따른 자동 개폐 기능과 날씨 연동 기능을 제공합니다.',
    image: '/images/curtains/smart-automation-series/main.jpg',
    category: 'curtains',
    subcategory: 'Custom Solution',
    displayOrder: 5,
    features: [
      '스마트폰 앱 제어',
      '음성 명령 지원',
      '타이머 기능',
      '날씨 연동',
      '에너지 절약',
      '원격 제어'
    ],
    materials: ['스마트 모터', '고급 원단', 'IoT 센서', '무선 컨트롤러'],
    sizes: ['맞춤 제작 전용'],
    colors: ['Smart White', 'Tech Grey', 'Future Black'],
    price: {
      from: 299000,
      to: 599000,
      currency: 'KRW',
      unit: '평'
    },
    installation: ['전문 기술진 설치', '스마트 설정', '평생 기술지원'],
    care: ['전문 관리 서비스', '정기 소프트웨어 업데이트'],
    warranty: '5년 품질보증 + 평생 기술지원',
    new: true,
    gallery: [
      '/images/curtains/smart-automation-series/main.jpg',
      '/images/curtains/smart-automation-series/detail-1.jpg',
      '/images/curtains/smart-automation-series/detail-2.jpg',
      '/images/curtains/smart-automation-series/lifestyle.jpg'
    ]
  }
];

// 🔧 유틸리티 함수들
export const getAllCurtainProducts = (): Product[] => {
  return curtainProducts.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
};

export const getCurtainProductBySlug = (slug: string): Product | undefined => {
  return curtainProducts.find(product => product.slug === slug);
};

export const getCurtainProductsBySubcategory = (subcategory: string): Product[] => {
  return curtainProducts.filter(product => product.subcategory === subcategory);
};

export const getBestsellerCurtainProducts = (): Product[] => {
  return curtainProducts.filter(product => product.bestseller);
};

export const getNewCurtainProducts = (): Product[] => {
  return curtainProducts.filter(product => product.new);
};

export const getCurtainSubcategories = (): readonly string[] => {
  return curtainSubcategories;
};

// ================================================================================
// 🔧 추가 Export 함수들 (기존 코드 호환성용)
// ================================================================================

/**
 * 커튼 카테고리별 제품 조회 (기존 코드 호환성용)
 */
export const getCurtainProductsByCategory = (category: string): Product[] => {
  return getCurtainProductsBySubcategory(category);
};

/**
 * 커튼 카테고리 목록 조회 (기존 코드 호환성용)
 */
export const getCurtainCategories = (): readonly string[] => {
  return curtainSubcategories;
}; 