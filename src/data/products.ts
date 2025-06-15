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
    slug: 'modern-sheer-series',
    title: 'Modern Sheer Series',
    category: 'Curtain',
    description: '현대적인 공간에 완벽한 모던 쉬어 커튼입니다. 부드러운 빛 투과로 프라이버시를 보호하면서도 자연광을 적절히 유입시켜 밝고 쾌적한 실내 환경을 만들어줍니다.',
    image: '/images/curtain/modern-sheer-series/main.jpg',
    features: ['고급 쉬어 원단', '우아한 빛 투과', '프라이버시 보호', '모던 디자인', '쉬운 관리', '내구성 우수'],
    specifications: {
      material: '폴리에스터 쉬어 원단',
      size: '맞춤 제작 가능',
      installation: '전문 측정 및 설치',
    },
    gallery: [
      '/images/curtain/modern-sheer-series/main.jpg',
      '/images/curtain/modern-sheer-series/detail-1.jpg',
      '/images/curtain/modern-sheer-series/detail-2.jpg',
      '/images/curtain/modern-sheer-series/lifestyle.jpg'
    ],
  },
  {
    slug: 'essential-linen-collection',
    title: 'Essential Linen Collection',
    category: 'Curtain',
    description: '천연 리넨 소재로 제작된 에센셜 컬렉션입니다. 자연스러운 질감과 부드러운 드레이프가 공간에 편안함과 세련됨을 더해줍니다.',
    image: '/images/curtain/essential-linen-collection/main.jpg',
    features: ['100% 천연 리넨 소재', '자연스러운 드레이프', '우수한 통기성', '친환경 염료 사용'],
    specifications: {
      material: '프리미엄 벨기에 리넨',
      size: '맞춤 제작 가능',
      installation: '전문 측정 서비스',
    },
    gallery: [
      '/images/curtain/essential-linen-collection/main.jpg',
      '/images/curtain/essential-linen-collection/detail-1.jpg',
      '/images/curtain/essential-linen-collection/detail-2.jpg',
      '/images/curtain/essential-linen-collection/lifestyle.jpg'
    ],
  },
  {
    slug: 'venetian-premium-line',
    title: 'Venetian Premium Line',
    category: 'Curtain',
    description: '베네치안 스타일에서 영감을 받은 프리미엄 커튼 라인입니다. 풍부한 질감과 깊이 있는 색상으로 공간에 고급스러움과 우아함을 선사합니다.',
    image: '/images/curtain/venetian-premium-line/main.jpg',
    features: ['베네치안 스타일 디자인', '프리미엄 원단', '수작업 마감', '풍부한 색감'],
    specifications: {
      material: '이탈리아 수입 원단',
      size: '완전 맞춤 제작',
      installation: '전문 컨설팅',
    },
    gallery: [
      '/images/curtain/venetian-premium-line/main.jpg',
      '/images/curtain/venetian-premium-line/detail-1.jpg',
      '/images/curtain/venetian-premium-line/detail-2.jpg',
      '/images/curtain/venetian-premium-line/lifestyle.jpg'
    ],
  },
  {
    slug: 'wood-texture-natural',
    title: 'Wood Texture Natural',
    category: 'Curtain',
    description: '천연 나무의 질감을 모티브로 한 독특한 텍스처 커튼입니다. 자연친화적인 패턴과 부드러운 촉감으로 공간에 따뜻함과 안정감을 제공합니다.',
    image: '/images/curtain/wood-texture-natural/main.jpg',
    features: ['우드 텍스처 패턴', '자연친화적 디자인', '부드러운 촉감', '북유럽 스타일'],
    specifications: {
      material: '텍스처 가공 원단',
      size: '표준 사이즈',
      installation: '표준 설치',
    },
    gallery: [
      '/images/curtain/wood-texture-natural/main.jpg',
      '/images/curtain/wood-texture-natural/detail-1.jpg',
      '/images/curtain/wood-texture-natural/detail-2.jpg',
      '/images/curtain/wood-texture-natural/lifestyle.jpg'
    ],
  },
  {
    slug: 'smart-automation-series',
    title: 'Smart Automation Series',
    category: 'Curtain',
    description: '최신 IoT 기술이 적용된 스마트 커튼 시스템입니다. 앱으로 제어하거나 음성 명령으로 조작할 수 있으며, 시간에 따른 자동 개폐 기능과 날씨 연동 기능을 제공합니다.',
    image: '/images/curtain/smart-automation-series/main.jpg',
    features: ['스마트폰 앱 제어', '음성 명령 지원', '타이머 기능', '날씨 연동'],
    specifications: {
      material: '스마트 모터',
      size: '맞춤 제작 전용',
      installation: '전문 기술진 설치',
    },
    gallery: [
      '/images/curtain/smart-automation-series/main.jpg',
      '/images/curtain/smart-automation-series/detail-1.jpg',
      '/images/curtain/smart-automation-series/detail-2.jpg',
      '/images/curtain/smart-automation-series/lifestyle.jpg'
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
