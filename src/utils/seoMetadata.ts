// ================================================================================
// 🎨 KHAKISHOP SEO 메타데이터 관리 시스템
// ================================================================================
// 🎯 목적: RIGAS 모티브 + 일산 커튼 전문점 브랜딩 + 검색 최적화
// 📊 기능: 페이지별 맞춤형 title/description + OpenGraph + 구조화 데이터

import { Metadata } from 'next';

// 🎨 기본 브랜드 정보
const BRAND = {
  name: 'khaki shop',
  tagline: '감성과 기능을 담은 일산 커튼 전문 브랜드',
  location: '일산',
  specialty: '맞춤형 커튼 시공',
  website: 'https://khakishop.kr',
  description:
    '일산에서 감성과 품질을 모두 갖춘 커튼 시공. khaki shop은 맞춤형 디자인과 고급 원단으로 공간에 새로운 무드를 제안합니다.',
};

// 🗺️ 페이지별 SEO 메타데이터 매핑
export const seoPages = {
  home: {
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description: BRAND.description,
    keywords: [
      '일산 커튼',
      '커튼 시공',
      'khaki shop',
      '맞춤형 커튼',
      '인테리어 커튼',
      '고양시 커튼',
      '감성 인테리어',
    ],
    ogImage: '/images/midjourney/2.png',
  },

  curtain: {
    title: `커튼 컬렉션 | ${BRAND.name} - 프리미엄 원단으로 완성하는 감성 공간`,
    description:
      '다양한 스타일의 프리미엄 커튼 컬렉션. 클래식부터 모던까지, khaki shop만의 감성적인 디자인으로 공간을 완성하세요.',
    keywords: [
      '커튼 종류',
      '맞춤 커튼',
      '리넨 커튼',
      '모던 커튼',
      '클래식 커튼',
      '일산 커튼 전문점',
    ],
    ogImage: '/images/midjourney/7.png',
  },

  blind: {
    title: `블라인드 컬렉션 | ${BRAND.name} - 기능과 디자인의 완벽한 조화`,
    description:
      '우드, 알루미늄, 패브릭 블라인드까지. 실용성과 미학을 모두 만족하는 khaki shop의 블라인드 컬렉션을 만나보세요.',
    keywords: [
      '블라인드 종류',
      '우드 블라인드',
      '알루미늄 블라인드',
      '패브릭 블라인드',
      '맞춤 블라인드',
      '일산 블라인드',
    ],
    ogImage: '/images/midjourney/9.png',
  },

  motorized: {
    title: `모터라이즈 시스템 | ${BRAND.name} - 스마트한 공간의 시작`,
    description:
      '무선 모터와 스마트 홈 연동으로 더욱 편리해진 커튼&블라인드. khaki shop의 미래형 자동화 시스템을 경험하세요.',
    keywords: [
      '자동 커튼',
      '모터라이즈',
      '스마트 홈',
      '무선 모터',
      '자동화 시스템',
      '일산 스마트 인테리어',
    ],
    ogImage: '/images/midjourney/11.png',
  },

  collection: {
    title: `컬렉션 | ${BRAND.name} - 계절과 트렌드를 담은 특별한 제안`,
    description:
      '에센셜 리넨부터 프리미엄 베네치안까지. 매 시즌 새롭게 선보이는 khaki shop의 큐레이션 컬렉션입니다.',
    keywords: [
      '시즌 컬렉션',
      '에센셜 리넨',
      '베네치안 블라인드',
      '디자이너 하드웨어',
      '럭셔리 타이백',
    ],
    ogImage: '/images/midjourney/8.png',
  },

  references: {
    title: `시공 사례 | ${BRAND.name} - 검증된 전문성과 완성도`,
    description:
      '분당 미니멀 레지던스부터 홍대 클래식 카페까지. 다양한 공간에서 증명된 khaki shop의 시공 전문성을 확인하세요.',
    keywords: [
      '커튼 시공 사례',
      '인테리어 포트폴리오',
      '상업공간 시공',
      '주거공간 시공',
      '일산 인테리어',
    ],
    ogImage: '/images/midjourney/15.png',
  },

  about: {
    title: `브랜드 스토리 | ${BRAND.name} - 감성과 품질에 대한 우리의 약속`,
    description:
      'RIGAS 모티브에서 영감받은 미니멀 감성과 장인정신으로 완성하는 khaki shop의 브랜드 철학과 비전을 소개합니다.',
    keywords: [
      'khaki shop 소개',
      '브랜드 스토리',
      '일산 커튼 전문점',
      '인테리어 철학',
      '품질 관리',
    ],
    ogImage: '/images/midjourney/3.png',
  },

  blog: {
    title: `인테리어 가이드 | ${BRAND.name} - 전문가가 알려주는 스타일링 팁`,
    description:
      '2024 디자인 트렌드부터 관리 팁까지. khaki shop 전문가가 제안하는 인테리어 가이드와 실용적인 정보를 만나보세요.',
    keywords: [
      '인테리어 팁',
      '커튼 관리법',
      '색상 매칭',
      '룸 스타일링',
      '2024 트렌드',
      '설치 가이드',
    ],
    ogImage: '/images/midjourney/4.png',
  },
};

// 🎯 메타데이터 생성 헬퍼 함수
export function createSEOMetadata(pageKey: keyof typeof seoPages): Metadata {
  const page = seoPages[pageKey];

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,

    // OpenGraph
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${BRAND.website}`,
      siteName: BRAND.name,
      images: [
        {
          url: page.ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [page.ogImage],
    },

    // 추가 메타태그
    other: {
      'theme-color': '#D4C4A8', // khaki beige
      'color-scheme': 'light',
      'format-detection': 'telephone=no',
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 🏠 지역 SEO 구조화 데이터
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BRAND.name,
  description: BRAND.description,
  url: BRAND.website,
  logo: `${BRAND.website}/images/logo.png`,
  image: `${BRAND.website}/images/midjourney/2.png`,

  // 지역 정보
  address: {
    '@type': 'PostalAddress',
    addressLocality: '고양시',
    addressRegion: '경기도',
    addressCountry: 'KR',
  },

  // 서비스 영역
  areaServed: ['일산', '고양시', '파주시', '김포시', '서울 서북부'],

  // 서비스 카테고리
  serviceType: ['커튼 시공', '블라인드 설치', '인테리어 컨설팅', '맞춤 제작'],

  // 운영 시간
  openingHours: 'Mo-Sa 09:00-18:00',

  // 소셜 미디어
  sameAs: [
    'https://www.instagram.com/khakishop',
    'https://blog.naver.com/khakishop',
  ],
};

// 🎨 제품 구조화 데이터 생성기
export function createProductSchema(
  productName: string,
  category: string,
  imageUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: `${BRAND.name}에서 제공하는 프리미엄 ${productName}`,
    brand: {
      '@type': 'Brand',
      name: BRAND.name,
    },
    category: category,
    image: imageUrl,
    manufacturer: {
      '@type': 'Organization',
      name: BRAND.name,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '상담 후 견적',
        priceCurrency: 'KRW',
      },
    },
  };
}

// 🏗️ 포트폴리오 구조화 데이터
export function createPortfolioSchema(
  projectName: string,
  location: string,
  imageUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: projectName,
    description: `${BRAND.name}이 시공한 ${location}의 ${projectName} 프로젝트`,
    creator: {
      '@type': 'Organization',
      name: BRAND.name,
    },
    image: imageUrl,
    workExample: {
      '@type': 'VisualArtwork',
      artMedium: '인테리어 시공',
      artworkSurface: location,
    },
  };
}

// 🔍 검색 엔진 최적화 체크리스트
export const seoChecklist = {
  technical: [
    '✅ 모든 이미지에 alt 속성 추가',
    '✅ 페이지별 고유한 title/description',
    '✅ OpenGraph 메타태그 완비',
    '✅ 구조화 데이터 적용',
    '✅ 모바일 친화적 반응형 디자인',
  ],
  content: [
    '✅ 지역 키워드 최적화 (일산, 고양시)',
    '✅ 브랜드 일관성 유지',
    '✅ RIGAS 모티브 감성 반영',
    '✅ 사용자 중심 콘텐츠 구성',
    '✅ 전문성 강조 (시공 사례, 품질)',
  ],
};
