// ================================================================================
// 🎨 KHAKISHOP 갤러리 데이터
// ================================================================================

export interface GalleryItem {
  slug: string;
  title: string;
  description: string;
  category: 'Curtain' | 'Blind' | 'Motorized' | 'Interior' | 'Lifestyle';
  tags: string[];
  mainImage: string;
  images: string[];
  featured: boolean;
  createdAt: string;
  photographer?: string;
  location?: string;
}

export const galleryItems: GalleryItem[] = [
  {
    slug: 'modern-curtain-collection',
    title: 'Modern Curtain Collection',
    description:
      '현대적인 감각의 커튼 컬렉션. 미니멀한 디자인과 기능성을 완벽하게 조화시킨 작품들입니다.',
    category: 'Curtain',
    tags: ['모던', '미니멀', '리넨', '자연광'],
    mainImage: '/images/gallery/modern-curtain-collection/main.jpg',
    images: [
      '/images/gallery/modern-curtain-collection/detail-1.jpg',
      '/images/gallery/modern-curtain-collection/detail-2.jpg',
      '/images/gallery/modern-curtain-collection/detail-3.jpg',
      '/images/gallery/modern-curtain-collection/lifestyle.jpg',
    ],
    featured: true,
    createdAt: '2024-06-15',
    photographer: 'KHAKISHOP Studio',
    location: '스튜디오',
  },
  {
    slug: 'venetian-blind-series',
    title: 'Venetian Blind Series',
    description:
      '베네치안 블라인드의 클래식한 아름다움. 정밀한 빛 조절과 우아한 디자인의 만남입니다.',
    category: 'Blind',
    tags: ['베네치안', '클래식', '알루미늄', '빛조절'],
    mainImage: '/images/gallery/venetian-blind-series/main.jpg',
    images: [
      '/images/gallery/venetian-blind-series/detail-1.jpg',
      '/images/gallery/venetian-blind-series/detail-2.jpg',
      '/images/gallery/venetian-blind-series/installation.jpg',
    ],
    featured: true,
    createdAt: '2024-06-10',
    photographer: 'KHAKISHOP Studio',
    location: '강남 쇼룸',
  },
  {
    slug: 'smart-automation-showcase',
    title: 'Smart Automation Showcase',
    description:
      '스마트 홈 자동화 시스템의 미래. IoT 기술로 구현한 지능형 창호 솔루션입니다.',
    category: 'Motorized',
    tags: ['스마트홈', '자동화', 'IoT', '음성제어'],
    mainImage: '/images/gallery/smart-automation-showcase/main.jpg',
    images: [
      '/images/gallery/smart-automation-showcase/control-panel.jpg',
      '/images/gallery/smart-automation-showcase/app-interface.jpg',
      '/images/gallery/smart-automation-showcase/installation.jpg',
    ],
    featured: true,
    createdAt: '2024-06-05',
    photographer: 'Tech Review',
    location: '분당 스마트홈',
  },
  {
    slug: 'natural-interior-harmony',
    title: 'Natural Interior Harmony',
    description:
      '자연과 조화를 이루는 인테리어 공간. 카키샵의 감성적 접근법이 돋보이는 작품입니다.',
    category: 'Interior',
    tags: ['자연스러움', '조화', '친환경', '웰빙'],
    mainImage: '/images/gallery/natural-interior-harmony/main.jpg',
    images: [
      '/images/gallery/natural-interior-harmony/living-room.jpg',
      '/images/gallery/natural-interior-harmony/bedroom.jpg',
      '/images/gallery/natural-interior-harmony/details.jpg',
    ],
    featured: false,
    createdAt: '2024-05-28',
    photographer: 'Interior Focus',
    location: '용산구 주택',
  },
  {
    slug: 'lifestyle-moments',
    title: 'Lifestyle Moments',
    description:
      '일상 속 특별한 순간들. 카키샵 제품과 함께하는 라이프스타일을 담은 감성적인 이미지들입니다.',
    category: 'Lifestyle',
    tags: ['라이프스타일', '일상', '감성', '편안함'],
    mainImage: '/images/gallery/lifestyle-moments/main.jpg',
    images: [
      '/images/gallery/lifestyle-moments/morning-light.jpg',
      '/images/gallery/lifestyle-moments/evening-mood.jpg',
      '/images/gallery/lifestyle-moments/family-time.jpg',
    ],
    featured: false,
    createdAt: '2024-05-20',
    photographer: 'Lifestyle Studio',
    location: '다양한 공간',
  },
];

// ================================================================================
// 🔍 갤러리 데이터 유틸리티 함수들
// ================================================================================

export const getAllGalleryItems = (): GalleryItem[] => {
  return galleryItems.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getGalleryItemBySlug = (slug: string): GalleryItem | undefined => {
  return galleryItems.find((item) => item.slug === slug);
};

export const getGalleryItemsByCategory = (
  category: GalleryItem['category']
): GalleryItem[] => {
  return galleryItems.filter((item) => item.category === category);
};

export const getFeaturedGalleryItems = (): GalleryItem[] => {
  return galleryItems.filter((item) => item.featured);
};

export const getGalleryItemsByTag = (tag: string): GalleryItem[] => {
  return galleryItems.filter((item) => item.tags.includes(tag));
};

export const getGalleryCategories = (): GalleryItem['category'][] => {
  return ['Curtain', 'Blind', 'Motorized', 'Interior', 'Lifestyle'];
};

export const getAllTags = (): string[] => {
  const allTags = galleryItems.flatMap((item) => item.tags);
  return Array.from(new Set(allTags)).sort();
};
