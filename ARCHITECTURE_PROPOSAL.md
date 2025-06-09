# 🏗️ KHAKISHOP 아키텍처 개선 제안서

## 🎯 목표
- **확장성**: 새 카테고리/콘텐츠 타입 추가 시 최소한의 코드 변경
- **재사용성**: 공통 템플릿과 컴포넌트로 중복 제거
- **일관성**: 표준화된 구조와 패턴
- **다국어**: 원활한 i18n 확장

## 📁 개선된 디렉토리 구조

```
src/
├── app/[locale]/
│   ├── (content)/                    # Content Route Group
│   │   ├── [category]/
│   │   │   ├── page.tsx              # 카테고리 리스트 페이지
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # 통합된 상세 페이지
│   │   └── blog/
│   │       ├── page.tsx              # 블로그 리스트
│   │       └── [slug]/
│   │           └── page.tsx          # 블로그 상세
│   │
│   ├── (marketing)/                  # Marketing Route Group
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── references/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   │
│   └── (admin)/                      # Admin Route Group
│       └── admin/...
│
├── components/
│   ├── templates/                    # 재사용 가능한 템플릿
│   │   ├── ContentDetailTemplate.tsx
│   │   ├── ContentListTemplate.tsx
│   │   └── BlogTemplate.tsx
│   │
│   ├── blocks/                       # 콘텐츠 블록들
│   │   ├── HeroBlock.tsx
│   │   ├── SpecificationBlock.tsx
│   │   ├── GalleryBlock.tsx
│   │   └── RelatedItemsBlock.tsx
│   │
│   └── ui/                          # 기본 UI 컴포넌트
│       ├── Card.tsx
│       ├── Button.tsx
│       └── Image.tsx
│
├── data/
│   ├── content/                     # 콘텐츠 데이터
│   │   ├── products.ts
│   │   ├── blog.ts
│   │   ├── references.ts
│   │   └── collections.ts
│   │
│   ├── schemas/                     # 데이터 스키마
│   │   ├── content.schema.ts
│   │   └── meta.schema.ts
│   │
│   └── config/                      # 설정 데이터
│       ├── categories.ts
│       └── navigation.ts
│
├── lib/
│   ├── content/                     # 콘텐츠 관리
│   │   ├── manager.ts              # 통합 콘텐츠 매니저
│   │   ├── renderer.ts             # 렌더링 로직
│   │   └── metadata.ts             # 메타데이터 생성
│   │
│   └── utils/
│       ├── url.ts                  # URL 생성 헬퍼
│       └── i18n.ts                 # 국제화 헬퍼
│
└── types/
    ├── content.types.ts            # 콘텐츠 타입
    └── template.types.ts           # 템플릿 타입
```

## 🔧 핵심 개선사항

### 1. 통합된 콘텐츠 시스템

```typescript
// src/types/content.types.ts
export interface BaseContent {
  slug: string;
  title: string;
  description: string;
  category: string;
  contentType: 'product' | 'blog' | 'reference' | 'collection';
  publishedAt: Date;
  updatedAt: Date;
  metadata: ContentMetadata;
  blocks: ContentBlock[];
}

export interface Product extends BaseContent {
  contentType: 'product';
  price?: string;
  specifications?: Record<string, string>;
  features?: string[];
  gallery?: string[];
}

export interface BlogPost extends BaseContent {
  contentType: 'blog';
  author: string;
  tags: string[];
  excerpt: string;
}
```

### 2. 템플릿 기반 렌더링

```typescript
// src/components/templates/ContentDetailTemplate.tsx
interface ContentDetailTemplateProps {
  content: BaseContent;
  locale: string;
  template?: 'product' | 'blog' | 'reference';
}

export function ContentDetailTemplate({ 
  content, 
  locale, 
  template = 'product' 
}: ContentDetailTemplateProps) {
  const blocks = content.blocks.map(block => 
    renderContentBlock(block, { locale, template })
  );

  return (
    <article className="content-detail">
      <ContentHeader content={content} locale={locale} />
      <ContentBody blocks={blocks} />
      <ContentFooter content={content} />
    </article>
  );
}
```

### 3. 통합된 콘텐츠 매니저

```typescript
// src/lib/content/manager.ts
export class ContentManager {
  static async getContent<T extends BaseContent>(
    contentType: T['contentType'],
    slug: string,
    locale: string
  ): Promise<T | null> {
    // 통합된 콘텐츠 조회 로직
  }

  static async getContentList<T extends BaseContent>(
    contentType: T['contentType'],
    category?: string,
    locale?: string
  ): Promise<T[]> {
    // 통합된 리스트 조회 로직
  }

  static async generateStaticParams(
    contentType: BaseContent['contentType']
  ): Promise<{ slug: string }[]> {
    // 통합된 정적 파라미터 생성
  }
}
```

### 4. 설정 기반 카테고리 관리

```typescript
// src/data/config/categories.ts
export const categoryConfig = {
  curtain: {
    name: { ko: '커튼', en: 'Curtains', ja: 'カーテン' },
    description: { ko: '다양한 커튼 컬렉션', en: 'Various curtain collections' },
    template: 'product',
    fields: ['specifications', 'features', 'gallery'],
    seo: {
      titleTemplate: '{title} | 커튼 | KHAKISHOP',
      descriptionTemplate: '{description} - 프리미엄 커튼 컬렉션'
    }
  },
  blind: {
    name: { ko: '블라인드', en: 'Blinds', ja: 'ブラインド' },
    template: 'product',
    // ...
  },
  blog: {
    name: { ko: '블로그', en: 'Blog', ja: 'ブログ' },
    template: 'blog',
    fields: ['author', 'tags', 'excerpt'],
    // ...
  }
};
```

## 🚀 마이그레이션 단계

### Phase 1: 기반 구조 구축
1. 새로운 타입 시스템 구축
2. ContentManager 및 템플릿 시스템 개발
3. 기존 데이터를 새 스키마로 마이그레이션

### Phase 2: 기존 페이지 통합
1. 중복된 ProductView 컴포넌트들을 템플릿으로 대체
2. 카테고리별 페이지를 통합된 구조로 변경
3. 라우팅 정리 및 리다이렉트 설정

### Phase 3: 확장 기능 추가
1. 블로그 시스템 추가
2. 고급 SEO 기능 구현
3. 다국어 콘텐츠 관리 시스템

## 📈 예상 효과

### 개발 효율성
- **80% 코드 감소**: 중복 제거로 유지보수성 향상
- **빠른 확장**: 새 카테고리 추가 시 설정만으로 완료
- **일관된 UX**: 템플릿 기반으로 통일된 사용자 경험

### 성능 개선
- **최적화된 번들**: 중복 컴포넌트 제거로 번들 크기 감소
- **효율적인 정적 생성**: 통합된 generateStaticParams
- **개선된 SEO**: 구조화된 메타데이터 시스템

### 확장성
- **플러그인 방식**: 새로운 콘텐츠 타입을 쉽게 추가
- **다국어 준비**: i18n 시스템과 완전 통합
- **CMS 연동 가능**: 헤드리스 CMS와 쉬운 연동

## 🎯 구현 우선순위

1. **즉시 적용** (1-2주)
   - ContentDetailTemplate 구현
   - 기존 ProductView들을 템플릿으로 통합

2. **단기 목표** (1개월)
   - 통합된 데이터 구조 마이그레이션
   - Route Groups 적용

3. **중기 목표** (2-3개월)
   - 블로그 시스템 구축
   - 고급 SEO 및 다국어 기능

이 구조는 향후 확장에 매우 유연하며, 새로운 요구사항에 쉽게 대응할 수 있습니다. 