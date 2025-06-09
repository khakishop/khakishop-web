import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllPosts,
  getPostBySlug,
  getCategoryName,
} from '../../../../data/posts';

// 타입 정의
interface PostPageProps {
  params: {
    slug: string;
  };
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 | khaki shop',
      description: '요청하신 포스트를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${post.title} | khaki shop`,
    description: post.summary,
    keywords: `${post.title}, ${getCategoryName(post.category)}, 인테리어, 텍스타일, khaki shop`,
    openGraph: {
      title: `${post.title} | khaki shop`,
      description: post.summary,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      locale: 'ko_KR',
      publishedTime: post.date,
    },
  };
}

// 정적 경로 생성
export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostDetailPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  // 포스트를 찾을 수 없으면 404 페이지로 이동
  if (!post) {
    notFound();
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 마크다운 스타일의 콘텐츠를 렌더링하기 위한 간단한 파싱
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // 제목 파싱
      if (line.startsWith('# ')) {
        return (
          <h1
            key={index}
            className="text-3xl lg:text-4xl font-serif text-gray-900 leading-tight tracking-tight mb-8 mt-12 first:mt-0"
          >
            {line.substring(2)}
          </h1>
        );
      }

      if (line.startsWith('## ')) {
        return (
          <h2
            key={index}
            className="text-2xl lg:text-3xl font-serif text-gray-900 leading-tight tracking-tight mb-6 mt-10"
          >
            {line.substring(3)}
          </h2>
        );
      }

      if (line.startsWith('### ')) {
        return (
          <h3
            key={index}
            className="text-xl lg:text-2xl font-serif text-gray-900 leading-tight tracking-tight mb-4 mt-8"
          >
            {line.substring(4)}
          </h3>
        );
      }

      // 리스트 파싱
      if (line.startsWith('- ')) {
        return (
          <li
            key={index}
            className="text-lg text-gray-700 font-light leading-relaxed mb-2 ml-6 list-disc"
          >
            {line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </li>
        );
      }

      // 숫자 리스트 파싱
      if (/^\d+\.\s/.test(line)) {
        return (
          <li
            key={index}
            className="text-lg text-gray-700 font-light leading-relaxed mb-2 ml-6 list-decimal"
          >
            {line
              .replace(/^\d+\.\s/, '')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </li>
        );
      }

      // 일반 문단
      if (line.trim() && !line.startsWith('#')) {
        return (
          <p
            key={index}
            className="text-lg text-gray-700 font-light leading-relaxed mb-6"
            dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
            }}
          ></p>
        );
      }

      // 빈 줄
      return <div key={index} className="mb-4"></div>;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 브레드크럼 */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-gray-900 transition-colors"
            >
              Journal
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <article className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        {/* 포스트 헤더 */}
        <header className="mb-16 lg:mb-20 text-center">
          {/* 카테고리 */}
          <div className="mb-8">
            <Link
              href={`/blog?category=${post.category}`}
              className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm uppercase tracking-widest rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              {getCategoryName(post.category)}
            </Link>
          </div>

          {/* 제목 */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-gray-900 leading-tight tracking-tight mb-8">
            {post.title}
          </h1>

          {/* 날짜 */}
          <time className="text-lg text-gray-500 font-light">
            {formatDate(post.date)}
          </time>
        </header>

        {/* 포스트 본문 */}
        <div className="prose prose-lg max-w-none">
          <div className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed mb-12 p-8 bg-gray-50 rounded-2xl">
            {post.summary}
          </div>

          <div className="space-y-6">{renderContent(post.content)}</div>
        </div>
      </article>

      {/* CTA 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900 mb-6">
            전문적인 상담이 필요하신가요?
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto mb-10">
            이 글이 도움이 되셨다면, 실제 시공과 설치에 대한 전문 상담을
            받아보세요. 고객님의 공간에 최적화된 솔루션을 제안해드립니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wider font-medium group"
            >
              <span>시공 문의하기</span>
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

            <Link
              href="/blog"
              className="inline-flex items-center text-gray-900 hover:text-gray-600 transition-colors text-sm uppercase tracking-wider font-medium border-b border-transparent hover:border-gray-900"
            >
              <span>다른 글 둘러보기</span>
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
          </div>
        </div>
      </section>
    </div>
  );
}
