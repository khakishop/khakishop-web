import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '../../../data/products';

// 타입 정의
interface ProductPageProps {
  params: {
    slug: string;
  };
}

// 메타데이터 생성
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const products = getAllProducts();
  const product = products.find(p => p.slug === params.slug);

  if (!product) {
    return {
      title: '제품을 찾을 수 없습니다 | khaki shop',
      description: '요청하신 제품을 찾을 수 없습니다.'
    };
  }

  return {
    title: `${product.title} | khaki shop`,
    description: product.description,
    keywords: `${product.title}, ${product.category}, 카키샵, khaki shop, 텍스타일`,
    openGraph: {
      title: `${product.title} | khaki shop`,
      description: product.description,
      images: [
        {
          url: product.image || '/placeholder-product.jpg',
          width: 1200,
          height: 630,
          alt: product.title
        }
      ],
      type: 'website',
      locale: 'ko_KR',
    }
  };
}

// 정적 경로 생성 (선택사항 - 빌드 시 미리 생성)
export async function generateStaticParams() {
  const products = getAllProducts();
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const products = getAllProducts();
  const product = products.find(p => p.slug === params.slug);

  // 제품을 찾을 수 없으면 404 페이지로 이동
  if (!product) {
    notFound();
  }

  // 카테고리 한글 변환
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'curtain': return '커튼';
      case 'blind': return '블라인드';
      case 'motorized': return '전동 시스템';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 브레드크럼 - RIGAS 스타일 */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900 transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link href={`/${product.category}`} className="hover:text-gray-900 transition-colors">
              {getCategoryName(product.category)}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-screen-xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          
          {/* 왼쪽: 제품 이미지 */}
          <div className="space-y-6">
            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <Image
                src={product.image || '/placeholder-product.jpg'}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* 이미지 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-transparent"></div>
            </div>
            
            {/* 카테고리 배지 */}
            <div className="flex justify-center">
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm uppercase tracking-widest rounded-full font-medium">
                {getCategoryName(product.category)}
              </span>
            </div>
          </div>

          {/* 오른쪽: 제품 정보 */}
          <div className="space-y-12">
            
            {/* 제품명 */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-gray-900 leading-tight tracking-tight">
                {product.title}
              </h1>
            </div>

            {/* 제품 설명 */}
            <div className="space-y-6">
              <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* 주요 특징 */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif tracking-tight text-gray-900">
                주요 특징
              </h3>
              <ul className="space-y-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-4 mt-2 flex-shrink-0"></span>
                    <span className="text-lg font-light leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA 버튼 */}
            <div className="pt-8 space-y-6">
              <Link 
                href="/contact"
                className="group inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wider font-medium"
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
              
              {/* 추가 정보 */}
              <p className="text-sm text-gray-500 font-light">
                상담 시간: 평일 10:00 - 20:00 | 전화: 0507-1372-0358
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 하단 관련 제품 섹션 - RIGAS 스타일 */}
      <section className="py-20 lg:py-24 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900 mb-6">
              같은 카테고리의 다른 제품
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {getCategoryName(product.category)} 컬렉션의 다양한 제품들을 만나보세요.
            </p>
          </div>

          <div className="text-center">
            <Link 
              href={`/${product.category}`}
              className="inline-flex items-center text-gray-900 hover:text-gray-600 transition-colors duration-300 text-sm uppercase tracking-wider font-medium border-b border-transparent hover:border-gray-900"
            >
              <span>{getCategoryName(product.category)} 컬렉션 보기</span>
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