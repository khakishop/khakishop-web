"use client";

/**
 * ================================================================================
 * 👁️ 프로젝트 미리보기 페이지
 * ================================================================================
 * 
 * 기능:
 * - 실제 웹사이트와 동일한 레이아웃으로 미리보기
 * - 데스크톱/모바일 화면 전환
 * - 편집 페이지로 바로 이동
 * - 실시간 반영 (편집 중인 내용 표시)
 */

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProjectBySlug, Project } from '../../../../../../data/projects';
import { createStaggerContainer, createStaggerItem, fadeIn, fadeInUp } from "../../../../../../lib/motion";

interface ProjectPreviewPageProps {
  params: { slug: string; locale: string };
}

export default function ProjectPreviewPage({ params }: ProjectPreviewPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 프로젝트 데이터 로드
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const projectData = getProjectBySlug(params.slug);

        if (!projectData) {
          router.push('/admin/projects');
          return;
        }

        setProject(projectData);
      } catch (error) {
        console.error('프로젝트 로드 실패:', error);
        router.push('/admin/projects');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [params.slug, router]);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
      if (e.key === 'm' || e.key === 'M') {
        setViewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">프로젝트를 찾을 수 없습니다.</p>
          <Link href="/admin/projects" className="text-blue-600 hover:underline mt-2 inline-block">
            프로젝트 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 프로젝트 상세 페이지 컴포넌트 (실제 웹사이트와 동일)
  const ProjectDetailContent = () => (
    <div className="min-h-screen bg-white">
      <div className="py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* 브레드크럼 */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="flex items-center gap-2 text-sm text-gray-500 mb-8"
          >
            <span className="hover:text-gray-700 transition-colors cursor-pointer">홈</span>
            <span>•</span>
            <span className="hover:text-gray-700 transition-colors cursor-pointer">프로젝트</span>
            <span>•</span>
            <span className="text-gray-700">{project.title}</span>
          </motion.div>

          {/* 프로젝트 헤더 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">
                  {project.title}
                </h1>
                <div className="flex items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {project.year}
                  </span>
                  {project.area && (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      {project.area}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 lg:mt-0">
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {project.category === 'Residential' ? '주거' :
                    project.category === 'Commercial' ? '상업' :
                      project.category === 'F&B' ? '카페/레스토랑' :
                        project.category === 'Healthcare' ? '의료' :
                          project.category === 'Cultural' ? '문화/예술' : project.category}
                </span>
              </div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
              {project.description}
            </p>
          </motion.div>

          {/* 메인 이미지 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className="aspect-[16/9] relative rounded-2xl overflow-hidden mb-12 shadow-xl"
          >
            <Image
              src={project.mainImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* 프로젝트 정보 */}
          <motion.div
            variants={createStaggerContainer(0.1)}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12"
          >
            {/* 프로젝트 상세 */}
            <motion.div
              variants={createStaggerItem()}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-medium text-gray-900 mb-6">프로젝트 개요</h2>

              {project.concept && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">컨셉</h3>
                  <p className="text-gray-600 leading-relaxed">{project.concept}</p>
                </div>
              )}

              {project.features && project.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">주요 특징</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.materials && project.materials.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">사용 소재</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.materials.map((material, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* 프로젝트 정보 */}
            <motion.div
              variants={createStaggerItem()}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">프로젝트 정보</h3>
                <div className="space-y-3 text-sm">
                  {project.client && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">클라이언트</span>
                      <span className="text-gray-900">{project.client}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">위치</span>
                    <span className="text-gray-900">{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">연도</span>
                    <span className="text-gray-900">{project.year}</span>
                  </div>
                  {project.area && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">면적</span>
                      <span className="text-gray-900">{project.area}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">카테고리</span>
                    <span className="text-gray-900">
                      {project.category === 'Residential' ? '주거' :
                        project.category === 'Commercial' ? '상업' :
                          project.category === 'F&B' ? '카페/레스토랑' :
                            project.category === 'Healthcare' ? '의료' :
                              project.category === 'Cultural' ? '문화/예술' : project.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 갤러리 이미지 */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12"
            >
              <h2 className="text-2xl font-medium text-gray-900 mb-8">프로젝트 갤러리</h2>
              <motion.div
                variants={createStaggerContainer(0.1)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {project.galleryImages.map((image, idx) => (
                  <motion.div
                    key={idx}
                    variants={createStaggerItem()}
                    className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} 갤러리 ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'min-h-screen bg-gray-50'}`}>
      {/* 미리보기 컨트롤 바 */}
      {!isFullscreen && (
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/projects"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← 프로젝트 목록
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-lg font-medium text-gray-900">
                  {project.title} 미리보기
                </h1>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  PREVIEW
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {/* 화면 모드 전환 */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${viewMode === 'desktop'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    데스크톱
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${viewMode === 'mobile'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    모바일
                  </button>
                </div>

                {/* 전체화면 */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="전체화면 (F11)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>

                {/* 편집 */}
                <Link
                  href={`/admin/projects/${project.slug}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  편집
                </Link>

                {/* 실제 페이지 */}
                <Link
                  href={`/ko/projects/${project.slug}`}
                  target="_blank"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  실제 페이지
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 전체화면 모드 컨트롤 */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm">
            미리보기 모드 • ESC로 나가기
          </div>
          <button
            onClick={() => setIsFullscreen(false)}
            className="bg-black/80 text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 미리보기 콘텐츠 */}
      <div className={`${isFullscreen ? '' : 'py-8'}`}>
        <div className={`${isFullscreen ? '' : 'max-w-7xl mx-auto px-6'}`}>
          <div className={`bg-white shadow-lg overflow-hidden ${isFullscreen
              ? ''
              : viewMode === 'mobile'
                ? 'max-w-sm mx-auto rounded-lg'
                : 'rounded-lg'
            }`}>
            {/* 브라우저 시뮬레이션 헤더 (전체화면이 아닐 때만) */}
            {!isFullscreen && (
              <div className="bg-gray-100 px-4 py-2 border-b flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                  khakishop.com/projects/{project.slug}
                </div>
                <div className="text-xs text-gray-500">
                  {viewMode === 'mobile' ? '375px' : '1200px'}
                </div>
              </div>
            )}

            {/* 실제 프로젝트 콘텐츠 */}
            <div className={`${viewMode === 'mobile' && !isFullscreen ? 'text-sm' : ''}`}>
              <ProjectDetailContent />
            </div>
          </div>
        </div>
      </div>

      {/* 단축키 안내 (전체화면이 아닐 때만) */}
      {!isFullscreen && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs">
          <div className="space-y-1">
            <div><kbd className="bg-white/20 px-1 rounded">M</kbd> 모바일/데스크톱 전환</div>
            <div><kbd className="bg-white/20 px-1 rounded">F11</kbd> 전체화면</div>
          </div>
        </div>
      )}
    </div>
  );
} 