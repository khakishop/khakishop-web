// ================================================================================
// 🎨 KHAKISHOP 프로젝트 데이터
// ================================================================================

export interface Project {
  slug: string;
  title: string;
  location: string;
  year: string;
  category: 'Residential' | 'Commercial' | 'F&B' | 'Healthcare' | 'Cultural';
  description: string;
  mainImage: string;
  galleryImages?: string[];
  features?: string[];
  client?: string;
  area?: string;
  concept?: string;
  materials?: string[];
  size?: string;
}

export const projects: Project[] = [
  {
    slug: "modern-office-gangnam",
    title: "Modern Office Gangnam",
    location: "강남구",
    year: "2024",
    category: "Commercial",
    description: "현대적 감각의 오피스 공간을 위한 맞춤형 블라인드 시공. 업무 효율성과 미적 완성도를 동시에 추구한 프로젝트입니다.",
    mainImage: "/images/references/modern-office-gangnam/main.svg",
    galleryImages: [
      "/images/references/modern-office-gangnam/gallery-1.svg",
      "/images/references/modern-office-gangnam/gallery-2.svg",
      "/images/references/modern-office-gangnam/gallery-3.svg"
    ],
    features: ["알루미늄 블라인드", "자동화 시스템", "에너지 효율", "소음 차단"],
    client: "테크 스타트업",
    area: "200㎡",
    concept: "Clean, functional workspace with optimal light control",
    materials: ["고급 알루미늄", "자동화 모터", "UV 차단 코팅"]
  },
  {
    slug: "minimal-residence-bundang",
    title: "Minimal Residence Bundang",
    location: "분당구",
    year: "2024",
    category: "Residential",
    description: "미니멀 주거 공간의 감성적 커튼 시공. 자연스러운 채광과 프라이버시를 균형 있게 조화시킨 작품입니다.",
    mainImage: "/images/references/minimal-residence-bundang/main.svg",
    galleryImages: [
      "/images/references/minimal-residence-bundang/gallery-1.svg",
      "/images/references/minimal-residence-bundang/gallery-2.svg",
      "/images/references/minimal-residence-bundang/gallery-3.svg"
    ],
    features: ["리넨 커튼", "자연광 조절", "미니멀 디자인", "친환경 소재"],
    client: "개인 주택",
    area: "150㎡",
    concept: "Harmonious blend of natural light and minimalist aesthetics",
    materials: ["고급 리넨", "천연 염료", "무소음 레일"]
  },
  {
    slug: "classic-cafe-hongdae",
    title: "Classic Cafe Hongdae",
    location: "홍대",
    year: "2023",
    category: "F&B",
    description: "클래식한 감성의 카페 공간 커튼 시공. 따뜻하고 아늑한 분위기 연출로 고객들의 휴식 공간을 완성했습니다.",
    mainImage: "/images/references/classic-cafe-hongdae/main.svg",
    galleryImages: [
      "/images/references/classic-cafe-hongdae/gallery-1.svg",
      "/images/references/classic-cafe-hongdae/gallery-2.svg",
      "/images/references/classic-cafe-hongdae/gallery-3.svg"
    ],
    features: ["클래식 커튼", "따뜻한 분위기", "방음 효과", "카페 전용 디자인"],
    client: "독립 카페",
    area: "80㎡",
    concept: "Cozy, vintage-inspired atmosphere for coffee lovers",
    materials: ["벨벳 원단", "황동 액세서리", "방음 라이닝"]
  },
  {
    slug: "contemporary-house-goyang",
    title: "Contemporary House Goyang",
    location: "고양시",
    year: "2023",
    category: "Residential",
    description: "현대적 주택의 스마트 블라인드 시스템. IoT 기술을 활용한 지능형 조광 시스템으로 편의성을 극대화했습니다.",
    mainImage: "/images/references/contemporary-house-goyang/main.svg",
    galleryImages: [
      "/images/references/contemporary-house-goyang/gallery-1.svg",
      "/images/references/contemporary-house-goyang/gallery-2.svg",
      "/images/references/contemporary-house-goyang/gallery-3.svg"
    ],
    features: ["스마트 블라인드", "음성 제어", "에너지 절약", "앱 연동"],
    client: "개인 주택",
    area: "180㎡",
    concept: "Smart home integration with intelligent lighting control",
    materials: ["스마트 모터", "IoT 센서", "에너지 효율 원단"]
  },
  {
    slug: "scandinavian-apartment-mapo",
    title: "Scandinavian Apartment Mapo",
    location: "마포구",
    year: "2023",
    category: "Residential",
    description: "스칸디나비아 스타일 아파트 커튼 시공. 북유럽의 자연스럽고 밝은 감성을 담아낸 따뜻한 공간입니다.",
    mainImage: "/images/references/scandinavian-apartment-mapo/main.svg",
    galleryImages: [
      "/images/references/scandinavian-apartment-mapo/gallery-1.svg",
      "/images/references/scandinavian-apartment-mapo/gallery-2.svg",
      "/images/references/scandinavian-apartment-mapo/gallery-3.svg"
    ],
    features: ["북유럽 스타일", "자연 소재", "밝은 색상", "심플 라인"],
    client: "개인 아파트",
    area: "120㎡",
    concept: "Scandinavian hygge with natural materials and light colors",
    materials: ["오가닉 코튼", "자작나무 레일", "천연 염료"]
  },
  {
    slug: "industrial-lobby-yongsan",
    title: "Industrial Lobby Yongsan",
    location: "용산구",
    year: "2023",
    category: "Commercial",
    description: "인더스트리얼 스타일 로비 블라인드 시공. 모던하고 세련된 비즈니스 공간의 첫인상을 완성했습니다.",
    mainImage: "/images/references/industrial-lobby-yongsan/main.svg",
    galleryImages: [
      "/images/references/industrial-lobby-yongsan/gallery-1.svg",
      "/images/references/industrial-lobby-yongsan/gallery-2.svg",
      "/images/references/industrial-lobby-yongsan/gallery-3.svg"
    ],
    features: ["메탈 블라인드", "인더스트리얼 디자인", "대형 창호", "내구성"],
    client: "오피스 빌딩",
    area: "300㎡",
    concept: "Industrial chic with metal accents and raw materials",
    materials: ["스테인리스 스틸", "산업용 체인", "강화 알루미늄"]
  },
  {
    slug: "luxury-penthouse-seocho",
    title: "Luxury Penthouse Seocho",
    location: "서초구",
    year: "2023",
    category: "Residential",
    description: "럭셔리 펜트하우스 프리미엄 커튼 시공. 최고급 소재와 정교한 디테일로 완성한 품격 있는 공간입니다.",
    mainImage: "/images/references/luxury-penthouse-seocho/main.svg",
    galleryImages: [
      "/images/references/luxury-penthouse-seocho/gallery-1.svg",
      "/images/references/luxury-penthouse-seocho/gallery-2.svg",
      "/images/references/luxury-penthouse-seocho/gallery-3.svg"
    ],
    features: ["프리미엄 원단", "전동 시스템", "맞춤 제작", "럭셔리 피니시"],
    client: "개인 펜트하우스",
    area: "250㎡",
    concept: "Luxury living with bespoke curtain solutions",
    materials: ["실크 혼방", "24K 금도금", "수입 전동 모터"]
  },
  {
    slug: "modern-clinic-seongnam",
    title: "Modern Clinic Seongnam",
    location: "성남시",
    year: "2023",
    category: "Healthcare",
    description: "모던 클리닉 항균 블라인드 시공. 의료 환경에 특화된 위생적이고 기능적인 솔루션을 제공했습니다.",
    mainImage: "/images/references/modern-clinic-seongnam/main.svg",
    galleryImages: [
      "/images/references/modern-clinic-seongnam/gallery-1.svg",
      "/images/references/modern-clinic-seongnam/gallery-2.svg",
      "/images/references/modern-clinic-seongnam/gallery-3.svg"
    ],
    features: ["항균 소재", "쉬운 청소", "의료용 인증", "무독성"],
    client: "치과 클리닉",
    area: "100㎡",
    concept: "Clean, hygienic environment with medical-grade materials",
    materials: ["항균 코팅 PVC", "의료용 스테인리스", "무독성 염료"]
  },
  {
    slug: "art-gallery-jongno",
    title: "Art Gallery Jongno",
    location: "종로구",
    year: "2023",
    category: "Cultural",
    description: "아트 갤러리 조명 조절 블라인드 시공. 작품을 최적으로 보호하면서 관람 환경을 극대화한 전문적인 프로젝트입니다.",
    mainImage: "/images/references/art-gallery-jongno/main.svg",
    galleryImages: [
      "/images/references/art-gallery-jongno/gallery-1.svg",
      "/images/references/art-gallery-jongno/gallery-2.svg",
      "/images/references/art-gallery-jongno/gallery-3.svg"
    ],
    features: ["정밀 조광", "UV 차단", "작품 보호", "큐레이터 승인"],
    client: "현대 미술관",
    area: "400㎡",
    concept: "Museum-quality lighting control for art preservation",
    materials: ["UV 차단 필름", "정밀 모터", "갤러리 전용 원단"]
  }
];

export const getAllProjects = (): Project[] => {
  return projects;
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getProjectsByCategory = (category: Project['category']): Project[] => {
  return projects.filter(project => project.category === category);
};

export const getProjectsByYear = (year: string): Project[] => {
  return projects.filter(project => project.year === year);
}; 