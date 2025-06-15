# 🔍 KHAKISHOP-WEB 자동 진단 프로그램

Claude AI가 프로젝트 상태를 100% 정확히 파악할 수 있는 종합 진단 도구입니다.

## 🎯 목적

- **완전 자동화**: 수동 체크 없이 모든 문제점 자동 스캔
- **Claude 최적화**: AI가 이해하기 쉬운 구조화된 리포트 생성
- **실시간 진단**: 현재 프로젝트 상태의 정확한 스냅샷 제공
- **안전성 보장**: 파일 수정 없이 읽기 전용 분석

## 🚀 사용법

```bash
# 기본 실행
npm run auto-diagnose

# 또는 직접 실행
node scripts/auto-diagnose.js
```

## 📊 진단 항목

### 1. 📁 프로젝트 구조 스캔
- 핵심 파일 존재 여부 (package.json, next.config.js 등)
- 디렉토리 구조 매핑
- 파일 개수 및 크기 분석

### 2. 📦 Package.json 분석
- 필수 스크립트 체크 (dev, build, start)
- 의존성 버전 분석
- Next.js 버전 호환성 체크

### 3. 🔧 TypeScript 설정 체크
- tsconfig.json 유효성 검증
- TypeScript 컴파일 테스트
- 타입 에러 감지

### 4. 💻 소스 코드 스캔
- 컴포넌트, 페이지, 훅 분류
- 코드 품질 이슈 감지
- 파일 구조 분석

### 5. 🖼️ 이미지 에셋 체크
- 이미지 파일 존재 여부
- 소스 코드 내 이미지 참조 검증
- 누락된 이미지 파일 리스트

### 6. 🏗️ 빌드 시스템 분석
- Next.js 설정 검증
- 빌드 캐시 상태 체크
- 실제 빌드 테스트 실행

### 7. 📋 의존성 체크
- node_modules 존재 여부
- 보안 취약점 스캔 (npm audit)
- 패키지 버전 호환성

### 8. 🔍 일반적인 이슈 스캔
- 포트 충돌 감지
- 환경 변수 파일 체크
- 설정 파일 문제점

## 📄 리포트 구조

진단 완료 후 `diagnosis-report.json` 파일이 생성됩니다:

```json
{
  "timestamp": "2025-06-14T04:05:32.498Z",
  "projectName": "KHAKISHOP-WEB",
  "summary": {
    "status": "CRITICAL|WARNING|CAUTION|HEALTHY",
    "criticalIssues": 119,
    "warnings": 0,
    "suggestions": 1
  },
  "sections": {
    "projectStructure": { ... },
    "packageAnalysis": { ... },
    "typeScriptConfig": { ... },
    "sourceCodeAnalysis": { ... },
    "imageAnalysis": { ... },
    "buildAnalysis": { ... },
    "dependencyAnalysis": { ... },
    "commonIssues": { ... },
    "claudeReport": {
      "executiveSummary": { ... },
      "quickFixes": [ ... ],
      "detailedAnalysis": { ... },
      "actionPlan": [ ... ],
      "codeSnippets": { ... }
    }
  }
}
```

## 🎨 출력 예시

```
================================================================================
🎯 KHAKISHOP-WEB 프로젝트 진단 완료
================================================================================

📊 전체 상태: CRITICAL
🔴 Critical: 119개
🟡 Warning: 0개
🟢 Suggestion: 1개

💡 권장사항: 즉시 조치가 필요한 심각한 문제가 있습니다.

🚨 Critical Issues:
  1. 이미지 파일 누락: /images/hero/hero.jpg
  2. TypeScript 컴파일 에러 발생
  3. 빌드 실패
  ...

📄 상세 리포트 저장됨: diagnosis-report.json
```

## 🔧 커스터마이징

### 타임아웃 설정
```javascript
// 빌드 테스트 타임아웃 (기본: 60초)
timeout: 60000

// TypeScript 컴파일 타임아웃 (기본: 30초)
timeout: 30000
```

### 스캔 깊이 조절
```javascript
// 디렉토리 스캔 깊이 (기본: 3단계)
this.scanDirectory('src', 3);
```

### 추가 체크 항목
```javascript
// checkForCodeIssues 메서드에서 패턴 추가
const issuePatterns = [
  { pattern: /console\.log/, message: 'console.log 사용 발견', severity: 'suggestion' },
  // 새로운 패턴 추가...
];
```

## 🛡️ 안전성

- **읽기 전용**: 파일을 수정하지 않고 분석만 수행
- **타임아웃 보호**: 무한 대기 방지
- **에러 핸들링**: 개별 체크 실패가 전체 진단을 중단시키지 않음
- **권한 체크**: 접근 불가능한 파일/디렉토리 안전하게 스킵

## 🔄 확장성

새로운 진단 항목 추가:

```javascript
// 1. runDiagnosis 메서드에 새 체크 추가
await this.checkNewFeature();

// 2. 새 메서드 구현
async checkNewFeature() {
  console.log('🆕 새 기능 체크 중...');
  // 체크 로직 구현
  this.report.sections.newFeature = result;
}
```

## 📈 성능

- **병렬 처리**: 독립적인 체크들을 동시 실행
- **메모리 효율**: 대용량 파일 스트리밍 처리
- **캐시 활용**: 중복 계산 방지

## 🤝 Claude AI 연동

이 진단 리포트를 Claude에게 제공하면:

1. **정확한 문제 파악**: 추측 없이 정확한 현재 상태 인지
2. **맞춤형 해결책**: 프로젝트 특성에 맞는 솔루션 제공
3. **우선순위 제시**: Critical → Warning → Suggestion 순서로 해결
4. **코드 스니펫**: 실제 설정 파일 내용 기반 조언

## 📝 로그 레벨

- `🔍` 진단 시작/완료
- `📁📦🔧💻🖼️🏗️📋🔍📊` 각 단계별 진행 상황
- `🚨⚠️🟢` 이슈 심각도별 표시
- `✅❌` 성공/실패 상태

## 🔗 관련 스크립트

- `npm run auto-diagnose` - 전체 진단 실행
- `npm run type-check` - TypeScript만 체크
- `npm run build` - 빌드 테스트
- `npm run lint` - 코드 품질 체크

---

**💡 팁**: 개발 시작 전, 문제 발생 시, 배포 전에 정기적으로 실행하여 프로젝트 건강 상태를 체크하세요! 