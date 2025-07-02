#!/usr/bin/env node

/**
 * 🎯 KHAKISHOP 프로젝트 실시간 상태 추적 대시보드
 * 현재 작업 상태를 실시간으로 모니터링하고 우선순위를 관리합니다.
 */

const fs = require('fs');
const path = require('path');

class KhakishopStatusTracker {
  constructor() {
    this.statusFile = path.join(__dirname, 'project-status-tracker.json');
    this.loadStatus();
  }

  loadStatus() {
    try {
      const data = fs.readFileSync(this.statusFile, 'utf8');
      this.status = JSON.parse(data);
    } catch (error) {
      console.error('❌ 상태 파일 로드 실패:', error.message);
      process.exit(1);
    }
  }

  saveStatus() {
    try {
      this.status.projectInfo.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.statusFile, JSON.stringify(this.status, null, 2));
      console.log('✅ 상태 저장 완료');
    } catch (error) {
      console.error('❌ 상태 저장 실패:', error.message);
    }
  }

  displayDashboard() {
    console.clear();
    console.log('🎯 ====== KHAKISHOP 프로젝트 실시간 상태 대시보드 ======\n');

    this.displayProjectInfo();
    this.displaySystemStatus();
    this.displayCompletedSystems();
    this.displayInProgressSystems();
    this.displayCriticalIssues();
    this.displayNextTasks();
    this.displayQuickActions();
  }

  displayProjectInfo() {
    const info = this.status.projectInfo;
    console.log('📊 **프로젝트 정보**');
    console.log(`   프로젝트: ${info.name} v${info.version}`);
    console.log(`   총 코드라인: ${info.totalLines.toLocaleString()}줄`);
    console.log(`   상태: ${this.getStatusIcon(info.status)} ${info.status}`);
    console.log(`   최종 업데이트: ${new Date(info.lastUpdated).toLocaleString('ko-KR')}\n`);
  }

  displaySystemStatus() {
    const status = this.status.systemStatus;
    console.log('🏥 **시스템 상태**');
    console.log(`   헬스체크: ${this.getStatusIcon(status.healthCheck)} ${status.healthCheck}`);
    console.log(`   빌드: ${this.getStatusIcon(status.buildStatus)} ${status.buildStatus}`);
    console.log(`   테스트: ${this.getStatusIcon(status.testStatus)} ${status.testStatus}`);
    console.log(`   배포준비: ${this.getStatusIcon(status.deployment)} ${status.deployment}`);
    console.log(`   ⚠️  Critical Issues: ${status.criticalIssues}개`);
    console.log(`   🟡 Warnings: ${status.warnings}개\n`);
  }

  displayCompletedSystems() {
    console.log('✅ **완성된 시스템 (100%)**');
    Object.entries(this.status.completedSystems).forEach(([key, system]) => {
      console.log(`   🟢 ${this.getSystemName(key)}: ${system.completionRate}% (${system.status})`);
      if (system.features) {
        console.log(`      • ${system.features.slice(0, 2).join(', ')}...`);
      }
    });
    console.log('');
  }

  displayInProgressSystems() {
    console.log('🚧 **진행 중인 작업**');
    Object.entries(this.status.inProgressSystems).forEach(([key, system]) => {
      const priority = this.getPriorityIcon(system.priority);
      console.log(`   ${priority} ${this.getSystemName(key)}: ${system.completionRate}% (${system.estimatedTime}, ${system.difficulty})`);
      
      if (system.components) {
        Object.entries(system.components).forEach(([compKey, comp]) => {
          console.log(`      📁 ${compKey}: ${comp.completionRate}%`);
        });
      }
      
      if (system.blockers && system.blockers.length > 0) {
        console.log(`      🚫 Blockers: ${system.blockers.join(', ')}`);
      }
    });
    console.log('');
  }

  displayCriticalIssues() {
    console.log('🚨 **긴급 해결 필요**');
    Object.entries(this.status.criticalIssues).forEach(([key, issue]) => {
      const priorityIcon = this.getPriorityIcon(issue.priority === 'CRITICAL' ? 1 : issue.priority === 'HIGH' ? 2 : 3);
      console.log(`   ${priorityIcon} ${issue.description}`);
      console.log(`      ⏱️  ${issue.estimatedTime} | 🎯 ${issue.difficulty} | 💡 ${issue.solution}`);
      if (issue.command) {
        console.log(`      🔧 Command: ${issue.command}`);
      }
    });
    console.log('');
  }

  displayNextTasks() {
    console.log('📋 **다음 작업 우선순위**');
    Object.entries(this.status.nextTasks).forEach(([key, task]) => {
      const priority = key.replace('priority', '');
      console.log(`   ${priority}순위: ${task.task}`);
      console.log(`           ⏱️  ${task.estimatedTime} | 🎯 ${task.difficulty}`);
      console.log(`           📈 Impact: ${task.impact}`);
    });
    console.log('');
  }

  displayQuickActions() {
    console.log('⚡ **즉시 실행 가능한 명령어**');
    console.log('   npm run health-check      # 시스템 상태 확인');
    console.log('   npm run auto-diagnose     # 자동 진단 실행');
    console.log('   npm run auto-generate-all-images  # 이미지 자동 생성');
    console.log('   node status-dashboard.js  # 이 대시보드 새로고침');
    console.log('   npm run dev               # 개발 서버 시작\n');
  }

  getStatusIcon(status) {
    const icons = {
      'PRODUCTION_READY': '🟢',
      'PASS': '✅',
      'SUCCESS': '✅',
      'READY': '🚀',
      'IN_PROGRESS': '🟡',
      'CRITICAL': '🔴',
      'HIGH': '🟠',
      'LOW': '🟡'
    };
    return icons[status] || '⚫';
  }

  getPriorityIcon(priority) {
    const icons = {
      1: '🔴 P1',
      2: '🟠 P2', 
      3: '🟡 P3',
      4: '🔵 P4',
      5: '🟢 P5'
    };
    return icons[priority] || `P${priority}`;
  }

  getSystemName(key) {
    const names = {
      'jwtAuthentication': 'JWT 인증 시스템',
      'imageManagement': '이미지 관리 시스템',
      'routingSystem': '라우팅 시스템',
      'adminComponents': '어드민 컴포넌트',
      'npmScripts': 'NPM 스크립트',
      'contentManagement': '콘텐츠 관리 (CMS)',
      'seoManagement': 'SEO 관리',
      'productManagement': '제품 관리'
    };
    return names[key] || key;
  }

  updateTaskStatus(taskKey, newStatus, newCompletionRate = null) {
    if (this.status.inProgressSystems[taskKey]) {
      this.status.inProgressSystems[taskKey].status = newStatus;
      if (newCompletionRate !== null) {
        this.status.inProgressSystems[taskKey].completionRate = newCompletionRate;
      }
      this.saveStatus();
      console.log(`✅ ${taskKey} 상태 업데이트: ${newStatus} (${newCompletionRate || ''}%)`);
    }
  }

  addCriticalIssue(key, issue) {
    this.status.criticalIssues[key] = issue;
    this.status.systemStatus.criticalIssues = Object.keys(this.status.criticalIssues).length;
    this.saveStatus();
    console.log(`🚨 새로운 Critical Issue 추가: ${key}`);
  }

  resolveCriticalIssue(key) {
    if (this.status.criticalIssues[key]) {
      delete this.status.criticalIssues[key];
      this.status.systemStatus.criticalIssues = Object.keys(this.status.criticalIssues).length;
      this.saveStatus();
      console.log(`✅ Critical Issue 해결: ${key}`);
    }
  }

  generateProgressReport() {
    const totalSystems = Object.keys(this.status.completedSystems).length + 
                        Object.keys(this.status.inProgressSystems).length;
    const completedSystems = Object.keys(this.status.completedSystems).length;
    const overallProgress = Math.round((completedSystems / totalSystems) * 100);

    console.log('\n📈 **전체 진행률 리포트**');
    console.log(`   전체 시스템: ${totalSystems}개`);
    console.log(`   완성된 시스템: ${completedSystems}개`);
    console.log(`   전체 진행률: ${overallProgress}%`);
    
    // 진행률 바 표시
    const progressBar = '█'.repeat(Math.floor(overallProgress / 5)) + 
                       '░'.repeat(20 - Math.floor(overallProgress / 5));
    console.log(`   [${progressBar}] ${overallProgress}%\n`);
  }

  runHealthCheck() {
    console.log('🔍 시스템 헬스체크 실행 중...\n');
    
    // 파일 존재 확인
    const criticalFiles = [
      'khakishop-web/src/middleware.ts',
      'khakishop-web/src/lib/auth-utils.ts',
      'khakishop-web/package.json',
      'khakishop-web/src/app/[locale]/page.tsx'
    ];

    criticalFiles.forEach(file => {
      const exists = fs.existsSync(file);
      console.log(`${exists ? '✅' : '❌'} ${file}`);
    });

    console.log('\n📊 프로젝트 통계:');
    console.log(`   📁 총 라인 수: ${this.status.projectInfo.totalLines.toLocaleString()}`);
    console.log(`   🎯 완성도: ${this.calculateOverallProgress()}%`);
    console.log(`   🚨 해결 필요 이슈: ${this.status.systemStatus.criticalIssues}개`);
  }

  calculateOverallProgress() {
    const systems = {...this.status.completedSystems, ...this.status.inProgressSystems};
    const totalProgress = Object.values(systems).reduce((sum, system) => {
      return sum + (system.completionRate || 0);
    }, 0);
    return Math.round(totalProgress / Object.values(systems).length);
  }

  startRealTimeMonitoring() {
    console.log('🔄 실시간 모니터링 시작...\n');
    
    const monitor = () => {
      this.displayDashboard();
      this.generateProgressReport();
    };

    // 초기 표시
    monitor();

    // 30초마다 업데이트
    setInterval(() => {
      console.log('\n🔄 상태 업데이트...');
      this.loadStatus();
      monitor();
    }, 30000);
  }
}

// CLI 인터페이스
const command = process.argv[2];
const tracker = new KhakishopStatusTracker();

switch (command) {
  case 'dashboard':
  case undefined:
    tracker.displayDashboard();
    tracker.generateProgressReport();
    break;
    
  case 'monitor':
    tracker.startRealTimeMonitoring();
    break;
    
  case 'health':
    tracker.runHealthCheck();
    break;
    
  case 'update':
    const [, , , taskKey, status, completionRate] = process.argv;
    if (taskKey && status) {
      tracker.updateTaskStatus(taskKey, status, completionRate ? parseInt(completionRate) : null);
    } else {
      console.log('사용법: node status-dashboard.js update <taskKey> <status> [completionRate]');
    }
    break;
    
  case 'resolve':
    const [, , , issueKey] = process.argv;
    if (issueKey) {
      tracker.resolveCriticalIssue(issueKey);
    } else {
      console.log('사용법: node status-dashboard.js resolve <issueKey>');
    }
    break;
    
  default:
    console.log('🎯 KHAKISHOP 상태 추적 시스템');
    console.log('');
    console.log('사용법:');
    console.log('  node status-dashboard.js [dashboard]  # 대시보드 표시 (기본)');
    console.log('  node status-dashboard.js monitor      # 실시간 모니터링');
    console.log('  node status-dashboard.js health       # 헬스체크');
    console.log('  node status-dashboard.js update <task> <status> [rate]  # 상태 업데이트');
    console.log('  node status-dashboard.js resolve <issue>  # 이슈 해결');
    console.log('');
} 