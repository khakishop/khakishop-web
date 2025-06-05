import { Metadata } from 'next';
import Script from 'next/script';
import HomeClient from '../HomeClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "khaki shop | 감성과 기능을 담은 텍스타일 전문점",
    description: "공간을 아름답게 만드는 텍스타일 브랜드 카키샵. 커튼, 블라인드, 전동 시스템으로 당신의 공간을 특별하게 완성해보세요. 일산 호수로 위치, 맞춤 상담 가능.",
    keywords: "카키샵, khaki shop, 커튼, 블라인드, 전동시스템, 텍스타일, 인테리어, 일산, 호수로, 맞춤제작",
    openGraph: {
      title: "khaki shop | 감성과 기능을 담은 텍스타일 전문점",
      description: "공간을 아름답게 만드는 텍스타일 브랜드 카키샵. 커튼, 블라인드, 전동 시스템으로 당신의 공간을 특별하게 완성해보세요.",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "khaki shop 대표 이미지"
        }
      ],
      type: "website",
      locale: "ko_KR",
    }
  };
}

export default function Home() {
  // JSON-LD 구조화된 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "khaki shop",
    "url": "https://khakishop.kr",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "호수로 430번길 24 1층",
      "addressLocality": "일산동구",
      "addressRegion": "경기도",
      "addressCountry": "KR"
    },
    "telephone": "0507-1372-0358",
    "email": "lskshsrl@naver.com",
    "image": "https://khakishop.kr/og-image.jpg",
    "description": "감성과 기능을 담은 텍스타일 전문 커튼 브랜드",
    "priceRange": "$$",
    "openingHours": [
      "Mo-Sa 10:00-20:00"
    ],
    "sameAs": [
      "https://blog.naver.com/lskshsrl"
    ]
  };

  return (
    <>
      {/* JSON-LD 구조화된 데이터 */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      
      <HomeClient />
    </>
  )
} 