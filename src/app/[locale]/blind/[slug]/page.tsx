import React from 'react';
import { notFound } from 'next/navigation';
import { blindProducts } from '../../../../data/products';
import BlindProductView from '../../../../components/BlindProductView';

interface BlindDetailPageProps {
  params: { slug: string };
}

// generateStaticParams 함수 추가
export async function generateStaticParams() {
  return blindProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default function BlindDetailPage({ params }: BlindDetailPageProps) {
  const product = blindProducts.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return <BlindProductView product={product} />;
} 