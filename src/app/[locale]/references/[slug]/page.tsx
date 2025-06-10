import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getProjectBySlug,
  getAllProjects,
  type Project,
} from '../../../../data/projects';
import { createReferencesMetadata } from '../../../../utils/seoMetadata';
import { getReferenceImagePaths, getProjectMainImageUrl } from '../../../../utils/imageUtils';
import { ImageGallery } from './ImageGallery';

// 타입 정의
interface ReferencePageProps {
  params: {
    slug: string;
    locale: string;
  };
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: ReferencePageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: '프로젝트를 찾을 수 없습니다 | khaki shop',
      description: '요청하신 프로젝트를 찾을 수 없습니다.',
    };
  }

  // 프로젝트 이미지 경로 가져오기
  const imagePaths = getReferenceImagePaths(params.slug);
  const mainImageUrl = getProjectMainImageUrl(params.slug);

  return createReferencesMetadata({
    projectTitle: project.title,
    projectLocation: project.location,
    projectCategory: project.category,
    projectDescription: project.description,
    projectSlug: params.slug,
    projectImage: mainImageUrl, // 첫 번째 이미지를 OpenGraph 이미지로 사용
  });
}

// 정적 경로 생성
export async function generateStaticParams() {
  const projects = getAllProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ReferenceDetailPage({ params }: ReferencePageProps) {
  const project = getProjectBySlug(params.slug);

  // 프로젝트를 찾을 수 없으면 404 페이지로 이동
  if (!project) {
    notFound();
  }

  // 최적화된 이미지 경로들 가져오기
  const optimizedImages = getReferenceImagePaths(params.slug);
  
  // fallback으로 기존 이미지들도 사용
  const fallbackImages = [project.mainImage, ...(project.galleryImages || [])].filter(Boolean);
  
  // 최종 이미지 배열 (최적화된 이미지 우선, fallback 이미지 보조)
  const allImages = optimizedImages.length > 0 ? optimizedImages : fallbackImages;

  // 카테고리 한글 변환
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'Residential':
        return '주거';
      case 'Commercial':
        return '상업';
      case 'F&B':
        return '카페/레스토랑';
      case 'Healthcare':
        return '의료';
      case 'Cultural':
        return '문화';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 - RIGAS 스타일 */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {/* 뒤로가기 버튼 */}
            <Link
              href="/ko/references"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
            >
              <svg
                className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span className="text-sm uppercase tracking-wider font-medium">
                Back to References
              </span>
            </Link>

            {/* 브레드크럼 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link
                href="/ko"
                className="hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/ko/references"
                className="hover:text-gray-900 transition-colors"
              >
                References
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{project.title}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-screen-xl mx-auto px-6 py-16 lg:py-24">
        {/* 프로젝트 헤더 */}
        <div className="mb-16 lg:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end">
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm uppercase tracking-widest rounded-full font-medium">
                  {getCategoryName(project.category)}
                </span>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-gray-900 leading-tight tracking-tight">
                  {project.title}
                </h1>
              </div>
            </div>

            {/* 프로젝트 정보 */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">
                    Location
                  </dt>
                  <dd className="text-lg font-light text-gray-900">
                    {project.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">
                    Year
                  </dt>
                  <dd className="text-lg font-light text-gray-900">
                    {project.year}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">
                    Size
                  </dt>
                  <dd className="text-lg font-light text-gray-900">
                    {project.area || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">
                    Category
                  </dt>
                  <dd className="text-lg font-light text-gray-900">
                    {getCategoryName(project.category)}
                  </dd>
                </div>
              </div>

              {/* 이미지 품질 표시 - RIGAS 스타일 */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs uppercase tracking-wider">
                    High Quality • {allImages.length} Photos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 이미지 갤러리 - 최적화 적용 */}
        <div className="mb-16 lg:mb-20">
          <ImageGallery 
            images={allImages} 
            projectTitle={project.title}
            projectSlug={params.slug}
          />
        </div>

        {/* 프로젝트 설명 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mb-16 lg:mb-20">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-serif tracking-tight text-gray-900 mb-6">
                프로젝트 소개
              </h2>
              <div className="prose prose-lg prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed font-light">
                  {project.description}
                </p>
              </div>
            </div>

            {/* 프로젝트 특징 */}
            {project.features && project.features.length > 0 && (
              <div>
                <h3 className="text-xl font-serif tracking-tight text-gray-900 mb-4">
                  주요 특징
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 font-light leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 프로젝트 상세 정보 */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-serif tracking-tight text-gray-900 mb-6">
                프로젝트 상세
              </h3>
              <dl className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                    클라이언트
                  </dt>
                  <dd className="text-gray-900 font-light">
                    {project.client || 'Private Client'}
                  </dd>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                    위치
                  </dt>
                  <dd className="text-gray-900 font-light">
                    {project.location}
                  </dd>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                    완공년도
                  </dt>
                  <dd className="text-gray-900 font-light">
                    {project.year}
                  </dd>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                    면적
                  </dt>
                  <dd className="text-gray-900 font-light">
                    {project.area || 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between items-center py-3">
                  <dt className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                    카테고리
                  </dt>
                  <dd className="text-gray-900 font-light">
                    {getCategoryName(project.category)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 관련 서비스 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-serif tracking-tight text-gray-900 mb-4">
                관련 서비스
              </h3>
              <div className="space-y-3">
                <Link
                  href="/ko/curtain"
                  className="block text-gray-700 hover:text-gray-900 transition-colors duration-200 font-light"
                >
                  • 커튼 설계 및 시공
                </Link>
                <Link
                  href="/ko/blind"
                  className="block text-gray-700 hover:text-gray-900 transition-colors duration-200 font-light"
                >
                  • 블라인드 설치
                </Link>
                <Link
                  href="/ko/motorized"
                  className="block text-gray-700 hover:text-gray-900 transition-colors duration-200 font-light"
                >
                  • 전동 시스템
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="border-t border-gray-100 pt-16">
          <div className="flex items-center justify-between">
            <Link
              href="/ko/references"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
            >
              <svg
                className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span className="text-sm uppercase tracking-wider font-medium">
                모든 시공 사례 보기
              </span>
            </Link>

            <div className="text-right">
              <p className="text-sm text-gray-600 font-light mb-1">
                궁금한 점이 있으신가요?
              </p>
              <Link
                href="/ko/contact"
                className="text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium"
              >
                문의하기 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
