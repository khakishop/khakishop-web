export interface ProjectDetail {
  slug: string;
  title: string;
  location: string;
  category: string;
  year: string;
  size: string;
  description: string;
  concept: string;
  mainImage: string;
  galleryImages?: string[];
  materials: string[];
  features: string[];
}

export const projectDetails: ProjectDetail[] = [
  {
    slug: "modern-office-gangnam",
    title: "모던 오피스 인테리어",
    location: "서울 강남구",
    category: "Commercial",
    year: "2024",
    size: "150㎡",
    description: "현대적 감각과 기능성을 겸비한 모던 오피스 공간입니다. 자연광을 최대한 활용하면서도 업무 효율성을 높이는 텍스타일 솔루션을 적용했습니다.",
    concept: "Clean lines and functional beauty create a workspace that inspires productivity and creativity.",
    mainImage: "/images/projects/modern-office-main.jpg",
    galleryImages: [
      "/images/projects/modern-office-1.jpg",
      "/images/projects/modern-office-2.jpg",
      "/images/projects/modern-office-3.jpg"
    ],
    materials: ["프리미엄 알루미늄 블라인드", "차단 커튼", "전동 시스템"],
    features: ["자동 빛 조절", "에너지 효율성", "소음 차단", "프라이버시 보호"]
  },
  {
    slug: "minimal-residence-bundang",
    title: "미니멀 레지던스",
    location: "경기도 분당구",
    category: "Residential",
    year: "2024",
    size: "85㎡",
    description: "미니멀 라이프스타일을 추구하는 가족을 위한 주거 공간입니다. 단순함 속에서 찾는 진정한 편안함을 텍스타일로 완성했습니다.",
    concept: "Minimalism meets warmth through carefully curated textiles and natural light control.",
    mainImage: "/images/projects/minimal-residence-main.jpg",
    galleryImages: [
      "/images/projects/minimal-residence-1.jpg",
      "/images/projects/minimal-residence-2.jpg"
    ],
    materials: ["린넨 셰어 커튼", "화이트 롤 블라인드", "블랙아웃 커튼"],
    features: ["자연스러운 빛 투과", "미니멀 디자인", "쉬운 관리", "아늑한 분위기"]
  },
  {
    slug: "classic-cafe-hongdae",
    title: "클래식 카페 인테리어",
    location: "서울 홍대",
    category: "F&B",
    year: "2023",
    size: "120㎡",
    description: "클래식한 분위기와 모던한 감각이 조화를 이루는 카페 공간입니다. 따뜻하고 아늑한 분위기를 연출하는 텍스타일 디자인을 적용했습니다.",
    concept: "Timeless elegance meets contemporary comfort in this cozy urban retreat.",
    mainImage: "/images/projects/classic-cafe-main.jpg",
    materials: ["벨벳 커튼", "우드 블라인드", "패브릭 파티션"],
    features: ["따뜻한 분위기", "소음 흡수", "자연 채광", "프라이빗 존 구성"]
  },
  {
    slug: "contemporary-house-goyang",
    title: "컨템포러리 하우스",
    location: "경기도 고양시",
    category: "Residential",
    year: "2024",
    size: "180㎡",
    description: "현대적 건축과 자연이 만나는 컨템포러리 하우스입니다. 대형 창을 통해 들어오는 자연광을 섬세하게 조절하는 텍스타일 시스템을 구현했습니다.",
    concept: "Architecture and nature harmonize through sophisticated light management systems.",
    mainImage: "/images/projects/contemporary-house-main.jpg",
    materials: ["전동 커튼 시스템", "스마트 블라인드", "UV 차단 필름"],
    features: ["스마트 홈 연동", "UV 차단", "에너지 절약", "원격 제어"]
  },
  {
    slug: "scandinavian-apartment-mapo",
    title: "스칸디나비안 아파트",
    location: "서울 마포구",
    category: "Residential",
    year: "2023",
    size: "95㎡",
    description: "북유럽 스타일의 따뜻하고 아늑한 아파트 인테리어입니다. 자연 소재와 밝은 색상을 활용한 스칸디나비안 감성을 텍스타일로 표현했습니다.",
    concept: "Nordic simplicity and hygge lifestyle expressed through natural textiles and soft lighting.",
    mainImage: "/images/projects/scandinavian-apartment-main.jpg",
    materials: ["린넨 커튼", "화이트 우드 블라인드", "자연 섬유 러그"],
    features: ["자연 소재", "밝은 색상", "코지한 분위기", "지속 가능성"]
  },
  {
    slug: "industrial-lobby-yongsan",
    title: "인더스트리얼 로비",
    location: "서울 용산구",
    category: "Commercial",
    year: "2024",
    size: "300㎡",
    description: "산업적 디자인과 현대적 세련미가 만나는 로비 공간입니다. 강철과 콘크리트 소재와 조화를 이루는 텍스타일 요소를 적용했습니다.",
    concept: "Raw industrial materials softened by sophisticated textile interventions.",
    mainImage: "/images/projects/industrial-lobby-main.jpg",
    materials: ["메탈 블라인드", "인더스트리얼 커튼", "차단막 시스템"],
    features: ["내구성", "메탈릭 마감", "대형 공간 적합", "모던 디자인"]
  },
  {
    slug: "luxury-penthouse-seocho",
    title: "럭셔리 펜트하우스",
    location: "서울 서초구",
    category: "Residential",
    year: "2024",
    size: "250㎡",
    description: "최고급 주거 공간에 어울리는 프리미엄 텍스타일 솔루션입니다. 도시의 전망을 최대한 활용하면서도 프라이버시를 보장하는 시스템을 구현했습니다.",
    concept: "Ultimate luxury living enhanced by premium textile solutions and panoramic city views.",
    mainImage: "/images/projects/luxury-penthouse-main.jpg",
    materials: ["프리미엄 실크 커튼", "전동 차단 블라인드", "스마트 글라스"],
    features: ["최고급 소재", "전망 최적화", "완벽한 프라이버시", "스마트 제어"]
  },
  {
    slug: "modern-clinic-seongnam",
    title: "모던 클리닉",
    location: "경기도 성남시",
    category: "Healthcare",
    year: "2023",
    size: "200㎡",
    description: "편안하고 치유적인 환경을 조성하는 의료 공간입니다. 환자의 심리적 안정감을 높이는 색상과 질감의 텍스타일을 선별해 적용했습니다.",
    concept: "Healing environments created through therapeutic color palettes and soothing textures.",
    mainImage: "/images/projects/modern-clinic-main.jpg",
    materials: ["항균 패브릭", "의료용 블라인드", "차단 커튼"],
    features: ["항균 처리", "쉬운 세척", "치유적 색상", "소음 차단"]
  },
  {
    slug: "art-gallery-jongno",
    title: "아트 갤러리",
    location: "서울 종로구",
    category: "Cultural",
    year: "2024",
    size: "400㎡",
    description: "예술 작품을 위한 최적의 조명 환경을 제공하는 갤러리 공간입니다. 작품 보호와 관람 경험을 모두 고려한 정밀한 빛 조절 시스템을 구축했습니다.",
    concept: "Precision lighting control systems that protect artworks while enhancing visitor experience.",
    mainImage: "/images/projects/art-gallery-main.jpg",
    materials: ["UV 차단 필름", "정밀 조광 블라인드", "블랙아웃 시스템"],
    features: ["UV 보호", "정밀 조광", "작품 보호", "전시 최적화"]
  }
];

// slug로 프로젝트 상세 정보 찾기
export const getProjectBySlug = (slug: string): ProjectDetail | undefined => {
  return projectDetails.find(project => project.slug === slug);
};

// 모든 프로젝트 목록 가져오기
export const getAllProjects = (): ProjectDetail[] => {
  return projectDetails;
}; 