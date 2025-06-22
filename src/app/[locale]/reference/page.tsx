import React from 'react';
import { Metadata } from 'next';
import { createReferencesMetadata } from '../../../utils/seoMetadata';
import ReferencesPageClient from './ReferencesPageClient';

// 🎨 SEO 메타데이터 - 시공 사례 페이지
export const metadata: Metadata = createReferencesMetadata();

export default function ReferencesPage() {
  return <ReferencesPageClient />;
}
