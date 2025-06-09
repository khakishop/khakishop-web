// KHAKISHOP Midjourney 이미지 완전 자동 처리 시스템
// 148개 이미지 일괄 처리: PNG → JPG 변환, 폴더 이동, 메타데이터 삽입

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 색상 코드 정의
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// 설정 파일 로드
const CONFIG_FILE = path.join(__dirname, 'imageMapping.json');
let config;

try {
  config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  console.log(`${colors.green}✅ 설정 파일 로드 완료: ${CONFIG_FILE}${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ 설정 파일을 읽을 수 없습니다: ${CONFIG_FILE}${colors.reset}`);
  process.exit(1);
}

// 전역 변수
const MIDJOURNEY_DIR = config.metadata.baseSource;
const TARGET_BASE = config.metadata.targetBase;
const TOTAL_IMAGES = config.metadata.totalImages;

// 통계 변수
let stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  startTime: Date.now()
};

// 진행 상황 표시 함수
function showProgress(current, total, description = '') {
  const percentage = Math.floor((current / total) * 100);
  const bar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));
  process.stdout.write(`\r${colors.cyan}[${bar}] ${percentage}% (${current}/${total}) ${description}${colors.reset}`);
}

// 폴더 생성 함수
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`${colors.yellow}📁 폴더 생성: ${dirPath}${colors.reset}`);
  }
}

// 이미지 처리 함수
function processImage(imageNum, mappingData) {
  const sourceFile = path.join(MIDJOURNEY_DIR, mappingData.source);
  const targetFile = path.join(TARGET_BASE, mappingData.target);
  const targetDir = path.dirname(targetFile);

  try {
    // 1. 원본 파일 존재 확인
    if (!fs.existsSync(sourceFile)) {
      console.log(`\n${colors.yellow}⚠️  원본 파일이 없습니다: ${sourceFile}${colors.reset}`);
      stats.skipped++;
      return false;
    }

    // 2. 대상 폴더 생성
    ensureDirectoryExists(targetDir);

    // 3. PNG → JPG 변환 (95% 품질)
    const convertCmd = `convert "${sourceFile}" -quality 95 "${targetFile}"`; 
    execSync(convertCmd, { stdio: 'pipe' });

    // 4. 메타데이터 삽입
    const metadataCmd = `exiftool -overwrite_original -Artist="By khaki shop" -ImageDescription="${mappingData.description}" -Software="khakishop.com" "${targetFile}"`;
    execSync(metadataCmd, { stdio: 'pipe' });

    stats.processed++;
    return true;

  } catch (error) {
    console.log(`\n${colors.red}❌ 처리 실패 [${imageNum}]: ${error.message}${colors.reset}`);
    stats.errors++;
    return false;
  }
}

// 메인 처리 함수
async function processBulkImages() {
  console.log(`${colors.bright}${colors.magenta}`);
  console.log('================================================================================');
  console.log('🎨 KHAKISHOP MIDJOURNEY 이미지 일괄 처리 시작');
  console.log('================================================================================');
  console.log(`${colors.reset}`);
  
  console.log(`${colors.blue}📂 원본 폴더: ${MIDJOURNEY_DIR}${colors.reset}`);
  console.log(`${colors.blue}📁 대상 폴더: ${TARGET_BASE}${colors.reset}`);
  console.log(`${colors.blue}🖼️  총 이미지: ${TOTAL_IMAGES}개${colors.reset}`);
  console.log(`${colors.blue}⚙️  처리 방식: PNG → JPG (95% 품질) + 메타데이터 삽입${colors.reset}\n`);

  // Midjourney 폴더 존재 확인
  if (!fs.existsSync(MIDJOURNEY_DIR)) {
    console.error(`${colors.red}❌ Midjourney 폴더가 존재하지 않습니다: ${MIDJOURNEY_DIR}${colors.reset}`);
    process.exit(1);
  }

  // 이미지 매핑 처리
  const mappingEntries = Object.entries(config.mapping);
  
  for (let i = 0; i < mappingEntries.length; i++) {
    const [imageNum, mappingData] = mappingEntries[i];
    
    showProgress(i + 1, mappingEntries.length, `처리 중: ${imageNum}.png → ${mappingData.target}`);
    
    processImage(imageNum, mappingData);
    
    // 처리 간격 (시스템 과부하 방지)
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // 최종 통계 출력
  const processingTime = Math.round((Date.now() - stats.startTime) / 1000);
  
  console.log(`\n\n${colors.bright}${colors.green}`);
  console.log('================================================================================');
  console.log('🎉 KHAKISHOP 이미지 일괄 처리 완료!');
  console.log('================================================================================');
  console.log(`${colors.reset}`);
  
  console.log(`${colors.green}✅ 처리 완료: ${stats.processed}개${colors.reset}`);
  console.log(`${colors.yellow}⚠️  건너뜀: ${stats.skipped}개${colors.reset}`);
  console.log(`${colors.red}❌ 오류: ${stats.errors}개${colors.reset}`);
  console.log(`${colors.blue}⏱️  소요 시간: ${processingTime}초${colors.reset}`);
  console.log(`${colors.magenta}📍 모든 이미지가 /public/images/ 하위 폴더로 정리되었습니다.${colors.reset}\n`);

  // 카테고리별 통계
  const categoryStats = {};
  mappingEntries.forEach(([_, data]) => {
    categoryStats[data.category] = (categoryStats[data.category] || 0) + 1;
  });

  console.log(`${colors.cyan}📊 카테고리별 이미지 분포:${colors.reset}`);
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`   📁 ${category}: ${count}개`);
  });

  // 추가 안내사항
  console.log(`\n${colors.bright}💡 다음 단계:${colors.reset}`);
  console.log(`   1. ${colors.green}npm run dev${colors.reset} - 웹사이트에서 이미지 확인`);
  console.log(`   2. ${colors.blue}exiftool [파일명]${colors.reset} - 메타데이터 확인`);
  console.log(`   3. Midjourney 폴더 정리 (선택사항)`);
}

// 스크립트 실행
if (require.main === module) {
  processBulkImages().catch(error => {
    console.error(`\n${colors.red}❌ 실행 오류: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = { processBulkImages }; 