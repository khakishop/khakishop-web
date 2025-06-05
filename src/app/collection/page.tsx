'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { 
  getAllCollections, 
  getCollectionCategories, 
  getCollectionCategoryName, 
  getCollectionsByCategory,
  type Collection 
} from '../../data/collections';
import CollectionCard from '../../components/CollectionCard';

export default function CollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<Collection['category'] | 'all'>('all');
  const allCollections = getAllCollections();
  const categories = getCollectionCategories();

  // 필터링된 컬렉션 가져오기
  const filteredCollections = selectedCategory === 'all' 
    ? allCollections 
    : getCollectionsByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 섹션 - RIGAS 스타일 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-serif text-neutral-800 leading-tight tracking-tight mb-8">
            Collection
          </h1>
          <p className="text-lg lg:text-xl text-neutral-500 font-light leading-relaxed max-w-3xl mx-auto">
            엄선된 텍스타일 컬렉션으로 공간의 품격을 높여보세요. 
            각각의 컬렉션은 독특한 스토리와 감성을 담고 있습니다.
          </p>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="py-16 border-b border-neutral-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm font-serif tracking-wide transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'text-neutral-800 border-b border-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700 border-b border-transparent'
              }`}
            >
              전체보기
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-serif tracking-wide transition-all duration-300 ${
                  selectedCategory === category
                    ? 'text-neutral-800 border-b border-neutral-800'
                    : 'text-neutral-500 hover:text-neutral-700 border-b border-transparent'
                }`}
              >
                {getCollectionCategoryName(category)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 컬렉션 그리드 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-16">
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection.slug}
                slug={collection.slug}
                title={collection.title}
                summary={collection.summary}
                image={collection.image}
                category={collection.category}
                categoryLabel={getCollectionCategoryName(collection.category)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA 섹션 */}
      <section className="py-20 lg:py-32 bg-neutral-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-neutral-800 mb-8">
            맞춤 컬렉션이 필요하신가요?
          </h2>
          <p className="text-lg text-neutral-500 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            고객님의 취향과 공간에 최적화된 특별한 컬렉션을 큐레이션해드립니다. 
            전문가와 상담하여 완벽한 조합을 찾아보세요.
          </p>
          
          <Link 
            href="/contact"
            className="inline-flex items-center bg-neutral-800 text-white px-10 py-4 rounded-full hover:bg-neutral-700 transition-all duration-300 text-sm font-serif tracking-wide group"
          >
            <span>맞춤 상담 문의</span>
            <svg 
              className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
} 