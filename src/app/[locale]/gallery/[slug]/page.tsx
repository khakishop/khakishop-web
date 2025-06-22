import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomeButton from '../../../../components/ui/HomeButton';
import { getAllGalleryItems, getGalleryItemBySlug } from '../../../../data/gallery';
import { createStaggerContainer, createStaggerItem, fadeIn, fadeInUp, motion } from "../../../../lib/motion";

interface GalleryDetailPageProps {
  params: { slug: string; locale: string };
}

export default function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const item = getGalleryItemBySlug(params.slug);
  const locale = params.locale || 'ko';

  if (!item) {
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
            <Link href={`/${locale}/gallery`} className="hover:text-gray-700 transition-colors">
              갤러리
            </Link>
            <span>•</span>
            <span className="text-gray-700">{item.title}</span>
          </motion.div>

          {/* 갤러리 헤더 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">
                  {item.title}
                </h1>
                <div className="flex items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                  {item.photographer && (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.photographer}
                    </span>
                  )}
                  {item.location && (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 lg:mt-0 flex items-center gap-3">
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {item.category === 'Curtain' ? '커튼' :
                    item.category === 'Blind' ? '블라인드' :
                      item.category === 'Motorized' ? '전동 제품' :
                        item.category === 'Interior' ? '인테리어' :
                          item.category === 'Lifestyle' ? '라이프스타일' : item.category}
                </span>
                {item.featured && (
                  <span className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mb-6">
              {item.description}
            </p>

            {/* 태그들 */}
            <motion.div
              variants={createStaggerContainer(0.05)}
              initial="initial"
              animate="animate"
              className="flex flex-wrap gap-2"
            >
              {item.tags.map((tag, idx) => (
                <motion.span
                  key={idx}
                  variants={createStaggerItem()}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* 메인 이미지 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className="aspect-[16/10] relative rounded-2xl overflow-hidden mb-12 shadow-xl"
          >
            <Image
              src={item.mainImage}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* 갤러리 이미지들 */}
          {item.images && item.images.length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12"
            >
              <h2 className="text-2xl font-medium text-gray-900 mb-8">상세 이미지</h2>
              <motion.div
                variants={createStaggerContainer(0.1)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {item.images.map((image, idx) => (
                  <motion.div
                    key={idx}
                    variants={createStaggerItem()}
                    className="group"
                  >
                    <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={image}
                        alt={`${item.title} 상세 이미지 ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* 갤러리 정보 */}
          <motion.div
            variants={createStaggerContainer(0.1)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12"
          >
            <motion.div
              variants={createStaggerItem()}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-medium text-gray-900 mb-6">갤러리 소개</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={createStaggerItem()}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">갤러리 정보</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">카테고리</span>
                    <span className="text-gray-900">
                      {item.category === 'Curtain' ? '커튼' :
                        item.category === 'Blind' ? '블라인드' :
                          item.category === 'Motorized' ? '전동 제품' :
                            item.category === 'Interior' ? '인테리어' :
                              item.category === 'Lifestyle' ? '라이프스타일' : item.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">생성일</span>
                    <span className="text-gray-900">{new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  {item.photographer && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">사진작가</span>
                      <span className="text-gray-900">{item.photographer}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">촬영 장소</span>
                      <span className="text-gray-900">{item.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">이미지 수</span>
                    <span className="text-gray-900">{item.images.length + 1}장</span>
                  </div>
                  {item.featured && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">상태</span>
                      <span className="text-yellow-600 font-medium">Featured</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 다른 갤러리 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="pt-12 border-t border-gray-200"
          >
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">다른 갤러리도 확인해보세요</h2>
              <p className="text-gray-600 mb-8">KHAKISHOP의 다양한 갤러리들을 만나보세요.</p>
              <Link
                href={`/${locale}/gallery`}
                className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                모든 갤러리 보기
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
  const items = getAllGalleryItems();

  return items.map((item) => ({
    slug: item.slug,
  }));
} 