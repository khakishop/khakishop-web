'use client';

import React from 'react';
import ProductDetailTemplate from './templates/ProductDetailTemplate';
import { blindProducts } from '../data/products';

interface Product {
  slug: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  price?: string;
  features?: string[];
  specifications?: {
    material?: string;
    size?: string;
    color?: string;
    installation?: string;
  };
  gallery?: string[];
}

interface BlindProductViewProps {
  product: Product;
}

export default function BlindProductView({ product }: BlindProductViewProps) {
  return (
    <ProductDetailTemplate
      product={product}
      relatedProducts={blindProducts}
      categoryName="블라인드"
      categoryPath="/blind"
    />
  );
} 