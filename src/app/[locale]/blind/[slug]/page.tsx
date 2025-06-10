import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBlindProducts, getBlindProductBySlug } from '../../../../data/blind';
import BlindDetailPage from '../../../../components/BlindDetailPage';

interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
}

// 정적 경로 생성
export async function generateStaticParams() {
  const products = getAllBlindProducts();
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getBlindProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: '페이지를 찾을 수 없습니다 | 카키샵',
    };
  }

  const baseUrl = 'https://khakishop.kr';
  const imageUrl = `${baseUrl}${product.mainImage}`;

  return {
    title: `${product.title} | 카키샵 블라인드`,
    description: product.description,
    keywords: [
      product.title,
      '블라인드',
      product.category.replace('-', ' '),
      ...product.features.slice(0, 3),
      ...product.materials.slice(0, 2),
    ].join(', '),
    openGraph: {
      title: `${product.title} | 카키샵 블라인드`,
      description: product.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | 카키샵 블라인드`,
      description: product.description,
      images: [imageUrl],
    },
  };
}

export default function BlindDetailPageRoute({ params }: PageProps) {
  const product = getBlindProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <BlindDetailPage product={product} />;
} 