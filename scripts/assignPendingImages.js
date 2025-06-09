// ================================================================================
// 🎯 KHAKISHOP 대기 이미지 할당 도구
// ================================================================================
// 🚀 목적: 신규 이미지를 적절한 위치에 수동 할당
// 🎨 기능: 인터랙티브 UI, 자동 추천, 즉시 처리

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const SmartImageManager = require('./smartImageManager');

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

class PendingImageAssigner {
  constructor() {
    this.manager = new SmartImageManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // ================================================================================
  // 🎯 카테고리 옵션 정의
  // ================================================================================

  getCategoryOptions() {
    return {
      'hero': {
        name: '브랜드 히어로',
        description: '메인 페이지 최상단 브랜드 이미지',
        slots: ['hero-desktop-alt-2', 'hero-tablet', 'hero-wide'],
        priority: 1
      },
      'landing': {
        name: '랜딩 페이지',
        description: '랜딩 페이지 섹션 배경',
        slots: ['services-bg', 'testimonials-bg', 'cta-background'],
        priority: 1
      },
      'collections': {
        name: '컬렉션 추가',
        description: '신규 제품 컬렉션',
        slots: ['seasonal-spring-2', 'premium-collection', 'limited-edition'],
        priority: 2
      },
      'gallery': {
        name: '갤러리 확장',
        description: '갤러리 그리드 및 쇼케이스',
        slots: ['gallery-grid-', 'showcase-', 'featured-'],
        priority: 3
      },
      'products': {
        name: '제품 추가',
        description: '신규 제품 상세 이미지',
        slots: ['new-curtain-', 'new-blind-', 'new-motorized-'],
        priority: 3
      },
      'blog': {
        name: '블로그 컨텐츠',
        description: '블로그 포스트 배경',
        slots: ['article-', 'guide-', 'news-'],
        priority: 3
      },
      'references': {
        name: '시공 사례 추가',
        description: '신규 프로젝트 포트폴리오',
        slots: ['project-', 'case-study-', 'portfolio-'],
        priority: 2
      },
      'about': {
        name: '회사 소개 확장',
        description: '팀, 공간, 프로세스 이미지',
        slots: ['team-', 'office-', 'process-'],
        priority: 3
      },
      'future': {
        name: '미래 확장용',
        description: '향후 기능을 위한 예비',
        slots: ['future-', 'reserve-', 'upcoming-'],
        priority: 3
      }
    };
  }

  // ================================================================================
  // 🎨 사용자 인터페이스
  // ================================================================================

  async showPendingImages() {
    const pending = this.manager.status.pending;
    const pendingEntries = Object.entries(pending);

    if (pendingEntries.length === 0) {
      console.log(`${colors.green}✅ 대기 중인 이미지가 없습니다!${colors.reset}`);
      this.rl.close();
      return;
    }

    console.log(`\n${colors.bright}${colors.cyan}📋 대기 중인 이미지 할당${colors.reset}`);
    console.log('================================================================================');
    
    for (let i = 0; i < pendingEntries.length; i++) {
      const [slot, info] = pendingEntries[i];
      console.log(`\n${colors.yellow}${i + 1}. ${info.sourceFile}${colors.reset}`);
      console.log(`   📁 슬롯 번호: ${slot}`);
      console.log(`   📏 파일 크기: ${info.fileSize}`);
      console.log(`   🎯 추천 카테고리: ${info.suggestedCategory}`);
      console.log(`   📅 감지 시간: ${new Date(info.detectedAt).toLocaleString()}`);
      
      await this.assignSingleImage(slot, info);
    }

    this.rl.close();
  }

  async assignSingleImage(slot, imageInfo) {
    console.log(`\n${colors.bright}🎯 ${imageInfo.sourceFile} 할당 옵션:${colors.reset}`);
    
    const categories = this.getCategoryOptions();
    const categoryEntries = Object.entries(categories);

    // 카테고리 옵션 표시
    categoryEntries.forEach(([key, category], index) => {
      const priorityIcon = category.priority === 1 ? '🔥' : category.priority === 2 ? '⭐' : '🌟';
      console.log(`   ${index + 1}. ${priorityIcon} ${category.name}`);
      console.log(`      ${colors.blue}${category.description}${colors.reset}`);
    });

    console.log(`   ${categoryEntries.length + 1}. ⏭️  나중에 할당`);
    console.log(`   ${categoryEntries.length + 2}. ❌ 건너뛰기`);

    const choice = await this.askQuestion(`\n선택하세요 (1-${categoryEntries.length + 2}): `);
    const choiceNum = parseInt(choice);

    if (choiceNum >= 1 && choiceNum <= categoryEntries.length) {
      const selectedCategory = categoryEntries[choiceNum - 1];
      await this.processAssignment(slot, imageInfo, selectedCategory);
    } else if (choiceNum === categoryEntries.length + 1) {
      console.log(`${colors.yellow}⏭️  ${imageInfo.sourceFile} 나중에 할당하도록 유지합니다.${colors.reset}`);
    } else if (choiceNum === categoryEntries.length + 2) {
      await this.skipImage(slot, imageInfo);
    } else {
      console.log(`${colors.red}❌ 잘못된 선택입니다.${colors.reset}`);
      await this.assignSingleImage(slot, imageInfo); // 재시도
    }
  }

  async processAssignment(slot, imageInfo, [categoryKey, categoryInfo]) {
    console.log(`\n${colors.cyan}🎨 ${categoryInfo.name} 카테고리 세부 옵션:${colors.reset}`);
    
    // 사용 가능한 슬롯 표시
    const availableSlots = this.generateSlotOptions(categoryKey, categoryInfo);
    
    availableSlots.forEach((slotOption, index) => {
      console.log(`   ${index + 1}. ${slotOption.path}`);
      console.log(`      ${colors.blue}${slotOption.description}${colors.reset}`);
    });

    console.log(`   ${availableSlots.length + 1}. 🔧 커스텀 경로 입력`);

    const slotChoice = await this.askQuestion(`\n세부 위치 선택 (1-${availableSlots.length + 1}): `);
    const slotNum = parseInt(slotChoice);

    if (slotNum >= 1 && slotNum <= availableSlots.length) {
      const selectedSlot = availableSlots[slotNum - 1];
      await this.finalizeAssignment(slot, imageInfo, categoryKey, selectedSlot);
    } else if (slotNum === availableSlots.length + 1) {
      await this.customPathAssignment(slot, imageInfo, categoryKey);
    } else {
      console.log(`${colors.red}❌ 잘못된 선택입니다.${colors.reset}`);
      await this.processAssignment(slot, imageInfo, [categoryKey, categoryInfo]);
    }
  }

  generateSlotOptions(categoryKey, categoryInfo) {
    const slotNumber = parseInt(Object.keys(this.manager.status.pending)[0]) || 149;
    const index = slotNumber - 148;

    switch (categoryKey) {
      case 'gallery':
        return [
          {
            path: `gallery/gallery-grid-${12 + index}.jpg`,
            description: `갤러리 그리드 ${12 + index}번`
          },
          {
            path: `gallery/featured-collection-${index}.jpg`,
            description: `특별 컬렉션 ${index}번`
          },
          {
            path: `gallery/trending-${index}.jpg`,
            description: `트렌딩 스타일 ${index}번`
          }
        ];
      
      case 'products':
        return [
          {
            path: `products/new-arrivals/product-${index}.jpg`,
            description: `신상품 ${index}번`
          },
          {
            path: `products/curtain/premium-${index}/main.jpg`,
            description: `프리미엄 커튼 ${index}번 메인`
          },
          {
            path: `products/blind/modern-${index}/main.jpg`,
            description: `모던 블라인드 ${index}번 메인`
          }
        ];

      case 'blog':
        return [
          {
            path: `blog/trends-2024-${index}.jpg`,
            description: `2024 트렌드 ${index}편`
          },
          {
            path: `blog/how-to-${index}.jpg`,
            description: `하우투 가이드 ${index}편`
          },
          {
            path: `blog/inspiration-${index}.jpg`,
            description: `인스피레이션 ${index}편`
          }
        ];

      default:
        return [
          {
            path: `${categoryKey}/${categoryKey}-${index}.jpg`,
            description: `${categoryInfo.name} ${index}번`
          },
          {
            path: `${categoryKey}/additional-${index}.jpg`,
            description: `${categoryInfo.name} 추가 ${index}번`
          }
        ];
    }
  }

  async customPathAssignment(slot, imageInfo, categoryKey) {
    console.log(`\n${colors.cyan}🔧 커스텀 경로 입력:${colors.reset}`);
    console.log(`기본 경로: ${categoryKey}/`);
    console.log(`예시: my-custom-image.jpg`);
    
    const customPath = await this.askQuestion('파일명을 입력하세요: ');
    const fullPath = `${categoryKey}/${customPath}`;
    
    const description = await this.askQuestion('이미지 설명을 입력하세요: ');
    
    const selectedSlot = {
      path: fullPath,
      description: description || `커스텀 ${categoryKey} 이미지`
    };

    await this.finalizeAssignment(slot, imageInfo, categoryKey, selectedSlot);
  }

  async finalizeAssignment(slot, imageInfo, category, selectedSlot) {
    console.log(`\n${colors.bright}✅ 할당 확인:${colors.reset}`);
    console.log(`📁 소스: ${imageInfo.sourceFile}`);
    console.log(`📂 카테고리: ${category}`);
    console.log(`📄 대상: ${selectedSlot.path}`);
    console.log(`📝 설명: ${selectedSlot.description}`);

    const confirm = await this.askQuestion('\n할당을 확정하시겠습니까? (y/n): ');
    
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      await this.executeAssignment(slot, imageInfo, category, selectedSlot);
    } else {
      console.log(`${colors.yellow}🔄 할당이 취소되었습니다.${colors.reset}`);
    }
  }

  async executeAssignment(slot, imageInfo, category, selectedSlot) {
    try {
      // 1. 이미지 처리
      const sourceFile = path.join(this.manager.config.metadata.baseSource, imageInfo.sourceFile);
      const targetFile = path.join(this.manager.config.metadata.targetBase, selectedSlot.path);
      
      await this.manager.convertAndProcess(sourceFile, targetFile, {
        description: selectedSlot.description
      });

      // 2. 상태 업데이트
      this.manager.status.status[slot] = {
        sourceFile: imageInfo.sourceFile,
        targetPath: selectedSlot.path,
        status: "active",
        lastProcessed: new Date().toISOString(),
        fileSize: imageInfo.fileSize,
        md5Hash: this.manager.calculateFileHash(sourceFile),
        category: category,
        priority: 3, // 신규 이미지는 기본적으로 priority 3
        usage: selectedSlot.description,
        webPath: `/images/${selectedSlot.path}`
      };

      // 3. 대기 목록에서 제거
      delete this.manager.status.pending[slot];
      this.manager.status.metadata.pendingSlots--;
      this.manager.status.metadata.assignedSlots++;

      // 4. 변경 로그 추가
      this.manager.addToChangelog('manual_assignment', 
        `${imageInfo.sourceFile} → ${selectedSlot.path} (${category})`
      );

      // 5. 상태 저장
      this.manager.saveStatus();

      console.log(`${colors.green}🎉 할당 완료!${colors.reset}`);
      console.log(`   ✅ ${imageInfo.sourceFile} → ${selectedSlot.path}`);
      console.log(`   🌐 웹 경로: /images/${selectedSlot.path}`);

    } catch (error) {
      console.error(`${colors.red}❌ 할당 실패: ${error.message}${colors.reset}`);
      this.manager.addToErrors(slot, 'assignment_failed', error.message);
    }
  }

  async skipImage(slot, imageInfo) {
    const reason = await this.askQuestion('건너뛰는 이유를 입력하세요 (선택사항): ');
    
    // 에러 목록으로 이동
    this.manager.status.errors[slot] = {
      sourceFile: imageInfo.sourceFile,
      error: 'user_skipped',
      details: reason || '사용자가 수동으로 건너뜀',
      timestamp: new Date().toISOString(),
      requiresAttention: false
    };

    delete this.manager.status.pending[slot];
    this.manager.status.metadata.pendingSlots--;
    this.manager.status.metadata.errorSlots++;

    this.manager.addToChangelog('image_skipped', 
      `${imageInfo.sourceFile} 건너뜀: ${reason || '사용자 선택'}`
    );

    console.log(`${colors.yellow}⏭️  ${imageInfo.sourceFile}를 건너뛰었습니다.${colors.reset}`);
  }

  // ================================================================================
  // 🔧 유틸리티
  // ================================================================================

  askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  // ================================================================================
  // 🚀 메인 실행
  // ================================================================================

  async run() {
    console.log(`${colors.bright}${colors.magenta}🎯 KHAKISHOP 대기 이미지 할당 도구${colors.reset}`);
    console.log('================================================================================');

    try {
      await this.showPendingImages();
      
      // 최종 상태 저장
      this.manager.saveStatus();
      
      console.log(`\n${colors.green}✅ 할당 작업이 완료되었습니다!${colors.reset}`);
      console.log(`${colors.blue}💡 'npm run smart-scan'으로 전체 상태를 확인하세요.${colors.reset}`);

    } catch (error) {
      console.error(`${colors.red}❌ 할당 도구 오류: ${error.message}${colors.reset}`);
    } finally {
      this.rl.close();
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  const assigner = new PendingImageAssigner();
  assigner.run().catch(console.error);
}

module.exports = PendingImageAssigner; 