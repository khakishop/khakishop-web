'use client';

import React from 'react';
import { motion } from "../lib/motion";
import Image from 'next/image';
import { LocalizedLink } from './ui/LocalizedLink';
import { useRouter, usePathname } from 'next/navigation';
import { projects, getAllProjects, getProjectsByCategory } from '../data/projects';

export default function ProjectClientView() {
  const router = useRouter();
  const pathname = usePathname();
  
  // 현재 locale 추출 (예: /ko/project → ko)
  const locale = pathname.split('/')[1] || 'ko';
  
  const allProjects = getAllProjects();
  const categories = ['All', 'Residential', 'Commercial', 'F&B', 'Healthcare', 'Cultural'];

  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? allProjects 
    : getProjectsByCategory(selectedCategory as any);

  return (
    <div className="min-h-screen bg-white">
      {/* 🎨 RIGAS 스타일: 깔끔한 헤더 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* 브레드크럼 네비게이션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-8"
          >
            <LocalizedLink href="/" className="hover:text-gray-700 transition-colors">
              홈
            </LocalizedLink>
            <span>•</span>
            <span className="text-gray-700">프로젝트</span>
          </motion.div>

          {/* 페이지 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-tight mb-6">
              Our Projects
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              각각의 공간이 가진 고유한 이야기와 감성을 담아낸 KHAKISHOP의 프로젝트들을 만나보세요. 
              주거부터 상업 공간까지, 다양한 환경에서 완성된 우리의 작품들이 보여주는 창의적인 솔루션들을 확인하실 수 있습니다.
            </p>
          </motion.div>

          {/* 카테고리 필터 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'All' ? '전체' : 
                 category === 'Residential' ? '주거' :
                 category === 'Commercial' ? '상업' :
                 category === 'F&B' ? '카페/레스토랑' :
                 category === 'Healthcare' ? '의료' :
                 category === 'Cultural' ? '문화/예술' : category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🎨 프로젝트 그리드 (RIGAS 스타일) */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <LocalizedLink href={`/project/${project.slug}`}>
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 text-gray-700 text-sm font-medium rounded-full">
                        {project.category === 'Residential' ? '주거' :
                         project.category === 'Commercial' ? '상업' :
                         project.category === 'F&B' ? '카페/레스토랑' :
                         project.category === 'Healthcare' ? '의료' :
                         project.category === 'Cultural' ? '문화/예술' : project.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                        {project.year}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl lg:text-2xl font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </p>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* 프로젝트 특징 */}
                    {project.features && project.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </LocalizedLink>
              </motion.div>
            ))}
          </div>

          {/* 프로젝트가 없을 때 */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="text-gray-400 text-xl mb-4">해당 카테고리의 프로젝트가 없습니다</div>
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-gray-600 hover:text-gray-900 transition-colors underline"
              >
                전체 프로젝트 보기
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 🎨 상담 문의 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-6">
              새로운 프로젝트를 계획하고 계신가요?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              KHAKISHOP의 전문 컨설턴트가 귀하의 공간에 최적화된 솔루션을 제안해드립니다.
            </p>
            <LocalizedLink
              href="/contact"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-lg font-medium"
            >
              <span>프로젝트 상담 요청</span>
              <svg
                className="w-5 h-5 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </LocalizedLink>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 