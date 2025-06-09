import React from 'react';
import { notFound } from 'next/navigation';
import { motorizedProducts } from '../../../../data/products';
import MotorizedProductView from '../../../../components/MotorizedProductView';

interface MotorizedDetailPageProps {
  params: { slug: string };
}

// generateStaticParams 함수 추가
export async function generateStaticParams() {
  return motorizedProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default function MotorizedDetailPage({ params }: MotorizedDetailPageProps) {
  const product = motorizedProducts.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return <MotorizedProductView product={product} />;
} 