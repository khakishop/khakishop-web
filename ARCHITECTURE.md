# 🏗️ KHAKISHOP 아키텍처 가이드

## 📋 **개요**

이 문서는 KHAKISHOP 프로젝트의 안정적인 장기 운영을 위한 아키텍처 설계와 모범 사례를 설명합니다.

## 🎯 **구조적 안정성 시스템**

### 1. **Import 표준화 시스템**

**위치**: `src/lib/imports.ts`

**목적**: 모든 서드파티 라이브러리 import를 중앙 집중화하여 버전 변경이나 패키지 업데이트 시 일관성 유지

```typescript
// ❌ 피해야 할 패턴
import { motion } from 'framer-motion';
import { motion } from 'framer-motion/client'; // 불일치!

// ✅ 권장 패턴
import { motion } from '../lib/imports';
```

**이점**:
- import 오류 방지
- 버전 업그레이드 시 한 곳에서만 수정
- 타입 안전성 보장

### 2. **환경별 설정 관리**

**위치**: `src/config/environment.ts`

**목적**: 개발/프로덕션 환경 불일치 방지

```typescript
// 환경별 자동 설정
import config from '../config/environment';

// 자동으로 환경에 맞는 설정 적용
const apiUrl = config.api.baseUrl; // 개발: localhost, 프로덕션: khakishop.kr
```

**주요 설정 영역**:
- API 엔드포인트 및 타임아웃
- 이미지 처리 설정
- 동기화 간격
- 디버깅 레벨
- 성능 최적화 옵션

### 3. **커스텀 훅 기반 상태 관리**

**위치**: `src/hooks/useImageManager.ts`

**해결 문제**:
- 무한 루프 방지
- 초기화 순서 문제 해결
- 메모리 누수 방지

```typescript
// ✅ 안전한 이미지 관리
const {
  mappedImages,
  loading,
  error,
  syncImages,
  categoryStats,
  isReady
} = useImageManager({
  autoSync: true,
  syncInterval: 30000,
  maxRetries: 3
});
```

**주요 기능**:
- 자동 중복 요청 방지
- AbortController를 통한 요청 취소
- 점진적 백오프 재시도
- 컴포넌트 언마운트 시 자동 정리

### 4. **자동화된 검증 시스템**

**위치**: `scripts/health-check.js`

**실행 방법**:
```bash
npm run health-check        # 전체 헬스 체크
npm run validate-imports    # Import 구문만 검증
npm run pre-deploy          # 배포 전 검증
```

**검증 항목**:
- 패키지 의존성 검증
- Import 구문 오류 검사
- TypeScript 컴파일 확인
- Next.js 빌드 테스트
- 필수 파일 존재 확인
- 환경 설정 검증

## 🚨 **과거 문제 분석 및 해결책**

### 1. **framer-motion Import 오류**

**문제**: `framer-motion/client` 경로 불일치
**해결**: 중앙화된 import 시스템 (`src/lib/imports.ts`)
**예방**: 헬스 체크에서 자동 검증

### 2. **Webpack Dynamic Chunk 오류**

**문제**: `./72.js` 등 모듈 참조 오류
**해결**: 캐시 정리 및 의존성 재설치 스크립트
**예방**: 빌드 전 자동 검증

### 3. **getCategoryStats 초기화 오류**

**문제**: 함수 호출 시점 문제
**해결**: 커스텀 훅으로 상태 관리 로직 분리
**예방**: useMemo와 useCallback 적절한 활용

### 4. **무한 API 호출 루프**

**문제**: useEffect 의존성 배열 문제
**해결**: AbortController와 isMounted 플래그 활용
**예방**: 커스텀 훅에서 안전한 패턴 제공

### 5. **개발/프로덕션 환경 불일치**

**문제**: 환경별 설정 차이
**해결**: 중앙화된 환경 설정 시스템
**예방**: 환경 감지 및 자동 설정 적용

## 🛠️ **개발 워크플로우**

### 개발 시작
```bash
npm run fresh          # 캐시 정리 후 개발 서버 시작
npm run health-check   # 프로젝트 상태 점검
```

### 코드 변경 후
```bash
npm run validate-imports  # Import 검증
npm run lint             # 코드 품질 검사
```

### 배포 전
```bash
npm run pre-deploy       # 전체 검증 + 빌드
npm run safe-deploy      # 안전한 배포
```

## 📊 **성능 모니터링**

### 주요 지표
- 빌드 시간: 목표 < 30초
- 첫 페이지 로드: 목표 < 3초
- 이미지 동기화: 목표 < 5초
- 메모리 사용량: 안정적 유지

### 모니터링 도구
```bash
npm run lighthouse       # Lighthouse 성능 측정
npm run test-pages      # 주요 페이지 응답 확인
npm run pwa-test        # PWA 기능 테스트
```

## 🔄 **업데이트 프로세스**

### 1. 의존성 업데이트
```bash
# 1. 백업
git checkout -b update-dependencies

# 2. 업데이트
npm update

# 3. 검증
npm run health-check
npm run build

# 4. 테스트
npm run test-pages
```

### 2. 새로운 기능 추가
```bash
# 1. Import 표준화 확인
echo "import from '../lib/imports'"

# 2. 환경 설정 업데이트 (필요 시)
# src/config/environment.ts 수정

# 3. 헬스 체크 업데이트 (필요 시)
# scripts/health-check.js 검증 항목 추가

# 4. 검증
npm run health-check
```

## 🎨 **컴포넌트 설계 원칙**

### 1. **Import 일관성**
```typescript
// ✅ 표준화된 import
import { motion, useState, useCallback } from '../lib/imports';
```

### 2. **환경 인식**
```typescript
// ✅ 환경별 동작
import config, { isDevelopment } from '../config/environment';

if (isDevelopment()) {
  console.log('개발 모드에서만 로그 출력');
}
```

### 3. **안전한 상태 관리**
```typescript
// ✅ 커스텀 훅 활용
const { data, loading, error } = useImageManager();
```

## 🚀 **배포 체크리스트**

- [ ] `npm run health-check` 통과
- [ ] `npm run build` 성공
- [ ] 모든 import 오류 해결
- [ ] TypeScript 컴파일 오류 없음
- [ ] 환경 변수 설정 확인
- [ ] .gitignore 검증
- [ ] Git 커밋 메시지 명확

## 📚 **참고 자료**

### 주요 파일 위치
- 중앙 Import: `src/lib/imports.ts`
- 환경 설정: `src/config/environment.ts`
- 이미지 관리: `src/hooks/useImageManager.ts`
- 헬스 체크: `scripts/health-check.js`
- API 타입: `src/types/api.ts`

### 명령어 참고
```bash
npm run health-check      # 종합 검증
npm run validate-imports  # Import 검증
npm run pre-deploy       # 배포 전 검증
npm run fresh            # 깨끗한 재시작
```

---

**마지막 업데이트**: 2024년 12월
**작성자**: KHAKISHOP 개발팀
**버전**: 1.0.0 