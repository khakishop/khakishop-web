import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getAllCollections, 
  getCollectionBySlug, 
  getCollectionCategoryName 
} from '../../../data/collections';

// 타입 정의
interface CollectionPageProps {
  params: {
    slug: string;
  };
}

// 메타데이터 생성
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = getCollectionBySlug(params.slug);

  if (!collection) {
    return {
      title: '컬렉션을 찾을 수 없습니다 | khaki shop',
      description: '요청하신 컬렉션을 찾을 수 없습니다.'
    };
  }

  return {
    title: `${collection.title} | khaki shop`,
    description: collection.summary,
    keywords: `${collection.title}, ${getCollectionCategoryName(collection.category)}, 텍스타일, 인테리어, khaki shop`,
    openGraph: {
      title: `${collection.title} | khaki shop`,
      description: collection.summary,
      images: [
        {
          url: collection.image,
          width: 1200,
          height: 630,
          alt: collection.title
        }
      ],
      type: 'website',
      locale: 'ko_KR',
    }
  };
}

// 정적 경로 생성
export async function generateStaticParams() {
  const collections = getAllCollections();
  
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}

export default function CollectionDetailPage({ params }: CollectionPageProps) {
  const collection = getCollectionBySlug(params.slug);

  // 컬렉션을 찾을 수 없으면 404 페이지로 이동
  if (!collection) {
    notFound();
  }

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
            <Link href="/collection" className="hover:text-gray-900 transition-colors">
              Collection
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{collection.title}</span>
          </nav>
        </div>
      </div>

      {/* 메인 컬렉션 섹션 */}
      <section className="py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* 컬렉션 이미지 */}
            <div className="space-y-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* 컬렉션 정보 */}
            <div className="space-y-8 lg:pl-8">
              
              {/* 카테고리 */}
              <div>
                <Link 
                  href={`/collection?category=${collection.category}`}
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm uppercase tracking-widest rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  {getCollectionCategoryName(collection.category)}
                </Link>
              </div>

              {/* 제목과 요약 */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-gray-900 leading-tight tracking-tight">
                  {collection.title}
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed">
                  {collection.summary}
                </p>
              </div>

              {/* 상세 설명 */}
              <div className="pt-8 border-t border-gray-100">
                <p className="text-lg text-gray-700 font-light leading-relaxed">
                  {collection.description}
                </p>
              </div>

              {/* CTA 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wider font-medium group"
                >
                  <span>문의하기</span>
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
                  href="/references"
                  className="inline-flex items-center justify-center text-gray-900 hover:text-gray-600 transition-colors text-sm uppercase tracking-wider font-medium border border-gray-300 px-8 py-4 rounded-full hover:border-gray-900"
                >
                  <span>시공 사례 보기</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 관련 컬렉션 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900 mb-6">
              관련 컬렉션
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              이 컬렉션과 함께 고려해보실 만한 다른 컬렉션들을 추천해드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {getAllCollections()
              .filter(c => c.slug !== collection.slug && c.category === collection.category)
              .slice(0, 3)
              .map((relatedCollection) => (
                <article key={relatedCollection.slug} className="group">
                  <Link href={`/collection/${relatedCollection.slug}`}>
                    <div className="space-y-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                        <Image
                          src={relatedCollection.image}
                          alt={relatedCollection.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-serif text-gray-900 leading-tight tracking-tight group-hover:text-gray-600 transition-colors">
                          {relatedCollection.title}
                        </h3>
                        <p className="text-gray-600 font-light leading-relaxed">
                          {relatedCollection.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA 섹션 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900 mb-8">
            이 컬렉션이 마음에 드시나요?
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto mb-10">
            전문 상담을 통해 고객님의 공간에 최적화된 맞춤 제안을 받아보세요. 
            정확한 측정부터 설치까지 모든 과정을 지원해드립니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/contact"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wider font-medium group"
            >
              <span>견적 문의하기</span>
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
              href="/collection"
              className="inline-flex items-center text-gray-900 hover:text-gray-600 transition-colors text-sm uppercase tracking-wider font-medium border-b border-transparent hover:border-gray-900"
            >
              <span>다른 컬렉션 보기</span>
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