# Khakishop Midjourney V7 프롬프트 생성 시스템

RIGAS 가구 디자인 모티브를 유지하며 khakishop 웹사이트용 고품질 이미지를 생성하기 위한 Midjourney V7 프롬프트 자동 생성 시스템입니다.

## 📁 폴더 구조 기반 자동 프롬프트

### 생성된 이미지 폴더 구조
```
public/images/
├── references/              # 시공 사례 (9개)
│   ├── modern-office-gangnam/
│   ├── minimal-residence-bundang/
│   ├── classic-cafe-hongdae/
│   ├── contemporary-house-goyang/
│   ├── scandinavian-apartment-mapo/
│   ├── industrial-lobby-yongsan/
│   ├── luxury-penthouse-seocho/
│   ├── modern-clinic-seongnam/
│   └── art-gallery-jongno/
├── products/
│   ├── curtain/             # 커튼 제품 (5개)
│   │   ├── classic-curtain/
│   │   ├── modern-curtain/
│   │   ├── sheer-curtain/
│   │   ├── linen-white/
│   │   └── pleats-ivory/
│   ├── blind/               # 블라인드 제품 (3개)
│   │   ├── wood-blind/
│   │   ├── aluminum-blind/
│   │   └── fabric-blind/
│   └── motorized/           # 전동 제품 (3개)
│       ├── motorized-curtain-system/
│       ├── motorized-blind-system/
│       └── smart-home-integration/
├── landing/                 # 메인 히어로 이미지
└── hero/                    # 브랜드 이미지
```

## 🎨 브랜드 디자인 가이드라인

### RIGAS 가구 모티브 유지
- **자연광 중심**: 오후 햇살이 창문과 커튼을 통해 들어오는 조명
- **미니멀 스타일링**: 차분하고 따뜻한 분위기
- **고급 가구**: USM 모듈러 시스템 등 프리미엄 가구 포함
- **중성 색조**: 세련된 중성 컬러 팔레트
- **넓은 공간감**: 여유로운 인테리어 레이아웃

### 공통 기술 사양
- **해상도**: 8K 인테리어 매거진 사진 품질
- **촬영**: 50mm 프라임 렌즈, f/2.2 얕은 심도
- **스타일**: ultra-photorealistic, 시네마틱 자연광
- **비율**: 16:9 (--ar 16:9 --style raw --v 6.1)

## 🔧 사용법

### 1. TypeScript 유틸리티 사용
```typescript
import { generatePromptFromPath, generateMidjourneyPrompt } from '@/utils/imagePromptGenerator';

// 폴더 경로에서 자동 생성
const prompt = generatePromptFromPath('/public/images/references/modern-office-gangnam/main.jpg', 'main');

// 수동으로 구성
const customPrompt = generateMidjourneyPrompt({
  category: 'curtain',
  slug: 'sheer-curtain',
  imageType: 'detail'
});
```

### 2. 스크립트로 일괄 생성
```bash
# 모든 프롬프트 생성 및 JSON 파일 저장
node scripts/generatePrompts.js

# 출력: khakishop-midjourney-prompts.json (43개 프롬프트)
```

### 3. 생성된 JSON 파일 활용
```json
{
  "/public/images/references/modern-office-gangnam/main.jpg": "spacious modern corporate office with floor-to-ceiling windows, urban midcentury furniture, glass conference table...",
  "/public/images/products/curtain/sheer-curtain/main.jpg": "ethereal sheer curtains creating soft light diffusion, airy atmosphere, bedroom or study setting..."
}
```

## 📝 카테고리별 프롬프트 특성

### 🏢 References (시공 사례)
- **목적**: 실제 시공 사례처럼 보이는 인테리어 촬영
- **특징**: 공간 유형별 맞춤 스타일 (오피스, 주거, 카페, 갤러리 등)
- **예시**:
  - `modern-office-gangnam`: 도시형 미드센트리 오피스
  - `minimal-residence-bundang`: 스칸디나비아 미니멀 주거
  - `classic-cafe-hongdae`: 따뜻한 카페 인테리어

### 🎭 Curtain 제품
- **목적**: 커튼의 텍스처와 드레이핑 강조
- **특징**: 패브릭 디테일, 자연광 투과 효과
- **유형**: main (메인 샷), detail (텍스처 클로즈업)

### 🪟 Blind 제품  
- **목적**: 블라인드의 조도 조절 기능 강조
- **특징**: 슬랫 디테일, 빛 조절 데모
- **유형**: main (제품 샷), lifestyle (사용 시나리오)

### ⚙️ Motorized 제품
- **목적**: 스마트 홈 기술 통합 강조
- **특징**: 전동 시스템, 리모컨, 자동화
- **유형**: main (시스템 샷), tech (기술 클로즈업)

### 🌟 Hero/Landing
- **목적**: khakishop 브랜드 아이덴티티 표현
- **특징**: 브랜드 감성, 라이프스타일 어필
- **유형**: brand-main, hero-mobile, lifestyle

## 🎯 이미지 타입별 구분

| 타입 | 설명 | 프롬프트 modifier |
|------|------|-------------------|
| `main` | 메인 히어로 샷 | hero shot composition, primary focal point |
| `gallery` | 다각도 갤러리 뷰 | multiple angle showcase, comprehensive view |
| `detail` | 텍스처/소재 클로즈업 | close-up texture focus, material emphasis |
| `lifestyle` | 사용자 인터랙션 | human interaction, living scenario, emotional connection |

## 🔍 Slug 기반 자동 감지

시스템이 slug 이름을 분석하여 자동으로 공간 유형을 감지합니다:

- `office` → 전문적 오피스 분위기
- `residence`, `apartment`, `house`, `penthouse` → 주거 공간
- `cafe` → 카페 분위기  
- `gallery` → 갤러리/전시 공간
- `clinic` → 의료/웰니스 시설
- `lobby` → 로비/리셉션 공간

## 📊 생성 통계

- **총 프롬프트**: 43개
- **References**: 18개 (9개 공간 × 2타입)
- **Curtain**: 10개 (5개 제품 × 2타입)
- **Blind**: 6개 (3개 제품 × 2타입)
- **Motorized**: 6개 (3개 제품 × 2타입)
- **Hero/Landing**: 3개

## 🚀 고급 사용법

### 커스텀 프롬프트 생성
```typescript
// 새로운 공간 타입 추가
const CUSTOM_SPACE_STYLES = {
  'luxury-hotel-lobby': 'grand hotel lobby with marble columns, crystal chandeliers, premium seating areas'
};

// 프롬프트 생성
const customPrompt = generateMidjourneyPrompt({
  category: 'references',
  slug: 'luxury-hotel-lobby',
  imageType: 'main'
});
```

### 배치 프롬프트 생성
```typescript
import { generateAllPrompts } from '@/utils/imagePromptGenerator';

const allPrompts = generateAllPrompts();
// 43개 모든 프롬프트를 한 번에 생성
```

## 💡 팁

1. **프롬프트 길이**: 각 프롬프트는 약 300-500자로 최적화됨
2. **일관성**: 모든 프롬프트에 RIGAS 브랜드 모티브 유지
3. **세분화**: 각 slug와 이미지 타입에 특화된 디테일 포함
4. **확장성**: 새로운 제품이나 공간 타입 쉽게 추가 가능

## 📝 유지보수

새로운 제품이나 공간을 추가할 때:

1. `imagePromptGenerator.ts`의 해당 스타일 객체에 추가
2. `generatePrompts.js` 스크립트 실행으로 새 프롬프트 생성
3. JSON 파일 업데이트 확인

---

**Note**: 모든 프롬프트는 Midjourney V7 기준으로 최적화되었으며, RIGAS 가구의 브랜드 감성을 충실히 반영합니다. 