# GA4 & PWA 설정 가이드

## 🔧 Google Analytics 4 (GA4) 설정

### 1. 환경변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Google Analytics 4 Tracking ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# PWA 설정용 앱 정보 (선택사항)
NEXT_PUBLIC_APP_NAME="khaki shop"
NEXT_PUBLIC_APP_DESCRIPTION="커튼과 블라인드의 새로운 기준"

# Notion CMS 설정 (블로그 기능)
NOTION_API_KEY=secret_your-integration-secret-key-here
NOTION_DATABASE_ID=your-database-id-here
```

### 2. GA4 속성 만들기
1. [Google Analytics](https://analytics.google.com/) 접속
2. **관리** → **속성 만들기** 클릭
3. 속성 이름: `khaki shop`
4. 보고 시간대: `대한민국`
5. 통화: `대한민국 원(₩)`
6. **웹** 데이터 스트림 생성
7. 웹사이트 URL: `https://your-domain.com`
8. 측정 ID(G-XXXXXXXXXX) 복사하여 환경변수에 설정

### 3. 추적 확인
- 개발 서버 실행: `npm run dev`
- Google Analytics 실시간 보고서에서 트래픽 확인

---

## 📱 PWA (Progressive Web App) 설정

### 현재 구현된 기능
✅ **웹 앱 매니페스트** (`/manifest.json`)
✅ **서비스 워커** (자동 생성)
✅ **아이콘 지원** (여러 크기)
✅ **오프라인 캐싱**
✅ **설치 가능한 웹 앱**

### PWA 아이콘 생성하기

#### 1. 기본 아이콘 준비
- 512x512px PNG 파일 준비 (투명 배경)
- 브랜드 로고나 앱 아이콘 사용

#### 2. 다양한 크기 생성
다음 크기들로 아이콘을 생성하여 `/public/icons/` 폴더에 저장하세요:

```
icon-72x72.png
icon-96x96.png
icon-128x128.png
icon-144x144.png
icon-152x152.png
icon-192x192.png
icon-384x384.png
icon-512x512.png

# Apple 터치 아이콘
touch-icon-iphone.png (120x120)
touch-icon-ipad.png (152x152)
touch-icon-iphone-retina.png (180x180)
touch-icon-ipad-retina.png (167x167)

# Microsoft 아이콘
ms-icon-70x70.png
ms-icon-144x144.png
ms-icon-150x150.png
ms-icon-310x310.png

# Favicon
favicon-16x16.png
favicon-32x32.png
safari-pinned-tab.svg
```

#### 3. 온라인 도구 활용
**추천 도구:**
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)
- [Favicon Generator](https://realfavicongenerator.net/)
- [App Icon Generator](https://appicon.co/)

### PWA 테스트하기

#### Chrome DevTools에서 확인
1. F12 → **Application** 탭
2. **Manifest** 섹션에서 매니페스트 파일 확인
3. **Service Workers** 섹션에서 서비스 워커 상태 확인
4. **Storage** → **Cache Storage**에서 캐시된 리소스 확인

#### Lighthouse PWA 점수 확인
```bash
npm run lighthouse
```

### 배포 후 설정

#### 1. 도메인 설정
`manifest.json`에서 실제 도메인으로 업데이트:
```json
{
  "scope": "https://your-domain.com/",
  "start_url": "https://your-domain.com/"
}
```

#### 2. HTTPS 필수
PWA는 HTTPS에서만 완전히 작동합니다.

#### 3. 앱 설치 테스트
- Chrome: 주소창 오른쪽 설치 버튼 확인
- Safari (iOS): 공유 → 홈 화면에 추가
- Android: 브라우저 메뉴 → 홈 화면에 추가

---

## 🚀 성능 최적화

### 캐싱 전략
현재 설정된 캐싱 전략:
- **NetworkFirst**: 네트워크 우선, 실패 시 캐시 사용
- **최대 200개 엔트리** 캐시 저장
- **개발 모드에서는 비활성화**

### 오프라인 페이지 (선택사항)
오프라인 상태에서 보여줄 페이지를 추가하려면:

```tsx
// pages/offline.tsx 또는 app/offline/page.tsx
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>오프라인 상태입니다</h1>
        <p>인터넷 연결을 확인해주세요.</p>
      </div>
    </div>
  );
}
```

---

## 📊 분석 및 모니터링

### GA4 이벤트 추적
페이지별 맞춤 이벤트를 추가하려면:

```tsx
// 버튼 클릭 추적 예시
const handleCTAClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: 'landing_page_cta'
    });
  }
};
```

### PWA 설치 이벤트 추적
```tsx
useEffect(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // 설치 프롬프트 표시 전 이벤트
    if (window.gtag) {
      window.gtag('event', 'pwa_install_prompt', {
        event_category: 'pwa'
      });
    }
  });
}, []);
```

---

## ⚠️ 주의사항

1. **환경변수**: `.env.local` 파일은 절대 버전 관리에 포함하지 마세요
2. **아이콘**: 실제 서비스 전에 브랜드에 맞는 아이콘으로 교체하세요
3. **도메인**: manifest.json의 URL들을 실제 도메인으로 업데이트하세요
4. **HTTPS**: PWA 기능은 HTTPS에서만 완전히 작동합니다

---

## 🔍 문제 해결

### GA4가 작동하지 않는 경우
1. 환경변수 `NEXT_PUBLIC_GA_ID` 확인
2. 측정 ID 형식 확인 (G-XXXXXXXXXX)
3. 브라우저 광고 차단기 비활성화
4. 개발자 도구 Network 탭에서 GA 요청 확인

### PWA 설치 버튼이 나타나지 않는 경우
1. HTTPS 사용 여부 확인
2. manifest.json 파일 유효성 검사
3. 서비스 워커 등록 상태 확인
4. 필수 아이콘 파일 존재 여부 확인

### 빌드 오류 발생 시
```bash
# 캐시 정리 후 재빌드
rm -rf .next
npm run build
``` 