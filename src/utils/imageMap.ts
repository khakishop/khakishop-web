// KHAKISHOP 이미지 매핑 시스템 (빌드 에러 해결 버전)

export interface ImageMetadata {
  alt: string;
  title: string;
  description: string;
  category: string;
  priority?: number;
  dataStyle: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  tags?: string[];
  keywords?: string[];
  subject?: string[];  originalFileName?: string;
  updatedAt?: string;
}

export interface ImageMapping {
  id: string;
  sourceFile: string;
  targetPath: string;
  category: string;
  isProtected: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  uploadedAt?: string | Date;
  metadata?: ImageMetadata;
  displayOrder?: number;
  src?: string;
  fileName?: string;
  alt?: string;
  fileSize?: number;
  image?: string;
  slug?: string;
  title?: string;
  mainImage?: string;
  description?: string;
}

export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMetadataForUpload(
  fileName: string,
  category: string,
  description: string
): ImageMetadata {
  return {
    alt: `${category} - ${fileName}`,
    title: fileName.replace(/\.[^/.]+$/, ""),
    description,
    category,
    priority: 1,
    dataStyle: 'default',
    originalFileName: fileName,
  };
}

export function dateToISOString(date: string | Date): string {
  if (typeof date === 'string') return date;
  return date.toISOString();
}

export function isoStringToDate(dateStr: string | Date): Date {
  if (dateStr instanceof Date) return dateStr;
  return new Date(dateStr);
}

export function toAPIFormat(image: ImageMapping): ImageMapping {
  return {
    ...image,
    createdAt: dateToISOString(image.createdAt),
    updatedAt: image.updatedAt ? dateToISOString(image.updatedAt) : undefined,
    uploadedAt: image.uploadedAt ? dateToISOString(image.uploadedAt) : undefined,
  };
}

export function fromAPIFormat(image: ImageMapping): ImageMapping {
  return {
    ...image,
    createdAt: isoStringToDate(image.createdAt),
    updatedAt: image.updatedAt ? isoStringToDate(image.updatedAt) : undefined,
    uploadedAt: image.uploadedAt ? isoStringToDate(image.uploadedAt) : undefined,
  };
}

export function toDragDropFormat(image: ImageMapping): ImageMapping {
  return {
    ...image,
    src: image.src || image.targetPath,
    image: image.image || image.targetPath,
    fileName: image.fileName || image.sourceFile,
    alt: image.alt || image.metadata?.alt || `Image ${image.id}`,
    title: image.title || image.metadata?.title || image.fileName || image.sourceFile,
    description: image.description || image.metadata?.description || '',
  };
}

export function normalizeImagePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export function getSafeTitle(image: ImageMapping): string {
  if (image.title) return image.title;
  if (image.metadata?.title) return image.metadata.title;
  if (image.alt) return image.alt;
  if (image.metadata?.alt) return image.metadata.alt;
  if (image.fileName) return image.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  if (image.sourceFile) return image.sourceFile.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return `Image ${image.id}`;
}

export function getSafeDescription(image: ImageMapping): string {
  if (image.description) return image.description;
  if (image.metadata?.description) return image.metadata.description;
  return `${image.category} 카테고리의 이미지`;
}

export function getSafeAlt(image: ImageMapping): string {
  if (image.alt) return image.alt;
  if (image.metadata?.alt) return image.metadata.alt;
  return getSafeTitle(image);
}

export function getCategoryByKey(key: string): any {
  return { key, priority: 1, icon: '📁' };
}

export function getCategoryPriority(key: string): number {
  const priorities: Record<string, number> = {
    hero: 1, landing: 2, collections: 3, products: 4, projects: 5,
    references: 6, gallery: 7, curtain: 8, blind: 9, motorized: 10
  };
  return priorities[key] || 100;
}

export function getCategoryIcon(key: string): string {
  const icons: Record<string, string> = {
    hero: '🦸', landing: '🏠', collections: '📚', products: '🛍️', projects: '🏗️',
    references: '📖', gallery: '🖼️', curtain: '🪟', blind: '🎭', motorized: '⚡'
  };
  return icons[key] || '📁';
}

export const CATEGORY_METADATA_TEMPLATES = {
  hero: { priority: 1, defaultAlt: 'KHAKISHOP 히어로 이미지', prefix: 'hero' },
  landing: { priority: 2, defaultAlt: '랜딩 페이지', prefix: 'landing' },
  collections: { priority: 3, defaultAlt: '컬렉션', prefix: 'collection' },
  products: { priority: 4, defaultAlt: '제품', prefix: 'product' },
  projects: { priority: 5, defaultAlt: '프로젝트', prefix: 'project' },
  references: { priority: 6, defaultAlt: '레퍼런스', prefix: 'reference' },
  gallery: { priority: 7, defaultAlt: '갤러리', prefix: 'gallery' },
  curtain: { priority: 8, defaultAlt: '커튼', prefix: 'curtain' },
  blind: { priority: 9, defaultAlt: '블라인드', prefix: 'blind' },
  motorized: { priority: 10, defaultAlt: '모터라이즈', prefix: 'motorized' }
};

export const getAllImageInfo = (): ImageMapping[] => [];
export const getProtectedImages = (): ImageMapping[] => [];
export const calculateCategoryStats = (mappings: ImageMapping[]) => ({
  totalImages: mappings.length,
  protectedImages: mappings.filter(m => m.isProtected).length,
  categories: []
});

export function getImagePath(imageId: string): string {
  return '/images/default.jpg';
}
