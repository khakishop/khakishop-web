import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getProjectBySlug,
  getAllProjects,
  type Project,
} from '../../../../data/projects';
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

  return {
    title: `${project.title} | khaki shop References`,
    description: project.description,
    keywords: `${project.title}, ${project.location}, ${project.category}, 레퍼런스, 프로젝트, 카키샵, khaki shop, 텍스타일, 인테리어`,
    openGraph: {
      title: `${project.title} | khaki shop References`,
      description: project.description,
      images: [
        {
          url: project.mainImage || '/placeholder-project.jpg',
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'website',
      locale: 'ko_KR',
    },
  };
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

  // 모든 이미지 배열 (메인 이미지 + 갤러리 이미지)
  const allImages = [project.mainImage, ...(project.galleryImages || [])];

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
            </div>
          </div>
        </div>

        {/* 메인 이미지 갤러리 */}
        <div className="mb-16 lg:mb-20">
          <ImageGallery images={allImages} projectTitle={project.title} />
        </div>

        {/* 프로젝트 설명 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mb-16 lg:mb-20">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-serif tracking-tight text-gray-900 mb-6">
                프로젝트 소개
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.client && (
              <div>
                <h3 className="text-xl font-serif tracking-tight text-gray-900 mb-4">
                  클라이언트
                </h3>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  {project.client}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* 주요 특징 */}
            {project.features && project.features.length > 0 && (
              <div>
                <h3 className="text-xl font-serif tracking-tight text-gray-900 mb-6">
                  주요 특징
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-4 mt-2 flex-shrink-0"></span>
                      <span className="text-lg font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex items-center justify-between pt-16 border-t border-gray-100">
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
              모든 프로젝트 보기
            </span>
          </Link>

          <Link
            href="/ko/contact"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white text-sm uppercase tracking-wider font-medium rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}
