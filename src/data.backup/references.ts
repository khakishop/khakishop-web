// ================================================================================
// 🏢 KHAKISHOP 시공사례 데이터 - RIGAS 스타일 통일
// ================================================================================
// 🎨 디자인 모티브: https://www.rigas-furniture.gr/
// 📁 이미지 경로: /public/images/references/[slug]/
// 🔧 관리자 연동: displayOrder 드래그앤드롭 지원

// 🎯 통일된 Product interface
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'references';
  subcategory?: string;
  displayOrder?: number;
  features?: string[];
  materials?: string[];
  sizes?: string[];
  colors?: string[];
  price?: {
    from: number;
    to?: number;
    currency: string;
    unit?: string;
  };
  installation?: string[];
  care?: string[];
  warranty?: string;
  bestseller?: boolean;
  new?: boolean;
  gallery?: string[];
  // 시공사례 전용 필드
  location?: string;
  clientType?: string;
  projectDate?: string;
  duration?: string;
}

// 🏷️ 시공사례 서브카테고리 정의
export const referenceSubcategories = [
  'Residential',
  'Commercial',
  'Office',
  'Hotel & Restaurant',
  'Medical & Clinic',
  'Educational',
] as const;

// 🏢 시공사례 데이터 - RIGAS 스타일
export const referenceProducts: Product[] = [
  {
    id: 'ref-001',
    slug: 'luxury-residence-gangnam',
    title: '강남 고급 주택 시공사례',
    description:
      '강남 고급 주택에 설치된 프리미엄 커튼과 블라인드 시공사례입니다. 모던한 인테리어와 완벽하게 조화를 이루는 맞춤형 솔루션을 제공했습니다.',
    image: '/images/references/luxury-residence-gangnam/main.jpg',
    category: 'references',
    subcategory: 'Residential',
    displayOrder: 1,
    location: '서울 강남구',
    clientType: '개인 주택',
    projectDate: '2024년 3월',
    duration: '3일',
    features: [
      '맞춤형 리넨 커튼',
      '자동화 블라인드 시스템',
      '스마트 조명 연동',
      '프리미엄 하드웨어',
      '완벽한 채광 조절',
    ],
    materials: [
      '벨기에 리넨',
      '알루미늄 프레임',
      '스마트 모터',
      '황동 액세서리',
    ],
    bestseller: true,
    gallery: [
      '/images/references/luxury-residence-gangnam/main.jpg',
      '/images/references/luxury-residence-gangnam/detail-1.jpg',
      '/images/references/luxury-residence-gangnam/detail-2.jpg',
      '/images/references/luxury-residence-gangnam/before-after.jpg',
    ],
  },
  {
    id: 'ref-002',
    slug: 'modern-office-seoul',
    title: '서울 모던 오피스 프로젝트',
    description:
      '서울 시내 모던 오피스 빌딩의 대규모 블라인드 설치 프로젝트입니다. 효율적인 업무 환경을 위한 최적의 채광 솔루션을 구현했습니다.',
    image: '/images/references/modern-office-seoul/main.jpg',
    category: 'references',
    subcategory: 'Office',
    displayOrder: 2,
    location: '서울 중구',
    clientType: '대기업 본사',
    projectDate: '2024년 2월',
    duration: '5일',
    features: [
      '대형 버티컬 블라인드',
      '자외선 차단 원단',
      '그룹 제어 시스템',
      '에너지 절약형',
      '소음 방지 설계',
    ],
    materials: ['상업용 패브릭', '알루미늄 헤드레일', '스테인리스 액세서리'],
    new: true,
    gallery: [
      '/images/references/modern-office-seoul/main.jpg',
      '/images/references/modern-office-seoul/detail-1.jpg',
      '/images/references/modern-office-seoul/detail-2.jpg',
      '/images/references/modern-office-seoul/workspace.jpg',
    ],
  },
  {
    id: 'ref-003',
    slug: 'boutique-hotel-busan',
    title: '부산 부티크 호텔 인테리어',
    description:
      '부산 해운대의 부티크 호텔 전 객실에 설치된 럭셔리 커튼 시공사례입니다. 바다 뷰와 조화로운 우아한 디자인으로 완성했습니다.',
    image: '/images/references/boutique-hotel-busan/main.jpg',
    category: 'references',
    subcategory: 'Hotel & Restaurant',
    displayOrder: 3,
    location: '부산 해운대구',
    clientType: '부티크 호텔',
    projectDate: '2024년 1월',
    duration: '7일',
    features: [
      '블랙아웃 커튼',
      '쉬어 레이어링',
      '해풍 대응 소재',
      '호텔급 마감',
      '유지보수 편의성',
    ],
    materials: ['호텔급 패브릭', '해염 방지 코팅', '고급 브라스 하드웨어'],
    bestseller: true,
    gallery: [
      '/images/references/boutique-hotel-busan/main.jpg',
      '/images/references/boutique-hotel-busan/detail-1.jpg',
      '/images/references/boutique-hotel-busan/detail-2.jpg',
      '/images/references/boutique-hotel-busan/suite-view.jpg',
    ],
  },
  {
    id: 'ref-004',
    slug: 'medical-center-ilsan',
    title: '일산 메디컬센터 차광시설',
    description:
      '일산 대형 메디컬센터의 차광 및 프라이버시 보호를 위한 전문 블라인드 시공사례입니다. 의료 환경에 최적화된 솔루션을 제공했습니다.',
    image: '/images/references/medical-center-ilsan/main.jpg',
    category: 'references',
    subcategory: 'Medical & Clinic',
    displayOrder: 4,
    location: '경기 고양시',
    clientType: '종합병원',
    projectDate: '2023년 12월',
    duration: '10일',
    features: [
      '항균 처리 원단',
      '완전 차광 가능',
      '쉬운 청소 설계',
      '정전기 방지',
      '의료기기 간섭 없음',
    ],
    materials: ['의료용 패브릭', '항균 코팅', '스테인리스 프레임'],
    gallery: [
      '/images/references/medical-center-ilsan/main.jpg',
      '/images/references/medical-center-ilsan/detail-1.jpg',
      '/images/references/medical-center-ilsan/detail-2.jpg',
      '/images/references/medical-center-ilsan/clinic-room.jpg',
    ],
  },
  {
    id: 'ref-005',
    slug: 'university-library-daejeon',
    title: '대전 대학교 도서관 프로젝트',
    description:
      '대전 소재 대학교 중앙도서관의 열람실과 세미나실에 설치된 스마트 블라인드 시공사례입니다. 학습 환경 최적화에 중점을 두었습니다.',
    image: '/images/references/university-library-daejeon/main.jpg',
    category: 'references',
    subcategory: 'Educational',
    displayOrder: 5,
    location: '대전 유성구',
    clientType: '대학교',
    projectDate: '2023년 11월',
    duration: '6일',
    features: [
      '스마트 조광 제어',
      '집중도 향상 설계',
      '그룹별 독립 제어',
      '에너지 효율성',
      '무소음 동작',
    ],
    materials: ['교육용 패브릭', '스마트 센서', '무소음 모터'],
    new: true,
    gallery: [
      '/images/references/university-library-daejeon/main.jpg',
      '/images/references/university-library-daejeon/detail-1.jpg',
      '/images/references/university-library-daejeon/detail-2.jpg',
      '/images/references/university-library-daejeon/reading-room.jpg',
    ],
  },
  {
    id: 'ref-006',
    slug: 'premium-apartment-songdo',
    title: '송도 프리미엄 아파트 단지',
    description:
      '송도국제도시 프리미엄 아파트 단지 전체 동에 설치된 대규모 커튼 프로젝트입니다. 통일성과 개성을 동시에 구현했습니다.',
    image: '/images/references/premium-apartment-songdo/main.jpg',
    category: 'references',
    subcategory: 'Residential',
    displayOrder: 6,
    location: '인천 연수구',
    clientType: '아파트 단지',
    projectDate: '2023년 10월',
    duration: '14일',
    features: [
      '단지 통합 디자인',
      '개별 맞춤 옵션',
      '풍압 대응 설계',
      '유지보수 체계',
      '대량 공급 시스템',
    ],
    materials: ['내구성 패브릭', '풍압 대응 프레임', '표준화 하드웨어'],
    bestseller: true,
    gallery: [
      '/images/references/premium-apartment-songdo/main.jpg',
      '/images/references/premium-apartment-songdo/detail-1.jpg',
      '/images/references/premium-apartment-songdo/detail-2.jpg',
      '/images/references/premium-apartment-songdo/complex-view.jpg',
    ],
  },
];

// 🔧 유틸리티 함수들
export const getAllReferenceProducts = (): Product[] => {
  return referenceProducts.sort(
    (a, b) => (a.displayOrder || 999) - (b.displayOrder || 999)
  );
};

export const getReferenceProductBySlug = (
  slug: string
): Product | undefined => {
  return referenceProducts.find((product) => product.slug === slug);
};

export const getReferenceProductsBySubcategory = (
  subcategory: string
): Product[] => {
  return referenceProducts.filter(
    (product) => product.subcategory === subcategory
  );
};

export const getBestsellerReferenceProducts = (): Product[] => {
  return referenceProducts.filter((product) => product.bestseller);
};

export const getNewReferenceProducts = (): Product[] => {
  return referenceProducts.filter((product) => product.new);
};

export const getReferenceSubcategories = (): readonly string[] => {
  return referenceSubcategories;
};
