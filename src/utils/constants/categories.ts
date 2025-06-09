// ================================================================================
// 🎯 KHAKISHOP 통합 카테고리 시스템 (계층형 구조)
// ================================================================================
// 🔄 목적: 모든 카테고리 정의를 단일 소스로 통합 관리

export interface CategoryConfig {
  key: string;
  priority: number;
  icon: string;
  folderName: string;
  displayName: string;
  description: string;
  children?: CategoryConfig[]; // 하위 분류 추가
}

// 🎯 마스터 카테고리 정의 (계층형 구조)
export const MASTER_CATEGORIES: CategoryConfig[] = [
  {
    key: 'hero',
    priority: 1,
    icon: '🌟',
    folderName: 'hero',
    displayName: 'Hero',
    description: '메인 히어로 이미지',
    children: [
      {
        key: 'main-banner',
        priority: 1,
        icon: '🎭',
        folderName: 'main-banner',
        displayName: 'Main Banner',
        description: '메인 배너 이미지',
      },
      {
        key: 'intro-visual',
        priority: 2,
        icon: '🎨',
        folderName: 'intro-visual',
        displayName: 'Intro Visual',
        description: '인트로 비주얼',
      },
    ],
  },
  {
    key: 'landing',
    priority: 1,
    icon: '🏠',
    folderName: 'landing',
    displayName: 'Landing',
    description: '랜딩 페이지 이미지',
    children: [
      {
        key: 'section-hero',
        priority: 1,
        icon: '🔝',
        folderName: 'section-hero',
        displayName: 'Section Hero',
        description: '섹션 히어로',
      },
      {
        key: 'feature-showcase',
        priority: 2,
        icon: '✨',
        folderName: 'feature-showcase',
        displayName: 'Feature Showcase',
        description: '기능 쇼케이스',
      },
    ],
  },
  {
    key: 'projects',
    priority: 2,
    icon: '🏗️',
    folderName: 'projects',
    displayName: 'Projects',
    description: '프로젝트 쇼케이스',
    children: [
      {
        key: 'residential',
        priority: 1,
        icon: '🏠',
        folderName: 'residential',
        displayName: 'Residential',
        description: '주거 프로젝트',
      },
      {
        key: 'commercial',
        priority: 2,
        icon: '🏢',
        folderName: 'commercial',
        displayName: 'Commercial',
        description: '상업 프로젝트',
      },
      {
        key: 'hospitality',
        priority: 3,
        icon: '🏨',
        folderName: 'hospitality',
        displayName: 'Hospitality',
        description: '호텔/리조트 프로젝트',
      },
    ],
  },
  {
    key: 'collections',
    priority: 3,
    icon: '🎨',
    folderName: 'collections',
    displayName: 'Collections',
    description: '감성 컬렉션',
    children: [
      {
        key: 'curtain',
        priority: 1,
        icon: '🪟',
        folderName: 'curtain',
        displayName: 'Curtain',
        description: '커튼 컬렉션',
      },
      {
        key: 'blind',
        priority: 2,
        icon: '🗂️',
        folderName: 'blind',
        displayName: 'Blind',
        description: '블라인드 컬렉션',
      },
      {
        key: 'motorized',
        priority: 3,
        icon: '⚙️',
        folderName: 'motorized',
        displayName: 'Motorized',
        description: '모터라이즈 컬렉션',
      },
      {
        key: 'fabric',
        priority: 4,
        icon: '🧵',
        folderName: 'fabric',
        displayName: 'Fabric',
        description: '원단 컬렉션',
      },
    ],
  },
  {
    key: 'references',
    priority: 4,
    icon: '🏢',
    folderName: 'references',
    displayName: 'References',
    description: '시공 사례',
    children: [
      {
        key: 'before-after',
        priority: 1,
        icon: '🔄',
        folderName: 'before-after',
        displayName: 'Before & After',
        description: '시공 전후 비교',
      },
      {
        key: 'process',
        priority: 2,
        icon: '🔧',
        folderName: 'process',
        displayName: 'Process',
        description: '시공 과정',
      },
      {
        key: 'detail-shots',
        priority: 3,
        icon: '🔍',
        folderName: 'detail-shots',
        displayName: 'Detail Shots',
        description: '디테일 샷',
      },
    ],
  },
  {
    key: 'products',
    priority: 5,
    icon: '🛍️',
    folderName: 'products',
    displayName: 'Products',
    description: '제품 이미지',
    children: [
      {
        key: 'curtain-products',
        priority: 1,
        icon: '🪟',
        folderName: 'curtain-products',
        displayName: 'Curtain Products',
        description: '커튼 제품',
      },
      {
        key: 'blind-products',
        priority: 2,
        icon: '🗂️',
        folderName: 'blind-products',
        displayName: 'Blind Products',
        description: '블라인드 제품',
      },
      {
        key: 'hardware',
        priority: 3,
        icon: '🔧',
        folderName: 'hardware',
        displayName: 'Hardware',
        description: '하드웨어',
      },
      {
        key: 'accessories',
        priority: 4,
        icon: '✨',
        folderName: 'accessories',
        displayName: 'Accessories',
        description: '액세서리',
      },
    ],
  },
  {
    key: 'gallery',
    priority: 6,
    icon: '🖼️',
    folderName: 'gallery',
    displayName: 'Gallery',
    description: '갤러리 이미지',
    children: [
      {
        key: 'inspiration',
        priority: 1,
        icon: '💡',
        folderName: 'inspiration',
        displayName: 'Inspiration',
        description: '영감 이미지',
      },
      {
        key: 'lifestyle',
        priority: 2,
        icon: '🏡',
        folderName: 'lifestyle',
        displayName: 'Lifestyle',
        description: '라이프스타일',
      },
      {
        key: 'mood',
        priority: 3,
        icon: '🌅',
        folderName: 'mood',
        displayName: 'Mood',
        description: '무드 이미지',
      },
    ],
  },
  {
    key: 'blog',
    priority: 7,
    icon: '📝',
    folderName: 'blog',
    displayName: 'Blog',
    description: '블로그 이미지',
    children: [
      {
        key: 'tutorials',
        priority: 1,
        icon: '📚',
        folderName: 'tutorials',
        displayName: 'Tutorials',
        description: '튜토리얼',
      },
      {
        key: 'tips',
        priority: 2,
        icon: '💡',
        folderName: 'tips',
        displayName: 'Tips',
        description: '팁 & 노하우',
      },
    ],
  },
  {
    key: 'about',
    priority: 8,
    icon: '👥',
    folderName: 'about',
    displayName: 'About',
    description: '회사 소개',
    children: [
      {
        key: 'team',
        priority: 1,
        icon: '👨‍👩‍👧‍👦',
        folderName: 'team',
        displayName: 'Team',
        description: '팀 소개',
      },
      {
        key: 'office',
        priority: 2,
        icon: '🏢',
        folderName: 'office',
        displayName: 'Office',
        description: '사무실',
      },
      {
        key: 'history',
        priority: 3,
        icon: '📅',
        folderName: 'history',
        displayName: 'History',
        description: '회사 연혁',
      },
    ],
  },
  {
    key: 'future',
    priority: 9,
    icon: '🚀',
    folderName: 'future',
    displayName: 'Future',
    description: '미래 계획',
    children: [
      {
        key: 'roadmap',
        priority: 1,
        icon: '🗺️',
        folderName: 'roadmap',
        displayName: 'Roadmap',
        description: '로드맵',
      },
      {
        key: 'innovation',
        priority: 2,
        icon: '⚡',
        folderName: 'innovation',
        displayName: 'Innovation',
        description: '혁신 계획',
      },
    ],
  },
];

// 🎨 카테고리별 메타데이터 템플릿
export const CATEGORY_METADATA_TEMPLATES: Record<
  string,
  {
    altPrefix: string;
    titlePrefix: string;
    dataStyle: string;
  }
> = {
  hero: {
    altPrefix: 'khaki shop',
    titlePrefix: '감성적인 텍스타일 브랜드 khaki shop',
    dataStyle: 'hero-elegant',
  },
  landing: {
    altPrefix: 'khaki shop 홈페이지',
    titlePrefix: '공간을 완성하는 텍스타일',
    dataStyle: 'landing-warm',
  },
  projects: {
    altPrefix: 'khaki shop 프로젝트',
    titlePrefix: '완성된 공간들',
    dataStyle: 'project-showcase',
  },
  collections: {
    altPrefix: 'khaki shop 컬렉션',
    titlePrefix: '감성 컬렉션',
    dataStyle: 'collection-curated',
  },
  references: {
    altPrefix: 'khaki shop 시공 사례',
    titlePrefix: '실제 시공 사례',
    dataStyle: 'reference-proven',
  },
  products: {
    altPrefix: 'khaki shop 제품',
    titlePrefix: '품질 제품',
    dataStyle: 'product-quality',
  },
  gallery: {
    altPrefix: 'khaki shop 갤러리',
    titlePrefix: '갤러리 이미지',
    dataStyle: 'gallery-aesthetic',
  },
  blog: {
    altPrefix: 'khaki shop 블로그',
    titlePrefix: '인사이트 & 팁',
    dataStyle: 'blog-informative',
  },
  about: {
    altPrefix: 'khaki shop 소개',
    titlePrefix: '브랜드 스토리',
    dataStyle: 'about-authentic',
  },
  future: {
    altPrefix: 'khaki shop 미래 계획',
    titlePrefix: '앞으로의 비전',
    dataStyle: 'future-vision',
  },
};

// 🔧 헬퍼 함수들
export const getCategoryByKey = (key: string): CategoryConfig | undefined => {
  return MASTER_CATEGORIES.find((cat) => cat.key === key);
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
  return MASTER_CATEGORIES.map((cat) => cat.key);
};

export const getAllCategoryFolders = (): string[] => {
  return MASTER_CATEGORIES.map((cat) => cat.folderName);
};

export const getCategoryDisplayName = (key: string): string => {
  return getCategoryByKey(key)?.displayName || key;
};

// 🎯 드롭다운용 옵션 생성
export const getCategoryOptions = (includeAll: boolean = false) => {
  const options = MASTER_CATEGORIES.map((cat) => ({
    value: cat.key,
    label: `${cat.icon} ${cat.displayName}`,
    description: cat.description,
  }));

  if (includeAll) {
    return [
      { value: 'all', label: '🌐 모든 카테고리', description: '전체 카테고리' },
      ...options,
    ];
  }

  return options;
};

// 🎯 카테고리 검증 및 추천 기능
export const validateCategoryUsage = (actualCategories: string[]) => {
  const definedCategories = getAllCategoryKeys();
  const unusedCategories = definedCategories.filter(
    (cat) => !actualCategories.includes(cat)
  );
  const undefinedCategories = actualCategories.filter(
    (cat) => !definedCategories.includes(cat)
  );

  return {
    defined: definedCategories,
    actual: actualCategories,
    unused: unusedCategories,
    undefined: undefinedCategories,
    coverage: actualCategories.length / definedCategories.length,
    suggestions: generateCategorySuggestions(
      unusedCategories,
      undefinedCategories
    ),
  };
};

// 💡 카테고리 개선 제안 생성
const generateCategorySuggestions = (
  unused: string[],
  undefined: string[]
): string[] => {
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
    hero: '#2D2823', // 다크 브라운 (중요도 최고)
    landing: '#4A453E', // 미디움 브라운
    projects: '#8B7A6B', // 소프트 베이지 브라운
    collections: '#D4C4B0', // 웜 베이지
    references: '#E8E5E1', // 라이트 베이지
    products: '#F7F5F3', // 크림 화이트
    gallery: '#FFFFFF', // 순백
    blog: '#4A453E', // 미디움 브라운
    about: '#8B7A6B', // 소프트 베이지 브라운
    future: '#D4C4B0', // 웜 베이지
  };
  return colors[key] || '#F7F5F3';
};

// 🎨 레거시 호환성 (기존 코드와의 호환)
export const categoryPriority = MASTER_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.key] = cat.priority;
    return acc;
  },
  {} as Record<string, number>
);

export const categoryIcons = MASTER_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.key] = cat.icon;
    return acc;
  },
  {} as Record<string, string>
);

// ================================================================================
// 🌳 계층 구조 헬퍼 함수들
// ================================================================================

// 모든 카테고리와 하위 분류 포함 플랫 리스트 생성 (안전성 강화)
export const getAllCategoriesFlat = (maxDepth: number = 2): CategoryConfig[] => {
  const flatCategories: CategoryConfig[] = [];
  const visitedKeys = new Set<string>(); // 순환 참조 방지
  
  const traverse = (categories: CategoryConfig[], depth: number = 0) => {
    // 깊이 제한으로 무한 재귀 방지
    if (depth >= maxDepth) {
      console.warn(`⚠️ 카테고리 깊이 제한 초과: ${depth}`);
      return;
    }
    
    categories.forEach((category) => {
      // 순환 참조 검사
      if (visitedKeys.has(category.key)) {
        console.warn(`⚠️ 순환 참조 감지: ${category.key}`);
        return;
      }
      
      visitedKeys.add(category.key);
      flatCategories.push(category);
      
      // 하위 분류 재귀 처리
      if (category.children && category.children.length > 0) {
        traverse(category.children, depth + 1);
      }
      
      visitedKeys.delete(category.key); // 방문 완료 후 제거
    });
  };
  
  traverse(MASTER_CATEGORIES);
  return flatCategories;
};

// 카테고리의 풀패스 반환 (category/subcategory)
export const getCategoryFullPath = (categoryKey: string, subcategoryKey?: string): string => {
  if (subcategoryKey) {
    return `${categoryKey}/${subcategoryKey}`;
  }
  return categoryKey;
};

// 풀패스에서 카테고리와 하위분류 분리
export const parseCategoryPath = (fullPath: string): { category: string; subcategory?: string } => {
  const parts = fullPath.split('/');
  return {
    category: parts[0],
    subcategory: parts[1],
  };
};

// 특정 카테고리가 하위 분류를 가지고 있는지 확인
export const hasSubcategories = (categoryKey: string): boolean => {
  const category = getCategoryByKey(categoryKey);
  return !!(category?.children && category.children.length > 0);
};

// 계층형 카테고리 옵션 생성 (드롭다운용) - 안전성 강화
export const getHierarchicalCategoryOptions = (maxDepth: number = 2) => {
  const options: Array<{
    value: string;
    label: string;
    description: string;
    level: number;
    hasChildren: boolean;
  }> = [];
  
  const visitedKeys = new Set<string>(); // 순환 참조 방지

  const traverse = (categories: CategoryConfig[], level: number = 0, parentKey: string = '') => {
    // 깊이 제한
    if (level >= maxDepth) {
      return;
    }
    
    categories.forEach((category) => {
      const fullKey = parentKey ? `${parentKey}/${category.key}` : category.key;
      
      // 순환 참조 검사
      if (visitedKeys.has(fullKey)) {
        console.warn(`⚠️ 계층형 옵션 순환 참조: ${fullKey}`);
        return;
      }
      
      visitedKeys.add(fullKey);
      
      const indent = '  '.repeat(level);
      const prefix = level > 0 ? '↳ ' : '';
      
      options.push({
        value: fullKey,
        label: `${indent}${prefix}${category.icon} ${category.displayName}`,
        description: category.description,
        level,
        hasChildren: !!(category.children && category.children.length > 0),
      });

      // 하위 분류 재귀 처리
      if (category.children && category.children.length > 0) {
        traverse(category.children, level + 1, fullKey);
      }
      
      visitedKeys.delete(fullKey); // 방문 완료 후 제거
    });
  };

  traverse(MASTER_CATEGORIES);
  return options;
};

// 특정 카테고리의 하위 분류 반환 (안전성 강화)
export const getSubcategories = (categoryKey: string, maxDepth: number = 1): CategoryConfig[] => {
  const category = getCategoryByKey(categoryKey);
  
  if (!category || !category.children) {
    return [];
  }
  
  // 깊이 검사
  if (maxDepth <= 0) {
    console.warn(`⚠️ 하위분류 깊이 제한: ${categoryKey}`);
    return [];
  }
  
  // 순환 참조 간단 체크
  const hasCircularReference = category.children.some(child => 
    child.key === categoryKey
  );
  
  if (hasCircularReference) {
    console.error(`❌ 순환 참조 발견: ${categoryKey}`);
    return [];
  }
  
  return category.children;
};

// 하위 분류에서 특정 키로 찾기
export const getSubcategoryByKey = (categoryKey: string, subcategoryKey: string): CategoryConfig | undefined => {
  const subcategories = getSubcategories(categoryKey);
  return subcategories.find((sub) => sub.key === subcategoryKey);
};

// 카테고리 경로의 표시 이름 반환
export const getCategoryPathDisplayName = (categoryKey: string, subcategoryKey?: string): string => {
  const category = getCategoryByKey(categoryKey);
  if (!category) return categoryKey;

  if (subcategoryKey) {
    const subcategory = getSubcategoryByKey(categoryKey, subcategoryKey);
    return `${category.displayName} > ${subcategory?.displayName || subcategoryKey}`;
  }

  return category.displayName;
};

// 파일 시스템 경로 생성 (/public/images/category/subcategory/)
export const getCategoryFolderPath = (categoryKey: string, subcategoryKey?: string): string => {
  const category = getCategoryByKey(categoryKey);
  if (!category) return categoryKey;

  if (subcategoryKey) {
    const subcategory = getSubcategoryByKey(categoryKey, subcategoryKey);
    return `${category.folderName}/${subcategory?.folderName || subcategoryKey}`;
  }

  return category.folderName;
};

// 브레드크럼 생성
export const getCategoryBreadcrumb = (categoryKey: string, subcategoryKey?: string) => {
  const category = getCategoryByKey(categoryKey);
  if (!category) return [];

  const breadcrumb = [
    {
      key: category.key,
      displayName: category.displayName,
      icon: category.icon,
      href: `/admin/images/${category.key}`,
    },
  ];

  if (subcategoryKey) {
    const subcategory = getSubcategoryByKey(categoryKey, subcategoryKey);
    if (subcategory) {
      breadcrumb.push({
        key: subcategory.key,
        displayName: subcategory.displayName,
        icon: subcategory.icon,
        href: `/admin/images/${category.key}/${subcategory.key}`,
      });
    }
  }

  return breadcrumb;
};
