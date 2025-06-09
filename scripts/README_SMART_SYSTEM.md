# 🧠 KHAKISHOP 스마트 이미지 관리 시스템 2.0

## 🎯 **시스템 개요**

기존 148개 이미지 처리 시스템을 확장하여 **완전 자동화된 이미지 관리 시스템**을 구축했습니다.  
이제 이미지 교체, 추가, 할당이 모두 자동화되며, 사용자와 Cursor가 모두 직관적으로 이해할 수 있습니다.

---

## 🏗️ **파일 구조**

```
scripts/
├── 📄 imageConfig.yml          # 마스터 설정 (YAML - 가독성 극대화)
├── 📊 imageStatus.json         # 실시간 상태 추적 (JSON - 상태 관리)
├── 🧠 smartImageManager.js     # 스마트 자동화 엔진
├── 🎯 assignPendingImages.js   # 대기 이미지 할당 도구
├── 📚 README_SMART_SYSTEM.md   # 이 가이드
│
├── 📜 imageMapping.json        # 레거시 (기존 호환성)
├── 🔄 processBulkImages.js     # 레거시 (기존 호환성)
└── 📝 guide.txt               # 레거시 (기존 호환성)
```

---

## 🚀 **빠른 시작 (3단계)**

### 1️⃣ **의존성 설치**
```bash
npm install
```

### 2️⃣ **스마트 스캔 실행**
```bash
npm run smart-scan
```

### 3️⃣ **대기 이미지 할당 (필요시)**
```bash
npm run assign-pending
```

---

## 🔄 **주요 워크플로우**

### 📝 **시나리오 1: 이미지 교체**
**상황**: `12.png` 파일을 새로운 이미지로 교체하고 싶음

```bash
# 1. Midjourney 폴더에 새 12.png 업로드
cp new_image.png /Users/kiholee/Projects/Midjourney/12.png

# 2. 스마트 스캔 실행 (자동 감지 + 처리)
npm run smart-scan

# 결과: 기존 매핑 위치에 자동으로 새 이미지 교체 완료 ✅
```

### ➕ **시나리오 2: 이미지 추가**
**상황**: 149.png, 150.png 새 이미지를 추가하고 싶음

```bash
# 1. Midjourney 폴더에 신규 이미지 추가
cp image1.png /Users/kiholee/Projects/Midjourney/149.png
cp image2.png /Users/kiholee/Projects/Midjourney/150.png

# 2. 스마트 스캔 (자동 감지)
npm run smart-scan
# 📋 감지된 변경사항:
#    • 신규: 2개
#    • 교체: 0개  
#    • 누락: 0개
# ⏳ 대기 목록 추가: 149.png → gallery
# ⏳ 대기 목록 추가: 150.png → gallery

# 3. 대기 이미지 수동 할당
npm run assign-pending
# 🎯 149.png 할당 옵션:
#    1. 🔥 브랜드 히어로
#    2. 🔥 랜딩 페이지  
#    3. ⭐ 컬렉션 추가
#    4. 🌟 갤러리 확장    ← 추천
#    5. 🌟 제품 추가
#    ...
# 선택하세요 (1-11): 4
# 
# 🎨 갤러리 확장 카테고리 세부 옵션:
#    1. gallery/gallery-grid-13.jpg
#    2. gallery/featured-collection-1.jpg
#    3. gallery/trending-1.jpg
# 세부 위치 선택 (1-4): 1
#
# ✅ 할당 확인:
# 📁 소스: 149.png
# 📂 카테고리: gallery
# 📄 대상: gallery/gallery-grid-13.jpg
# 할당을 확정하시겠습니까? (y/n): y
# 🎉 할당 완료!
```

### 📊 **시나리오 3: 상태 확인**
```bash
# 간단한 요약
npm run image-status
# 📊 이미지 상태 요약:
# ✅ 활성: 150
# ⏳ 대기: 0
# ❌ 오류: 0

# 상세한 리포트  
npm run smart-scan
# 📊 KHAKISHOP 이미지 관리 상태 리포트
# 📅 마지막 스캔: 2024-12-XX 16:30:00
# 📊 할당된 슬롯: 150/148+
# ⏳ 대기 중: 0개
# ❌ 오류: 0개
```

---

## 📁 **설정 파일 가이드**

### 🔧 **imageConfig.yml** - 마스터 설정
- **목적**: 전체 시스템의 설정과 규칙 정의
- **장점**: 사람이 읽기 쉬운 YAML 형식
- **편집**: 카테고리 추가, 경로 변경, 규칙 수정 시 사용

**주요 섹션:**
```yaml
categories:          # 카테고리 정의 (hero, landing, products...)
imageMapping:        # 이미지 매핑 구조 (brandCore, portfolio...)  
automationRules:     # 자동화 규칙 (감지, 교체, 추가)
styleGuide:          # RIGAS 스타일 가이드
```

### 📊 **imageStatus.json** - 실시간 상태
- **목적**: 각 이미지의 현재 상태 추적
- **자동 관리**: 시스템이 자동으로 업데이트
- **확인 방법**: `npm run image-status`

**주요 섹션:**
```json
{
  "status": {},      // 활성 이미지들 (슬롯별 상태)
  "pending": {},     // 대기 중인 신규 이미지들
  "errors": {},      // 오류가 있는 이미지들  
  "changelog": []    // 변경 이력 (최근 100개)
}
```

---

## 🎨 **카테고리 시스템**

### 🔥 **Priority 1 - 브랜드 핵심**
- `hero`: 브랜드 히어로 이미지
- `landing`: 랜딩 페이지 배경
- `projects`: 프로젝트 섹션
- `collections`: 제품 컬렉션 대표

### ⭐ **Priority 2 - 포트폴리오**  
- `references`: 시공 사례 및 프로젝트

### 🌟 **Priority 3 - 컨텐츠**
- `products`: 제품 상세 이미지
- `gallery`: 갤러리 쇼케이스
- `blog`: 블로그 배경
- `about`: 회사 소개
- `future`: 미래 확장용

---

## 🛠️ **고급 사용법**

### 🔍 **직접 상태 파일 편집**
```bash
# 상태 파일 직접 확인
cat scripts/imageStatus.json | jq '.metadata'

# 특정 이미지 상태 확인
cat scripts/imageStatus.json | jq '.status."12"'

# 대기 목록 확인
cat scripts/imageStatus.json | jq '.pending'
```

### 📝 **설정 파일 커스터마이징**
```yaml
# imageConfig.yml에서 신규 카테고리 추가
categories:
  newCategory:
    name: "신규 카테고리"
    description: "새로운 용도의 이미지"
    priority: 2
    usage: "CustomComponent.tsx"
```

### 🚨 **문제 해결**
```bash
# 1. 오류 이미지 수동 처리
npm run smart-scan  # 오류 확인
# ❌ 오류가 있는 이미지:
#    45. source_file_missing: 원본 파일이 없습니다

# 2. 해당 파일 복원 후 재스캔
cp backup/45.png /Users/kiholee/Projects/Midjourney/
npm run smart-scan

# 3. 상태 파일 재초기화 (극단적인 경우)
rm scripts/imageStatus.json
npm run smart-scan  # 새로 생성됨
```

---

## 💡 **베스트 프랙티스**

### ✅ **DO (권장사항)**
1. **정기적인 백업**: `npm run backup-midjourney`
2. **스캔 후 확인**: `npm run smart-scan` → `npm run image-status`
3. **의미있는 할당**: 대기 이미지 할당 시 용도에 맞는 카테고리 선택
4. **버전 관리**: 설정 파일 변경 시 Git 커밋

### ❌ **DON'T (주의사항)**  
1. **상태 파일 직접 편집**: `imageStatus.json` 수동 편집 금지
2. **중복 파일명**: 동일한 번호의 파일 중복 업로드 금지
3. **강제 삭제**: `rm -rf public/images/*` 함부로 실행 금지
4. **설정 파일 삭제**: `imageConfig.yml` 백업 없이 삭제 금지

---

## 🚀 **전체 명령어 레퍼런스**

### 📊 **상태 확인**
```bash
npm run smart-scan      # 전체 스캔 + 자동 처리 + 상태 리포트
npm run image-status    # 간단한 상태 요약
npm run check-images    # 원본 파일 개수 확인
```

### 🔄 **이미지 처리**
```bash
npm run assign-pending  # 대기 이미지 인터랙티브 할당
npm run process-bulk    # 레거시: 148개 기본 처리
```

### 🛠️ **유틸리티**
```bash
npm run backup-midjourney    # 원본 폴더 백업 (타임스탬프 포함)
npm run clean-processed      # 처리된 이미지 전체 삭제
npm run image-help          # 명령어 도움말
```

---

## 🎯 **사용자별 가이드**

### 👨‍🎨 **디자이너용**
1. **이미지 교체**: Midjourney 폴더에 동일 번호로 업로드 → `npm run smart-scan`
2. **신규 이미지**: 149번부터 업로드 → `npm run smart-scan` → `npm run assign-pending`
3. **결과 확인**: 웹사이트에서 실시간 확인

### 👨‍💻 **개발자용**  
1. **시스템 확장**: `imageConfig.yml`에서 카테고리/규칙 수정
2. **상태 모니터링**: `imageStatus.json`에서 실시간 상태 추적
3. **스크립트 커스터마이징**: `smartImageManager.js` 로직 수정

### 🤖 **Cursor/AI용**
1. **구조 파악**: YAML 설정 파일로 전체 시스템 이해
2. **상태 확인**: JSON 상태 파일로 현재 상황 파악
3. **자동 처리**: 클래스 기반 모듈로 확장/수정 용이

---

## 🆚 **기존 시스템과의 비교**

| 구분 | 기존 시스템 | 새 스마트 시스템 |
|------|-------------|------------------|
| **설정** | `guide.txt` → `imageMapping.json` | `imageConfig.yml` (직관적) |
| **처리** | 148개 고정 일괄 처리 | 스마트 감지 + 자동/수동 처리 |
| **확장** | 하드코딩된 매핑 | 유연한 카테고리 시스템 |
| **상태** | 처리 결과만 콘솔 출력 | 실시간 상태 추적 + 이력 관리 |
| **사용성** | 개발자 전용 | 디자이너/개발자/AI 모두 친화적 |
| **유지보수** | 수동 매핑 수정 필요 | 설정 파일 수정으로 자동 적용 |

---

## 🔮 **향후 확장 계획**

1. **🌐 웹 인터페이스**: 브라우저에서 이미지 관리
2. **📱 모바일 대응**: 반응형 이미지 자동 생성
3. **🎨 AI 분석**: 이미지 내용 기반 자동 카테고리 추론
4. **☁️ 클라우드 연동**: AWS S3, Cloudinary 등 연동
5. **🔄 실시간 동기화**: 파일 변경 감지 자동 처리

---

## 📞 **지원 및 문의**

- **시스템 오류**: `npm run smart-scan` 결과에서 오류 섹션 확인
- **설정 문의**: `imageConfig.yml` 파일 구조 참조
- **상태 확인**: `npm run image-status` 또는 `imageStatus.json` 확인
- **도움말**: `npm run image-help` 명령어 레퍼런스

---

**🎯 목표 달성**: 이미지 교체/추가/관리가 모두 자동화된 똑똑한 시스템!  
**⚡ 효과**: 사용자도 Cursor도 모두 쉽게 이해하고 사용할 수 있는 직관적 시스템! 