import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectBySlug, getAllProjects } from '../../../../data/projects';

interface ProjectDetailPageProps {
  params: { slug: string; locale: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = getProjectBySlug(params.slug);
  const locale = params.locale || 'ko';

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 뒤로가기 네비게이션 */}
      <div className="fixed top-8 left-8 z-10 space-y-2">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-sm text-white hover:text-gray-300 transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          홈으로
        </Link>
        <Link
          href={`/${locale}/project`}
          className="inline-flex items-center text-sm text-white hover:text-gray-300 transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          모든 프로젝트
        </Link>
      </div>

      {/* RIGAS 스타일 메인 이미지 - 풀스크린 */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {project.mainImage ? (
            <Image
              src={project.mainImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-16 h-16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium">프로젝트 메인 이미지</p>
              </div>
            </div>
          )}
        </div>

        {/* 이미지 위 오버레이 정보 */}
        <div className="absolute bottom-12 left-12 text-white z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-4 text-sm uppercase tracking-widest opacity-80">
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.year}</span>
              <span>•</span>
              <span>{project.size}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-serif tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-lg font-light tracking-wide opacity-90">
              {project.location}
            </p>
          </div>
        </div>
      </section>

      {/* 프로젝트 상세 정보 섹션 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* 왼쪽: 프로젝트 설명 */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl lg:text-3xl font-serif tracking-tight text-gray-900">
                  Project Overview
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                  {project.description}
                </p>
              </div>

              {/* 컨셉 */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Concept
                </h3>
                <p className="text-gray-600 leading-relaxed italic">
                  "{project.concept}"
                </p>
              </div>
            </div>

            {/* 오른쪽: 프로젝트 세부사항 */}
            <div className="space-y-8">
              {/* 사용 소재 */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Materials Used
                </h3>
                <ul className="space-y-2">
                  {project.materials.map((material, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="leading-relaxed">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 주요 특징 */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 프로젝트 정보 테이블 */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Project Info
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 gap-0">
                    <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-white border-b border-gray-200">
                      <span className="text-sm text-gray-900">
                        {project.location}
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-white border-b border-gray-200">
                      <span className="text-sm text-gray-900">
                        {project.category}
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-white border-b border-gray-200">
                      <span className="text-sm text-gray-900">
                        {project.year}
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-white">
                      <span className="text-sm text-gray-900">
                        {project.size}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 갤러리 섹션 (이미지가 있는 경우만) */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900">
                Project Gallery
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${project.title} - 갤러리 ${index + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA 섹션 - RIGAS 스타일 */}
      <section className="py-20 lg:py-32 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center px-6">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-white">
              비슷한 프로젝트를 원하시나요?
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed">
              {project.title}와 같은 공간을 꿈꾸고 계신가요?
              <br />
              전문 컨설턴트와 함께 당신만의 특별한 공간을 만들어보세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 text-sm uppercase tracking-wider font-medium">
                프로젝트 상담하기
              </button>
              <Link
                href={`/${locale}/project`}
                className="text-white hover:text-gray-300 transition-colors duration-300 text-sm uppercase tracking-wider font-medium border-b border-transparent hover:border-gray-300"
              >
                다른 프로젝트 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Static paths generation for all projects
export async function generateStaticParams() {
  const projects = getAllProjects();
  
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
