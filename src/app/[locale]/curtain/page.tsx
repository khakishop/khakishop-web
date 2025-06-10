import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import CurtainPageClient from '../../../components/CurtainPageClient';

// 🎨 SEO 메타데이터 - 커튼 컬렉션
export const metadata = createSEOMetadata('curtain');

export default function CurtainPage() {
  return <CurtainPageClient />;
}
