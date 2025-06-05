'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getAllProjects, type ProjectDetail } from '../../../data/projects';

// 관리자 대시보드 페이지
export default function AdminPage() {
  const projects = getAllProjects();
  const [isTableView, setIsTableView] = useState(true);

  // title 기준 오름차순 정렬
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  }, [projects]);

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

  // placeholder 함수들
  const handleEdit = (slug: string) => {
    console.log('Edit project:', slug);
    // TODO: 편집 기능 구현
  };

  const handleDelete = (slug: string) => {
    console.log('Delete project:', slug);
    // TODO: 삭제 기능 구현
  };

  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05
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
      className="min-h-screen bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 페이지 헤더 - RIGAS 스타일 */}
      <motion.div 
        className="bg-white border-b border-gray-200"
        variants={itemVariants}
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div>
              <motion.h1 
                className="text-3xl lg:text-4xl font-serif text-gray-900 leading-tight tracking-tight"
                variants={itemVariants}
              >
                Project Management
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 font-light mt-2"
                variants={itemVariants}
              >
                관리자 대시보드에서 프로젝트를 관리하고 편집할 수 있습니다.
              </motion.p>
            </div>
            
            {/* 뷰 전환 및 통계 */}
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
              variants={itemVariants}
            >
              <div className="text-sm text-gray-600 font-light">
                총 <span className="font-medium text-gray-900">{sortedProjects.length}</span>개의 프로젝트
              </div>
              
              {/* 뷰 전환 버튼 */}
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setIsTableView(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isTableView 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
                    </svg>
                    <span>테이블</span>
                  </span>
                </button>
                <button
                  onClick={() => setIsTableView(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    !isTableView 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>카드</span>
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 프로젝트 데이터 표시 */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8 lg:py-12">
        {isTableView ? (
          /* 테이블 뷰 */
          <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            variants={itemVariants}
          >
            {/* 데스크톱 테이블 */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      프로젝트명
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      위치
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      연도
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      규모
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedProjects.map((project, index) => (
                    <motion.tr
                      key={project.slug}
                      className="hover:bg-gray-50 transition-colors duration-200"
                      variants={itemVariants}
                      custom={index}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                          <div>
                            <div className="font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500 font-mono">{project.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{project.location}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getCategoryName(project.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{project.year}</td>
                      <td className="px-6 py-4 text-gray-600">{project.size}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            href={`/ko/references/${project.slug}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            보기
                          </Link>
                          <button
                            onClick={() => handleEdit(project.slug)}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            편집
                          </button>
                          <button
                            onClick={() => handleDelete(project.slug)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            삭제
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 리스트 */}
            <div className="lg:hidden divide-y divide-gray-200">
              {sortedProjects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  className="p-6 space-y-4"
                  variants={itemVariants}
                  custom={index}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{project.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{project.location} • {project.year}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">{project.slug}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-4">
                      {getCategoryName(project.category)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/ko/references/${project.slug}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      보기
                    </Link>
                    <button
                      onClick={() => handleEdit(project.slug)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      편집
                    </button>
                    <button
                      onClick={() => handleDelete(project.slug)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      삭제
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* 카드 뷰 */
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {sortedProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                variants={itemVariants}
                custom={index}
              >
                <div className="aspect-[16/10] bg-gray-100"></div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 leading-tight">{project.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{project.location} • {project.year}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">{project.slug}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getCategoryName(project.category)}
                      </span>
                      <div className="text-sm text-gray-500">{project.size}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/ko/references/${project.slug}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        보기
                      </Link>
                      <button
                        onClick={() => handleEdit(project.slug)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                      >
                        편집
                      </button>
                      <button
                        onClick={() => handleDelete(project.slug)}
                        className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 하단 정보 섹션 */}
      <motion.div 
        className="bg-white border-t border-gray-200 mt-12"
        variants={itemVariants}
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-gray-900">프로젝트 관리</h3>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              현재 {sortedProjects.length}개의 프로젝트가 등록되어 있습니다. 
              각 프로젝트를 클릭하여 상세 정보를 확인하거나 편집할 수 있습니다.
            </p>
            <div className="text-xs text-gray-500">
              마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 