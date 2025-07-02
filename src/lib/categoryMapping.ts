// 카테고리 매핑 시스템
export const CATEGORY_MAPPING = {
  // URL 카테고리 → 실제 데이터 카테고리
  products: 'collections',
  collections: 'collections',
  curtain: 'curtain',
  'curtain-products': 'curtain',
  blind: 'blind',
  'blind-products': 'blind',
  motorized: 'motorized',
  fabric: 'fabric',
  hardware: 'hardware',
  accessories: 'accessories',
  gallery: 'gallery',
  references: 'references',
} as const;

export const SUBCATEGORY_MAPPING = {
  // 서브카테고리 매핑
  accessories: 'accessories',
  hero: 'hero',
  landing: 'landing',
  projects: 'projects',
} as const;

export function mapCategoryToData(urlCategory: string): string {
  return (
    CATEGORY_MAPPING[urlCategory as keyof typeof CATEGORY_MAPPING] ||
    urlCategory
  );
}

export function mapSubcategoryToData(urlSubcategory: string): string {
  return (
    SUBCATEGORY_MAPPING[urlSubcategory as keyof typeof SUBCATEGORY_MAPPING] ||
    urlSubcategory
  );
}
