// src/data/products.ts

// ================================================================================
// 🎨 KHAKISHOP 제품 데이터
// ================================================================================

export interface Product {
  slug: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  price?: string;
  features?: string[];
  specifications?: {
    material?: string;
    size?: string;
    color?: string;
    installation?: string;
  };
  gallery?: string[];
}

// 커튼 제품 데이터
export const curtainProducts: Product[] = [
  {
    slug: 'sheer-curtain',
    title: 'Sheer Curtain',
    category: 'Curtain',
    description: '자연광을 부드럽게 확산시키는 쉬어 커튼',
    image: '/images/hero/hero.jpg',
    features: ['자연광 조절', '프라이버시 확보', '우아한 드레이프'],
    specifications: {
      material: '폴리에스터 100%',
      size: '맞춤 제작',
      installation: '레일/로드 설치',
    },
    gallery: [
      '/images/hero/hero.jpg',
      '/images/projects/our-projects-bg.jpg',
    ],
  },
  {
    slug: 'classic-curtain',
    title: 'Classic Curtain',
    category: 'Curtain',
    description: '클래식한 감성의 두꺼운 암막 커튼',
    image: '/images/hero/hero.jpg',
    features: ['완전 차광', '방음 효과', '단열 기능'],
    specifications: {
      material: '면 혼방',
      size: '맞춤 제작',
      installation: '레일/로드 설치',
    },
    gallery: ['/images/hero/hero.jpg', '/images/projects/our-projects-bg.jpg'],
  },
  {
    slug: 'modern-curtain',
    title: 'Modern Curtain',
    category: 'Curtain',
    description: '모던한 공간에 어울리는 심플한 커튼',
    image: '/images/hero/hero.jpg',
    features: ['미니멀 디자인', '다양한 컬러', '쉬운 관리'],
    specifications: {
      material: '린넨 혼방',
      size: '맞춤 제작',
      installation: '레일/로드 설치',
    },
    gallery: [
      '/images/hero/hero.jpg',
      '/images/projects/our-projects-bg.jpg',
    ],
  },
  {
    slug: 'linen-white',
    title: 'Linen White',
    category: 'Curtain',
    description: '자연스러운 린넨 소재의 화이트 커튼',
    image: '/images/hero/hero.jpg',
    features: ['천연 린넨', '화이트 컬러', '자연스러운 질감'],
    specifications: {
      material: '린넨 100%',
      size: '맞춤 제작',
      installation: '레일/로드 설치',
    },
    gallery: [
      '/images/hero/hero.jpg',
      '/images/projects/our-projects-bg.jpg',
    ],
  },
  {
    slug: 'pleats-ivory',
    title: 'Pleats Ivory',
    category: 'Curtain',
    description: '우아한 플리츠 디자인의 아이보리 커튼',
    image: '/images/hero/hero.jpg',
    features: ['플리츠 디자인', '아이보리 컬러', '고급스러운 드레이프'],
    specifications: {
      material: '폴리에스터 혼방',
      size: '맞춤 제작',
      installation: '레일/로드 설치',
    },
    gallery: [
      '/images/hero/hero.jpg',
      '/images/projects/our-projects-bg.jpg',
    ],
  },
];

// 블라인드 제품 데이터
export const blindProducts: Product[] = [
  {
    slug: 'wood-blind',
    title: 'Wood Blind',
    category: 'Blind',
    description: '자연스러운 우드 블라인드',
    image: '/images/collections/wood-texture.png',
    features: ['천연 원목', '다양한 색상', '각도 조절'],
    specifications: {
      material: '천연 원목',
      size: '맞춤 제작',
      installation: '벽걸이/천장 설치',
    },
    gallery: [
      '/images/collections/wood-texture.png',
      '/images/collections/venetian-premium.png',
    ],
  },
  {
    slug: 'aluminum-blind',
    title: 'Aluminum Blind',
    category: 'Blind',
    description: '실용적인 알루미늄 블라인드',
    image: '/images/collections/venetian-premium.png',
    features: ['내구성', '방수 기능', '쉬운 청소'],
    specifications: {
      material: '알루미늄',
      size: '맞춤 제작',
      installation: '벽걸이/천장 설치',
    },
    gallery: [
      '/images/collections/venetian-premium.png',
      '/images/collections/wood-texture.png',
    ],
  },
  {
    slug: 'fabric-blind',
    title: 'Fabric Blind',
    category: 'Blind',
    description: '패브릭 소재의 롤러 블라인드',
    image: '/images/hero/hero.jpg',
    features: ['다양한 패턴', '부드러운 질감', '차광 조절'],
    specifications: {
      material: '폴리에스터',
      size: '맞춤 제작',
      installation: '벽걸이/천장 설치',
    },
    gallery: ['/images/hero/hero.jpg', '/images/projects/our-projects-bg.jpg'],
  },
];

// 전동 제품 데이터
export const motorizedProducts: Product[] = [
  {
    slug: 'motorized-curtain-system',
    title: 'Motorized Curtain System',
    category: 'Motorized',
    description: '스마트한 전동 커튼 시스템',
    image: '/images/collections/smart-automation.png',
    features: ['스마트 컨트롤', '무선 리모컨', '스케줄 설정'],
    specifications: {
      material: '모터 시스템',
      size: '맞춤 제작',
      installation: '전문 설치',
    },
    gallery: [
      '/images/collections/smart-automation.png',
      '/images/collections/wireless-motor.png',
    ],
  },
  {
    slug: 'motorized-blind-system',
    title: 'Motorized Blind System',
    category: 'Motorized',
    description: '자동화된 블라인드 시스템',
    image: '/images/collections/wireless-motor.png',
    features: ['자동 개폐', '타이머 기능', '앱 연동'],
    specifications: {
      material: '모터 시스템',
      size: '맞춤 제작',
      installation: '전문 설치',
    },
    gallery: [
      '/images/collections/wireless-motor.png',
      '/images/collections/smart-automation.png',
    ],
  },
  {
    slug: 'smart-home-integration',
    title: 'Smart Home Integration',
    category: 'Motorized',
    description: '스마트홈 통합 솔루션',
    image: '/images/collections/designer-hardware.png',
    features: ['AI 음성 제어', '앱 통합', 'IoT 연동'],
    specifications: {
      material: '통합 시스템',
      size: '맞춤 제작',
      installation: '전문 설치',
    },
    gallery: [
      '/images/collections/designer-hardware.png',
      '/images/collections/luxury-tieback.png',
    ],
  },
];

// 모든 제품 데이터
export const allProducts: Product[] = [
  ...curtainProducts,
  ...blindProducts,
  ...motorizedProducts,
];

// 제품 관련 유틸리티 함수들
export const getAllProducts = (): Product[] => allProducts;

export const getProductBySlug = (slug: string): Product | undefined => {
  return allProducts.find((product) => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return allProducts.filter((product) => product.category === category);
};

export const getFeaturedProducts = (limit: number = 6): Product[] => {
  return allProducts.slice(0, limit);
};
