import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import CollectionPageClient from './CollectionPageClient';

// 🎨 SEO 메타데이터 - 컬렉션
export const metadata = createSEOMetadata('collection');

export default function CollectionPage() {
  return <CollectionPageClient />;
}
