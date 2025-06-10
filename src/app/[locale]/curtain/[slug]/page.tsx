import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCurtainProductBySlug, getAllCurtainProducts } from '../../../../data/curtain';
import { createCurtainMetadata } from '../../../../utils/seoMetadata';
import CurtainDetailPage from '../../../../components/CurtainDetailPage';

interface CurtainDetailPageProps {
  params: { slug: string; locale: string };
}

// generateStaticParams 함수 추가
export async function generateStaticParams() {
  const products = getAllCurtainProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: CurtainDetailPageProps): Promise<Metadata> {
  const product = getCurtainProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: '제품을 찾을 수 없습니다 - KHAKISHOP',
      description: '요청하신 커튼 제품을 찾을 수 없습니다.',
    };
  }
  
  return createCurtainMetadata(product);
}

export default function CurtainDetailPageRoute({ params }: CurtainDetailPageProps) {
  const product = getCurtainProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <CurtainDetailPage product={product} />;
} 