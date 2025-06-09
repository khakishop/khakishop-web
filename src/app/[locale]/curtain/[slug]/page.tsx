import React from 'react';
import { notFound } from 'next/navigation';
import { curtainProducts } from '../../../../data/products';
import CurtainProductView from '../../../../components/CurtainProductView';

interface CurtainDetailPageProps {
  params: { slug: string };
}

// generateStaticParams 함수 추가
export async function generateStaticParams() {
  return curtainProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default function CurtainDetailPage({ params }: CurtainDetailPageProps) {
  const product = curtainProducts.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return <CurtainProductView product={product} />;
} 