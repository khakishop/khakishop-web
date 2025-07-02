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

// Product 인터페이스 추가 - CollectionPageClient.tsx에서 사용
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  image: string;
  price?: {
    from: number;
    to?: number;
    unit?: string;
  };
  bestseller?: boolean;
  new?: boolean;
  featured?: boolean;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  features?: string[];
  installation?: string;
  care?: string;
  warranty?: string;
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
    season: 'All Season',
  },
  {
    slug: 'modern-sheer',
    title: 'Modern Sheer',
    description: '현대적 감각의 쉬어 커튼 컬렉션',
    category: 'Curtain',
    image: '/images/collections/modern-sheer.png',
    featured: true,
    products: ['sheer-curtain'],
    season: 'Spring/Summer',
  },
  {
    slug: 'venetian-premium',
    title: 'Venetian Premium',
    description: '프리미엄 베네치안 블라인드',
    category: 'Blind',
    image: '/images/collections/venetian-premium.png',
    featured: true,
    products: ['wood-blind'],
    season: 'All Season',
  },
  {
    slug: 'wood-texture',
    title: 'Wood Texture',
    description: '자연스러운 우드 텍스처 컬렉션',
    category: 'Blind',
    image: '/images/collections/wood-texture.png',
    featured: false,
    products: ['wood-blind'],
    season: 'Fall/Winter',
  },
  {
    slug: 'smart-automation',
    title: 'Smart Automation',
    description: '스마트 자동화 시스템 컬렉션',
    category: 'Motorized',
    image: '/images/collections/smart-automation.png',
    featured: true,
    products: ['motorized-curtain-system', 'smart-home-integration'],
    season: 'All Season',
  },
  {
    slug: 'wireless-motor',
    title: 'Wireless Motor',
    description: '무선 모터 시스템 컬렉션',
    category: 'Motorized',
    image: '/images/collections/wireless-motor.png',
    featured: false,
    products: ['motorized-blind-system'],
    season: 'All Season',
  },
  {
    slug: 'designer-hardware',
    title: 'Designer Hardware',
    description: '디자이너 하드웨어 컬렉션',
    category: 'Accessories',
    image: '/images/collections/designer-hardware.png',
    featured: false,
    products: [],
    season: 'All Season',
  },
  {
    slug: 'luxury-tieback',
    title: 'Luxury Tieback',
    description: '럭셔리 타이백 컬렉션',
    category: 'Accessories',
    image: '/images/collections/luxury-tieback.png',
    featured: false,
    products: [],
    season: 'All Season',
  },
];

// Product 데이터 배열 - collections 데이터를 Product 형태로 변환
export const collectionProducts: Product[] = collections.map(
  (collection, index) => ({
    id: `collection-${index + 1}`,
    slug: collection.slug,
    title: collection.title,
    description: collection.description,
    category: collection.category,
    subcategory: getSubcategoryByCategory(collection.category),
    image: collection.image,
    price: {
      from: getPriceByCategory(collection.category),
      to: getPriceByCategory(collection.category) + 50000,
      unit: '평방미터',
    },
    bestseller: collection.featured,
    new: false,
    featured: collection.featured,
    sizes: ['소형', '중형', '대형', '맞춤형'],
    colors: ['화이트', '베이지', '그레이', '브라운'],
    materials: getMaterialsByCategory(collection.category),
    features: getFeaturesByCategory(collection.category),
    installation: '전문 설치 서비스 제공',
    care: '정기적인 청소 및 관리 권장',
    warranty: '2년 품질보증',
  })
);

// 헬퍼 함수들
function getSubcategoryByCategory(category: string): string {
  const subcategoryMap: { [key: string]: string } = {
    Curtain: 'Essential Collection',
    Blind: 'Premium Collection',
    Motorized: 'Smart Collection',
    Accessories: 'Designer Collection',
  };
  return subcategoryMap[category] || 'Standard Collection';
}

function getPriceByCategory(category: string): number {
  const priceMap: { [key: string]: number } = {
    Curtain: 150000,
    Blind: 200000,
    Motorized: 350000,
    Accessories: 80000,
  };
  return priceMap[category] || 100000;
}

function getMaterialsByCategory(category: string): string[] {
  const materialMap: { [key: string]: string[] } = {
    Curtain: ['린넨', '실크', '코튼', '폴리에스터'],
    Blind: ['우드', '알루미늄', 'PVC', '패브릭'],
    Motorized: ['프리미엄 소재', '모터 시스템', '스마트 컨트롤'],
    Accessories: ['메탈', '우드', '크리스탈', '패브릭'],
  };
  return materialMap[category] || ['표준 소재'];
}

function getFeaturesByCategory(category: string): string[] {
  const featureMap: { [key: string]: string[] } = {
    Curtain: ['차광 기능', '방염 처리', '세탁 가능', '맞춤 제작'],
    Blind: ['정밀 조절', '내구성', '먼지 방지', '쉬운 청소'],
    Motorized: ['원격 제어', '타이머 설정', '스마트홈 연동', '조용한 작동'],
    Accessories: ['고급스러운 디자인', '내구성', '쉬운 설치', '다양한 스타일'],
  };
  return featureMap[category] || ['기본 기능'];
}

// 컬렉션 관련 유틸리티 함수들
export const getAllCollections = (): Collection[] => collections;

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find((collection) => collection.slug === slug);
};

export const getFeaturedCollections = (): Collection[] => {
  return collections.filter((collection) => collection.featured);
};

export const getCollectionsByCategory = (category: string): Collection[] => {
  return collections.filter((collection) => collection.category === category);
};

export const getCollectionCategories = (): string[] => {
  const categories = collections.map((collection) => collection.category);
  return Array.from(new Set(categories));
};

// ✅ 누락된 함수 추가: getCollectionSubcategories
export const getCollectionSubcategories = (): string[] => {
  const subcategories = collectionProducts
    .map((product) => product.subcategory)
    .filter(Boolean);
  return Array.from(new Set(subcategories)) as string[];
};

// ✅ Product 관련 유틸리티 함수들 추가
export const getAllCollectionProducts = (): Product[] => collectionProducts;

export const getCollectionProductBySlug = (
  slug: string
): Product | undefined => {
  return collectionProducts.find((product) => product.slug === slug);
};

export const getCollectionProductsBySubcategory = (
  subcategory: string
): Product[] => {
  return collectionProducts.filter(
    (product) => product.subcategory === subcategory
  );
};

export const getCollectionCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    Curtain: '커튼',
    Blind: '블라인드',
    Motorized: '전동시스템',
    Accessories: '액세서리',
  };
  return categoryNames[category] || category;
};
