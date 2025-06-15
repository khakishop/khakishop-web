import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import { getAllCollectionProducts } from '../../../data/collections';
import CollectionPageClient from './CollectionPageClient';

// 🎨 SEO 메타데이터 - 컬렉션
export const metadata = createSEOMetadata('collection');

interface CollectionPageProps {
  params: { locale: string };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { locale } = params;
  const collectionProducts = getAllCollectionProducts();

  return (
    <CollectionPageClient 
      initialProducts={collectionProducts}
      locale={locale}
    />
  );
}
