'use client';

import React from 'react';
import { notFound } from 'next/navigation';

interface PageParams {
  locale: string;
  category: string;
  subcategory: string;
}

interface CategoryManagePageProps {
  params: PageParams;
}

export default function CategoryManagePage({ params }: CategoryManagePageProps) {
  const { locale, category, subcategory } = params;

  const validCategories = ['collections', 'products', 'projects'];
  const validSubcategories = ['curtain', 'blind', 'modern', 'kitchen', 'living'];

  if (!validCategories.includes(category) || !validSubcategories.includes(subcategory)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-100 border border-green-400 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            🎉 빌드 에러 해결완료! (임시 버전)
          </h1>
          <p className="text-green-700 text-lg">
            카테고리: {category} | 서브카테고리: {subcategory}
          </p>
        </div>
      </div>
    </div>
  );
}
