// ================================================================================
// 🎯 KHAKISHOP 통합 카테고리 시스템
// ================================================================================
// 🔄 목적: 모든 카테고리 정의를 단일 소스로 통합 관리

export interface CategoryConfig {
  key: string;
  priority: number;
  icon: string;
  folderName: string;
  displayName: string;
  description: string;
}

// 🎯 마스터 카테고리 정의 (단일 소스)
export const MASTER_CATEGORIES: CategoryConfig[] = [
  {
    key: 'hero',
    priority: 1,
    icon: '🌟',
    folderName: 'hero',
    displayName: 'Hero',
    description: '메인 히어로 이미지'
  },
  {
    key: 'landing',
    priority: 1,
    icon: '🏠',
    folderName: 'landing',
    displayName: 'Landing',
    description: '랜딩 페이지 이미지'
  },
  {
    key: 'projects',
    priority: 2,
    icon: '🏗️',
    folderName: 'projects',
    displayName: 'Projects',
    description: '프로젝트 쇼케이스'
  },
  {
    key: 'collections',
    priority: 3,
    icon: '🎨',
    folderName: 'collections',
    displayName: 'Collections',
    description: '감성 컬렉션'
  },
  {
    key: 'references',
    priority: 4,
    icon: '🏢',
    folderName: 'references',
    displayName: 'References',
    description: '시공 사례'
  },
  {
    key: 'products',
    priority: 5,
    icon: '🛍️',
    folderName: 'products',
    displayName: 'Products',
    description: '제품 이미지'
  },
  {
    key: 'gallery',
    priority: 6,
    icon: '🖼️',
    folderName: 'gallery',
    displayName: 'Gallery',
    description: '갤러리 이미지'
  },
  {
    key: 'blog',
    priority: 7,
    icon: '📝',
    folderName: 'blog',
    displayName: 'Blog',
    description: '블로그 이미지'
  },
  {
    key: 'about',
    priority: 8,
    icon: '👥',
    folderName: 'about',
    displayName: 'About',
    description: '회사 소개'
  },
  {
    key: 'future',
    priority: 9,
    icon: '🚀',
    folderName: 'future',
    displayName: 'Future',
    description: '미래 계획'
  }
];

// 🎨 카테고리별 메타데이터 템플릿
export const CATEGORY_METADATA_TEMPLATES: Record<string, {
  altPrefix: string;
  titlePrefix: string;
  dataStyle: string;
}> = {
  hero: {
    altPrefix: 'khaki shop',
    titlePrefix: '감성적인 텍스타일 브랜드 khaki shop',
    dataStyle: 'hero-elegant'
  },
  landing: {
    altPrefix: 'khaki shop 홈페이지',
    titlePrefix: '공간을 완성하는 텍스타일',
    dataStyle: 'landing-warm'
  },
  projects: {
    altPrefix: 'khaki shop 프로젝트',
    titlePrefix: '완성된 공간들',
    dataStyle: 'project-showcase'
  },
  collections: {
    altPrefix: 'khaki shop 컬렉션',
    titlePrefix: '감성 컬렉션',
    dataStyle: 'collection-curated'
  },
  references: {
    altPrefix: 'khaki shop 시공 사례',
    titlePrefix: '실제 시공 사례',
    dataStyle: 'reference-proven'
  },
  products: {
    altPrefix: 'khaki shop 제품',
    titlePrefix: '품질 제품',
    dataStyle: 'product-quality'
  },
  gallery: {
    altPrefix: 'khaki shop 갤러리',
    titlePrefix: '갤러리 이미지',
    dataStyle: 'gallery-aesthetic'
  },
  blog: {
    altPrefix: 'khaki shop 블로그',
    titlePrefix: '인사이트 & 팁',
    dataStyle: 'blog-informative'
  },
  about: {
    altPrefix: 'khaki shop 소개',
    titlePrefix: '브랜드 스토리',
    dataStyle: 'about-authentic'
  },
  future: {
    altPrefix: 'khaki shop 미래 계획',
    titlePrefix: '앞으로의 비전',
    dataStyle: 'future-vision'
  }
};

// 🔧 헬퍼 함수들
export const getCategoryByKey = (key: string): CategoryConfig | undefined => {
  return MASTER_CATEGORIES.find(cat => cat.key === key);
};

export const getCategoryPriority = (key: string): number => {
  return getCategoryByKey(key)?.priority || 6;
};

export const getCategoryIcon = (key: string): string => {
  return getCategoryByKey(key)?.icon || '📷';
};

export const getCategoryFolderName = (key: string): string => {
  return getCategoryByKey(key)?.folderName || key;
};

export const getAllCategoryKeys = (): string[] => {
  return MASTER_CATEGORIES.map(cat => cat.key);
};

export const getAllCategoryFolders = (): string[] => {
  return MASTER_CATEGORIES.map(cat => cat.folderName);
};

export const getCategoryDisplayName = (key: string): string => {
  return getCategoryByKey(key)?.displayName || key;
};

// 🎯 드롭다운용 옵션 생성
export const getCategoryOptions = (includeAll: boolean = false) => {
  const options = MASTER_CATEGORIES.map(cat => ({
    value: cat.key,
    label: `${cat.icon} ${cat.displayName}`,
    description: cat.description
  }));

  if (includeAll) {
    return [{ value: 'all', label: '🌐 모든 카테고리', description: '전체 카테고리' }, ...options];
  }

  return options;
};

// 🎯 카테고리 검증 및 추천 기능
export const validateCategoryUsage = (actualCategories: string[]) => {
  const definedCategories = getAllCategoryKeys();
  const unusedCategories = definedCategories.filter(cat => !actualCategories.includes(cat));
  const undefinedCategories = actualCategories.filter(cat => !definedCategories.includes(cat));
  
  return {
    defined: definedCategories,
    actual: actualCategories,
    unused: unusedCategories,
    undefined: undefinedCategories,
    coverage: actualCategories.length / definedCategories.length,
    suggestions: generateCategorySuggestions(unusedCategories, undefinedCategories)
  };
};

// 💡 카테고리 개선 제안 생성
const generateCategorySuggestions = (unused: string[], undefined: string[]): string[] => {
  const suggestions: string[] = [];
  
  if (unused.length > 0) {
    suggestions.push(`📂 사용되지 않는 카테고리: ${unused.join(', ')}`);
    suggestions.push(`💡 해당 카테고리용 이미지 추가를 고려해보세요.`);
  }
  
  if (undefined.length > 0) {
    suggestions.push(`❓ 정의되지 않은 카테고리: ${undefined.join(', ')}`);
    suggestions.push(`🔧 categories.ts에 새 카테고리 정의를 추가하세요.`);
  }
  
  if (unused.length === 0 && undefined.length === 0) {
    suggestions.push('✅ 모든 카테고리가 완벽하게 연동되었습니다!');
  }
  
  return suggestions;
};

// 🎨 카테고리별 색상 팔레트 (khaki shop 브랜드 기반)
export const getCategoryColor = (key: string): string => {
  const colors: Record<string, string> = {
    hero: '#2D2823',      // 다크 브라운 (중요도 최고)
    landing: '#4A453E',   // 미디움 브라운
    projects: '#8B7A6B',  // 소프트 베이지 브라운
    collections: '#D4C4B0', // 웜 베이지
    references: '#E8E5E1', // 라이트 베이지
    products: '#F7F5F3',   // 크림 화이트
    gallery: '#FFFFFF',    // 순백
    blog: '#4A453E',       // 미디움 브라운
    about: '#8B7A6B',      // 소프트 베이지 브라운
    future: '#D4C4B0'      // 웜 베이지
  };
  return colors[key] || '#F7F5F3';
};

// 🎨 레거시 호환성 (기존 코드와의 호환)
export const categoryPriority = MASTER_CATEGORIES.reduce((acc, cat) => {
  acc[cat.key] = cat.priority;
  return acc;
}, {} as Record<string, number>);

export const categoryIcons = MASTER_CATEGORIES.reduce((acc, cat) => {
  acc[cat.key] = cat.icon;
  return acc;
}, {} as Record<string, string>); 