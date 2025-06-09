#!/usr/bin/env node

// ================================================================================
// 🎯 KHAKISHOP - 자동화된 헬스 체크 시스템
// ================================================================================
// 목적: 배포 전 자동 검증, 런타임 이슈 사전 방지

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ================================================================================
// 🎯 검증 항목들
// ================================================================================

const checks = {
  // 1. 패키지 의존성 검증
  async checkDependencies() {
    console.log('🔍 의존성 검증 중...');
    
    try {
      // package.json 읽기
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // 중요한 패키지들 검증
      const criticalPackages = [
        'next',
        'react',
        'react-dom',
        'framer-motion',
        'typescript'
      ];
      
      const missing = criticalPackages.filter(pkg => !dependencies[pkg]);
      
      if (missing.length > 0) {
        throw new Error(`필수 패키지 누락: ${missing.join(', ')}`);
      }
      
      // framer-motion 버전 검증 (11.x 이상 권장)
      const framerVersion = dependencies['framer-motion'];
      if (framerVersion && !framerVersion.match(/^[\^~]?1[1-9]/)) {
        console.warn('⚠️  framer-motion 버전이 낮을 수 있습니다:', framerVersion);
      }
      
      console.log('✅ 의존성 검증 완료');
      return true;
    } catch (error) {
      console.error('❌ 의존성 검증 실패:', error.message);
      return false;
    }
  },

  // 2. Import 구문 검증
  async checkImports() {
    console.log('🔍 Import 구문 검증 중...');
    
    try {
      const srcDir = path.join(process.cwd(), 'src');
      const problematicImports = [];
      
      // 재귀적으로 .tsx, .ts 파일 검색
      function scanDirectory(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.')) {
            scanDirectory(filePath);
          } else if (file.match(/\.(tsx?|jsx?)$/)) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // 문제가 될 수 있는 import 패턴 검사
            const badPatterns = [
              /from ['"]framer-motion\/client['"]/g,
              /from ['"]react\/client['"]/g,
              /import.*from ['"][^'"]*\/client['"]/g
            ];
            
            badPatterns.forEach(pattern => {
              const matches = content.match(pattern);
              if (matches) {
                problematicImports.push({
                  file: filePath.replace(process.cwd(), ''),
                  issues: matches
                });
              }
            });
          }
        });
      }
      
      scanDirectory(srcDir);
      
      if (problematicImports.length > 0) {
        console.error('❌ 문제가 있는 import 발견:');
        problematicImports.forEach(({ file, issues }) => {
          console.error(`  ${file}:`);
          issues.forEach(issue => console.error(`    - ${issue}`));
        });
        return false;
      }
      
      console.log('✅ Import 구문 검증 완료');
      return true;
    } catch (error) {
      console.error('❌ Import 검증 실패:', error.message);
      return false;
    }
  },

  // 3. TypeScript 컴파일 검증
  async checkTypeScript() {
    console.log('🔍 TypeScript 컴파일 검증 중...');
    
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      console.log('✅ TypeScript 컴파일 검증 완료');
      return true;
    } catch (error) {
      console.error('❌ TypeScript 컴파일 오류:');
      console.error(error.stdout?.toString() || error.message);
      return false;
    }
  },

  // 4. Next.js 빌드 검증
  async checkBuild() {
    console.log('🔍 Next.js 빌드 검증 중...');
    
    try {
      // 빌드 테스트
      execSync('npm run build', { stdio: 'pipe' });
      console.log('✅ Next.js 빌드 검증 완료');
      return true;
    } catch (error) {
      console.error('❌ Next.js 빌드 실패:');
      console.error(error.stdout?.toString() || error.message);
      return false;
    }
  },

  // 5. 필수 파일 존재 검증
  async checkEssentialFiles() {
    console.log('🔍 필수 파일 존재 검증 중...');
    
    const essentialFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'src/app/layout.tsx',
      'src/app/[locale]/admin/images/page.tsx',
      'src/utils/imageMap.ts',
      'src/lib/imports.ts',
      'src/config/environment.ts'
    ];
    
    const missingFiles = essentialFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
      console.error('❌ 필수 파일 누락:', missingFiles);
      return false;
    }
    
    console.log('✅ 필수 파일 검증 완료');
    return true;
  },

  // 6. 환경 설정 검증
  async checkEnvironment() {
    console.log('🔍 환경 설정 검증 중...');
    
    try {
      // .env 파일들 체크 (존재하면 안 되는 것들)
      const sensitiveFiles = ['.env', '.env.local', '.env.production'];
      const existingSensitiveFiles = sensitiveFiles.filter(file => fs.existsSync(file));
      
      if (existingSensitiveFiles.length > 0) {
        console.warn('⚠️  민감한 환경 파일이 커밋될 수 있습니다:', existingSensitiveFiles);
      }
      
      // .gitignore 검증
      if (fs.existsSync('.gitignore')) {
        const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
        const requiredIgnores = ['.env', 'node_modules', '.next'];
        const missingIgnores = requiredIgnores.filter(ignore => !gitignoreContent.includes(ignore));
        
        if (missingIgnores.length > 0) {
          console.warn('⚠️  .gitignore에 누락된 항목들:', missingIgnores);
        }
      }
      
      console.log('✅ 환경 설정 검증 완료');
      return true;
    } catch (error) {
      console.error('❌ 환경 설정 검증 실패:', error.message);
      return false;
    }
  }
};

// ================================================================================
// 🚀 메인 실행 함수
// ================================================================================

async function runHealthCheck() {
  console.log('🏥 KHAKISHOP 헬스 체크 시작...\n');
  
  const results = [];
  let allPassed = true;
  
  for (const [name, check] of Object.entries(checks)) {
    const startTime = Date.now();
    const passed = await check();
    const duration = Date.now() - startTime;
    
    results.push({ name, passed, duration });
    
    if (!passed) {
      allPassed = false;
    }
    
    console.log(''); // 빈 줄
  }
  
  // ================================================================================
  // 📊 결과 요약
  // ================================================================================
  
  console.log('📊 헬스 체크 결과 요약:');
  console.log('='.repeat(50));
  
  results.forEach(({ name, passed, duration }) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const time = `(${duration}ms)`;
    console.log(`${status} ${name.padEnd(20)} ${time}`);
  });
  
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 모든 검증 통과! 배포 준비 완료.');
    process.exit(0);
  } else {
    console.log('🚨 일부 검증 실패. 문제를 해결한 후 다시 시도하세요.');
    process.exit(1);
  }
}

// 스크립트가 직접 실행된 경우에만 헬스 체크 실행
if (require.main === module) {
  runHealthCheck().catch(error => {
    console.error('🔥 헬스 체크 실행 중 오류:', error);
    process.exit(1);
  });
}

module.exports = { checks, runHealthCheck }; 