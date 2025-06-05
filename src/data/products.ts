// src/data/products.ts

export interface Product {
  title: string;
  description: string;
  features: string[];
  image?: string;
  slug: string;
  category: 'curtain' | 'blind' | 'motorized';
}

export const curtainProducts: Product[] = [
  {
    title: "클래식 커튼",
    description: "전통적인 우아함과 현대적 감각이 만나는 클래식 커튼 컬렉션. 다양한 패브릭과 색상으로 공간에 품격을 더합니다.",
    features: ["프리미엄 패브릭", "맞춤 제작", "다양한 색상"],
    image: "/images/classic.jpg",
    slug: "classic-curtain",
    category: "curtain"
  },
  {
    title: "모던 커튼",
    description: "미니멀하고 세련된 디자인의 모던 커튼. 심플한 라인과 기능성을 중시하는 현대적 공간에 완벽한 선택입니다.",
    features: ["미니멀 디자인", "기능성 우선", "현대적 감각"],
    image: "/images/modern.jpg",
    slug: "modern-curtain",
    category: "curtain"
  },
  {
    title: "셰어 커튼",
    description: "은은한 빛의 투과와 프라이버시를 동시에 제공하는 셰어 커튼. 공간에 부드러운 분위기를 연출합니다.",
    features: ["자연스러운 빛 투과", "프라이버시 보호", "부드러운 분위기"],
    image: "/images/sheer.jpg",
    slug: "sheer-curtain",
    category: "curtain"
  },
  {
    title: "린넨 화이트 커튼",
    description: "자연광을 부드럽게 받아들이는 린넨 화이트 커튼입니다.",
    features: ["고급 린넨 원단", "화이트 컬러", "은은한 자연광"],
    image: "/images/products/linen-white.jpg",
    slug: "linen-white",
    category: "curtain"
  },
  {
    title: "플리츠 아이보리",
    description: "세련된 주름과 부드러운 톤의 아이보리 컬러.",
    features: ["플리츠 디자인", "아이보리톤", "미니멀 인테리어에 적합"],
    image: "/images/products/pleats-ivory.jpg",
    slug: "pleats-ivory",
    category: "curtain"
  }
];

export const blindProducts: Product[] = [
  {
    title: "우드 블라인드",
    description: "자연스러운 나무의 질감과 따뜻함을 공간에 더하는 우드 블라인드. 고급스러운 마감과 내구성을 자랑합니다.",
    features: ["천연 나무 소재", "고급스러운 마감", "뛰어난 내구성"],
    image: "/images/wood.jpg",
    slug: "wood-blind",
    category: "blind"
  },
  {
    title: "알루미늄 블라인드",
    description: "세련되고 모던한 알루미늄 블라인드. 다양한 색상과 크기로 어떤 공간에도 완벽하게 어울립니다.",
    features: ["모던한 디자인", "다양한 색상", "쉬운 관리"],
    image: "/images/aluminum.jpg",
    slug: "aluminum-blind",
    category: "blind"
  },
  {
    title: "패브릭 블라인드",
    description: "부드러운 빛 조절과 세련된 디자인의 패브릭 블라인드. 공간에 따뜻하고 아늑한 분위기를 연출합니다.",
    features: ["부드러운 빛 조절", "세련된 패턴", "아늑한 분위기"],
    image: "/images/fabric.jpg",
    slug: "fabric-blind",
    category: "blind"
  }
];

export const motorizedProducts: Product[] = [
  {
    title: "전동 커튼 시스템",
    description: "리모컨 하나로 조작 가능한 전동 커튼 시스템. 스마트폰 앱과 연동하여 언제 어디서나 제어할 수 있습니다.",
    features: ["리모컨 조작", "스마트폰 연동", "조용한 모터"],
    image: "/images/motorized-curtain.jpg",
    slug: "motorized-curtain-system",
    category: "motorized"
  },
  {
    title: "전동 블라인드 시스템",
    description: "정밀한 각도 조절이 가능한 전동 블라인드. 시간대별 자동 조절 기능으로 최적의 빛 환경을 제공합니다.",
    features: ["정밀 각도 조절", "시간별 자동 조절", "에너지 절약"],
    image: "/images/motorized-blind.jpg",
    slug: "motorized-blind-system",
    category: "motorized"
  },
  {
    title: "스마트 홈 연동",
    description: "IoT 기반 스마트 홈 시스템과 연동 가능한 전동 제품군. 음성 인식과 AI 학습을 통한 최적화된 공간 제어.",
    features: ["IoT 연동", "음성 제어", "AI 학습 기능"],
    image: "/images/smart.jpg",
    slug: "smart-home-integration",
    category: "motorized"
  }
];

// 모든 제품을 하나의 배열로 합치는 헬퍼 함수
export const getAllProducts = (): Product[] => {
  return [...curtainProducts, ...blindProducts, ...motorizedProducts];
}; 