// ================================================================================
// ⚙️ KHAKISHOP 모터라이즈드 제품 데이터 구조
// ================================================================================
// 🎨 디자인 모티브: https://www.rigas-furniture.gr/
// 📁 이미지 경로: /public/images/motorized/[slug]/
// 🔧 관리자 연동: /ko/admin/images/motorized

export interface MotorizedProduct {
  slug: string;
  title: string;
  category: string;
  description: string;
  mainImage: string;
  gallery?: string[];
  image?: string;
  features: string[];
  materials: string[];
  sizes: string[];
  colors: string[];
  price: {
    from: number;
    currency: string;
  };
  installation: string[];
  care: string[];
  warranty: string;
  bestseller?: boolean;
  new?: boolean;
  specifications?: Record<string, string>;
  detailDescription?: string;
}

// 🏷️ 모터라이즈드 카테고리 정의
export const motorizedCategories = [
  {
    id: 'smart-curtains',
    name: '스마트 커튼',
    description: '자동화된 커튼 시스템으로 편리한 조작이 가능합니다',
  },
  {
    id: 'smart-blinds',
    name: '스마트 블라인드',
    description: '모터라이즈드 블라인드로 정밀한 빛 조절을 제공합니다',
  },
  {
    id: 'home-automation',
    name: '홈 오토메이션',
    description: 'IoT 기반 스마트홈 통합 시스템입니다',
  },
  {
    id: 'voice-control',
    name: '음성 제어',
    description: 'AI 음성 인식으로 핸즈프리 조작이 가능합니다',
  },
  {
    id: 'app-control',
    name: '앱 제어',
    description: '스마트폰 앱으로 원격 제어가 가능합니다',
  },
] as const;

// ⚙️ 모터라이즈드 제품 데이터
export const motorizedProducts: MotorizedProduct[] = [
  {
    slug: 'smart-curtain-system-pro',
    title: '스마트 커튼 시스템 프로',
    category: 'smart-curtains',
    description:
      '최신 IoT 기술이 적용된 프리미엄 스마트 커튼 시스템입니다. 음성 제어, 앱 제어, 스케줄 설정 등 다양한 기능을 제공합니다.',
    mainImage: '/images/motorized/smart-curtain-system/main.jpg',
    gallery: [
      '/images/motorized/smart-curtain-system/main.jpg',
      '/images/motorized/smart-curtain-system/detail-1.jpg',
      '/images/motorized/smart-curtain-system/detail-2.jpg',
    ],
    image: '/images/motorized/smart-curtain-system/main.jpg',
    features: [
      '음성 제어 (Alexa, Google Assistant)',
      'AI 기반 자동 스케줄링',
      '스마트폰 원격 제어',
      '에너지 절약 센서',
      '간편한 설치',
    ],
    specifications: {
      '제어 방식': '스마트폰 앱, 음성 명령, 자동 센서',
      호환성: 'iOS, Android, Alexa, Google Home',
      전원: 'DC 24V (어댑터 포함)',
      설치: '브래킷 마운트 (DIY 가능)',
      'A/S': '3년 품질보증',
    },
    detailDescription: `
IoT 기술과 인공지능이 결합된 차세대 스마트 커튼 시스템입니다. 
음성으로 간편하게 제어하고, AI가 당신의 라이프스타일을 학습하여 
최적의 시간에 자동으로 커튼을 조절합니다.

**주요 특징:**
- 🎤 음성 제어: "알렉사, 커튼 열어줘" 
- 🤖 AI 스케줄링: 생활 패턴 학습 후 자동 제어
- 📱 스마트폰 앱: 어디서나 원격 제어 가능
- ⚡ 에너지 절약: 빛 센서로 전력 효율 최적화
- 🔧 간편 설치: 기존 레일에 쉽게 설치 가능
    `,
    materials: ['프리미엄 모터', 'IoT 센서', '고급 원단', '스마트 컨트롤러'],
    sizes: ['120x200cm', '150x220cm', '180x240cm', '맞춤 제작'],
    colors: ['스마트 화이트', '테크 그레이', '미드나이트 블랙', '맞춤 색상'],
    price: {
      from: 395000,
      currency: 'KRW',
    },
    installation: [
      '전문 기사 방문 설치',
      '스마트홈 시스템 연동',
      '앱 설정 및 교육',
    ],
    care: ['자동 진단 기능', '원격 모니터링', '정기 펌웨어 업데이트'],
    warranty: '5년 시스템 보증 (무상 A/S 포함)',
    bestseller: true,
    new: true,
  },
  {
    slug: 'motorized-venetian-deluxe',
    title: '모터라이즈드 베네치안 디럭스',
    category: 'smart-blinds',
    description:
      '정밀한 슬랫 각도 조절이 가능한 모터라이즈드 베네치안 블라인드로 완벽한 빛 조절을 제공합니다.',
    mainImage: '/images/motorized/remote-venetian-blinds/main.jpg',
    features: [
      '정밀 슬랫 각도 제어',
      '무소음 모터 시스템',
      '배터리 백업 기능',
      '그룹 제어 가능',
      '장애물 감지 센서',
    ],
    materials: [
      '프리미엄 알루미늄',
      '독일산 모터',
      '리튬 배터리',
      '스마트 센서',
    ],
    sizes: ['80x150cm', '100x180cm', '120x200cm', '맞춤 제작'],
    colors: ['실버', '화이트', '그레이', '골드', '블랙'],
    price: {
      from: 285000,
      currency: 'KRW',
    },
    installation: ['정밀 측정 및 설치', '모터 시스템 테스트', '원격 제어 설정'],
    care: ['자가 진단 기능', '모터 자동 윤활', '전문 점검 서비스'],
    warranty: '7년 모터 보증 (부품 교체 포함)',
    bestseller: true,
  },
  {
    slug: 'ai-home-integration-suite',
    title: 'AI 홈 통합 시스템',
    category: 'home-automation',
    description:
      '인공지능 기반 스마트홈 통합 솔루션으로 전체 주거 공간의 창호 시스템을 자동화합니다.',
    mainImage: '/images/motorized/smart-home-automation/main.jpg',
    features: [
      'AI 학습 기반 자동화',
      '전체 집 통합 제어',
      '에너지 효율 최적화',
      '날씨 연동 자동 조절',
      '보안 시스템 연동',
    ],
    materials: ['AI 허브', '무선 모터', '환경 센서', '스마트 스위치'],
    sizes: [
      '소형 (3-5개 창)',
      '중형 (6-10개 창)',
      '대형 (11개 이상)',
      '전체 빌딩',
    ],
    colors: ['시스템 통합형 (원단별 선택)'],
    price: {
      from: 795000,
      currency: 'KRW',
    },
    installation: [
      '전체 집 설계 컨설팅',
      '시스템 통합 설치',
      '사용자 교육 프로그램',
    ],
    care: ['AI 자동 최적화', '24시간 원격 모니터링', '클라우드 백업'],
    warranty: '10년 시스템 보증 (평생 업데이트)',
    new: true,
  },
  {
    slug: 'voice-control-roller-system',
    title: '보이스 컨트롤 롤러 시스템',
    category: 'voice-control',
    description:
      'AI 음성 인식 기술로 핸즈프리 조작이 가능한 차세대 롤러 블라인드 시스템입니다.',
    mainImage: '/images/motorized/voice-blind-control/main.jpg',
    features: [
      'AI 음성 인식',
      '다국어 명령 지원',
      '음성 학습 기능',
      '소음 차단 마이크',
      '응답 피드백',
    ],
    materials: [
      '스마트 원단',
      'AI 음성 모듈',
      '초정밀 모터',
      '노이즈 캔슬링 마이크',
    ],
    sizes: ['90x160cm', '120x180cm', '150x200cm', '맞춤 제작'],
    colors: ['아이보리', '베이지', '그레이', '다크 그레이'],
    price: {
      from: 325000,
      currency: 'KRW',
    },
    installation: [
      '음성 인식 캘리브레이션',
      '개인 음성 학습',
      '명령어 커스터마이징',
    ],
    care: ['음성 데이터 업데이트', '마이크 청소 서비스', 'AI 성능 최적화'],
    warranty: '5년 AI 시스템 보증',
    new: true,
  },
  {
    slug: 'smartphone-vertical-elite',
    title: '스마트폰 버티컬 엘리트',
    category: 'app-control',
    description:
      '전용 모바일 앱으로 정밀 제어가 가능한 프리미엄 버티컬 블라인드 시스템입니다.',
    mainImage: '/images/motorized/app-controlled-blinds/main.jpg',
    features: [
      '전용 모바일 앱',
      '실시간 상태 모니터링',
      '사용 패턴 분석',
      '멀티 디바이스 연결',
      '클라우드 동기화',
    ],
    materials: [
      '프리미엄 패브릭',
      '블루투스 모터',
      '스마트 센서',
      '클라우드 모듈',
    ],
    sizes: ['150x220cm', '180x240cm', '220x260cm', '맞춤 제작'],
    colors: [
      '엘리트 화이트',
      '프리미엄 그레이',
      '럭셔리 베이지',
      '클래식 네이비',
    ],
    price: {
      from: 245000,
      currency: 'KRW',
    },
    installation: ['앱 다운로드 및 설정', '디바이스 페어링', '사용법 가이드'],
    care: ['앱 자동 업데이트', '원격 진단', '사용 통계 리포트'],
    warranty: '4년 앱 연동 보증',
    bestseller: true,
  },
  {
    slug: 'solar-powered-eco-system',
    title: '솔라 파워드 에코 시스템',
    category: 'smart-curtains',
    description:
      '태양광 충전 시스템으로 친환경적이고 경제적인 스마트 커튼 솔루션입니다.',
    mainImage: '/images/motorized/solar-powered-blinds/main.jpg',
    features: [
      '태양광 충전 패널',
      '에너지 절약 모드',
      '배터리 수명 표시',
      '친환경 소재',
      '전력선 불필요',
    ],
    materials: [
      '친환경 원단',
      '태양광 패널',
      '리튬 폴리머 배터리',
      '저전력 모터',
    ],
    sizes: ['100x180cm', '130x200cm', '160x220cm', '맞춤 제작'],
    colors: ['에코 화이트', '네이처 베이지', '어스 그린', '스카이 블루'],
    price: {
      from: 365000,
      currency: 'KRW',
    },
    installation: [
      '태양광 패널 위치 선정',
      '충전 시스템 설치',
      '에너지 효율 설정',
    ],
    care: ['태양광 패널 청소', '배터리 상태 점검', '에너지 사용량 모니터링'],
    warranty: '8년 에코 시스템 보증',
    new: true,
  },
];

// 🔧 유틸리티 함수들

/**
 * 모든 모터라이즈드 제품 가져오기
 */
export function getAllMotorizedProducts(): MotorizedProduct[] {
  return motorizedProducts;
}

/**
 * 슬러그로 모터라이즈드 제품 찾기
 */
export function getMotorizedProductBySlug(
  slug: string
): MotorizedProduct | undefined {
  return motorizedProducts.find((product) => product.slug === slug);
}

/**
 * 카테고리별 모터라이즈드 제품 가져오기
 */
export function getMotorizedProductsByCategory(
  category: string
): MotorizedProduct[] {
  return motorizedProducts.filter((product) => product.category === category);
}

/**
 * 모터라이즈드 카테고리 목록 가져오기
 */
export function getMotorizedCategories() {
  return Array.from(
    new Set(motorizedProducts.map((product) => product.category))
  );
}

/**
 * 베스트셀러 모터라이즈드 제품 가져오기
 */
export function getBestsellerMotorizedProducts(): MotorizedProduct[] {
  return motorizedProducts.filter((product) => product.bestseller);
}

/**
 * 신제품 모터라이즈드 가져오기
 */
export function getNewMotorizedProducts(): MotorizedProduct[] {
  return motorizedProducts.filter((product) => product.new);
}

/**
 * 모터라이즈드 제품 검색
 */
export function searchMotorizedProducts(query: string): MotorizedProduct[] {
  const searchTerm = query.toLowerCase();
  return motorizedProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.features.some((feature) =>
        feature.toLowerCase().includes(searchTerm)
      ) ||
      product.materials.some((material) =>
        material.toLowerCase().includes(searchTerm)
      )
  );
}
