'use client';

import Image from 'next/image';
import Link from 'next/link';
import HomeButton from '../../../components/ui/HomeButton';
import { getAllReferenceProducts } from '../../../data/references';

export default function ReferencesPageClient() {
  console.log('🚀 ReferencesPageClient 시작 - 정적 모드');

  // 🔧 Static data loading - no React state
  const references = getAllReferenceProducts();
  console.log('📦 레퍼런스 데이터 정적 로드:', references);
  console.log('📦 데이터 개수:', references.length);

  // 🎨 렌더링
  return (
    <div className="min-h-screen bg-white">
      <HomeButton />
      {/* 헤더 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 mb-6 leading-tight">
              REFERENCES
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed">
              다양한 공간에서 펼쳐지는 우리의 이야기들.<br className="hidden sm:block" />
              각각의 프로젝트는 공간과 사람, 그리고 빛이 만나는 특별한 순간을 담고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 레퍼런스 그리드 섹션 */}
      <section className="py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* 상태 표시 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              정적 모드: {references.length}개 레퍼런스 로드됨
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              데이터: {references.length > 0 ? '✅ 성공' : '❌ 실패'}
            </p>
          </div>

          {/* 🎯 정적 렌더링 */}
          {references.length > 0 ? (
            <div className="space-y-12">
              {/* 간단한 리스트 테스트 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">✅ 데이터 로드 성공 (정적 리스트)</h3>
                {references.map((item, index) => (
                  <div key={item.slug} className="border-b border-green-200 py-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-green-900">{index + 1}. {item.title}</h4>
                        <p className="text-sm text-green-700">{item.location} • {item.projectDate} • {item.subcategory}</p>
                        <p className="text-xs text-green-600 mt-1">{item.description.slice(0, 100)}...</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {item.slug}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 그리드 렌더링 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-8">🎨 레퍼런스 그리드</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {references.map((reference, index) => (
                    <Link
                      key={reference.slug}
                      href={`/ko/references/${reference.slug}`}
                      className="group block"
                    >
                      <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                        {/* 레퍼런스 이미지 */}
                        <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                          <Image
                            src={reference.image || '/images/hero/hero.jpg'}
                            alt={`${reference.title} - ${reference.location}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading="lazy"
                          />

                          {/* 카테고리 배지 */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs uppercase tracking-wider rounded-full font-medium">
                              {reference.subcategory}
                            </span>
                          </div>

                          {/* 연도 배지 */}
                          <div className="absolute top-4 right-4">
                            <span className="inline-block px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs uppercase tracking-wider rounded-full font-medium">
                              {reference.projectDate?.slice(-4) || '2024'}
                            </span>
                          </div>
                        </div>

                        {/* 레퍼런스 정보 */}
                        <div className="p-6 lg:p-8 flex-1 flex flex-col">
                          <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                              <h3 className="text-xl lg:text-2xl font-serif text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                                {reference.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {reference.location}
                                </span>
                                {reference.duration && (
                                  <>
                                    <span>•</span>
                                    <span>{reference.duration}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-600 font-light leading-relaxed line-clamp-3 flex-1">
                              {reference.description}
                            </p>
                          </div>

                          {/* 더보기 링크 */}
                          <div className="pt-4 mt-auto">
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
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">❌</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-gray-900">
                    데이터 로드 실패
                  </h3>
                  <p className="text-gray-600 font-light">
                    레퍼런스 데이터를 불러올 수 없습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
