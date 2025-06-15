import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getAllTags, getNotionPosts, NotionPost } from '../../../../lib/notion';
import { createSEOMetadata } from '../../../utils/seoMetadata';

// 🎨 SEO 메타데이터 - 인테리어 가이드
export const metadata = createSEOMetadata('blog');

// 태그 필터 컴포넌트
async function TagFilter() {
  const tags = await getAllTags();

  if (tags.length === 0) return null;

  return (
    <section className="py-16 border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
          <Link
            href="/blog"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            전체보기
          </Link>
          {tags.slice(0, 8).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// 서버 컴포넌트로 블로그 포스트 목록을 렌더링
async function BlogPosts({
  searchParams,
}: {
  searchParams?: { tag?: string };
}) {
  const allPosts = await getNotionPosts();

  // 태그 필터링
  const posts = searchParams?.tag
    ? allPosts.filter((post) =>
      post.tags?.some(
        (postTag) => postTag.toLowerCase() === searchParams.tag?.toLowerCase()
      )
    )
    : allPosts;

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 게시글이 없는 경우
  if (!posts || posts.length === 0) {
    const isFiltered = searchParams?.tag;

    return (
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-4">
              {isFiltered
                ? `'${searchParams.tag}' 태그의 글이 없습니다`
                : '작성된 글이 없습니다'}
            </h3>
            <p className="text-lg text-gray-600 font-light max-w-md mx-auto leading-relaxed mb-6">
              {isFiltered
                ? '다른 태그를 선택하거나 전체보기를 확인해보세요.'
                : '새로운 글이 준비되는 대로 여기에서 만나보실 수 있습니다.'}
            </p>
            {isFiltered && (
              <Link
                href="/blog"
                className="inline-flex items-center text-gray-900 hover:text-gray-600 transition-colors text-sm uppercase tracking-wider font-medium"
              >
                전체 글 보기
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* 필터링 결과 표시 */}
        {searchParams?.tag && (
          <div className="mb-12 text-center">
            <div className="inline-flex items-center bg-gray-50 rounded-full px-6 py-3 mb-4">
              <span className="text-sm text-gray-600 mr-2">필터:</span>
              <span className="text-sm font-medium text-gray-900">
                {searchParams.tag}
              </span>
              <Link
                href="/blog"
                className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                title="필터 제거"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              {posts.length}개의 게시글을 찾았습니다
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-16">
          {posts.map((post: NotionPost) => (
            <article key={post.id} className="group space-y-6">
              {/* 커버 이미지 */}
              {post.coverImage && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              {/* 태그 배지 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs uppercase tracking-widest rounded-full font-medium hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* 포스트 내용 */}
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-serif text-gray-900 leading-tight tracking-tight group-hover:text-gray-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                {post.summary && (
                  <p className="text-base lg:text-lg text-gray-600 font-light leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                )}
              </div>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex flex-col space-y-1">
                  <time className="text-sm text-gray-500 font-light">
                    {formatDate(post.date)}
                  </time>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    {post.author && <span>by {post.author}</span>}
                    {post.readingTime && (
                      <>
                        <span>•</span>
                        <span>{post.readingTime}분 읽기</span>
                      </>
                    )}
                  </div>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-gray-900 hover:text-gray-600 transition-colors text-sm uppercase tracking-wider font-medium group"
                >
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
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BlogPage({
  searchParams,
}: {
  searchParams?: { tag?: string };
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 섹션 - RIGAS 스타일 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-serif text-gray-900 leading-tight tracking-tight mb-8">
            Journal
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            인테리어와 텍스타일에 대한 깊이 있는 이야기들. 공간을 더욱 아름답게
            만드는 지혜와 영감을 나누어 드립니다.
          </p>
        </div>
      </section>

      {/* 태그 필터 - Suspense로 래핑 */}
      <Suspense
        fallback={<div className="py-16 border-b border-gray-100"></div>}
      >
        <TagFilter />
      </Suspense>

      {/* 포스트 목록 - Suspense로 래핑 */}
      <Suspense
        fallback={
          <div className="py-20 lg:py-32">
            <div className="text-center">로딩 중...</div>
          </div>
        }
      >
        <BlogPosts searchParams={searchParams} />
      </Suspense>

      {/* 하단 CTA 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900 mb-8">
            더 많은 정보가 필요하신가요?
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto mb-10">
            전문 상담을 통해 고객님의 공간에 최적화된 솔루션을 제안해드립니다.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wider font-medium group"
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
        </div>
      </section>
    </div>
  );
}
