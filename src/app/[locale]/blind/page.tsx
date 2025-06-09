import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import BlindClientView from '../../../components/BlindClientView';

// 🎨 SEO 메타데이터 - 블라인드 컬렉션
export const metadata = createSEOMetadata('blind');

export default function BlindPage() {
  return <BlindClientView />;
}
