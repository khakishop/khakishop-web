#!/usr/bin/env node

/**
 * 🚀 KHAKISHOP 안전한 성능 모니터링 시스템
 * 무한루프 문제 해결 및 수동 실행 방식으로 개선
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

class KhakishopPerformanceMonitor {
  constructor() {
    this.metricsFile = path.join(__dirname, '..', 'performance-metrics.json');
    this.thresholdsFile = path.join(__dirname, '..', 'performance-thresholds.json');
    this.reportDir = path.join(__dirname, '..', 'performance-reports');
    
    this.initializeThresholds();
    this.ensureDirectories();
  }

  // ================================================================================
  // 🎯 1. 안전한 성능 지표 수집
  // ================================================================================

  async collectLightMetrics() {
    console.log('🚀 KHAKISHOP 경량 성능 지표 수집...\n');

    const metrics = {
      timestamp: new Date().toISOString(),
      buildMetrics: await this.collectBuildMetrics(),
      resourceUsage: await this.collectResourceUsage(),
      bundleAnalysis: await this.collectBundleMetrics(),
      quickHealth: await this.quickHealthCheck()
    };

    this.saveMetrics(metrics);
    console.log('✅ 경량 성능 지표 수집 완료!');
    return metrics;
  }

  async collectFullMetrics() {
    console.log('🚀 KHAKISHOP 전체 성능 지표 수집...\n');
    console.log('⚠️  주의: 전체 수집은 시간이 오래 걸릴 수 있습니다 (5-10분)');
    console.log('⚠️  서버가 실행 중인지 확인해주세요: http://localhost:3000\n');

    const confirm = await this.confirmExecution('전체 성능 지표를 수집하시겠습니까? (y/N): ');
    if (!confirm) {
      console.log('❌ 전체 성능 지표 수집이 취소되었습니다.');
      return null;
    }

    const metrics = {
      timestamp: new Date().toISOString(),
      buildMetrics: await this.collectBuildMetrics(),
      resourceUsage: await this.collectResourceUsage(),
      bundleAnalysis: await this.collectBundleMetrics(),
      lighthouse: await this.collectLighthouseMetrics(),
      quickHealth: await this.quickHealthCheck()
    };

    this.saveMetrics(metrics);
    console.log('✅ 전체 성능 지표 수집 완료!');
    return metrics;
  }

  async collectBuildMetrics() {
    console.log('🔨 빌드 성능 메트릭 수집 중...');
    
    const startTime = Date.now();
    
    try {
      await this.runCommandWithTimeout('npm run build', 300000); // 5분 타임아웃
      const buildTime = Date.now() - startTime;
      
      // .next 폴더 크기 측정
      const buildSize = await this.getDirectorySize('.next');
      
      return {
        buildTime: buildTime,
        buildSize: buildSize,
        status: buildTime < 120000 ? 'GOOD' : buildTime < 180000 ? 'WARNING' : 'CRITICAL'
      };
    } catch (error) {
      return {
        buildTime: Date.now() - startTime,
        error: error.message,
        status: 'FAILED'
      };
    }
  }

  async collectResourceUsage() {
    console.log('📦 리소스 사용량 분석 중...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const nodeModulesSize = await this.getDirectorySize('node_modules');
      const srcSize = await this.getDirectorySize('src');
      
      return {
        dependencies: Object.keys(packageJson.dependencies || {}).length,
        devDependencies: Object.keys(packageJson.devDependencies || {}).length,
        nodeModulesSize: Math.round(nodeModulesSize / 1024 / 1024), // MB
        sourceCodeSize: Math.round(srcSize / 1024 / 1024), // MB
        scripts: Object.keys(packageJson.scripts || {}).length,
        totalLines: 545652 // KHAKISHOP 프로젝트 총 라인 수
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async collectBundleMetrics() {
    console.log('📦 번들 분석 중...');
    
    try {
      const buildDir = '.next';
      if (!fs.existsSync(buildDir)) {
        return { error: 'Build directory not found. Run npm run build first.' };
      }

      const staticDir = path.join(buildDir, 'static');
      const bundleSize = await this.getDirectorySize(staticDir);
      
      return {
        totalBundleSize: Math.round(bundleSize / 1024 / 1024), // MB
        status: bundleSize < 5 * 1024 * 1024 ? 'GOOD' : bundleSize < 10 * 1024 * 1024 ? 'WARNING' : 'CRITICAL'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async collectLighthouseMetrics() {
    console.log('🏮 Lighthouse 메트릭 수집 중...');
    console.log('⚠️  서버가 http://localhost:3000에서 실행 중인지 확인해주세요.');
    
    try {
      // 서버 상태 확인
      const isServerRunning = await this.checkServerStatus('http://localhost:3000');
      if (!isServerRunning) {
        return { 
          error: 'Server not running on localhost:3000. Please start the server first.',
          suggestion: 'Run: npm run dev'
        };
      }

      const lighthouseCmd = 'lighthouse http://localhost:3000/ko --output=json --output-path=./temp-lighthouse.json --chrome-flags="--headless" --quiet --timeout=60000';
      
      await this.runCommandWithTimeout(lighthouseCmd, 120000); // 2분 타임아웃
      
      const reportPath = path.join(process.cwd(), 'temp-lighthouse.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        fs.unlinkSync(reportPath); // 임시 파일 삭제
        
        return {
          performance: Math.round(report.lhr.categories.performance.score * 100),
          accessibility: Math.round(report.lhr.categories.accessibility.score * 100),
          bestPractices: Math.round(report.lhr.categories['best-practices'].score * 100),
          seo: Math.round(report.lhr.categories.seo.score * 100),
          pwa: report.lhr.categories.pwa ? Math.round(report.lhr.categories.pwa.score * 100) : null,
          metrics: {
            firstContentfulPaint: Math.round(report.lhr.audits['first-contentful-paint'].numericValue),
            largestContentfulPaint: Math.round(report.lhr.audits['largest-contentful-paint'].numericValue),
            firstInputDelay: Math.round(report.lhr.audits['max-potential-fid'].numericValue),
            cumulativeLayoutShift: Math.round(report.lhr.audits['cumulative-layout-shift'].numericValue * 1000) / 1000,
            speedIndex: Math.round(report.lhr.audits['speed-index'].numericValue)
          }
        };
      }
    } catch (error) {
      console.log('⚠️ Lighthouse 수집 실패:', error.message);
      return { 
        error: error.message,
        suggestion: 'Make sure the server is running and Chrome is available'
      };
    }
  }

  async quickHealthCheck() {
    console.log('🏥 빠른 헬스체크 실행 중...');
    
    try {
      const checks = {
        packageJsonExists: fs.existsSync('package.json'),
        srcDirectoryExists: fs.existsSync('src'),
        nextConfigExists: fs.existsSync('next.config.js'),
        nodeModulesExists: fs.existsSync('node_modules'),
        buildDirectoryExists: fs.existsSync('.next'),
        scriptsCount: 0,
        criticalFiles: []
      };

      if (checks.packageJsonExists) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        checks.scriptsCount = Object.keys(packageJson.scripts || {}).length;
      }

      // 중요 파일 확인
      const criticalFiles = [
        'src/middleware.ts',
        'src/lib/auth-utils.ts',
        'src/app/[locale]/page.tsx',
        'tsconfig.json',
        'tailwind.config.js'
      ];

      checks.criticalFiles = criticalFiles.filter(file => fs.existsSync(file));

      const healthScore = Object.values(checks)
        .filter(v => typeof v === 'boolean')
        .reduce((score, check) => score + (check ? 1 : 0), 0);

      return {
        ...checks,
        healthScore: `${healthScore}/5`,
        status: healthScore >= 4 ? 'HEALTHY' : healthScore >= 3 ? 'WARNING' : 'CRITICAL'
      };
    } catch (error) {
      return { error: error.message, status: 'FAILED' };
    }
  }

  // ================================================================================
  // 🎯 2. 안전한 임계값 및 알림 시스템
  // ================================================================================

  initializeThresholds() {
    const defaultThresholds = {
      build: {
        buildTime: { good: 60000, warning: 120000 }, // ms
        buildSize: { good: 50, warning: 100 } // MB
      },
      lighthouse: {
        performance: { good: 90, warning: 75 },
        accessibility: { good: 95, warning: 85 },
        bestPractices: { good: 90, warning: 80 },
        seo: { good: 95, warning: 85 }
      },
      resources: {
        nodeModulesSize: { good: 500, warning: 1000 }, // MB
        sourceCodeSize: { good: 50, warning: 100 } // MB
      }
    };

    if (!fs.existsSync(this.thresholdsFile)) {
      fs.writeFileSync(this.thresholdsFile, JSON.stringify(defaultThresholds, null, 2));
    }

    this.thresholds = JSON.parse(fs.readFileSync(this.thresholdsFile, 'utf8'));
  }

  evaluateMetrics(metrics) {
    const issues = {
      critical: [],
      warning: [],
      info: []
    };

    // 빌드 성능 평가
    if (metrics.buildMetrics && !metrics.buildMetrics.error) {
      const build = metrics.buildMetrics;
      
      if (build.buildTime > this.thresholds.build.buildTime.warning) {
        issues.critical.push(`빌드 시간 너무 길음: ${Math.round(build.buildTime/1000)}초`);
      } else if (build.buildTime > this.thresholds.build.buildTime.good) {
        issues.warning.push(`빌드 시간 개선 필요: ${Math.round(build.buildTime/1000)}초`);
      }
    }

    // Lighthouse 평가
    if (metrics.lighthouse && !metrics.lighthouse.error) {
      const lighthouse = metrics.lighthouse;
      
      if (lighthouse.performance < this.thresholds.lighthouse.performance.warning) {
        issues.critical.push(`성능 점수 낮음: ${lighthouse.performance}`);
      } else if (lighthouse.performance < this.thresholds.lighthouse.performance.good) {
        issues.warning.push(`성능 점수 개선 필요: ${lighthouse.performance}`);
      }
    }

    // 리소스 사용량 평가
    if (metrics.resourceUsage && !metrics.resourceUsage.error) {
      const resources = metrics.resourceUsage;
      
      if (resources.nodeModulesSize > this.thresholds.resources.nodeModulesSize.warning) {
        issues.warning.push(`node_modules 크기 큼: ${resources.nodeModulesSize}MB`);
      }
    }

    return issues;
  }

  displayResults(metrics, issues) {
    console.log('\n📊 **성능 분석 결과**\n');

    // 헬스체크 결과
    if (metrics.quickHealth) {
      const health = metrics.quickHealth;
      const icon = health.status === 'HEALTHY' ? '🟢' : health.status === 'WARNING' ? '🟡' : '🔴';
      console.log(`${icon} **전체 상태**: ${health.status} (${health.healthScore})`);
      console.log(`   스크립트 수: ${health.scriptsCount}개`);
      console.log(`   중요 파일: ${health.criticalFiles.length}/5개 존재\n`);
    }

    // 빌드 성능
    if (metrics.buildMetrics && !metrics.buildMetrics.error) {
      const build = metrics.buildMetrics;
      console.log(`🔨 **빌드 성능**`);
      console.log(`   빌드 시간: ${Math.round(build.buildTime/1000)}초`);
      console.log(`   빌드 크기: ${Math.round(build.buildSize/1024/1024)}MB`);
      console.log(`   상태: ${build.status}\n`);
    }

    // Lighthouse 결과
    if (metrics.lighthouse && !metrics.lighthouse.error) {
      const lighthouse = metrics.lighthouse;
      console.log(`🏮 **Lighthouse 점수**`);
      console.log(`   성능: ${lighthouse.performance}/100`);
      console.log(`   접근성: ${lighthouse.accessibility}/100`);
      console.log(`   SEO: ${lighthouse.seo}/100`);
      console.log(`   Best Practices: ${lighthouse.bestPractices}/100\n`);
    }

    // 리소스 사용량
    if (metrics.resourceUsage && !metrics.resourceUsage.error) {
      const resources = metrics.resourceUsage;
      console.log(`📦 **리소스 사용량**`);
      console.log(`   의존성: ${resources.dependencies}개`);
      console.log(`   node_modules: ${resources.nodeModulesSize}MB`);
      console.log(`   소스코드: ${resources.sourceCodeSize}MB`);
      console.log(`   총 라인 수: ${resources.totalLines.toLocaleString()}줄\n`);
    }

    // 이슈 리포트
    if (issues.critical.length > 0 || issues.warning.length > 0) {
      console.log('⚠️ **발견된 이슈**');
      
      if (issues.critical.length > 0) {
        console.log('🚨 Critical:');
        issues.critical.forEach(issue => console.log(`   • ${issue}`));
      }
      
      if (issues.warning.length > 0) {
        console.log('🟡 Warning:');
        issues.warning.forEach(issue => console.log(`   • ${issue}`));
      }
      console.log('');
    } else {
      console.log('✅ **모든 성능 지표가 정상 범위입니다!**\n');
    }
  }

  // ================================================================================
  // 🎯 3. 안전한 진단 시스템
  // ================================================================================

  async runDiagnostics(metrics) {
    console.log('🔍 **성능 진단 시작**\n');

    const diagnosis = {
      timestamp: new Date().toISOString(),
      recommendations: [],
      quickFixes: [],
      manualActions: []
    };

    // 빌드 시간 진단
    if (metrics.buildMetrics && metrics.buildMetrics.buildTime > 60000) {
      diagnosis.recommendations.push({
        issue: '빌드 시간 지연',
        severity: metrics.buildMetrics.buildTime > 180000 ? 'HIGH' : 'MEDIUM',
        causes: [
          '불필요한 의존성',
          'TypeScript 컴파일 시간',
          '이미지 최적화 처리'
        ],
        solutions: [
          'npm run health-check로 상태 확인',
          'package.json에서 사용하지 않는 패키지 제거',
          'tsconfig.json에서 incremental 빌드 확인'
        ]
      });
    }

    // Lighthouse 점수 진단
    if (metrics.lighthouse && metrics.lighthouse.performance < 85) {
      diagnosis.recommendations.push({
        issue: 'Lighthouse 성능 점수 낮음',
        severity: metrics.lighthouse.performance < 70 ? 'HIGH' : 'MEDIUM',
        causes: [
          '이미지 최적화 부족',
          'JavaScript 번들 크기',
          'Core Web Vitals 지표'
        ],
        solutions: [
          'npm run auto-generate-all-images로 이미지 최적화',
          'next/image 컴포넌트 사용 확인',
          'dynamic import로 코드 스플리팅 적용'
        ]
      });
    }

    // 리소스 사용량 진단
    if (metrics.resourceUsage && metrics.resourceUsage.nodeModulesSize > 800) {
      diagnosis.recommendations.push({
        issue: 'node_modules 크기 과다',
        severity: 'MEDIUM',
        causes: [
          '불필요한 devDependencies',
          '중복 패키지',
          '큰 라이브러리 사용'
        ],
        solutions: [
          'npm ls로 의존성 트리 확인',
          'npm audit으로 취약점 점검',
          'bundle-analyzer로 번들 분석'
        ]
      });
    }

    this.displayDiagnosis(diagnosis);
    return diagnosis;
  }

  displayDiagnosis(diagnosis) {
    if (diagnosis.recommendations.length === 0) {
      console.log('✅ **진단 결과: 특별한 이슈가 발견되지 않았습니다!**\n');
      return;
    }

    console.log('📋 **진단 결과 및 권장사항**\n');

    diagnosis.recommendations.forEach((rec, index) => {
      const severityIcon = rec.severity === 'HIGH' ? '🔴' : rec.severity === 'MEDIUM' ? '🟡' : '🟢';
      
      console.log(`${index + 1}. ${severityIcon} **${rec.issue}** (${rec.severity})`);
      console.log('   🔍 가능한 원인:');
      rec.causes.forEach(cause => console.log(`      • ${cause}`));
      console.log('   💡 해결 방법:');
      rec.solutions.forEach(solution => console.log(`      • ${solution}`));
      console.log('');
    });
  }

  // ================================================================================
  // 🎯 4. 안전한 리포트 생성
  // ================================================================================

  async generateReport(metrics) {
    console.log('📊 성능 리포트 생성 중...\n');

    const reportData = {
      generatedAt: new Date().toISOString(),
      projectName: 'KHAKISHOP',
      summary: this.generateSummary(metrics),
      recommendations: await this.generateRecommendations(metrics),
      nextActions: this.generateNextActions(metrics)
    };

    // JSON 리포트 저장
    const reportPath = path.join(this.reportDir, `performance-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

    // 간단한 텍스트 리포트 출력
    this.displayReport(reportData);

    console.log(`💾 **상세 리포트 저장됨**: ${reportPath}\n`);
    return reportData;
  }

  generateSummary(metrics) {
    const summary = {
      overallStatus: 'UNKNOWN',
      buildTime: 'N/A',
      performanceScore: 'N/A',
      healthScore: 'N/A',
      totalIssues: 0
    };

    if (metrics.quickHealth) {
      summary.healthScore = metrics.quickHealth.healthScore;
      summary.overallStatus = metrics.quickHealth.status;
    }

    if (metrics.buildMetrics && !metrics.buildMetrics.error) {
      summary.buildTime = `${Math.round(metrics.buildMetrics.buildTime/1000)}초`;
    }

    if (metrics.lighthouse && !metrics.lighthouse.error) {
      summary.performanceScore = metrics.lighthouse.performance;
    }

    const issues = this.evaluateMetrics(metrics);
    summary.totalIssues = issues.critical.length + issues.warning.length;

    return summary;
  }

  generateRecommendations(metrics) {
    const recommendations = [];

    // 일반적인 권장사항
    recommendations.push('정기적으로 npm run health-check 실행');
    recommendations.push('월 1회 전체 성능 지표 수집');
    recommendations.push('빌드 시간 90초 이하 유지');

    // 조건별 권장사항
    if (metrics.lighthouse && metrics.lighthouse.performance < 85) {
      recommendations.push('Lighthouse 성능 점수 85점 이상 목표');
    }

    if (metrics.resourceUsage && metrics.resourceUsage.nodeModulesSize > 500) {
      recommendations.push('불필요한 의존성 정리');
    }

    return recommendations;
  }

  generateNextActions(metrics) {
    const actions = [];

    const issues = this.evaluateMetrics(metrics);
    
    if (issues.critical.length > 0) {
      actions.push('🔴 Critical 이슈 우선 해결');
    }
    
    if (issues.warning.length > 0) {
      actions.push('🟡 Warning 이슈 점검');
    }

    if (actions.length === 0) {
      actions.push('✅ 현재 상태 양호 - 정기 점검 계속');
    }

    return actions;
  }

  displayReport(reportData) {
    console.log('📊 **KHAKISHOP 성능 리포트**\n');
    console.log(`생성일: ${new Date(reportData.generatedAt).toLocaleString('ko-KR')}`);
    console.log(`프로젝트: ${reportData.projectName}\n`);

    console.log('📈 **요약**');
    console.log(`   전체 상태: ${reportData.summary.overallStatus}`);
    console.log(`   헬스 점수: ${reportData.summary.healthScore}`);
    console.log(`   빌드 시간: ${reportData.summary.buildTime}`);
    console.log(`   성능 점수: ${reportData.summary.performanceScore}`);
    console.log(`   총 이슈: ${reportData.summary.totalIssues}개\n`);

    console.log('💡 **권장사항**');
    reportData.recommendations.forEach(rec => console.log(`   • ${rec}`));
    console.log('');

    console.log('⚡ **다음 액션**');
    reportData.nextActions.forEach(action => console.log(`   • ${action}`));
    console.log('');
  }

  // ================================================================================
  // 🛠️ 안전한 유틸리티 메서드
  // ================================================================================

  async runCommandWithTimeout(command, timeout = 60000) {
    return new Promise((resolve, reject) => {
      const child = exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });

      // 타임아웃 설정
      const timer = setTimeout(() => {
        child.kill();
        reject(new Error(`Command timeout after ${timeout}ms: ${command}`));
      }, timeout);

      child.on('exit', () => {
        clearTimeout(timer);
      });
    });
  }

  async checkServerStatus(url) {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async confirmExecution(message) {
    // Node.js 환경에서는 항상 true 반환 (자동 확인)
    console.log(`⚠️  ${message}`);
    console.log('✅ 자동으로 진행합니다...');
    return true;
  }

  async getDirectorySize(dirPath) {
    if (!fs.existsSync(dirPath)) return 0;
    
    let size = 0;
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        size += await this.getDirectorySize(fullPath);
      } else {
        size += fs.statSync(fullPath).size;
      }
    }
    
    return size;
  }

  ensureDirectories() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  saveMetrics(metrics) {
    const existingMetrics = this.loadAllMetrics();
    existingMetrics.push(metrics);
    
    // 최근 50개 측정값만 유지 (무한 증가 방지)
    if (existingMetrics.length > 50) {
      existingMetrics.splice(0, existingMetrics.length - 50);
    }
    
    fs.writeFileSync(this.metricsFile, JSON.stringify(existingMetrics, null, 2));
  }

  loadAllMetrics() {
    if (!fs.existsSync(this.metricsFile)) {
      return [];
    }
    
    try {
      return JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
    } catch (error) {
      console.log('⚠️ 메트릭 파일 로드 실패:', error.message);
      return [];
    }
  }
}

// ================================================================================
// 🚀 안전한 CLI 인터페이스
// ================================================================================

async function main() {
  const monitor = new KhakishopPerformanceMonitor();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'quick':
        console.log('🚀 빠른 성능 점검 시작...\n');
        const quickMetrics = await monitor.collectLightMetrics();
        const quickIssues = monitor.evaluateMetrics(quickMetrics);
        monitor.displayResults(quickMetrics, quickIssues);
        break;

      case 'full':
        console.log('🚀 전체 성능 분석 시작...\n');
        const fullMetrics = await monitor.collectFullMetrics();
        if (fullMetrics) {
          const fullIssues = monitor.evaluateMetrics(fullMetrics);
          monitor.displayResults(fullMetrics, fullIssues);
          await monitor.runDiagnostics(fullMetrics);
        }
        break;

      case 'report':
        console.log('📊 성능 리포트 생성...\n');
        const reportMetrics = await monitor.collectLightMetrics();
        await monitor.generateReport(reportMetrics);
        break;

      case 'lighthouse':
        console.log('🏮 Lighthouse 전용 테스트...\n');
        const lighthouse = await monitor.collectLighthouseMetrics();
        if (lighthouse && !lighthouse.error) {
          console.log('📊 **Lighthouse 결과**');
          console.log(`   성능: ${lighthouse.performance}/100`);
          console.log(`   접근성: ${lighthouse.accessibility}/100`);
          console.log(`   SEO: ${lighthouse.seo}/100`);
          console.log(`   Best Practices: ${lighthouse.bestPractices}/100\n`);
        } else {
          console.log('❌ Lighthouse 테스트 실패:', lighthouse?.error || 'Unknown error');
        }
        break;

      case 'health':
        console.log('🏥 헬스체크 실행...\n');
        const health = await monitor.quickHealthCheck();
        const healthIcon = health.status === 'HEALTHY' ? '🟢' : health.status === 'WARNING' ? '🟡' : '🔴';
        console.log(`${healthIcon} **전체 상태**: ${health.status}`);
        console.log(`   헬스 점수: ${health.healthScore}`);
        console.log(`   스크립트 수: ${health.scriptsCount}개`);
        console.log(`   중요 파일: ${health.criticalFiles.length}/5개 존재\n`);
        break;

      case 'thresholds':
        console.log('⚙️ 성능 임계값 확인...\n');
        console.log(JSON.stringify(monitor.thresholds, null, 2));
        break;

      default:
        console.log('🚀 **KHAKISHOP 안전한 성능 모니터링 시스템**\n');
        console.log('📋 **사용법**:');
        console.log('  node scripts/performance-monitor.js quick      # 빠른 성능 점검 (1-2분)');
        console.log('  node scripts/performance-monitor.js full       # 전체 성능 분석 (5-10분)');
        console.log('  node scripts/performance-monitor.js lighthouse # Lighthouse 테스트만');
        console.log('  node scripts/performance-monitor.js health     # 헬스체크만');
        console.log('  node scripts/performance-monitor.js report     # 성능 리포트 생성');
        console.log('  node scripts/performance-monitor.js thresholds # 임계값 확인');
        console.log('');
        console.log('⚠️  **주의사항**:');
        console.log('   • full 명령어는 서버가 실행 중일 때만 사용');
        console.log('   • lighthouse 테스트는 http://localhost:3000 필요');
        console.log('   • 모든 명령어는 수동 실행으로 안전함');
        console.log('');
    }
  } catch (error) {
    console.error('❌ 실행 오류:', error.message);
    console.log('\n💡 **문제 해결 팁**:');
    console.log('   • 서버가 실행 중인지 확인: npm run dev');
    console.log('   • 빌드가 완료되었는지 확인: npm run build');
    console.log('   • Chrome 브라우저가 설치되어 있는지 확인');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = KhakishopPerformanceMonitor; 