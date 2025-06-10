// ================================================================================
// 🎨 KHAKISHOP SEO 메타데이터 관리 시스템 - RIGAS 스타일 통일
// ================================================================================

import { Metadata } from 'next';

// 🎯 통일된 Product 인터페이스 
interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'curtains' | 'blinds' | 'references' | 'motorized';
  subcategory?: string;
  displayOrder?: number;
  bestseller?: boolean;
  new?: boolean;
  price?: {
    from: number;
    to?: number;
    currency: string;
    unit?: string;
  };
  // 시공사례 전용
  location?: string;
  clientType?: string;
  projectDate?: string;
}

// 🎨 기본 브랜드 정보
const BRAND = {
  name: 'KHAKISHOP',
  tagline: '감성과 기능을 담은 프리미엄 커튼 & 블라인드',
  location: '일산',
  specialty: '맞춤형 인테리어 솔루션',
  website: 'https://khakishop.com',
  description: '프리미엄 커튼과 블라인드로 공간을 특별하게 만들어보세요. 맞춤 제작, 전문 설치, 완벽한 A/S까지.',
};

// 기본 메타데이터 설정
const baseMetadata = {
  siteName: BRAND.name,
  siteUrl: BRAND.website,
  defaultImage: '/images/hero/khakishop-hero.jpg',
  locale: 'ko_KR',
  type: 'website' as const
};

// 카테고리별 기본 정보
const categoryInfo = {
  curtains: {
    name: '커튼',
    description: '프리미엄 커튼으로 공간을 품격 있게 연출하세요',
    keywords: ['커튼', '맞춤 커튼', '인테리어 커튼', '리넨 커튼', '모던 커튼']
  },
  blinds: {
    name: '블라인드',
    description: '기능적이고 스타일리시한 블라인드 솔루션',
    keywords: ['블라인드', '베네치안 블라인드', '롤러 블라인드', '버티컬 블라인드']
  },
  references: {
    name: '시공사례',
    description: '전문적인 설치와 완벽한 마감의 시공사례를 확인하세요',
    keywords: ['시공사례', '인테리어 사례', '커튼 설치', '블라인드 설치']
  },
  motorized: {
    name: '모터라이즈드',
    description: '스마트한 자동화 시스템으로 편리함을 경험하세요',
    keywords: ['모터라이즈드', '스마트 커튼', '자동 블라인드', 'IoT 인테리어']
  }
};

// 🎨 통일된 제품 메타데이터 생성
export function createProductMetadata(product: Product, category: keyof typeof categoryInfo): Metadata {
  const categoryData = categoryInfo[category];
  const priceText = product.price ? 
    `₩${new Intl.NumberFormat('ko-KR').format(product.price.from)}${product.price.to ? `~${new Intl.NumberFormat('ko-KR').format(product.price.to)}` : ''}` : '';
  
  const title = `${product.title} | ${categoryData.name} | ${baseMetadata.siteName}`;
  const description = `${product.description} ${priceText ? `${priceText} 부터` : ''} ${categoryData.description}`;
  
  return {
    title,
    description,
    keywords: [
      ...categoryData.keywords,
      product.title,
      product.subcategory || '',
      ...(product.bestseller ? ['베스트셀러'] : []),
      ...(product.new ? ['신제품'] : [])
    ].filter(Boolean).join(', '),
    
    openGraph: {
      title,
      description,
      url: `${baseMetadata.siteUrl}/${category}/${product.slug}`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ],
      locale: baseMetadata.locale,
      type: 'article',
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
    
    // 구조화 데이터
    other: {
      'product:price:amount': product.price?.from?.toString() || '',
      'product:price:currency': product.price?.currency || 'KRW',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:brand': baseMetadata.siteName,
      'product:category': categoryData.name,
    }
  };
}

// 🎨 카테고리 메인 페이지 메타데이터 생성
export function createCategoryMetadata(category: keyof typeof categoryInfo, productCount?: number): Metadata {
  const categoryData = categoryInfo[category];
  const title = `${categoryData.name} | ${baseMetadata.siteName}`;
  const description = `${categoryData.description} ${productCount ? `${productCount}개의 제품을 만나보세요.` : ''}`;
  
  return {
    title,
    description,
    keywords: categoryData.keywords.join(', '),
    
    openGraph: {
      title,
      description,
      url: `${baseMetadata.siteUrl}/${category}`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: baseMetadata.defaultImage,
          width: 1200,
          height: 630,
          alt: `${baseMetadata.siteName} ${categoryData.name}`,
        }
      ],
      locale: baseMetadata.locale,
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [baseMetadata.defaultImage],
    }
  };
}

// 🏢 시공사례 전용 메타데이터 생성
export function createReferenceMetadata(product: Product): Metadata {
  const title = `${product.title} | 시공사례 | ${baseMetadata.siteName}`;
  const description = `${product.description} ${product.location ? `위치: ${product.location}` : ''} ${product.clientType ? `클라이언트: ${product.clientType}` : ''}`;
  
  return {
    title,
    description,
    keywords: [
      '시공사례',
      '인테리어 사례',
      product.title,
      product.location || '',
      product.clientType || '',
      product.projectDate || ''
    ].filter(Boolean).join(', '),
    
    openGraph: {
      title,
      description,
      url: `${baseMetadata.siteUrl}/references/${product.slug}`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ],
      locale: baseMetadata.locale,
      type: 'article',
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
    
    // 시공사례 구조화 데이터
    other: {
      'article:published_time': product.projectDate || '',
      'article:section': '시공사례',
      'article:tag': [product.location, product.clientType].filter(Boolean).join(','),
      'business:contact_data:locality': product.location || '',
    }
  };
}

// 기존 함수들 유지
export function createHomeMetadata(): Metadata {
  return {
    title: `${baseMetadata.siteName} - ${BRAND.tagline}`,
    description: BRAND.description,
    keywords: '커튼, 블라인드, 인테리어, 맞춤 제작, 시공, 설치',
    
    openGraph: {
      title: `${baseMetadata.siteName} - ${BRAND.tagline}`,
      description: BRAND.description,
      url: baseMetadata.siteUrl,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: baseMetadata.defaultImage,
          width: 1200,
          height: 630,
          alt: baseMetadata.siteName,
        }
      ],
      locale: baseMetadata.locale,
      type: baseMetadata.type,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `${baseMetadata.siteName} - ${BRAND.tagline}`,
      description: BRAND.description,
      images: [baseMetadata.defaultImage],
    }
  };
}

export function createAboutMetadata(): Metadata {
  return {
    title: `회사소개 | ${baseMetadata.siteName}`,
    description: `${baseMetadata.siteName}의 철학과 가치, 그리고 고객을 위한 약속을 소개합니다.`,
    
    openGraph: {
      title: `회사소개 | ${baseMetadata.siteName}`,
      description: `${baseMetadata.siteName}의 철학과 가치를 소개합니다.`,
      url: `${baseMetadata.siteUrl}/about`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: baseMetadata.defaultImage,
          width: 1200,
          height: 630,
          alt: `${baseMetadata.siteName} 회사소개`,
        }
      ],
      locale: baseMetadata.locale,
      type: baseMetadata.type,
    }
  };
}

export function createContactMetadata(): Metadata {
  return {
    title: `문의하기 | ${baseMetadata.siteName}`,
    description: `${baseMetadata.siteName}에 문의사항이 있으시면 언제든지 연락주세요. 친절하고 전문적인 상담을 제공합니다.`,
    
    openGraph: {
      title: `문의하기 | ${baseMetadata.siteName}`,
      description: `${baseMetadata.siteName}에 문의사항이 있으시면 언제든지 연락주세요.`,
      url: `${baseMetadata.siteUrl}/contact`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: baseMetadata.defaultImage,
          width: 1200,
          height: 630,
          alt: `${baseMetadata.siteName} 문의`,
        }
      ],
      locale: baseMetadata.locale,
      type: baseMetadata.type,
    }
  };
}

export function createReferencesMetadata(): Metadata {
  const title = `시공사례 | ${baseMetadata.siteName}`;
  const description = `${BRAND.tagline} ${baseMetadata.siteName}의 다양한 시공사례를 확인하세요.`;
  
  return {
    title,
    description,
    keywords: '시공사례, 인테리어 사례, 커튼 설치, 블라인드 설치, 프리미엄 인테리어',
    
    openGraph: {
      title,
      description,
      url: `${baseMetadata.siteUrl}/references`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: baseMetadata.defaultImage,
          width: 1200,
          height: 630,
          alt: `${baseMetadata.siteName} 시공사례`,
        }
      ],
      locale: baseMetadata.locale,
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [baseMetadata.defaultImage],
    }
  };
}

// 🎨 통합 SEO 메타데이터 함수 (기존 코드 호환성용)
export function createSEOMetadata(type: 'home' | 'about' | 'contact' | 'references' | 'blog' | 'collection' | 'curtain' | 'project'): Metadata {
  switch (type) {
    case 'home':
      return createHomeMetadata();
    case 'about':
      return createAboutMetadata();
    case 'contact':
      return createContactMetadata();
    case 'references':
      return createReferencesMetadata();
    case 'blog':
      return createBlogMetadata();
    case 'collection':
      return createCollectionMetadata();
    case 'curtain':
      return createCategoryMetadata('curtains');
    case 'project':
      return createProjectMetadata();
    default:
      return createHomeMetadata();
  }
}

// 🎨 커튼 전용 메타데이터 (기존 코드 호환성용)
export function createCurtainMetadata(product?: Product): Metadata {
  if (product) {
    return createProductMetadata(product, 'curtains');
  }
  return createCategoryMetadata('curtains');
}

// 🎨 블로그 메타데이터
export function createBlogMetadata(): Metadata {
  const title = `블로그 | ${baseMetadata.siteName}`;
  const description = `${BRAND.tagline} 인테리어 팁과 트렌드를 확인하세요.`;
  
  return {
    title,
    description,
    keywords: '블로그, 인테리어 팁, 커튼 가이드, 블라인드 선택법, 홈데코',
    
    openGraph: {
      title,
      description,
      url: `${baseMetadata.siteUrl}/blog`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: baseMetadata.defaultImage,
          width: 1200,
          height: 630,
          alt: `${baseMetadata.siteName} 블로그`,
        }
      ],
      locale: baseMetadata.locale,
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [baseMetadata.defaultImage],
    }
  };
}

// 🎨 컬렉션 메타데이터
export function createCollectionMetadata(): Metadata {
  const title = `컬렉션 | ${baseMetadata.siteName}`;
  const description = `${BRAND.tagline} 엄선된 프리미엄 컬렉션을 만나보세요.`;
  
  return {
    title,
    description,
    keywords: '컬렉션, 프리미엄 커튼, 디자이너 블라인드, 인테리어 컬렉션',
    
    openGraph: {
      title,
      description,
      url: `${baseMetadata.siteUrl}/collection`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: baseMetadata.defaultImage,
          width: 1200,
          height: 630,
          alt: `${baseMetadata.siteName} 컬렉션`,
        }
      ],
      locale: baseMetadata.locale,
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [baseMetadata.defaultImage],
    }
  };
}

// 🎨 프로젝트 메타데이터
export function createProjectMetadata(): Metadata {
  const title = `프로젝트 | ${baseMetadata.siteName}`;
  const description = `${BRAND.tagline} 다양한 프로젝트와 사례를 확인하세요.`;
  
  return {
    title,
    description,
    keywords: '프로젝트, 상업공간, 주거공간, 맞춤 인테리어, 전문 설치',
    
    openGraph: {
      title,
      description,
      url: `${baseMetadata.siteUrl}/project`,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: baseMetadata.defaultImage,
          width: 1200,
          height: 630,
          alt: `${baseMetadata.siteName} 프로젝트`,
        }
      ],
      locale: baseMetadata.locale,
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [baseMetadata.defaultImage],
    }
  };
} 