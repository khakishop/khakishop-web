// src/data/collections.ts

export interface Collection {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  category: 'curtain' | 'blind' | 'motorized' | 'accessory';
}

export const collections: Collection[] = [
  {
    slug: "essential-linen-collection",
    title: "Essential Linen Collection",
    summary: "자연스러운 질감과 우아함을 담은 리넨 커튼 컬렉션. 공간에 따뜻한 감성을 더합니다.",
    description: "고품질 유럽산 리넨으로 제작된 프리미엄 커튼 컬렉션입니다. 자연스러운 주름과 부드러운 질감이 공간에 편안함과 세련미를 동시에 선사합니다. 다양한 중성 톤으로 구성되어 어떤 인테리어 스타일에도 완벽하게 조화됩니다.",
    image: "/collections/essential-linen.jpg",
    category: "curtain"
  },
  {
    slug: "modern-sheer-series",
    title: "Modern Sheer Series",
    summary: "빛을 아름답게 걸러내는 셰어 커튼. 프라이버시와 채광의 완벽한 균형을 제공합니다.",
    description: "최신 기술로 제작된 고급 셰어 원단을 사용하여 자연광을 부드럽게 확산시키면서도 적절한 프라이버시를 보장합니다. 미니멀한 디자인과 뛰어난 기능성으로 현대적인 공간에 최적화되었습니다.",
    image: "/collections/modern-sheer.jpg",
    category: "curtain"
  },
  {
    slug: "venetian-blind-premium",
    title: "Venetian Blind Premium",
    summary: "클래식한 베네치안 블라인드의 현대적 재해석. 정밀한 빛 조절과 세련된 디자인.",
    description: "전통적인 베네치안 블라인드의 우아함을 현대적 감각으로 재해석한 프리미엄 컬렉션입니다. 고품질 알루미늄과 우드 소재로 제작되어 내구성과 미적 완성도를 모두 만족시킵니다.",
    image: "/collections/venetian-premium.jpg",
    category: "blind"
  },
  {
    slug: "wood-texture-blind",
    title: "Wood Texture Blind",
    summary: "자연 목재의 따뜻함을 담은 우드 블라인드. 공간에 자연스러운 포근함을 선사합니다.",
    description: "엄선된 천연 목재로 제작된 우드 블라인드 컬렉션입니다. 각 소재의 고유한 나뭇결과 색상이 공간에 자연스러운 아름다움을 더하며, 뛰어난 단열 효과로 실용성도 겸비했습니다.",
    image: "/collections/wood-texture.jpg",
    category: "blind"
  },
  {
    slug: "smart-automation-system",
    title: "Smart Automation System",
    summary: "미래형 스마트 홈 솔루션. 음성 제어와 스케줄링으로 편리함을 극대화합니다.",
    description: "최첨단 IoT 기술을 적용한 스마트 커튼 및 블라인드 자동화 시스템입니다. 스마트폰 앱, 음성 명령, 일정 설정을 통해 원격으로 제어할 수 있으며, 에너지 효율성과 편의성을 동시에 제공합니다.",
    image: "/collections/smart-automation.jpg",
    category: "motorized"
  },
  {
    slug: "wireless-motor-collection",
    title: "Wireless Motor Collection",
    summary: "무선 전동 시스템으로 깔끔한 설치와 편리한 조작. 선 없는 자유로움을 경험하세요.",
    description: "무선 기술을 적용한 전동 모터 시스템으로 복잡한 배선 없이도 간편하게 설치할 수 있습니다. 조용한 모터 작동과 정밀한 위치 제어로 최고의 사용자 경험을 제공합니다.",
    image: "/collections/wireless-motor.jpg",
    category: "motorized"
  },
  {
    slug: "designer-hardware-set",
    title: "Designer Hardware Set",
    summary: "세련된 커튼 하드웨어 컬렉션. 공간의 완성도를 높이는 디테일의 힘.",
    description: "유명 디자이너가 설계한 프리미엄 커튼 하드웨어 세트입니다. 브러시드 메탈, 매트 블랙, 골드 등 다양한 마감재로 제공되며, 기능성과 미적 완성도를 모두 만족시킵니다.",
    image: "/collections/designer-hardware.jpg",
    category: "accessory"
  },
  {
    slug: "luxury-tie-back-collection",
    title: "Luxury Tie-back Collection",
    summary: "럭셔리 타이백 컬렉션. 커튼의 우아한 드레이프를 완성하는 특별한 액세서리.",
    description: "수작업으로 제작된 프리미엄 타이백 컬렉션입니다. 천연 소재와 세련된 디자인으로 커튼의 아름다운 실루엣을 연출하며, 공간에 고급스러운 포인트를 제공합니다.",
    image: "/collections/luxury-tieback.jpg",
    category: "accessory"
  }
];

// 헬퍼 함수들
export const getAllCollections = (): Collection[] => {
  return collections;
};

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find(collection => collection.slug === slug);
};

export const getCollectionsByCategory = (category: Collection['category']): Collection[] => {
  return collections.filter(collection => collection.category === category);
};

export const getCollectionCategories = (): Collection['category'][] => {
  const categories = Array.from(new Set(collections.map(collection => collection.category)));
  return categories;
};

// 카테고리 한글 변환
export const getCollectionCategoryName = (category: Collection['category']): string => {
  switch (category) {
    case 'curtain': return '커튼';
    case 'blind': return '블라인드';
    case 'motorized': return '전동 시스템';
    case 'accessory': return '액세서리';
    default: return category;
  }
}; 