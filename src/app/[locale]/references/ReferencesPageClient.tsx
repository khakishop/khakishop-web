'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects } from '../../../data/projects';

export default function ReferencesPageClient() {
  const projects = getAllProjects();
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링 로직
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects;
    }

    const query = searchQuery.toLowerCase().trim();
    return projects.filter(project => 
      project.title.toLowerCase().includes(query) || 
      project.location.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  // 리프레시 함수
  const handleRefresh = () => {
    setSearchQuery('');
  };

  // 카테고리 한글 변환
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'Residential': return '주거';
      case 'Commercial': return '상업';
      case 'F&B': return '카페/레스토랑';
      case 'Healthcare': return '의료';
      case 'Cultural': return '문화';
      default: return category;
    }
  };

  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 페이지 헤더 - RIGAS 스타일 */}
      <motion.div 
        className="bg-gray-50 border-b border-gray-100"
        variants={itemVariants}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center space-y-8">
            <motion.h1 
              className="text-4xl lg:text-5xl xl:text-6xl font-serif text-gray-900 leading-tight tracking-tight"
              variants={itemVariants}
            >
              References
            </motion.h1>
            <motion.p 
              className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto"
              variants={itemVariants}
            >
              우리가 완성한 공간들의 이야기를 만나보세요. 각각의 프로젝트는 고객의 꿈과 우리의 전문성이 만나 탄생한 특별한 공간입니다.
            </motion.p>
            
            {/* 검색 박스 - RIGAS 스타일 */}
            <motion.div 
              className="max-w-md mx-auto mt-12"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg 
                    className="w-5 h-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="프로젝트명 또는 지역으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm tracking-wide"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* 검색 결과 및 컨트롤 바 */}
              <motion.div 
                className="flex items-center justify-between mt-6 px-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {/* 프로젝트 카운터 */}
                <div className="text-sm text-gray-600 font-light">
                  {searchQuery ? (
                    <span>
                      <span className="font-medium text-gray-900">{filteredProjects.length}</span>개의 검색 결과
                    </span>
                  ) : (
                    <span>
                      총 <span className="font-medium text-gray-900">{projects.length}</span>개의 프로젝트
                    </span>
                  )}
                </div>

                {/* 리프레시 버튼 */}
                <button
                  onClick={handleRefresh}
                  className="group inline-flex items-center text-gray-500 hover:text-gray-900 transition-all duration-300 text-sm font-medium"
                  disabled={!searchQuery}
                >
                  <svg 
                    className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                      searchQuery ? 'group-hover:rotate-180' : 'opacity-50'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                  <span className="uppercase tracking-wider text-xs">
                    {searchQuery ? '초기화' : '전체'}
                  </span>
                </button>
              </motion.div>

              {/* 검색 상태 메시지 (검색어가 있을 때만 표시) */}
              {searchQuery && (
                <motion.div 
                  className="text-center mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-gray-500 font-light">
                    "<span className="text-gray-700 font-medium">{searchQuery}</span>" 검색 결과
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 레퍼런스 그리드 */}
      <div className="max-w-screen-xl mx-auto px-6 py-16 lg:py-24">
        {filteredProjects.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            variants={containerVariants}
            key={searchQuery} // 검색 시 애니메이션 재실행
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/ko/references/${project.slug}`} className="group block">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* 프로젝트 이미지 */}
                    <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                      <Image
                        src={project.mainImage || '/placeholder-project.jpg'}
                        alt={`${project.title} - ${project.location}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      
                      {/* 카테고리 배지 */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs uppercase tracking-wider rounded-full font-medium">
                          {getCategoryName(project.category)}
                        </span>
                      </div>
                      
                      {/* 그라디언트 오버레이 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* 프로젝트 정보 */}
                    <div className="p-6 lg:p-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xl lg:text-2xl font-serif text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                            {project.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {project.location}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {project.year}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 font-light leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                        
                        {/* 더보기 링크 */}
                        <div className="pt-2">
                          <span className="inline-flex items-center text-gray-900 group-hover:text-gray-600 transition-colors duration-300 text-sm uppercase tracking-wider font-medium">
                            <span>자세히 보기</span>
                            <svg 
                              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
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
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* 검색 결과 없음 */
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif text-gray-900">검색 결과가 없습니다</h3>
                <p className="text-gray-600 font-light">
                  다른 키워드로 검색해 보시거나 전체 프로젝트를 둘러보세요.
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center text-gray-900 hover:text-gray-600 transition-colors duration-300 text-sm uppercase tracking-wider font-medium"
              >
                <span>전체 프로젝트 보기</span>
                <svg 
                  className="w-4 h-4 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* CTA 섹션 - RIGAS 스타일 */}
      <motion.section 
        className="py-20 lg:py-24 bg-gray-50"
        variants={itemVariants}
      >
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <motion.h2 
              className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900"
              variants={itemVariants}
            >
              더 많은 프로젝트가 궁금하신가요?
            </motion.h2>
            <motion.p 
              className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto"
              variants={itemVariants}
            >
              상담을 통해 더 많은 포트폴리오와 맞춤형 제안을 받아보세요.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <Link 
                href="/ko/contact"
                className="group inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wider font-medium"
              >
                <span>상담 문의하기</span>
                <svg 
                  className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" 
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
              </Link>
            </motion.div>
            
            <motion.p 
              className="text-sm text-gray-500 font-light"
              variants={itemVariants}
            >
              상담 시간: 평일 10:00 - 20:00 | 전화: 0507-1372-0358
            </motion.p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
} 