# Notion CMS 연동 설정 가이드

## 🔧 Notion 데이터베이스 설정

### 1. Notion 데이터베이스 생성
1. [Notion](https://notion.so) 워크스페이스에서 새 페이지 생성
2. **Table** 블록 추가하여 데이터베이스 생성
3. 데이터베이스 이름: `khaki shop Blog`

### 2. 필수 속성(Properties) 설정
다음 속성들을 데이터베이스에 추가하세요:

| 속성 이름 | 타입 | 설명 | 필수 여부 |
|----------|------|------|----------|
| **Title** | Title | 게시글 제목 | ✅ 필수 |
| **Slug** | Rich text | URL 슬러그 (비워두면 자동 생성) | ⭕ 선택 |
| **Summary** | Rich text | 게시글 요약 | ✅ 권장 |
| **Published** | Checkbox | 게시 여부 | ✅ 필수 |
| **Date** | Date | 작성/게시 날짜 | ✅ 필수 |
| **CoverImage** | URL | 커버 이미지 URL | ⭕ 선택 |
| **Tags** | Multi-select | 태그 목록 | ⭕ 선택 |
| **Author** | Rich text | 작성자 (기본값: khaki shop) | ⭕ 선택 |

### 3. 예시 게시글 생성
테스트용으로 다음과 같은 게시글을 생성해보세요:

```
Title: 커튼 선택 가이드
Slug: curtain-selection-guide
Summary: 공간에 맞는 완벽한 커튼을 선택하는 방법을 알아보세요.
Published: ✅ (체크)
Date: 2024-01-15
Tags: 커튼, 가이드, 인테리어
Author: khaki shop
```

---

## 🔑 Notion API 설정

### 1. Notion Integration 생성
1. [Notion Developers](https://developers.notion.com/) 접속
2. **My integrations** → **New integration** 클릭
3. Integration 정보 입력:
   - Name: `khaki shop Blog`
   - Associated workspace: 본인의 워크스페이스 선택
   - Capabilities: **Read content** 체크

### 2. API Key 복사
1. Integration 생성 후 **Internal Integration Secret** 복사
2. 이 값을 환경변수로 사용합니다

### 3. 데이터베이스 연결
1. 블로그 데이터베이스 페이지로 이동
2. 우상단 **...** 메뉴 → **Add connections** 클릭
3. 생성한 Integration (`khaki shop Blog`) 선택하여 연결

### 4. 데이터베이스 ID 복사
데이터베이스 URL에서 ID를 추출합니다:
```
https://notion.so/{workspace}/{database-id}?v={view-id}
```
`database-id` 부분을 복사하세요 (32자 문자열)

---

## 🛠️ 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Notion CMS 설정
NOTION_API_KEY=secret_your-integration-secret-key-here
NOTION_DATABASE_ID=your-database-id-here

# 기존 환경변수들
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_NAME="khaki shop"
NEXT_PUBLIC_APP_DESCRIPTION="커튼과 블라인드의 새로운 기준"
```

⚠️ **주의사항:**
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- API Key는 `secret_`로 시작하는 문자열입니다
- Database ID는 하이픈이 없는 32자 문자열입니다

---

## 🧪 테스트 및 확인

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 블로그 페이지 확인
- URL: `http://localhost:3000/ko/blog`
- Notion에서 `Published: true`로 설정한 게시글들이 표시되어야 합니다

### 3. 문제 해결

#### 게시글이 표시되지 않는 경우
1. **환경변수 확인**
   ```bash
   # 터미널에서 확인
   echo $NOTION_API_KEY
   echo $NOTION_DATABASE_ID
   ```

2. **Integration 연결 확인**
   - Notion 데이터베이스에서 **Add connections** 확인
   - Integration이 올바르게 연결되었는지 확인

3. **콘솔 로그 확인**
   - 브라우저 개발자 도구 → Console 탭
   - 서버 터미널에서 오류 메시지 확인

#### API 오류 발생 시
```bash
# 패키지 재설치
npm install @notionhq/client

# 캐시 정리
rm -rf .next
npm run dev
```

---

## 📝 게시글 작성 워크플로우

### 1. Notion에서 새 게시글 생성
1. 블로그 데이터베이스에서 **New** 클릭
2. 필수 속성들 입력:
   - **Title**: 게시글 제목
   - **Summary**: 간단한 요약 (2-3문장)
   - **Date**: 게시 날짜
   - **Published**: 체크 해제 (작성 중)

### 2. 게시글 내용 작성
- Notion 페이지에서 자유롭게 내용 작성
- 이미지, 텍스트, 리스트 등 다양한 블록 사용 가능

### 3. 게시 준비
1. **CoverImage**: 대표 이미지 URL 추가
2. **Tags**: 관련 태그 추가 (예: 커튼, 인테리어, 가이드)
3. **Slug**: URL 주소 커스터마이징 (선택)

### 4. 게시
- **Published** 체크박스 체크
- 웹사이트에서 즉시 확인 가능

---

## 🚀 고급 기능

### 1. 이미지 최적화
- Notion 이미지 URL 사용 시 로딩 속도 고려
- 가능하면 CDN 서비스 (Cloudinary, AWS S3 등) 활용 권장

### 2. SEO 최적화
- **Title**: 검색엔진 친화적인 제목 작성
- **Summary**: 150자 내외의 메타 설명 역할
- **Slug**: 영문 소문자, 하이픈 사용 권장

### 3. 태그 활용
자주 사용할 태그들:
- `커튼` `블라인드` `전동시스템`
- `인테리어` `가이드` `팁`
- `시공사례` `제품소개` `트렌드`

### 4. 예약 게시
- **Date**를 미래 날짜로 설정
- 필요시 Next.js에서 날짜 필터링 로직 추가 가능

---

## 🔄 백업 및 관리

### 1. 정기 백업
- Notion 데이터베이스를 정기적으로 Export
- CSV, Markdown 형태로 백업 보관

### 2. 성능 모니터링
```bash
# Lighthouse 성능 측정
npm run lighthouse

# 블로그 페이지 특정 측정
lighthouse http://localhost:3000/ko/blog --output=html
```

### 3. 캐싱 전략
- 현재: 서버 사이드에서 매번 Notion API 호출
- 개선 가능: Next.js ISR(Incremental Static Regeneration) 적용

---

## 📚 참고 자료

- [Notion API 공식 문서](https://developers.notion.com/)
- [Next.js App Router 가이드](https://nextjs.org/docs/app)
- [TypeScript Notion Client](https://github.com/makenotion/notion-sdk-js)

---

## ❓ FAQ

**Q: 게시글 수정 후 웹사이트에 반영이 안 돼요**
A: 브라우저 새로고침(Ctrl+F5) 또는 개발 서버 재시작 후 확인해보세요.

**Q: 이미지가 표시되지 않아요**
A: CoverImage URL이 올바른지, 이미지가 공개적으로 접근 가능한지 확인하세요.

**Q: 한글 슬러그를 사용해도 되나요?**
A: 네, 자동 슬러그 생성 함수가 한글을 지원합니다. 하지만 SEO상 영문 권장.

**Q: 게시글 순서를 바꾸고 싶어요**
A: **Date** 속성을 수정하면 최신순으로 자동 정렬됩니다. 