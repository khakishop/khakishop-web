import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomeButton from '../../../../components/ui/HomeButton';
import { getAllProjects, getProjectBySlug } from '../../../../data/projects';
import { createStaggerContainer, createStaggerItem, fadeIn, fadeInUp, motion } from "../../../../lib/motion";

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
      <HomeButton />

      <div className="py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* 브레드크럼 */}
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
            <Link href={`/${locale}/projects`} className="hover:text-gray-700 transition-colors">
              프로젝트
            </Link>
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

          {/* 다른 프로젝트 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="pt-12 border-t border-gray-200"
          >
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">다른 프로젝트도 확인해보세요</h2>
              <p className="text-gray-600 mb-8">KHAKISHOP의 다양한 프로젝트들을 만나보세요.</p>
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                모든 프로젝트 보기
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const projects = getAllProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
} 