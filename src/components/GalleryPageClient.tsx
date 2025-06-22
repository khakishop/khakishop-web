'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { GalleryItem, getAllGalleryItems, getGalleryCategories, getGalleryItemsByCategory } from '../data/gallery';
import { createStaggerContainer, createStaggerItem, fadeIn, fadeInUp, motion } from "../lib/motion";
import HomeButton from './ui/HomeButton';

export default function GalleryPageClient() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';

  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const allItems = getAllGalleryItems();
  const categories = getGalleryCategories();

  const filteredItems = selectedCategory === 'All'
    ? allItems
    : getGalleryItemsByCategory(selectedCategory as GalleryItem['category']);

  return (
    <div className="min-h-screen bg-white">
      <HomeButton />

      {/* 🎨 RIGAS 스타일: 깔끔한 헤더 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* 브레드크럼 네비게이션 */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="flex items-center gap-2 text-sm text-gray-500 mb-8"
          >
            <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
              홈
            </Link>
            <span>•</span>
            <span className="text-gray-700">갤러리</span>
          </motion.div>

          {/* 페이지 타이틀 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-tight mb-6">
              Gallery
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              KHAKISHOP의 아름다운 순간들을 담은 갤러리입니다.
              제품의 디테일부터 라이프스타일까지, 시각적 영감을 주는 이미지들을 만나보세요.
            </p>
          </motion.div>

          {/* 카테고리 필터 */}
          <motion.div
            variants={createStaggerContainer(0.05)}
            initial="initial"
            animate="animate"
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <motion.button
              variants={createStaggerItem()}
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${selectedCategory === 'All'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              전체
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                variants={createStaggerItem()}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category === 'Curtain' ? '커튼' :
                  category === 'Blind' ? '블라인드' :
                    category === 'Motorized' ? '전동 제품' :
                      category === 'Interior' ? '인테리어' :
                        category === 'Lifestyle' ? '라이프스타일' : category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🎨 갤러리 그리드 (Masonry 스타일) */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div
            variants={createStaggerContainer(0.1)}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.slug}
                variants={createStaggerItem()}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group"
              >
                <Link href={`/${locale}/gallery/${item.slug}`}>
                  <div className="relative rounded-xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    {/* 메인 이미지 */}
                    <div className="aspect-[4/5] relative">
                      <Image
                        src={item.mainImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        loading={index < 6 ? "eager" : "lazy"}
                      />
                      {/* 오버레이 */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                      {/* 카테고리 배지 */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 text-gray-700 text-sm font-medium rounded-full">
                          {item.category === 'Curtain' ? '커튼' :
                            item.category === 'Blind' ? '블라인드' :
                              item.category === 'Motorized' ? '전동 제품' :
                                item.category === 'Interior' ? '인테리어' :
                                  item.category === 'Lifestyle' ? '라이프스타일' : item.category}
                        </span>
                      </div>

                      {/* Featured 배지 */}
                      {item.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-medium rounded-full">
                            Featured
                          </span>
                        </div>
                      )}

                      {/* 호버 시 표시되는 정보 */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 이미지 하단 정보 */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* 태그들 */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {item.images.length}장
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* 갤러리 아이템이 없을 때 */}
          {filteredItems.length === 0 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-center py-20"
            >
              <div className="text-gray-400 text-xl mb-4">해당 카테고리의 갤러리가 없습니다</div>
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-gray-600 hover:text-gray-900 transition-colors underline"
              >
                전체 갤러리 보기
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 🎨 갤러리 참여 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-6">
              당신의 공간도 갤러리에 참여해보세요
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              KHAKISHOP 제품으로 완성된 당신의 특별한 공간을 공유해주세요.
              아름다운 순간들을 함께 나누어요.
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-lg font-medium"
            >
              갤러리 참여하기
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 