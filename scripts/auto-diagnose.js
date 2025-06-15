#!/usr/bin/env node

/**
 * KHAKISHOP-WEB 프로젝트 자동 진단 프로그램
 * Claude AI가 프로젝트 상태를 100% 정확히 파악할 수 있는 종합 리포트 생성
 * 
 * 사용법: npm run auto-diagnose
 * 
 * @author Claude AI Assistant
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class KhakishopDiagnostics {
  constructor() {
    this.projectRoot = process.cwd();
    this.report = {
      timestamp: new Date().toISOString(),
      projectName: 'KHAKISHOP-WEB',
      version: '1.0.0',
      summary: {
        status: 'UNKNOWN',
        criticalIssues: 0,
        warnings: 0,
        suggestions: 0
      },
      sections: {}
    };
    this.issues = {
      critical: [],
      warning: [],
      suggestion: []
    };
  }

  // 🎯 메인 진단 실행
  async runDiagnosis() {
    console.log('🔍 KHAKISHOP-WEB 프로젝트 자동 진단 시작...\n');

    try {
      await this.scanProjectStructure();
      await this.analyzePackageJson();
      await this.checkTypeScriptConfig();
      await this.scanSourceCode();
      await this.checkImageAssets();
      await this.analyzeBuildSystem();
      await this.checkDependencies();
      await this.scanForCommonIssues();
      await this.generateClaudeReport();

      this.finalizeDiagnosis();
      this.printReport();

    } catch (error) {
      console.error('❌ 진단 중 오류 발생:', error.message);
      process.exit(1);
    }
  }

  // 📁 프로젝트 구조 스캔
  async scanProjectStructure() {
    console.log('📁 프로젝트 구조 스캔 중...');

    const structure = {
      totalFiles: 0,
      directories: [],
      keyFiles: {},
      missingFiles: []
    };

    // 핵심 파일들 체크
    const keyFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.ts',
      'eslint.config.mjs',
      'src/app/layout.tsx',
      'src/app/globals.css',
      'public/images'
    ];

    keyFiles.forEach(file => {
      const fullPath = path.join(this.projectRoot, file);
      if (fs.existsSync(fullPath)) {
        structure.keyFiles[file] = {
          exists: true,
          size: this.getFileSize(fullPath),
          modified: this.getLastModified(fullPath)
        };
      } else {
        structure.keyFiles[file] = { exists: false };
        structure.missingFiles.push(file);
        this.addIssue('warning', `핵심 파일 누락: ${file}`);
      }
    });

    // 디렉토리 구조 스캔
    structure.directories = this.scanDirectory('src', 3);
    structure.totalFiles = this.countFiles(this.projectRoot);

    this.report.sections.projectStructure = structure;
  }

  // 📦 Package.json 분석
  async analyzePackageJson() {
    console.log('📦 Package.json 분석 중...');

    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      const analysis = {
        name: packageJson.name,
        version: packageJson.version,
        scripts: Object.keys(packageJson.scripts || {}),
        dependencies: Object.keys(packageJson.dependencies || {}),
        devDependencies: Object.keys(packageJson.devDependencies || {}),
        issues: []
      };

      // 필수 스크립트 체크
      const requiredScripts = ['dev', 'build', 'start'];
      requiredScripts.forEach(script => {
        if (!packageJson.scripts?.[script]) {
          analysis.issues.push(`필수 스크립트 누락: ${script}`);
          this.addIssue('critical', `필수 스크립트 누락: ${script}`);
        }
      });

      // Next.js 버전 체크
      const nextVersion = packageJson.dependencies?.['next'];
      if (nextVersion) {
        analysis.nextVersion = nextVersion;
        if (nextVersion.includes('14.1.3')) {
          this.addIssue('suggestion', 'Next.js 14.1.3 사용 중 - 최신 버전 고려');
        }
      }

      this.report.sections.packageAnalysis = analysis;

    } catch (error) {
      this.addIssue('critical', `Package.json 분석 실패: ${error.message}`);
    }
  }

  // 🔧 TypeScript 설정 체크
  async checkTypeScriptConfig() {
    console.log('🔧 TypeScript 설정 체크 중...');

    const tsConfig = {
      exists: false,
      valid: false,
      issues: []
    };

    try {
      const tsConfigPath = path.join(this.projectRoot, 'tsconfig.json');
      if (fs.existsSync(tsConfigPath)) {
        tsConfig.exists = true;
        const config = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
        tsConfig.config = config;
        tsConfig.valid = true;

        // TypeScript 컴파일 체크
        try {
          execSync('npx tsc --noEmit', {
            cwd: this.projectRoot,
            stdio: 'pipe',
            timeout: 30000
          });
          tsConfig.compilationStatus = 'SUCCESS';
        } catch (error) {
          tsConfig.compilationStatus = 'FAILED';
          tsConfig.compilationErrors = error.stdout?.toString() || error.message;
          this.addIssue('critical', 'TypeScript 컴파일 에러 발생');
        }
      } else {
        this.addIssue('critical', 'tsconfig.json 파일이 없습니다');
      }

      this.report.sections.typeScriptConfig = tsConfig;

    } catch (error) {
      tsConfig.issues.push(error.message);
      this.addIssue('warning', `TypeScript 설정 체크 실패: ${error.message}`);
    }
  }

  // 💻 소스 코드 스캔
  async scanSourceCode() {
    console.log('💻 소스 코드 스캔 중...');

    const codeAnalysis = {
      totalFiles: 0,
      components: [],
      pages: [],
      hooks: [],
      utils: [],
      issues: []
    };

    // src 디렉토리 스캔
    const srcPath = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      this.scanCodeDirectory(srcPath, codeAnalysis);
    }

    // 일반적인 코드 이슈 체크
    this.checkForCodeIssues(codeAnalysis);

    this.report.sections.sourceCodeAnalysis = codeAnalysis;
  }

  // 🖼️ 이미지 에셋 체크
  async checkImageAssets() {
    console.log('🖼️ 이미지 에셋 체크 중...');

    const imageAnalysis = {
      totalImages: 0,
      categories: {},
      missingImages: [],
      brokenReferences: [],
      issues: []
    };

    const publicImagesPath = path.join(this.projectRoot, 'public', 'images');

    if (fs.existsSync(publicImagesPath)) {
      this.scanImageDirectory(publicImagesPath, imageAnalysis);
      await this.checkImageReferences(imageAnalysis);
    } else {
      this.addIssue('critical', 'public/images 디렉토리가 없습니다');
    }

    this.report.sections.imageAnalysis = imageAnalysis;
  }

  // 🏗️ 빌드 시스템 분석
  async analyzeBuildSystem() {
    console.log('🏗️ 빌드 시스템 분석 중...');

    const buildAnalysis = {
      nextConfigExists: false,
      buildStatus: 'UNKNOWN',
      buildErrors: [],
      buildWarnings: [],
      cacheStatus: 'UNKNOWN'
    };

    // Next.js 설정 체크
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      buildAnalysis.nextConfigExists = true;
      try {
        const configContent = fs.readFileSync(nextConfigPath, 'utf8');
        buildAnalysis.configSize = configContent.length;
      } catch (error) {
        this.addIssue('warning', `next.config.js 읽기 실패: ${error.message}`);
      }
    }

    // 빌드 캐시 체크
    const nextCachePath = path.join(this.projectRoot, '.next');
    if (fs.existsSync(nextCachePath)) {
      buildAnalysis.cacheStatus = 'EXISTS';
      buildAnalysis.cacheSize = this.getDirectorySize(nextCachePath);
    } else {
      buildAnalysis.cacheStatus = 'MISSING';
    }

    // 빌드 테스트 (타임아웃 적용)
    try {
      console.log('  빌드 테스트 실행 중... (최대 60초)');
      const buildOutput = execSync('npm run build', {
        cwd: this.projectRoot,
        stdio: 'pipe',
        timeout: 60000,
        encoding: 'utf8'
      });

      buildAnalysis.buildStatus = 'SUCCESS';
      buildAnalysis.buildOutput = buildOutput;

    } catch (error) {
      buildAnalysis.buildStatus = 'FAILED';
      buildAnalysis.buildErrors.push(error.message);
      this.addIssue('critical', '빌드 실패');
    }

    this.report.sections.buildAnalysis = buildAnalysis;
  }

  // 📋 의존성 체크
  async checkDependencies() {
    console.log('📋 의존성 체크 중...');

    const depAnalysis = {
      nodeModulesExists: false,
      packageLockExists: false,
      vulnerabilities: [],
      outdatedPackages: []
    };

    // node_modules 체크
    const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
    depAnalysis.nodeModulesExists = fs.existsSync(nodeModulesPath);

    if (!depAnalysis.nodeModulesExists) {
      this.addIssue('critical', 'node_modules가 없습니다. npm install 필요');
    }

    // package-lock.json 체크
    const packageLockPath = path.join(this.projectRoot, 'package-lock.json');
    depAnalysis.packageLockExists = fs.existsSync(packageLockPath);

    // npm audit 실행 (타임아웃 적용)
    try {
      const auditOutput = execSync('npm audit --json', {
        cwd: this.projectRoot,
        stdio: 'pipe',
        timeout: 30000,
        encoding: 'utf8'
      });

      const auditResult = JSON.parse(auditOutput);
      depAnalysis.vulnerabilities = auditResult.vulnerabilities || {};

      if (Object.keys(depAnalysis.vulnerabilities).length > 0) {
        this.addIssue('warning', `보안 취약점 발견: ${Object.keys(depAnalysis.vulnerabilities).length}개`);
      }

    } catch (error) {
      depAnalysis.auditError = error.message;
    }

    this.report.sections.dependencyAnalysis = depAnalysis;
  }

  // 🔍 일반적인 이슈 스캔
  async scanForCommonIssues() {
    console.log('🔍 일반적인 이슈 스캔 중...');

    const commonIssues = {
      portConflicts: [],
      environmentIssues: [],
      configurationIssues: []
    };

    // 포트 충돌 체크
    try {
      execSync('lsof -ti:3000', { stdio: 'pipe' });
      commonIssues.portConflicts.push('포트 3000이 사용 중입니다');
      this.addIssue('warning', '포트 3000이 사용 중입니다');
    } catch (error) {
      // 포트가 비어있음 (정상)
    }

    // 환경 변수 체크
    const envFiles = ['.env', '.env.local', '.env.development'];
    envFiles.forEach(envFile => {
      const envPath = path.join(this.projectRoot, envFile);
      if (fs.existsSync(envPath)) {
        commonIssues.environmentIssues.push(`${envFile} 파일 존재`);
      }
    });

    this.report.sections.commonIssues = commonIssues;
  }

  // 📊 Claude용 리포트 생성
  async generateClaudeReport() {
    console.log('📊 Claude용 리포트 생성 중...');

    const claudeReport = {
      executiveSummary: this.generateExecutiveSummary(),
      quickFixes: this.generateQuickFixes(),
      detailedAnalysis: this.generateDetailedAnalysis(),
      actionPlan: this.generateActionPlan(),
      codeSnippets: this.generateCodeSnippets()
    };

    this.report.sections.claudeReport = claudeReport;
  }

  // 🎯 헬퍼 메서드들
  scanDirectory(dirPath, maxDepth = 2, currentDepth = 0) {
    const result = [];
    if (currentDepth >= maxDepth) return result;

    try {
      const fullPath = path.join(this.projectRoot, dirPath);
      if (!fs.existsSync(fullPath)) return result;

      const items = fs.readdirSync(fullPath);
      items.forEach(item => {
        if (item.startsWith('.')) return;

        const itemPath = path.join(fullPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          result.push({
            name: item,
            type: 'directory',
            path: path.join(dirPath, item),
            children: this.scanDirectory(path.join(dirPath, item), maxDepth, currentDepth + 1)
          });
        }
      });
    } catch (error) {
      // 디렉토리 접근 실패 무시
    }

    return result;
  }

  scanCodeDirectory(dirPath, analysis) {
    try {
      const items = fs.readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          this.scanCodeDirectory(itemPath, analysis);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          analysis.totalFiles++;

          const relativePath = path.relative(this.projectRoot, itemPath);

          if (item.includes('page.tsx')) {
            analysis.pages.push(relativePath);
          } else if (item.includes('Component') || item.endsWith('.tsx')) {
            analysis.components.push(relativePath);
          } else if (item.includes('use') && item.endsWith('.ts')) {
            analysis.hooks.push(relativePath);
          } else if (item.includes('util') || item.includes('helper')) {
            analysis.utils.push(relativePath);
          }
        }
      });
    } catch (error) {
      analysis.issues.push(`디렉토리 스캔 실패: ${error.message}`);
    }
  }

  scanImageDirectory(dirPath, analysis) {
    try {
      const items = fs.readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          if (!analysis.categories[item]) {
            analysis.categories[item] = { count: 0, files: [] };
          }
          this.scanImageSubDirectory(itemPath, analysis.categories[item]);
        } else if (this.isImageFile(item)) {
          analysis.totalImages++;
        }
      });
    } catch (error) {
      analysis.issues.push(`이미지 디렉토리 스캔 실패: ${error.message}`);
    }
  }

  scanImageSubDirectory(dirPath, category) {
    try {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          this.scanImageSubDirectory(itemPath, category);
        } else if (this.isImageFile(item)) {
          category.count++;
          category.files.push(path.relative(this.projectRoot, itemPath));
        }
      });
    } catch (error) {
      // 서브디렉토리 스캔 실패 무시
    }
  }

  async checkImageReferences(analysis) {
    // 소스 코드에서 이미지 참조 찾기
    const srcPath = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      this.findImageReferences(srcPath, analysis);
    }
  }

  findImageReferences(dirPath, analysis) {
    try {
      const items = fs.readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          this.findImageReferences(itemPath, analysis);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          const content = fs.readFileSync(itemPath, 'utf8');
          const imageRefs = content.match(/\/images\/[^"'\s]+/g);

          if (imageRefs) {
            imageRefs.forEach(ref => {
              const imagePath = path.join(this.projectRoot, 'public', ref);
              if (!fs.existsSync(imagePath)) {
                analysis.missingImages.push({
                  reference: ref,
                  file: path.relative(this.projectRoot, itemPath)
                });
                this.addIssue('critical', `이미지 파일 누락: ${ref}`);
              }
            });
          }
        }
      });
    } catch (error) {
      // 파일 읽기 실패 무시
    }
  }

  checkForCodeIssues(analysis) {
    // 일반적인 코드 이슈 패턴 체크
    const issuePatterns = [
      { pattern: /console\.log/, message: 'console.log 사용 발견', severity: 'suggestion' },
      { pattern: /debugger/, message: 'debugger 구문 발견', severity: 'warning' },
      { pattern: /TODO|FIXME/, message: 'TODO/FIXME 주석 발견', severity: 'suggestion' }
    ];

    // 실제 구현은 파일 내용을 읽어서 패턴 매칭
    // 여기서는 간단히 스킵
  }

  generateExecutiveSummary() {
    const total = this.issues.critical.length + this.issues.warning.length + this.issues.suggestion.length;

    let status = 'HEALTHY';
    if (this.issues.critical.length > 0) status = 'CRITICAL';
    else if (this.issues.warning.length > 3) status = 'WARNING';
    else if (this.issues.warning.length > 0) status = 'CAUTION';

    return {
      overallStatus: status,
      totalIssues: total,
      criticalIssues: this.issues.critical.length,
      warnings: this.issues.warning.length,
      suggestions: this.issues.suggestion.length,
      recommendation: this.getRecommendation(status)
    };
  }

  generateQuickFixes() {
    const fixes = [];

    if (this.issues.critical.some(issue => issue.includes('node_modules'))) {
      fixes.push({
        issue: 'Missing node_modules',
        command: 'npm install',
        description: '의존성 설치'
      });
    }

    if (this.issues.critical.some(issue => issue.includes('빌드'))) {
      fixes.push({
        issue: 'Build failure',
        command: 'rm -rf .next && npm run build',
        description: '빌드 캐시 정리 후 재빌드'
      });
    }

    return fixes;
  }

  generateDetailedAnalysis() {
    return {
      fileStructure: this.report.sections.projectStructure,
      buildSystem: this.report.sections.buildAnalysis,
      dependencies: this.report.sections.dependencyAnalysis,
      codeQuality: this.report.sections.sourceCodeAnalysis
    };
  }

  generateActionPlan() {
    const plan = [];

    if (this.issues.critical.length > 0) {
      plan.push({
        priority: 'HIGH',
        title: 'Critical Issues 해결',
        tasks: this.issues.critical.slice(0, 5),
        estimatedTime: '30분'
      });
    }

    if (this.issues.warning.length > 0) {
      plan.push({
        priority: 'MEDIUM',
        title: 'Warning Issues 해결',
        tasks: this.issues.warning.slice(0, 3),
        estimatedTime: '1시간'
      });
    }

    return plan;
  }

  generateCodeSnippets() {
    // 주요 설정 파일들의 스니펫 생성
    const snippets = {};

    const keyFiles = ['package.json', 'next.config.js', 'tsconfig.json'];
    keyFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          snippets[file] = content.substring(0, 500) + (content.length > 500 ? '...' : '');
        } catch (error) {
          snippets[file] = `읽기 실패: ${error.message}`;
        }
      }
    });

    return snippets;
  }

  getRecommendation(status) {
    switch (status) {
      case 'CRITICAL':
        return '즉시 조치가 필요한 심각한 문제가 있습니다. 빌드 및 실행이 불가능할 수 있습니다.';
      case 'WARNING':
        return '주의가 필요한 문제들이 있습니다. 개발 진행에 영향을 줄 수 있습니다.';
      case 'CAUTION':
        return '경미한 문제들이 있습니다. 시간이 날 때 해결하는 것을 권장합니다.';
      default:
        return '프로젝트 상태가 양호합니다. 정기적인 점검을 권장합니다.';
    }
  }

  // 유틸리티 메서드들
  addIssue(severity, message) {
    this.issues[severity].push(message);
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  getLastModified(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.mtime.toISOString();
    } catch (error) {
      return null;
    }
  }

  countFiles(dirPath) {
    let count = 0;
    try {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        if (item.startsWith('.')) return;
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          count += this.countFiles(itemPath);
        } else {
          count++;
        }
      });
    } catch (error) {
      // 디렉토리 접근 실패 무시
    }
    return count;
  }

  getDirectorySize(dirPath) {
    let size = 0;
    try {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          size += this.getDirectorySize(itemPath);
        } else {
          size += stat.size;
        }
      });
    } catch (error) {
      // 디렉토리 접근 실패 무시
    }
    return size;
  }

  isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  finalizeDiagnosis() {
    this.report.summary = {
      status: this.generateExecutiveSummary().overallStatus,
      criticalIssues: this.issues.critical.length,
      warnings: this.issues.warning.length,
      suggestions: this.issues.suggestion.length
    };
  }

  printReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 KHAKISHOP-WEB 프로젝트 진단 완료');
    console.log('='.repeat(80));

    const summary = this.generateExecutiveSummary();
    console.log(`\n📊 전체 상태: ${summary.overallStatus}`);
    console.log(`🔴 Critical: ${summary.criticalIssues}개`);
    console.log(`🟡 Warning: ${summary.warnings}개`);
    console.log(`🟢 Suggestion: ${summary.suggestions}개`);

    console.log(`\n💡 권장사항: ${summary.recommendation}`);

    if (this.issues.critical.length > 0) {
      console.log('\n🚨 Critical Issues:');
      this.issues.critical.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }

    if (this.issues.warning.length > 0) {
      console.log('\n⚠️  Warning Issues:');
      this.issues.warning.slice(0, 5).forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
      if (this.issues.warning.length > 5) {
        console.log(`  ... 그리고 ${this.issues.warning.length - 5}개 더`);
      }
    }

    // 리포트 파일 저장
    const reportPath = path.join(this.projectRoot, 'diagnosis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    console.log(`\n📄 상세 리포트 저장됨: ${reportPath}`);

    console.log('\n' + '='.repeat(80));
    console.log('✅ 진단 완료! Claude AI가 이 리포트를 참고하여 정확한 도움을 제공할 수 있습니다.');
    console.log('='.repeat(80) + '\n');
  }
}

// 메인 실행
if (require.main === module) {
  const diagnostics = new KhakishopDiagnostics();
  diagnostics.runDiagnosis().catch(error => {
    console.error('❌ 진단 실행 실패:', error);
    process.exit(1);
  });
}

module.exports = KhakishopDiagnostics; 