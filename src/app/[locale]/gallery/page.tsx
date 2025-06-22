import GalleryPageClient from '../../../components/GalleryPageClient';
import { createSEOMetadata } from '../../../utils/seoMetadata';

// 🎨 SEO 메타데이터 - 갤러리
export const metadata = createSEOMetadata('collection');

export default function GalleryPage() {
  return <GalleryPageClient />;
} 