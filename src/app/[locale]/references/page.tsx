import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import ReferencesPageClient from './ReferencesPageClient';

// 🎨 SEO 메타데이터 - 시공 사례
export const metadata = createSEOMetadata('references');

export default function ReferencesPage() {
  return <ReferencesPageClient />;
} 