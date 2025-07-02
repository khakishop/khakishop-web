# 🧪 KHAKISHOP 테스트 환경 구성

## 📋 테스트 시스템 개요

KHAKISHOP은 포괄적인 테스트 환경을 구축하여 품질 보증과 안정성을 확보합니다.

### 🧪 테스트 시스템

```tsx
// 1. E2E 테스트 (Playwright)
📁 tests/ 폴더
├── 페이지 로딩 테스트
├── 사용자 인터랙션 테스트
├── 반응형 디자인 테스트
└── 성능 테스트

// 2. 접근성 테스트 (Axe)
✅ 자동화된 a11y 테스트
├── WCAG 2.1 AA 준수
├── 키보드 네비게이션
├── 스크린 리더 호환성
└── 색상 대비 검사

// 3. 성능 테스트 (Lighthouse)
🚀 Core Web Vitals 모니터링
├── LCP (Largest Contentful Paint)
├── FID (First Input Delay)
├── CLS (Cumulative Layout Shift)
└── PWA 점수 측정

// 4. 타입 안전성 테스트 (TypeScript)
🔒 컴파일 타임 검증
├── 타입 체크
├── 인터페이스 검증
├── 제네릭 타입 안전성
└── 런타임 오류 방지
```

## 🎭 E2E 테스트 (Playwright)

### 설정 파일
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

### 테스트 실행 명령어
```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# UI 모드로 테스트 실행
npm run test:e2e:ui

# 디버그 모드로 테스트 실행
npm run test:e2e:debug

# 헤드리스 모드 해제
npm run test:e2e:headed
```

### 주요 테스트 시나리오
```typescript
// tests/e2e/admin-images.spec.ts
test.describe('관리자 이미지 페이지', () => {
  test('이미지 업로드 기능이 정상 작동한다', async ({ page }) => {
    await page.goto('/ko/admin/images');
    
    // 파일 업로드 테스트
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // 메타데이터 입력
    await page.fill('[data-testid="title-input"]', 'E2E 테스트 이미지');
    
    // 업로드 실행 및 검증
    await page.click('[data-testid="upload-submit"]');
    await expect(page.locator('[data-testid="upload-success-message"]')).toBeVisible();
  });
});
```

## ♿ 접근성 테스트 (Axe)

### 자동화된 접근성 검사
```javascript
// scripts/a11y-test.js
const testPages = [
  'http://localhost:3000/ko',
  'http://localhost:3000/ko/about',
  'http://localhost:3000/ko/collection',
  'http://localhost:3000/ko/products',
  'http://localhost:3000/ko/references',
  'http://localhost:3000/ko/contact',
];

// WCAG 2.1 AA 준수 검사
console.log('📋 접근성 점검 항목:');
console.log('   ✅ 키보드 네비게이션');
console.log('   ✅ 스크린 리더 호환성');
console.log('   ✅ 색상 대비 (4.5:1 이상)');
console.log('   ✅ 대체 텍스트');
console.log('   ✅ 포커스 관리');
```

### 접근성 테스트 실행
```bash
# 접근성 테스트 실행
npm run a11y-test

# 결과 확인
open test-results/a11y-report.html
```

## 🚀 성능 테스트 (Lighthouse)

### Core Web Vitals 모니터링
```bash
# 전체 성능 감사
npm run lighthouse

# PWA 점수 측정
npm run lighthouse:pwa

# 결과 확인
open test-results/lighthouse-report.html
```

### 성능 지표 목표
```typescript
// 성능 기준
const performanceTargets = {
  LCP: '< 2.5초',      // Largest Contentful Paint
  FID: '< 100ms',      // First Input Delay
  CLS: '< 0.1',        // Cumulative Layout Shift
  Performance: '> 90', // Lighthouse 성능 점수
  Accessibility: '> 95', // 접근성 점수
  PWA: '> 90'          // PWA 점수
};
```

## 🔒 타입 안전성 테스트

### TypeScript 컴파일 검증
```bash
# 타입 체크
npm run test:types

# 전체 테스트 (타입 + 컴파일)
npm run test
```

### 타입 안전성 보장
```typescript
// 엄격한 타입 체크 설정
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🔄 CI/CD 통합 테스트

### GitHub Actions 워크플로우
```yaml
# .github/workflows/ci.yml
e2e-test:
  name: 🧪 E2E Tests
  runs-on: ubuntu-latest
  steps:
    - name: 🎭 Install Playwright
      run: npx playwright install --with-deps
    
    - name: 🧪 Run E2E tests
      run: npm run test:e2e
    
    - name: 📄 Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

### 자동화된 품질 검사
```bash
# 배포 전 전체 검증
npm run pre-deploy

# 포함 항목:
# ✅ 헬스 체크
# ✅ 타입 검증
# ✅ 빌드 테스트
# ✅ 린트 검사
```

## 📊 테스트 결과 모니터링

### 테스트 리포트 생성
```bash
# HTML 리포트 생성
npx playwright show-report

# JSON 결과 파일
test-results/results.json
```

### 성능 모니터링 대시보드
```typescript
// 실시간 성능 추적
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Core Web Vitals 수집
getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🛠️ 테스트 환경 설정

### 개발 환경 테스트
```bash
# 로컬 개발 서버 시작
npm run dev

# 별도 터미널에서 테스트 실행
npm run test:e2e
```

### 프로덕션 환경 테스트
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 프로덕션 환경 테스트
npm run test:e2e
```

## 📋 테스트 체크리스트

### 배포 전 필수 검증
- [ ] 🧪 E2E 테스트 통과
- [ ] ♿ 접근성 테스트 통과 (WCAG 2.1 AA)
- [ ] 🚀 성능 테스트 통과 (Lighthouse > 90)
- [ ] 🔒 타입 안전성 검증
- [ ] 📱 반응형 디자인 테스트
- [ ] 🌐 다국어 지원 테스트
- [ ] 🔐 보안 취약점 검사

### 정기 모니터링
- [ ] 📊 주간 성능 감사
- [ ] 🔍 월간 접근성 검토
- [ ] 🚨 실시간 오류 모니터링
- [ ] 📈 사용자 경험 지표 추적

## 🎯 테스트 자동화 스크립트

### 통합 테스트 실행
```bash
# 전체 테스트 스위트 실행
npm run test-all

# 빠른 검증 (핵심 기능만)
npm run quick-check

# 배포 준비 검증
npm run pre-deploy
```

### 테스트 결과 알림
```typescript
// 테스트 완료 시 Slack 알림
const notifyTestResults = async (results) => {
  const message = `
🧪 테스트 완료
✅ E2E: ${results.e2e.passed}/${results.e2e.total}
♿ A11Y: ${results.a11y.score}/100
🚀 성능: ${results.performance.score}/100
  `;
  
  await sendSlackNotification(message);
};
```

---

## 🚀 시작하기

1. **의존성 설치**
   ```bash
   npm install
   npx playwright install
   ```

2. **개발 서버 시작**
   ```bash
   npm run dev
   ```

3. **테스트 실행**
   ```bash
   npm run test:e2e
   npm run a11y-test
   npm run lighthouse
   ```

4. **결과 확인**
   ```bash
   open test-results/
   ```

이 테스트 환경을 통해 KHAKISHOP의 품질과 안정성을 지속적으로 보장할 수 있습니다. 🎉 