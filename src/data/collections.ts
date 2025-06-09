// src/data/collections.ts

// ================================================================================
// 🎨 KHAKISHOP 컬렉션 데이터
// ================================================================================

export interface Collection {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  featured?: boolean;
  products?: string[];
  season?: string;
}

export const collections: Collection[] = [
  {
    slug: 'essential-linen',
    title: 'Essential Linen',
    description: '자연스러운 린넨 소재의 기본 컬렉션',
    category: 'Curtain',
    image: '/images/collections/essential-linen.png',
    featured: true,
    products: ['linen-white', 'linen-beige'],
    season: 'All Season'
  },
  {
    slug: 'modern-sheer',
    title: 'Modern Sheer',
    description: '현대적 감각의 쉬어 커튼 컬렉션',
    category: 'Curtain',
    image: '/images/collections/modern-sheer.png',
    featured: true,
    products: ['sheer-curtain'],
    season: 'Spring/Summer'
  },
  {
    slug: 'venetian-premium',
    title: 'Venetian Premium',
    description: '프리미엄 베네치안 블라인드',
    category: 'Blind',
    image: '/images/collections/venetian-premium.png',
    featured: true,
    products: ['wood-blind'],
    season: 'All Season'
  },
  {
    slug: 'wood-texture',
    title: 'Wood Texture',
    description: '자연스러운 우드 텍스처 컬렉션',
    category: 'Blind',
    image: '/images/collections/wood-texture.png',
    featured: false,
    products: ['wood-blind'],
    season: 'Fall/Winter'
  },
  {
    slug: 'smart-automation',
    title: 'Smart Automation',
    description: '스마트 자동화 시스템 컬렉션',
    category: 'Motorized',
    image: '/images/collections/smart-automation.png',
    featured: true,
    products: ['motorized-curtain-system', 'smart-home-integration'],
    season: 'All Season'
  },
  {
    slug: 'wireless-motor',
    title: 'Wireless Motor',
    description: '무선 모터 시스템 컬렉션',
    category: 'Motorized',
    image: '/images/collections/wireless-motor.png',
    featured: false,
    products: ['motorized-blind-system'],
    season: 'All Season'
  },
  {
    slug: 'designer-hardware',
    title: 'Designer Hardware',
    description: '디자이너 하드웨어 컬렉션',
    category: 'Accessories',
    image: '/images/collections/designer-hardware.png',
    featured: false,
    products: [],
    season: 'All Season'
  },
  {
    slug: 'luxury-tieback',
    title: 'Luxury Tieback',
    description: '럭셔리 타이백 컬렉션',
    category: 'Accessories',
    image: '/images/collections/luxury-tieback.png',
    featured: false,
    products: [],
    season: 'All Season'
  }
];

// 컬렉션 관련 유틸리티 함수들
export const getAllCollections = (): Collection[] => collections;

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find(collection => collection.slug === slug);
};

export const getFeaturedCollections = (): Collection[] => {
  return collections.filter(collection => collection.featured);
};

export const getCollectionsByCategory = (category: string): Collection[] => {
  return collections.filter(collection => collection.category === category);
};

export const getCollectionCategories = (): string[] => {
  const categories = collections.map(collection => collection.category);
  return Array.from(new Set(categories));
};

export const getCollectionCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    'Curtain': '커튼',
    'Blind': '블라인드',
    'Motorized': '전동시스템',
    'Accessories': '액세서리'
  };
  return categoryNames[category] || category;
}; 