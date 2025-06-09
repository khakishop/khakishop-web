'use client';

import React from 'react';
import ProductDetailTemplate from './templates/ProductDetailTemplate';
import { motorizedProducts } from '../data/products';

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

interface MotorizedProductViewProps {
  product: Product;
}

export default function MotorizedProductView({ product }: MotorizedProductViewProps) {
  return (
    <ProductDetailTemplate
      product={product}
      relatedProducts={motorizedProducts}
      categoryName="전동 시스템"
      categoryPath="/motorized"
    />
  );
} 