import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import AboutPageClient from './AboutPageClient';

// 🎨 SEO 메타데이터 - 브랜드 스토리
export const metadata = createSEOMetadata('about');

export default function AboutPage() {
  return <AboutPageClient />;
}
