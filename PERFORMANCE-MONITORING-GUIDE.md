# 🚀 KHAKISHOP 안전한 성능 모니터링 가이드

> **무한루프 문제 해결 완료** ✅  
> 안전한 수동 실행 방식으로 개선된 성능 모니터링 시스템

## 📋 개요

KHAKISHOP 프로젝트의 성능을 안전하고 효율적으로 모니터링하는 방법을 안내합니다.

### 🔧 개선 사항
- ❌ **기존**: 무한루프 실시간 모니터링 (위험)
- ✅ **개선**: 안전한 수동 실행 방식
- ✅ **안전 장치**: 타임아웃, 서버 상태 확인, 파일 크기 제한
- ✅ **실무 친화적**: 단계별 성능 점검

---

## 🚀 빠른 시작

### 1. 📊 기본 성능 점검 (1-2분)
```bash
# 빠르고 안전한 성능 점검
node scripts/performance-monitor.js quick
```

**포함 내용:**
- ✅ 프로젝트 헬스체크
- ✅ 빌드 성능 측정
- ✅ 리소스 사용량 분석
- ✅ 번들 크기 분석

### 2. 🏥 헬스체크만 실행
```bash
# 프로젝트 상태만 빠르게 확인
node scripts/performance-monitor.js health
```

### 3. 📈 전체 성능 분석 (5-10분)
```bash
# 서버 실행 후 전체 분석
npm run dev  # 서버 실행 (다른 터미널)
node scripts/performance-monitor.js full
```

---

## 📊 성능 지표 수집 방법

### 🎯 1단계: 경량 성능 점검

**실행 명령어:**
```bash
node scripts/performance-monitor.js quick
```

**수집되는 지표:**
- **빌드 성능**: 빌드 시간, .next 폴더 크기
- **리소스 사용량**: 의존성 개수, node_modules 크기
- **프로젝트 헬스**: 중요 파일 존재 여부
- **번들 분석**: 총 번들 크기

**예상 소요 시간:** 1-2분  
**안전성:** ⭐⭐⭐⭐⭐ (매우 안전)

### 🎯 2단계: 전체 성능 분석

**사전 준비:**
```bash
# 1. 서버 실행 (첫 번째 터미널)
npm run dev

# 2. 전체 분석 실행 (두 번째 터미널)
node scripts/performance-monitor.js full
```

**추가 수집 지표:**
- **Lighthouse 점수**: 성능, 접근성, SEO, Best Practices
- **Core Web Vitals**: LCP, FID, CLS, FCP, Speed Index
- **상세 진단**: 성능 이슈 원인 분석

**예상 소요 시간:** 5-10분  
**안전성:** ⭐⭐⭐⭐ (안전 - 타임아웃 보호)

### 🎯 3단계: Lighthouse 전용 테스트

**서버 필요 시에만 실행:**
```bash
node scripts/performance-monitor.js lighthouse
```

**수집되는 지표:**
- 성능 점수 (0-100)
- 접근성 점수 (0-100)
- SEO 점수 (0-100)
- Best Practices 점수 (0-100)

---

## ⚙️ 성능 임계값 설정

### 📊 기본 임계값

| 지표 | GOOD | WARNING | CRITICAL |
|-----|------|---------|----------|
| **빌드 시간** | < 60초 | < 120초 | 120초+ |
| **빌드 크기** | < 50MB | < 100MB | 100MB+ |
| **Lighthouse 성능** | 90+ | 75+ | 75- |
| **node_modules** | < 500MB | < 1GB | 1GB+ |

### 🔧 임계값 확인 및 수정

**현재 임계값 확인:**
```bash
node scripts/performance-monitor.js thresholds
```

**임계값 수정:**
```bash
# performance-thresholds.json 파일 편집
vim performance-thresholds.json
```

---

## 🚨 성능 저하 진단 체크리스트

### 🔍 자동 진단 실행

전체 성능 분석 시 자동으로 실행되지만, 개별적으로도 확인 가능:

```bash
node scripts/performance-monitor.js full
```

### 📋 수동 체크리스트

#### 1. 빌드 시간 지연 (> 90초)
- [ ] **package.json**: 사용하지 않는 패키지 제거
- [ ] **tsconfig.json**: incremental 빌드 활성화 확인
- [ ] **next.config.js**: 최적화 설정 점검
- [ ] **헬스체크**: `npm run health-check` 실행

#### 2. Lighthouse 성능 점수 낮음 (< 85점)
- [ ] **이미지 최적화**: `npm run auto-generate-all-images` 실행
- [ ] **next/image**: 모든 이미지에 next/image 사용 확인
- [ ] **코드 스플리팅**: dynamic import 사용 확인
- [ ] **번들 분석**: 큰 라이브러리 식별

#### 3. node_modules 크기 과다 (> 800MB)
- [ ] **의존성 점검**: `npm ls` 실행하여 의존성 트리 확인
- [ ] **취약점 점검**: `npm audit` 실행
- [ ] **번들 분석**: `npm run bundle-analyzer` 실행
- [ ] **devDependencies**: 운영에 불필요한 패키지 정리

#### 4. 빌드 에러 발생
- [ ] **React 컴포넌트**: 기본 export 확인
- [ ] **포트 충돌**: 3000-3003 포트 확인
- [ ] **타입 에러**: TypeScript 컴파일 오류 수정

---

## 🎯 최적화 우선순위 결정법

### 📊 영향도 vs 노력도 매트릭스

| 최적화 항목 | 영향도 | 노력도 | 우선순위 |
|------------|-------|-------|----------|
| **이미지 최적화** | HIGH | LOW | 🔥 1순위 |
| **폰트 최적화** | MEDIUM | LOW | 🚀 2순위 |
| **번들 크기 최적화** | HIGH | MEDIUM | ⚡ 3순위 |
| **코드 스플리팅** | MEDIUM | MEDIUM | 💡 4순위 |
| **SSR 최적화** | HIGH | HIGH | 🔧 5순위 |

### 💡 실행 가능한 최적화 액션

#### 🔥 1순위: 이미지 최적화 (즉시 실행 가능)
```bash
# 자동 이미지 최적화
npm run auto-generate-all-images

# WebP 포맷 이미지 생성
npm run generate-webp-images

# 이미지 크기별 생성
npm run generate-size-images
```

#### 🚀 2순위: 폰트 최적화
- `font-display: swap` 적용
- 폰트 서브셋 사용
- 시스템 폰트 fallback 설정

#### ⚡ 3순위: 번들 크기 최적화
```bash
# 번들 분석
npm run bundle-analyzer

# 사용하지 않는 코드 제거
npm run build-analyze
```

---

## 📈 정기적 성능 점검 방법론

### 🗓️ 일일 점검 (2분)
```bash
# 매일 아침 실행
node scripts/performance-monitor.js health
```

**체크 포인트:**
- ✅ 프로젝트 상태 HEALTHY 확인
- ✅ 중요 파일 존재 확인
- ✅ 스크립트 수 변화 확인

### 📊 주간 점검 (5분)
```bash
# 매주 월요일 실행
node scripts/performance-monitor.js quick
```

**체크 포인트:**
- ✅ 빌드 시간 90초 이하 확인
- ✅ node_modules 크기 800MB 이하 확인
- ✅ 번들 크기 증가 추이 확인

### 🔍 월간 정밀 점검 (30분)
```bash
# 매월 첫째 주 실행
npm run dev  # 서버 실행
node scripts/performance-monitor.js full
node scripts/performance-monitor.js report
```

**체크 포인트:**
- ✅ Lighthouse 점수 85점 이상 유지
- ✅ Core Web Vitals 모든 지표 GOOD 상태
- ✅ 성능 트렌드 분석
- ✅ 최적화 계획 수립

---

## 📊 성능 리포트 생성

### 🎯 간단한 리포트 생성
```bash
node scripts/performance-monitor.js report
```

**포함 내용:**
- 📈 성능 요약
- 🏥 헬스 점수
- ⚡ 발견된 이슈
- 💡 권장사항
- 🎯 다음 액션

### 📁 리포트 파일 위치
```
khakishop-web/
├── performance-reports/          # 리포트 저장 폴더
│   ├── performance-report-[timestamp].json
├── performance-metrics.json      # 성능 지표 히스토리
└── performance-thresholds.json   # 임계값 설정
```

### 📊 트렌드 분석
- **최근 50개** 측정값 자동 보관
- 성능 변화 추이 추적
- 임계값 초과 패턴 분석

---

## 🛡️ 안전 장치 및 주의사항

### ✅ 구현된 안전 장치

1. **타임아웃 보호**
   - 빌드: 5분 타임아웃
   - Lighthouse: 2분 타임아웃
   - 명령어 실행: 1분 타임아웃

2. **서버 상태 확인**
   - Lighthouse 실행 전 서버 응답 확인
   - 에러 시 안전한 실패 처리

3. **파일 크기 제한**
   - 메트릭 파일: 최근 50개만 보관
   - 자동 오래된 데이터 정리

4. **에러 핸들링**
   - 각 단계별 독립적 에러 처리
   - 실패 시에도 다른 지표 수집 계속

### ⚠️ 주의사항

1. **서버 실행 필요**
   - `full`, `lighthouse` 명령어는 서버 실행 필요
   - 포트 3000에서 서버 실행 확인

2. **Chrome 브라우저 필요**
   - Lighthouse는 Chrome 의존
   - 헤드리스 모드로 안전하게 실행

3. **디스크 공간**
   - 리포트 파일 정기적 정리 권장
   - 큰 프로젝트에서는 충분한 디스크 공간 확보

---

## 🔧 문제 해결 가이드

### 🚨 자주 발생하는 문제

#### 1. "Server not running" 에러
```bash
# 해결 방법
npm run dev  # 서버 실행 후 다시 시도
```

#### 2. "Chrome not found" 에러
```bash
# Chrome 설치 확인
google-chrome --version
# 또는 Chromium 사용
export CHROME_PATH=/usr/bin/chromium-browser
```

#### 3. "Build timeout" 에러
```bash
# 빌드 캐시 정리
rm -rf .next
npm run build
```

#### 4. 포트 충돌 문제
```bash
# 포트 3000-3003 중 사용 가능한 포트로 자동 연결
npm run dev
```

### 💡 성능 최적화 팁

#### 🎯 즉시 적용 가능한 최적화

1. **이미지 최적화** (5분)
```bash
npm run auto-generate-all-images
npm run generate-webp-images
```

2. **불필요한 의존성 제거** (10분)
```bash
npm ls  # 의존성 트리 확인
npm uninstall [unused-package]
```

3. **빌드 캐시 활용** (2분)
```bash
# next.config.js에서 확인
experimental: {
  incrementalCacheHandlerPath: require.resolve('./cache-handler.js')
}
```

---

## 📞 지원 및 문의

### 🔍 추가 도구 활용

**기존 KHAKISHOP 도구들:**
```bash
npm run lighthouse        # Lighthouse 감사
npm run test:performance  # E2E 성능 테스트
npm run web-vitals       # Web Vitals 수집
npm run health-check     # 전체 헬스체크
npm run bundle-analyzer  # 번들 분석
```

### 📚 참고 자료

- [Next.js 성능 최적화 가이드](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals 가이드](https://web.dev/vitals/)
- [Lighthouse 사용법](https://developers.google.com/web/tools/lighthouse)

---

## 🚀 요약

### ✅ 안전한 성능 모니터링 체크리스트

- [ ] **일일**: `health` 명령어로 프로젝트 상태 확인
- [ ] **주간**: `quick` 명령어로 기본 성능 점검
- [ ] **월간**: `full` 명령어로 전체 성능 분석
- [ ] **분기**: 최적화 계획 수립 및 실행
- [ ] **반기**: 임계값 설정 재검토

### 🎯 핵심 명령어

```bash
# 가장 많이 사용할 명령어들
node scripts/performance-monitor.js quick      # 일상적 점검
node scripts/performance-monitor.js health     # 빠른 상태 확인
node scripts/performance-monitor.js full       # 정밀 분석
node scripts/performance-monitor.js report     # 리포트 생성
```

**이제 KHAKISHOP의 성능을 안전하고 체계적으로 모니터링할 수 있습니다!** 🚀 