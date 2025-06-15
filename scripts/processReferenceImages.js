const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const access = promisify(fs.access);

// 이미지 매핑 정의
const imageMapping = {
  '1.png': 'contemporary-house-goyang',
  '2.png': 'scandinavian-apartment-mapo',
  '3.png': 'industrial-lobby-yongsan',
  '4.png': 'luxury-penthouse-seocho',
  '5.png': 'modern-office-gangnam',
  '6.png': 'minimal-residence-bundang',
  '7.png': 'classic-cafe-hongdae',
  '8.png': 'motorized-luxury-office-1'
};

// 소스 디렉토리 (바탕화면의 cursor 폴더)
const sourceDir = path.join(process.env.HOME, 'Desktop', 'cursor');

// 대상 디렉토리 (프로젝트의 public/images/references)
const targetBaseDir = path.join(__dirname, '..', 'public', 'images', 'references');

async function processImages() {
  console.log('🚀 이미지 처리 시작...\n');

  // 각 이미지에 대해 처리
  for (const [sourceFile, folderName] of Object.entries(imageMapping)) {
    const sourcePath = path.join(sourceDir, sourceFile);
    const targetDir = path.join(targetBaseDir, folderName);
    const targetPath = path.join(targetDir, 'main.png');

    try {
      // 소스 파일 존재 확인
      await access(sourcePath, fs.constants.F_OK);

      // 대상 디렉토리 생성
      await mkdir(targetDir, { recursive: true });

      // 파일 복사
      await copyFile(sourcePath, targetPath);

      console.log(`✅ ${sourceFile} → ${folderName}/main.png`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`❌ 오류: ${sourceFile} 파일을 찾을 수 없습니다.`);
      } else {
        console.error(`❌ 오류: ${sourceFile} 처리 중 문제 발생:`, error.message);
      }
    }
  }

  console.log('\n✨ 이미지 처리 완료!');
}

// 스크립트 실행
processImages().catch(error => {
  console.error('❌ 치명적 오류:', error);
  process.exit(1);
}); 