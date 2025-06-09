# 🎨 KHAKISHOP Midjourney 이미지 일괄 처리 시스템

## 📋 개요

RIGAS 디자인 모티브를 기반으로 한 khakishop 웹사이트를 위한 **148개 이미지 완전 자동화 처리 시스템**입니다.

Midjourney에서 생성한 `1.png ~ 148.png` 파일을 웹사이트 구조에 맞게 자동으로 정리합니다.

---

## 🚀 빠른 시작

### 1단계: Midjourney 이미지 준비
```bash
# Midjourney 폴더에 1.png ~ 148.png 파일들을 저장
ls /Users/kiholee/Projects/Midjourney/
# 1.png, 2.png, 3.png, ..., 148.png
```

### 2단계: 이미지 개수 확인
```bash
npm run check-images
```

### 3단계: 일괄 처리 실행
```bash
npm run process-bulk
```

---

## 📁 자동 처리 과정

### ⚙️ 시스템이 자동으로 수행하는 작업:

1. **📂 폴더 생성** - 필요한 하위 폴더들 자동 생성
2. **🔄 포맷 변환** - PNG → JPG (95% 품질)  
3. **📝 파일명 변경** - 용도에 맞는 의미있는 이름으로 변경
4. **📍 폴더 이동** - 웹사이트 구조에 맞는 위치로 이동
5. **🏷️ 메타데이터 삽입** - Artist, Description, Software 정보 추가

### 📊 처리 결과 예시:
```
1.png → /public/images/hero/hero-mobile.jpg
2.png → /public/images/landing/hero-main.jpg  
3.png → /public/images/landing/brand-lifestyle.jpg
...
148.png → /public/images/future/next-generation.jpg
```

---

## 🗂️ 이미지 분류 구조

### 🔥 1순위 (브랜드 핵심) - 14개
- **Hero** (1개): 모바일 히어로
- **Landing** (3개): 메인 배경, 라이프스타일, 컬렉션 개요  
- **Projects** (2개): 배경, 쇼케이스
- **Collections** (8개): 8가지 컬렉션 대표 이미지

### ⭐ 2순위 (포트폴리오) - 32개  
- **References** (32개): 8개 프로젝트 × 4개 이미지

### 🌟 3순위 (제품 카탈로그) - 102개
- **Products** (55개): 커튼/블라인드/전동 제품들
- **Gallery** (17개): 갤러리 그리드 + 특별 컬렉션  
- **Blog** (5개): 블로그 배경 이미지
- **About** (5개): 회사 소개 이미지
- **Accessories** (5개): 액세서리 제품
- **References** (5개): 추가 프로젝트 사례
- **Future** (3개): 미래 확장용 예비
- **Hero/Landing/Projects** (7개): 추가 배경 이미지

---

## 🛠️ 사용 가능한 명령어

```bash
# 📊 이미지 파일 개수 확인
npm run check-images

# 🎯 전체 148개 이미지 일괄 처리
npm run process-bulk

# 🔧 개별 이미지 처리 (기존 5개 방식)
npm run process-single

# 🗑️ 처리된 이미지 전체 삭제 (재처리 전)
npm run clean-processed

# 💾 Midjourney 폴더 백업 (날짜 포함)
npm run backup-midjourney

# 🎨 Midjourney 프롬프트 생성
npm run generate-prompts
```

---

## 📁 파일 구조

```
scripts/
├── imageMapping.json        # 148개 이미지 매핑 설정
├── processBulkImages.js     # 일괄 처리 메인 스크립트  
├── processImage.js          # 개별 처리 스크립트 (기존)
└── README_BULK_PROCESSING.md # 이 파일

/Users/kiholee/Projects/
├── Midjourney/              # 원본 이미지 저장소
│   ├── 1.png ~ 148.png
│   └── guide.txt
└── khakishop-web/
    └── public/images/       # 처리된 이미지 저장소
        ├── hero/
        ├── landing/  
        ├── projects/
        ├── collections/
        ├── references/
        ├── products/
        ├── gallery/
        ├── blog/
        ├── about/
        └── future/
```

---

## 🎯 RIGAS 디자인 기준

모든 이미지는 다음 기준을 준수해야 합니다:

### 📸 촬영 기법
- **8K ultra-photorealistic** 품질
- **50mm prime lens, f/2.2** 얕은 심도
- **Eye-level shot** 시선 높이 촬영
- **Cinematic natural lighting** 영화적 자연광

### 🎨 스타일 가이드
- **Afternoon sunlight** 오후 햇살 필터링
- **Minimal styling** 미니멀 스타일링
- **Quiet warm atmosphere** 조용하고 따뜻한 분위기
- **Neutral color palette** 중성 색상 팔레트
- **Architectural Digest style** AD 매거진 스타일

### 🏠 공간 특성
- **Wide spacious layouts** 넓고 여유로운 레이아웃
- **High-end furniture** 고급 가구 (USM 모듈러 시스템 포함)
- **Soft shadows** 부드러운 그림자
- **Natural color grading** 자연스러운 색보정

---

## 🔧 시스템 요구사항

### 필수 도구
- **ImageMagick** (`convert` 명령어)
- **ExifTool** (메타데이터 처리)
- **Node.js** (스크립트 실행)

### 확인 방법
```bash
which convert    # ImageMagick 설치 확인
which exiftool   # ExifTool 설치 확인  
node --version   # Node.js 버전 확인
```

---

## 📊 처리 결과 예시

### 실행 결과 화면:
```
🎨 KHAKISHOP MIDJOURNEY 이미지 일괄 처리 시작
📂 원본 폴더: /Users/kiholee/Projects/Midjourney/
📁 대상 폴더: /Users/kiholee/Projects/khakishop-web/public/images/
🖼️  총 이미지: 148개
⚙️  처리 방식: PNG → JPG (95% 품질) + 메타데이터 삽입

[██████████████████████████████████████████████████] 100% (148/148)

🎉 KHAKISHOP 이미지 일괄 처리 완료!
✅ 처리 완료: 148개
⚠️  건너뜀: 0개  
❌ 오류: 0개
⏱️  소요 시간: 45초

📊 카테고리별 이미지 분포:
   📁 hero: 2개
   📁 landing: 5개
   📁 projects: 4개
   📁 collections: 12개
   📁 references: 37개
   📁 products: 60개
   📁 gallery: 17개
   📁 blog: 5개
   📁 about: 5개
   📁 future: 3개
```

### 메타데이터 확인:
```bash
exiftool public/images/hero/hero-mobile.jpg
# Artist: By khaki shop
# Image Description: 모바일용 세로형 히어로
# Software: khakishop.com
```

---

## 🚨 주의사항

1. **백업 권장**: 처리 전 `npm run backup-midjourney` 실행
2. **파일명 순서**: 1.png부터 148.png까지 순서대로 준비
3. **폴더 권한**: `/Users/kiholee/Projects/` 폴더 쓰기 권한 필요
4. **덮어쓰기**: 기존 파일이 있으면 자동으로 덮어씁니다

---

## 🆘 문제 해결

### Q: 이미지가 일부만 처리되었어요
```bash
npm run check-images  # 원본 파일 개수 확인
npm run clean-processed  # 기존 결과 삭제  
npm run process-bulk  # 재처리
```

### Q: 메타데이터가 삽입되지 않았어요
```bash
which exiftool  # ExifTool 설치 확인
brew install exiftool  # macOS에서 설치
```

### Q: 이미지 품질이 떨어져요
- `processBulkImages.js`에서 `quality 95` 값을 조정 (95 → 98)

### Q: 처리 속도가 너무 느려요  
- `processBulkImages.js`에서 `setTimeout(resolve, 50)` 값을 줄이기 (50 → 10)

---

## 📞 지원

- **이슈 발생시**: `scripts/` 폴더의 스크립트 파일들 확인
- **매핑 수정**: `imageMapping.json` 파일 편집
- **경로 변경**: JSON 파일의 `metadata.baseSource`, `metadata.targetBase` 수정

---

**🎯 목표**: Midjourney → Web-ready 이미지 완전 자동화**  
**⚡ 효과**: 148개 이미지를 1분 안에 웹사이트 구조로 완벽 정리!** 