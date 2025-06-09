// ================================================================================
// 🎨 KHAKISHOP SEO 최적화 이미지 컴포넌트
// ================================================================================
// 🎯 목적: 모든 이미지에 자동으로 SEO 메타데이터 적용
// 🎨 스타일: RIGAS 모티브 감성 + khaki shop 브랜딩
// 📊 기능: alt, title, data-style 자동 삽입

'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { generateMetadataForUpload, getImagePath } from '../../utils/imageMap';

interface SEOImageProps extends Omit<ImageProps, 'alt'> {
  imageId?: string;
  category?: string;
  description?: string;
  alt?: string; // 선택적으로 만들어서 자동 생성 가능
}

export default function SEOImage({
  imageId,
  category = 'landing',
  description,
  alt,
  className = '',
  ...props
}: SEOImageProps) {
  // 🎯 메타데이터 자동 생성
  const metadata = generateMetadataForUpload(
    imageId || (typeof props.src === 'string' ? props.src : 'khakishop-image'),
    category,
    description
  );

  // 🎨 RIGAS 모티브 스타일 클래스
  const seoClasses = [
    'khaki-shop-image',
    metadata ? `style-${metadata.dataStyle}` : 'style-soft-minimal',
    metadata ? `category-${metadata.category}` : `category-${category}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Image
      {...props}
      alt={alt || metadata?.alt || description || 'khaki shop 감성 인테리어 이미지'}
      title={metadata?.title || `${description || 'khaki shop'} by khaki shop`}
      className={seoClasses}
      data-style={metadata?.dataStyle || 'soft-minimal'}
      data-category={metadata?.category || category}
      data-priority={metadata?.priority || 3}
    />
  );
}

// 🎨 특정 카테고리용 특화 컴포넌트들
export function HeroImage(props: Omit<SEOImageProps, 'category'>) {
  return <SEOImage {...props} category="hero" />;
}

export function ProductImage(props: Omit<SEOImageProps, 'category'>) {
  return <SEOImage {...props} category="products" />;
}

export function CollectionImage(props: Omit<SEOImageProps, 'category'>) {
  return <SEOImage {...props} category="collections" />;
}

export function ReferenceImage(props: Omit<SEOImageProps, 'category'>) {
  return <SEOImage {...props} category="references" />;
}

export function ProjectImage(props: Omit<SEOImageProps, 'category'>) {
  return <SEOImage {...props} category="projects" />;
} 