# 🏗️ KHAKISHOP 홈페이지 프로젝트 개발 문서

> **목표**: KHAKISHOP 프로젝트를 빠르게 파악하고 유지보수·확장이 가능하도록 전체 구조와 흐름을 설명

## 📋 **프로젝트 개요**

**KHAKISHOP**는 인테리어 블라인드·커튼 전문 업체의 브랜드 홈페이지로, 현대적이고 세련된 디자인을 통해 "카키 감성"을 강조하는 웹사이트입니다.

---

## 1. ✅ KHAKISHOP 홈페이지 전체 개발 흐름

### 🛠️ **기술 스택**
- **Framework**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **다국어**: next-intl (한국어/영어)
- **이미지 최적화**: Next.js Image + Sharp
- **배포**: Vercel
- **CI/CD**: GitHub Actions
- **모니터링**: Sentry, Vercel Analytics

### 🗂️ **프로젝트 구조**

```
khakishop-web/
├── 📁 src/
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 [locale]/            # 다국어 라우팅 (ko/en)
│   │   │   ├── 📄 page.tsx         # 홈페이지
│   │   │   ├── 📁 about/           # 브랜드 소개
│   │   │   ├── 📁 references/      # 시공 사례
│   │   │   ├── 📁 curtain/         # 커튼 카테고리
│   │   │   ├── 📁 blind/           # 블라인드 카테고리
│   │   │   ├── 📁 motorized/       # 전동 제품
│   │   │   ├── 📁 collection/      # 컬렉션
│   │   │   ├── 📁 products/        # 제품 상세
│   │   │   ├── 📁 contact/         # 문의하기
│   │   │   └── 📁 admin/           # 관리자 페이지
│   │   │       └── 📁 images/      # 이미지 관리 시스템
│   │   └── 📁 api/                 # API Routes
│   │       ├── 📄 sync-images/     # 이미지 동기화
│   │       ├── 📄 upload-image/    # 이미지 업로드
│   │       └── 📄 restore-images/  # 이미지 복원
│   ├── 📁 components/              # 재사용 컴포넌트
│   │   ├── 📄 HeroSection.tsx     # 메인 히어로
│   │   ├── 📄 ImageManagerCard.tsx # 이미지 관리
│   │   ├── 📄 FullscreenMenu.tsx  # 전체화면 메뉴
│   │   └── 📄 SystemStatusCard.tsx # 시스템 상태
│   ├── 📁 utils/                  # 유틸리티 함수
│   ├── 📁 hooks/                  # 커스텀 훅
│   ├── 📁 lib/                    # 라이브러리 설정
│   └── 📁 types/                  # 타입 정의
├── 📁 scripts/                    # 자동화 스크립트
│   ├── 📄 health-check.js         # 시스템 상태 점검
│   ├── 📄 autoGenerateAllImages.js # 이미지 자동 생성
│   └── 📄 smartImageManager.js    # 스마트 이미지 관리
├── 📁 .github/workflows/          # GitHub Actions
├── 📁 .husky/                     # Git 훅 설정
└── 📁 tests/                      # E2E 테스트 (Playwright)
```

### 🎨 **디자인 기준**
- **참고 사이트**: rigas-furniture.eu
- **디자인 컨셉**: 미니멀하고 세련된 가구 브랜드 감성
- **컬러 팔레트**: 카키, 베이지, 화이트 중심의 자연스러운 톤
- **타이포그래피**: 깔끔하고 가독성 높은 폰트
- **레이아웃**: 그리드 기반, 여백 활용, 이미지 중심

### 📈 **개발 순서 및 마일스톤**

1. **Phase 1**: 기본 구조 설정
   - Next.js 14 App Router 설정
   - 다국어 지원 (next-intl)
   - 기본 라우팅 구조

2. **Phase 2**: 메인 페이지 개발
   - Hero Section 구현
   - 제품 카테고리 페이지 (curtain, blind, motorized)
   - 반응형 디자인 적용

3. **Phase 3**: 고급 기능 구현
   - References 페이지 (시공 사례)
   - 전체화면 메뉴 시스템
   - 이미지 최적화

4. **Phase 4**: 관리자 시스템
   - 이미지 관리 페이지 (`/ko/admin/images`)
   - 자동화된 이미지 처리 시스템
   - 메타데이터 관리

5. **Phase 5**: 인프라 및 자동화
   - GitHub Actions CI/CD
   - Husky pre-commit 훅
   - 모니터링 시스템 구축

---

## 2. 🧱 KHAKISHOP 고유 콘텐츠 구성

### 📄 **각 페이지 특징**

#### **홈페이지 (`/ko`)**
- **목적**: 브랜드 첫인상, 주요 제품 소개
- **특징**: 대형 히어로 이미지, 제품 카테고리 그리드
- **핵심 메시지**: "세련된 공간을 위한 카키 감성"

#### **커튼 (`/ko/curtain`)**
- **목적**: 커튼 제품군 소개
- **특징**: 제품 이미지 갤러리, 기능별 분류
- **핵심 메시지**: "자연스러운 질감과 편안함"

#### **블라인드 (`/ko/blind`)**
- **목적**: 블라인드 제품군 소개
- **특징**: 기능성 강조, 설치 예시
- **핵심 메시지**: "깔끔하고 실용적인 공간 연출"

#### **전동 제품 (`/ko/motorized`)**
- **목적**: 스마트 홈 솔루션 제시
- **특징**: 기술적 혁신성 강조
- **핵심 메시지**: "편리함과 첨단 기술의 만남"

#### **시공 사례 (`/ko/references`)**
- **목적**: 실제 시공 결과물 전시
- **특징**: Before/After 비교, 고객 후기
- **핵심 메시지**: "검증된 전문성과 만족도"

#### **관리자 페이지 (`/ko/admin/images`)**
- **목적**: 이미지 콘텐츠 관리
- **특징**: 드래그앤드롭 업로드, 자동 분류, 메타데이터 관리

### 🎨 **브랜드 철학과 텍스트 스타일**

#### **브랜드 철학**
```
"카키 감성을 담은 인테리어 솔루션"
- 자연스러움과 모던함의 조화
- 실용성과 심미성의 균형
- 고객 맞춤형 공간 연출
```

#### **텍스트 스타일**
- **헤드라인**: 간결하고 임팩트 있는 메시지
- **본문**: 친근하면서도 전문적인 톤
- **CTA**: 명확하고 액션 지향적

### 🖼️ **이미지 구성 방식**

#### **카키샵 감성**
- **컬러 톤**: 따뜻한 베이지, 소프트 그린, 자연스러운 브라운
- **조명**: 자연광 활용, 부드러운 그림자
- **구도**: 미니멀하고 깔끔한 공간 연출

#### **Midjourney 8K 실사 스타일**
- **프롬프트 패턴**: "modern interior design, khaki tone curtains, 8K realistic"
- **이미지 크기**: 고해상도 (최소 1920x1080)
- **메타데이터**: "By khaki shop" 자동 삽입

---

## 3. 🛠 관리자 페이지 (`/ko/admin/images`) 상세 구조

### 🎯 **핵심 기능**

#### **1. 이미지 업로드 시스템**
- **파일 형식**: JPG, PNG, WebP 지원
- **크기 제한**: 최대 10MB
- **자동 최적화**: Sharp 라이브러리 활용
- **메타데이터 추출**: EXIF, 파일명 기반 카테고리 자동 분류

#### **2. 스마트 필터링**
```typescript
// 주요 필터 옵션
- 카테고리별 필터 (hero, collection, curtain, blind, etc.)
- 보호된 이미지 필터
- 검색어 기반 필터
- 날짜별 필터
```

#### **3. 카테고리 매핑 시스템**
- **자동 분류**: 파일명 패턴 인식
- **수동 분류**: 드래그앤드롭 인터페이스
- **일괄 처리**: 다중 선택 지원

### 🧩 **주요 컴포넌트**

#### **ImageManagerCard.tsx**
```typescript
// 핵심 기능
- 이미지 미리보기
- 메타데이터 편집
- 카테고리 변경
- 삭제/복원 기능
- 보호 상태 토글
```

#### **SystemStatusCard.tsx**
```typescript
// 시스템 상태 모니터링
- 동기화 상태
- 이미지 통계
- 에러 로그
- 성능 지표
```

#### **EmptyImageCard.tsx**
```typescript
// 업로드 인터페이스
- 드래그앤드롭 영역
- 파일 선택 버튼
- 진행률 표시
- 에러 처리
```

### 🔄 **카테고리 동기화 시스템**

#### **sync-images API (`/api/sync-images`)**
```typescript
// POST 요청 처리
- 물리적 파일 스캔
- 메타데이터 동기화
- 카테고리 자동 분류
- 중복 파일 감지
- 무결성 검사
```

#### **getCategoryStats 함수**
```typescript
// 실시간 통계 계산
- 카테고리별 이미지 수
- 보호된 이미지 수
- 오류 상태 이미지 수
- 전체 용량 계산
```

### 🚨 **해결한 주요 이슈들**

#### **1. framer-motion Import 오류**
```typescript
// 문제: 'motion' is not exported from 'framer-motion/client'
// 해결: 중앙화된 import 시스템
import { motion } from '../lib/imports';
```

#### **2. 무한 루프 문제**
```typescript
// 문제: useEffect 의존성 배열 문제
// 해결: AbortController와 cleanup 함수 활용
useEffect(() => {
  const controller = new AbortController();
  
  return () => {
    controller.abort();
  };
}, []);
```

#### **3. API 호출 반복 문제**
```typescript
// 문제: 동시 다발적 API 호출
// 해결: 요청 상태 관리와 debounce 적용
const [syncing, setSyncing] = useState(false);

const syncImages = useCallback(async () => {
  if (syncing) return;
  setSyncing(true);
  // ... API 호출
  setSyncing(false);
}, [syncing]);
```

#### **4. getCategoryStats 초기화 오류**
```typescript
// 문제: Cannot access 'getCategoryStats' before initialization
// 해결: 함수 선언 순서 조정과 useMemo 활용
const getCategoryStats = useCallback(() => {
  // 통계 계산 로직
}, [mappedImages]);

const stats = useMemo(() => {
  return getCategoryStats();
}, [getCategoryStats]);
```

---

## 4. 🔁 자동화 및 시스템 설정

### 🚀 **GitHub Actions + Vercel 배포 흐름**

#### **CI/CD 파이프라인 (`.github/workflows/ci.yml`)**
```yaml
# 주요 단계
1. Health Check - 시스템 상태 점검
2. Build - Next.js 빌드 테스트
3. E2E Tests - Playwright 자동 테스트
4. Performance Audit - Lighthouse 성능 측정
5. Deployment Ready - 배포 승인
```

#### **배포 전 검증 항목**
- TypeScript 컴파일 검사
- ESLint 코드 품질 검사
- 이미지 무결성 검사
- API 엔드포인트 응답 테스트
- 주요 페이지 로드 테스트

### 🎣 **Husky 설정 (Pre-commit 훅)**

#### **설정 파일: `.husky/pre-commit`**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "✅ 코드 품질 검사 시작 중..."

# ESLint: 모든 경고와 에러 차단
npm run lint -- --max-warnings=0

# TypeScript 컴파일 검증
npm run test

# 시스템 상태 점검
npm run health-check

echo "🎉 모든 검사 통과! 안전하게 커밋할 수 있습니다."
```

#### **검사 항목**
- **ESLint**: 코드 스타일, 사용하지 않는 변수, React Hook 규칙
- **TypeScript**: 타입 검사, 컴파일 오류
- **Health Check**: 의존성, import 구문, 필수 파일 존재

### 🏥 **Health Check 스크립트**

#### **위치**: `scripts/health-check.js`

#### **검증 영역**
1. **의존성 검사**: package.json과 node_modules 일치성
2. **Import 구문 검사**: 모든 import 경로 유효성
3. **TypeScript 컴파일**: 전체 프로젝트 컴파일 성공
4. **Next.js 빌드**: 프로덕션 빌드 성공
5. **필수 파일**: 설정 파일들 존재 확인
6. **환경 설정**: 환경 변수 검증

#### **실행 방법**
```bash
npm run health-check        # 전체 검사
npm run validate-imports    # Import만 검사
npm run pre-deploy         # 배포 전 검사
```

### 📊 **모니터링 도구 적용**

#### **Sentry (에러 추적)**
```typescript
// 설정: src/lib/monitoring.ts
- 실시간 에러 추적
- 성능 지표 수집
- 사용자 세션 분석
- 릴리스 추적
```

#### **Vercel Analytics (성능 분석)**
```typescript
// 자동 수집 지표
- Core Web Vitals
- 페이지 로드 시간
- 사용자 인터랙션
- 트래픽 분석
```

#### **Custom Monitoring**
```typescript
// usePerformanceMonitoring 훅
- 컴포넌트별 렌더링 시간
- API 응답 시간
- 메모리 사용량
- 사용자 액션 추적
```

---

## 🛠️ **개발 워크플로우**

### 🚀 **개발 시작**
```bash
# 1. 프로젝트 클론
git clone [repository-url]
cd khakishop-web

# 2. 의존성 설치
npm install

# 3. 환경 설정
cp .env.example .env.local

# 4. 개발 서버 시작
npm run fresh    # 캐시 정리 후 시작
```

### 💻 **일상적인 개발**
```bash
# 1. 새로운 기능 브랜치
git checkout -b feature/new-component

# 2. 개발 중 검증
npm run health-check
npm run lint

# 3. 커밋 (자동으로 pre-commit 훅 실행)
git add .
git commit -m "feat: add new component"

# 4. 푸시 (GitHub Actions 자동 실행)
git push origin feature/new-component
```

### 🚀 **배포 프로세스**
```bash
# 1. 배포 전 최종 검증
npm run pre-deploy

# 2. 프로덕션 빌드 테스트
npm run build
npm run start

# 3. E2E 테스트
npm run test:e2e

# 4. main 브랜치 병합
git checkout main
git merge feature/new-component

# 5. Vercel 자동 배포
git push origin main
```

---

## 📝 **주요 명령어 정리**

### 🔧 **개발 명령어**
```bash
npm run dev              # 개발 서버 시작
npm run fresh            # 캐시 정리 후 개발 서버
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버 시작
```

### ✅ **검증 명령어**
```bash
npm run health-check     # 전체 시스템 점검
npm run lint             # ESLint 검사
npm run test             # TypeScript 컴파일 검사
npm run test:e2e         # E2E 테스트
npm run lighthouse       # 성능 측정
```

### 🎨 **이미지 관리 명령어**
```bash
npm run smart-scan       # 스마트 이미지 스캔
npm run image-status     # 이미지 상태 요약
npm run auto-generate-all-images # 전체 이미지 자동 생성
npm run backup-midjourney # 이미지 백업
```

### 🔧 **유틸리티 명령어**
```bash
npm run format           # 코드 포맷팅
npm run fix-all          # 자동 수정
npm run clean            # 캐시 정리
npm run image-help       # 이미지 명령어 도움말
```

---

## 🎯 **향후 개발 방향**

### 📈 **단기 계획 (1-3개월)**
1. **성능 최적화**: 이미지 로딩 최적화, 코드 스플리팅
2. **SEO 강화**: 메타태그 최적화, 구조화된 데이터
3. **접근성 개선**: WCAG 가이드라인 준수
4. **모바일 UX**: 터치 인터랙션 개선

### 🚀 **중기 계획 (3-6개월)**
1. **CMS 도입**: 콘텐츠 관리 시스템 구축
2. **고객 관리**: 문의/견적 시스템
3. **포트폴리오 확장**: 더 많은 시공 사례
4. **다국어 확장**: 추가 언어 지원

### 🌟 **장기 계획 (6개월+)**
1. **E-commerce**: 온라인 주문 시스템
2. **AR/VR 연동**: 가상 체험 기능
3. **AI 추천**: 개인화된 제품 추천
4. **모바일 앱**: 네이티브 앱 개발

---

## 📞 **문의 및 지원**

### 🛠️ **기술 문의**
- **이슈 등록**: GitHub Issues
- **개발 문서**: `/docs` 폴더
- **API 문서**: Swagger UI (예정)

### 📊 **모니터링 대시보드**
- **Vercel Dashboard**: 배포 상태, 성능 지표
- **Sentry Dashboard**: 에러 추적, 성능 분석
- **GitHub Actions**: CI/CD 파이프라인 상태

---

*문서 최종 업데이트: 2024년 12월*
*작성자: KHAKISHOP 개발팀* 