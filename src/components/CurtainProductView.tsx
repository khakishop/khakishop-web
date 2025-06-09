'use client';

import React from 'react';
import ProductDetailTemplate from './templates/ProductDetailTemplate';
import { curtainProducts } from '../data/products';

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

interface CurtainProductViewProps {
  product: Product;
}

export default function CurtainProductView({ product }: CurtainProductViewProps) {
  return (
    <ProductDetailTemplate
      product={product}
      relatedProducts={curtainProducts}
      categoryName="커튼"
      categoryPath="/curtain"
    />
  );
} 