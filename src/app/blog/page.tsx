import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getCategories, getCategoryName } from '../../data/posts';

export const metadata: Metadata = {
  title: 'Blog | khaki shop',
  description: '인테리어와 텍스타일에 대한 유용한 정보와 팁을 제공합니다. 커튼, 블라인드, 스마트 홈 시스템에 대한 전문적인 가이드를 만나보세요.',
  keywords: '인테리어 블로그, 커튼 가이드, 블라인드 설치, 홈 인테리어, 텍스타일, khaki shop',
  openGraph: {
    title: 'Blog | khaki shop',
    description: '인테리어와 텍스타일에 대한 유용한 정보와 팁을 제공합니다.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'khaki shop blog'
      }
    ],
    type: 'website',
    locale: 'ko_KR',
  }
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 섹션 - RIGAS 스타일 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-serif text-gray-900 leading-tight tracking-tight mb-8">
            Journal
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            인테리어와 텍스타일에 대한 깊이 있는 이야기들. 
            공간을 더욱 아름답게 만드는 지혜와 영감을 나누어 드립니다.
          </p>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            <Link 
              href="/blog"
              className="px-6 py-3 text-sm uppercase tracking-wider font-medium text-gray-900 border-b-2 border-gray-900 hover:text-gray-600 transition-colors"
            >
              전체보기
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${category}`}
                className="px-6 py-3 text-sm uppercase tracking-wider font-medium text-gray-600 border-b-2 border-transparent hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                {getCategoryName(category)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 포스트 목록 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-16">
            {posts.map((post) => (
              <article key={post.slug} className="group space-y-6">
                
                {/* 카테고리 배지 */}
                <div className="flex justify-start">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs uppercase tracking-widest rounded-full font-medium">
                    {getCategoryName(post.category)}
                  </span>
                </div>

                {/* 포스트 내용 */}
                <div className="space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-serif text-gray-900 leading-tight tracking-tight group-hover:text-gray-600 transition-colors">
                    <Link href={`/posts/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-base lg:text-lg text-gray-600 font-light leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <time className="text-sm text-gray-500 font-light">
                    {formatDate(post.date)}
                  </time>
                  
                  <Link 
                    href={`/posts/${post.slug}`}
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