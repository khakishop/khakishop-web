// ================================================================================
// 🎯 KHAKISHOP 블라인드 제품 데이터 - RIGAS 스타일 통일
// ================================================================================
// 🎨 디자인 모티브: https://www.rigas-furniture.gr/
// 📁 이미지 경로: /public/images/blinds/[slug]/
// 🔧 관리자 연동: displayOrder 드래그앤드롭 지원

// 🎯 통일된 Product interface
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'blinds';
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

// 🏷️ 블라인드 서브카테고리 정의
export const blindSubcategories = [
  'Venetian Blinds',
  'Vertical Blinds',
  'Roller Blinds',
  'Roman Blinds',
  'Panel Blinds'
] as const;

// 🎯 블라인드 제품 데이터 - RIGAS 스타일
export const blindProducts: Product[] = [
  {
    id: 'bld-001',
    slug: 'premium-venetian-collection',
    title: '프리미엄 베네치안 컬렉션',
    description: '고급 알루미늄 소재의 베네치안 블라인드로 정밀한 빛 조절과 내구성을 제공합니다.',
    image: '/images/blinds/premium-venetian-collection/main.jpg',
    category: 'blinds',
    subcategory: 'Venetian Blinds',
    displayOrder: 1,
    features: [
      '25mm 고급 알루미늄 슬랫',
      '정밀 틸트 조절 시스템',
      '무소음 코드 시스템',
      '자외선 차단 코팅',
      '정전기 방지 처리'
    ],
    materials: ['프리미엄 알루미늄', '스테인리스 스틸', '내구성 플라스틱'],
    sizes: ['60x120cm', '80x150cm', '100x180cm', '맞춤 제작'],
    colors: ['실버', '화이트', '그레이', '베이지', '블랙'],
    price: {
      from: 89000,
      currency: 'KRW'
    },
    installation: [
      '천장 또는 벽면 브라켓 설치',
      '전문 기사 방문 설치',
      '설치 후 동작 테스트'
    ],
    care: [
      '부드러운 브러시로 먼지 제거',
      '중성 세제로 슬랫 청소',
      '직사광선 장시간 노출 피하기'
    ],
    warranty: '2년 품질보증 (부품 교체 포함)',
    bestseller: true,
    gallery: [
      '/images/blinds/premium-venetian-collection/main.jpg',
      '/images/blinds/premium-venetian-collection/detail-1.jpg',
      '/images/blinds/premium-venetian-collection/detail-2.jpg',
      '/images/blinds/premium-venetian-collection/lifestyle.jpg'
    ]
  },
  {
    id: 'bld-002',
    slug: 'modern-vertical-system',
    title: '모던 버티컬 시스템',
    description: '세련된 수직 블라인드로 넓은 창문과 슬라이딩 도어에 완벽한 솔루션을 제공합니다.',
    image: '/images/blinds/modern-vertical-system/main.jpg',
    category: 'blinds',
    subcategory: 'Vertical Blinds',
    displayOrder: 2,
    features: [
      '127mm 와이드 루버',
      '매끄러운 슬라이딩 시스템',
      '원터치 회전 조절',
      '체인 또는 완드 조작',
      '바닥 고정 체인 포함'
    ],
    materials: ['폴리에스터 패브릭', 'PVC 루버', '알루미늄 헤드레일'],
    sizes: ['150x200cm', '200x220cm', '250x240cm', '맞춤 제작'],
    colors: ['아이보리', '베이지', '그레이', '네이비', '브라운'],
    price: {
      from: 125000,
      currency: 'KRW'
    },
    installation: [
      '헤드레일 천장 고정',
      '루버 높이 조절',
      '바닥 체인 고정'
    ],
    care: [
      '정기적인 진공청소',
      '물걸레질 (PVC 루버)',
      '패브릭 드라이클리닝'
    ],
    warranty: '3년 품질보증 (헤드레일 포함)',
    new: true,
    gallery: [
      '/images/blinds/modern-vertical-system/main.jpg',
      '/images/blinds/modern-vertical-system/detail-1.jpg',
      '/images/blinds/modern-vertical-system/detail-2.jpg',
      '/images/blinds/modern-vertical-system/lifestyle.jpg'
    ]
  },
  {
    id: 'bld-003',
    slug: 'smart-roller-collection',
    title: '스마트 롤러 컬렉션',
    description: '모터라이즈드 시스템과 다양한 원단 옵션을 제공하는 현대적인 롤러 블라인드입니다.',
    image: '/images/blinds/smart-roller-collection/main.jpg',
    category: 'blinds',
    subcategory: 'Roller Blinds',
    displayOrder: 3,
    features: [
      '모터라이즈드 시스템',
      '리모컨 및 앱 제어',
      '다양한 투과도 원단',
      '채광 조절 기능',
      '타이머 설정 가능'
    ],
    materials: ['폴리에스터 원단', '알루미늄 튜브', '스마트 모터'],
    sizes: ['80x150cm', '120x180cm', '150x200cm', '맞춤 제작'],
    colors: ['화이트', '크림', '그레이', '블루', '그린'],
    price: {
      from: 195000,
      currency: 'KRW'
    },
    installation: [
      '전동 모터 설치',
      '전원 연결 작업',
      '앱 페어링 설정'
    ],
    care: [
      '부드러운 브러시 사용',
      '모터 부분 물기 주의',
      '정기 점검 서비스'
    ],
    warranty: '5년 품질보증 (모터 포함)',
    bestseller: true,
    new: true,
    gallery: [
      '/images/blinds/smart-roller-collection/main.jpg',
      '/images/blinds/smart-roller-collection/detail-1.jpg',
      '/images/blinds/smart-roller-collection/detail-2.jpg',
      '/images/blinds/smart-roller-collection/lifestyle.jpg'
    ]
  },
  {
    id: 'bld-004',
    slug: 'elegant-roman-style',
    title: '엘레강트 로만 스타일',
    description: '클래식한 로만 블라인드로 우아한 주름과 고급스러운 분위기를 연출합니다.',
    image: '/images/blinds/elegant-roman-style/main.jpg',
    category: 'blinds',
    subcategory: 'Roman Blinds',
    displayOrder: 4,
    features: [
      '자연스러운 주름 라인',
      '고급 패브릭 소재',
      '코드락 시스템',
      '맞춤 패턴 제작',
      '내측 차광 라이닝'
    ],
    materials: ['린넨 블렌드', '코튼 패브릭', '차광 라이닝'],
    sizes: ['70x130cm', '90x150cm', '110x170cm', '맞춤 제작'],
    colors: ['내추럴', '베이지', '그레이', '네이비', '와인'],
    price: {
      from: 145000,
      currency: 'KRW'
    },
    installation: [
      '상부 브라켓 고정',
      '로드 설치',
      '주름 조절'
    ],
    care: [
      '정기적인 진공청소',
      '전문 드라이클리닝',
      '직사광선 주의'
    ],
    warranty: '2년 품질보증 (패브릭 포함)',
    gallery: [
      '/images/blinds/elegant-roman-style/main.jpg',
      '/images/blinds/elegant-roman-style/detail-1.jpg',
      '/images/blinds/elegant-roman-style/detail-2.jpg',
      '/images/blinds/elegant-roman-style/lifestyle.jpg'
    ]
  },
  {
    id: 'bld-005',
    slug: 'contemporary-panel-system',
    title: '컨템포러리 패널 시스템',
    description: '대형 창문과 공간 분할을 위한 모던한 패널 블라인드 시스템입니다.',
    image: '/images/blinds/contemporary-panel-system/main.jpg',
    category: 'blinds',
    subcategory: 'Panel Blinds',
    displayOrder: 5,
    features: [
      '대형 패널 설계',
      '슬라이딩 트랙 시스템',
      '공간 분할 기능',
      '모던 미니멀 디자인',
      '맞춤 제작'
    ],
    materials: ['프리미엄 패브릭', '알루미늄 트랙', '스테인리스 액세서리'],
    sizes: ['200x250cm', '250x280cm', '300x300cm', '맞춤 제작'],
    colors: ['화이트', '그레이', '블랙', '베이지', '네이비'],
    price: {
      from: 175000,
      currency: 'KRW'
    },
    installation: [
      '천장 트랙 설치',
      '패널 높이 조절',
      '동작 테스트'
    ],
    care: [
      '정기적인 진공청소',
      '패브릭 드라이클리닝',
      '트랙 윤활 관리'
    ],
    warranty: '3년 품질보증 (트랙 시스템 포함)',
    gallery: [
      '/images/blinds/contemporary-panel-system/main.jpg',
      '/images/blinds/contemporary-panel-system/detail-1.jpg',
      '/images/blinds/contemporary-panel-system/detail-2.jpg',
      '/images/blinds/contemporary-panel-system/lifestyle.jpg'
    ]
  }
];

// 🔧 유틸리티 함수들
export const getAllBlindProducts = (): Product[] => {
  return blindProducts.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
};

export const getBlindProductBySlug = (slug: string): Product | undefined => {
  return blindProducts.find(product => product.slug === slug);
};

export const getBlindProductsBySubcategory = (subcategory: string): Product[] => {
  return blindProducts.filter(product => product.subcategory === subcategory);
};

export const getBestsellerBlindProducts = (): Product[] => {
  return blindProducts.filter(product => product.bestseller);
};

export const getNewBlindProducts = (): Product[] => {
  return blindProducts.filter(product => product.new);
};

export const getBlindSubcategories = (): readonly string[] => {
  return blindSubcategories;
};

// ================================================================================
// 🔧 추가 Export 함수들 (기존 코드 호환성용)
// ================================================================================

/**
 * 블라인드 카테고리 정보 조회 (기존 코드 호환성용)
 */
export const blindCategories = blindSubcategories;

/**
 * 카테고리별 블라인드 제품 조회 (기존 코드 호환성용)
 */
export const getBlindProductsByCategory = (category: string): Product[] => {
  return getBlindProductsBySubcategory(category);
};

/**
 * 블라인드 카테고리 목록 조회 (기존 코드 호환성용)
 */
export const getBlindCategories = (): readonly string[] => {
  return blindSubcategories;
}; 