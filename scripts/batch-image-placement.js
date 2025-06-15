#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 🎯 KHAKISHOP 이미지 자동화 배치 스크립트
console.log('🎯 KHAKISHOP 이미지 자동화 배치 시작\n');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const MIDJOURNEY_DIR = path.join(PROJECT_ROOT, 'public/images/midjourney');
const BACKUP_DIR = path.join(PROJECT_ROOT, 'backup/images');

// 배치 매핑 설정
const IMAGE_MAPPING = [
  { source: '17.png', target: 'public/images/curtains/modern-sheer-series/detail-2.jpg' },
  { source: '18.png', target: 'public/images/curtains/modern-sheer-series/lifestyle.jpg' },
  { source: '19.png', target: 'public/images/curtains/venetian-premium-line/main.jpg' },
  { source: '20.png', target: 'public/images/curtains/venetian-premium-line/detail-1.jpg' },
  { source: '21.png', target: 'public/images/curtains/venetian-premium-line/detail-2.jpg' },
  { source: '22.png', target: 'public/images/curtains/venetian-premium-line/lifestyle.jpg' },
  { source: '23.png', target: 'public/images/curtains/wood-texture-natural/main.jpg' },
  { source: '24.png', target: 'public/images/curtains/wood-texture-natural/detail-1.jpg' },
  { source: '25.png', target: 'public/images/curtains/wood-texture-natural/detail-2.jpg' },
  { source: '26.png', target: 'public/images/curtains/wood-texture-natural/lifestyle.jpg' }
];

// 유틸리티 함수들
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 폴더 생성: ${dirPath}`);
    return true;
  }
  return false;
}

function createBackup(filePath) {
  if (!fs.existsSync(filePath)) return null;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const parsedPath = path.parse(filePath);
  const backupFileName = `${parsedPath.name}_backup_${timestamp}${parsedPath.ext}`;
  const backupPath = path.join(BACKUP_DIR, backupFileName);
  
  ensureDirectoryExists(BACKUP_DIR);
  fs.copyFileSync(filePath, backupPath);
  console.log(`💾 백업 생성: ${backupFileName}`);
  return backupPath;
}

function getFileSize(filePath) {
  let bytes;
  if (typeof filePath === 'string') {
    const stats = fs.statSync(filePath);
    bytes = stats.size;
  } else if (filePath && typeof filePath.size === 'number') {
    bytes = filePath.size;
  } else {
    return '0 Bytes';
  }
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// 메인 실행 함수
async function executeBatchPlacement() {
  const results = {
    success: [],
    errors: [],
    backups: [],
    created_folders: [],
    total_size: 0
  };

  console.log('📊 배치 작업 시작...\n');

  for (const mapping of IMAGE_MAPPING) {
    try {
      const sourcePath = path.join(MIDJOURNEY_DIR, mapping.source);
      const targetPath = path.join(PROJECT_ROOT, mapping.target);
      const targetDir = path.dirname(targetPath);

      console.log(`🔄 처리 중: ${mapping.source} → ${mapping.target}`);

      // 1. 소스 파일 존재 확인
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`소스 파일을 찾을 수 없습니다: ${mapping.source}`);
      }

      // 2. 타겟 디렉토리 생성
      const folderCreated = ensureDirectoryExists(targetDir);
      if (folderCreated) {
        results.created_folders.push(targetDir);
      }

      // 3. 기존 파일 백업
      if (fs.existsSync(targetPath)) {
        const backupPath = createBackup(targetPath);
        if (backupPath) {
          results.backups.push({
            original: targetPath,
            backup: backupPath
          });
        }
      }

      // 4. 파일 복사 (PNG → JPG 변환은 나중에 처리)
      fs.copyFileSync(sourcePath, targetPath);
      
      // 5. 파일 크기 계산
      const fileSize = fs.statSync(targetPath).size;
      results.total_size += fileSize;

      results.success.push({
        source: mapping.source,
        target: mapping.target,
        size: getFileSize(targetPath)
      });

      console.log(`✅ 완료: ${mapping.source} (${getFileSize(targetPath)})\n`);

    } catch (error) {
      console.log(`❌ 오류: ${mapping.source} - ${error.message}\n`);
      results.errors.push({
        source: mapping.source,
        target: mapping.target,
        error: error.message
      });
    }
  }

  return results;
}

// 검증 리포트 생성
function generateVerificationReport(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 KHAKISHOP 이미지 배치 완료 리포트');
  console.log('='.repeat(60));

  console.log(`\n📊 작업 통계:`);
  console.log(`   ✅ 성공: ${results.success.length}개`);
  console.log(`   ❌ 실패: ${results.errors.length}개`);
  console.log(`   💾 백업: ${results.backups.length}개`);
  console.log(`   📁 생성된 폴더: ${results.created_folders.length}개`);
  console.log(`   💿 총 용량: ${getFileSize({ size: results.total_size })}`);

  if (results.success.length > 0) {
    console.log(`\n✅ 성공한 배치:`);
    results.success.forEach(item => {
      console.log(`   ${item.source} → ${item.target} (${item.size})`);
    });
  }

  if (results.errors.length > 0) {
    console.log(`\n❌ 실패한 배치:`);
    results.errors.forEach(item => {
      console.log(`   ${item.source} → ${item.target}`);
      console.log(`   오류: ${item.error}`);
    });
  }

  if (results.backups.length > 0) {
    console.log(`\n💾 생성된 백업:`);
    results.backups.forEach(item => {
      console.log(`   ${path.basename(item.backup)}`);
    });
  }

  if (results.created_folders.length > 0) {
    console.log(`\n📁 생성된 폴더:`);
    results.created_folders.forEach(folder => {
      console.log(`   ${folder}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  
  if (results.errors.length === 0) {
    console.log('🎉 모든 이미지 배치가 성공적으로 완료되었습니다!');
  } else {
    console.log('⚠️  일부 오류가 발생했습니다. 위의 오류 목록을 확인해주세요.');
  }
  
  console.log('='.repeat(60));
}

// 스크립트 실행
(async () => {
  try {
    const results = await executeBatchPlacement();
    generateVerificationReport(results);
    
    // 성공 시 0, 오류 시 1로 종료
    process.exit(results.errors.length > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('💥 치명적 오류:', error.message);
    process.exit(1);
  }
})(); 