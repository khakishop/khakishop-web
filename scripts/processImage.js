// Midjourney 이미지 자동 처리 스크립트
// PNG → JPG 변환, 파일명 변경, 위치 이동, 메타데이터 삽입

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 처리 설정 테이블
const IMAGE_PROCESSING_CONFIG = [
  {
    source: '/Users/kiholee/Projects/Midjourney/1.png',
    filename: 'main.jpg',
    destination: 'public/images/references/modern-office-gangnam/',
    description: 'Modern Office - Main Hero Shot'
  },
  {
    source: '/Users/kiholee/Projects/Midjourney/2.png', 
    filename: 'gallery-1.jpg',
    destination: 'public/images/references/modern-office-gangnam/',
    description: 'Modern Office - Gallery Image 1'
  },
  {
    source: '/Users/kiholee/Projects/Midjourney/3.png',
    filename: 'gallery-2.jpg', 
    destination: 'public/images/references/modern-office-gangnam/',
    description: 'Modern Office - Gallery Image 2'
  },
  {
    source: '/Users/kiholee/Projects/Midjourney/4.png',
    filename: 'detail.jpg',
    destination: 'public/images/products/curtain/sheer-curtain/',
    description: 'Sheer Curtain - Detail Close-up'
  },
  {
    source: '/Users/kiholee/Projects/Midjourney/5.png',
    filename: 'lifestyle.jpg',
    destination: 'public/images/products/curtain/sheer-curtain/',
    description: 'Sheer Curtain - Lifestyle Scene'
  }
];

// 이미지 처리 함수
function processImages() {
  console.log('🎨 KHAKISHOP 이미지 자동 처리 시작');
  console.log('===================================\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  IMAGE_PROCESSING_CONFIG.forEach((config, index) => {
    try {
      console.log(`📷 [${index + 1}/5] 처리 중: ${config.description}`);
      console.log(`   소스: ${config.source}`);
      console.log(`   목적지: ${config.destination}${config.filename}`);
      
      // 1. 소스 파일 존재 확인
      if (!fs.existsSync(config.source)) {
        throw new Error(`소스 파일이 존재하지 않습니다: ${config.source}`);
      }
      
      // 2. 목적지 폴더 존재 확인 및 생성
      const destDir = path.resolve(__dirname, '..', config.destination);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`   📁 폴더 생성: ${destDir}`);
      }
      
      // 3. 최종 파일 경로 설정
      const finalPath = path.join(destDir, config.filename);
      
      // 4. PNG → JPG 변환 및 복사 (ImageMagick 사용)
      console.log('   🔄 PNG → JPG 변환 중...');
      execSync(`convert "${config.source}" -quality 95 "${finalPath}"`, { 
        stdio: 'pipe' 
      });
      
      // 5. 메타데이터 삽입 (exiftool 사용)
      console.log('   📝 메타데이터 삽입 중...');
      execSync(`exiftool -overwrite_original -Artist="By khaki shop" -ImageDescription="${config.description}" -Software="khakishop.com" "${finalPath}"`, {
        stdio: 'pipe'
      });
      
      console.log(`   ✅ 처리 완료: ${config.filename}\n`);
      successCount++;
      
    } catch (error) {
      console.error(`   ❌ 처리 실패: ${error.message}\n`);
      errorCount++;
    }
  });
  
  // 결과 요약
  console.log('\n🎯 처리 결과 요약');
  console.log('==================');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${errorCount}개`);
  console.log(`📊 총 처리: ${IMAGE_PROCESSING_CONFIG.length}개`);
  
  if (successCount > 0) {
    console.log('\n📁 저장된 이미지 위치:');
    IMAGE_PROCESSING_CONFIG.forEach((config) => {
      console.log(`   - ${config.destination}${config.filename}`);
    });
  }
  
  if (errorCount === 0) {
    console.log('\n🎉 모든 이미지 처리가 완료되었습니다!');
    console.log('💡 RIGAS 디자인 스타일로 준비된 고품질 이미지들을 확인해주세요.');
  }
}

// 의존성 확인 함수
function checkDependencies() {
  const dependencies = ['convert', 'exiftool'];
  const missing = [];
  
  dependencies.forEach(dep => {
    try {
      execSync(`which ${dep}`, { stdio: 'pipe' });
    } catch (error) {
      missing.push(dep);
    }
  });
  
  if (missing.length > 0) {
    console.error('❌ 필수 도구가 설치되지 않았습니다:');
    missing.forEach(tool => {
      console.error(`   - ${tool}`);
    });
    console.error('\n설치 명령어:');
    if (missing.includes('convert')) {
      console.error('   brew install imagemagick');
    }
    if (missing.includes('exiftool')) {
      console.error('   brew install exiftool');
    }
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  checkDependencies();
  processImages();
}

module.exports = { processImages }; 