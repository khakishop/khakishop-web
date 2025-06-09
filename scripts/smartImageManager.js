// ================================================================================
// 🧠 KHAKISHOP 스마트 이미지 매니저
// ================================================================================
// 🎯 목적: 이미지 교체/추가 자동 감지 및 처리
// 🔧 기능: YAML 설정 + JSON 상태 연동, 스마트 매핑

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

// 색상 정의
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

class SmartImageManager {
  constructor() {
    this.configFile = path.join(__dirname, 'imageConfig.yml');
    this.statusFile = path.join(__dirname, 'imageStatus.json');
    this.legacyMapping = path.join(__dirname, 'imageMapping.json'); // 호환성
    
    this.config = null;
    this.status = null;
    
    this.loadConfiguration();
  }

  // ================================================================================
  // 📁 설정 및 상태 로드
  // ================================================================================
  
  loadConfiguration() {
    try {
      // YAML 설정 로드
      if (fs.existsSync(this.configFile)) {
        const yamlContent = fs.readFileSync(this.configFile, 'utf8');
        this.config = yaml.load(yamlContent);
        console.log(`${colors.green}✅ YAML 설정 로드 완료${colors.reset}`);
      } else {
        throw new Error('imageConfig.yml 파일이 없습니다.');
      }

      // JSON 상태 로드
      if (fs.existsSync(this.statusFile)) {
        this.status = JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
        console.log(`${colors.green}✅ 상태 파일 로드 완료${colors.reset}`);
      } else {
        this.initializeStatus();
      }

    } catch (error) {
      console.error(`${colors.red}❌ 설정 로드 실패: ${error.message}${colors.reset}`);
      process.exit(1);
    }
  }

  initializeStatus() {
    this.status = {
      metadata: {
        title: "KHAKISHOP 이미지 상태 추적",
        version: "2.0",
        lastScan: new Date().toISOString(),
        totalSlots: 148,
        assignedSlots: 0,
        pendingSlots: 0,
        errorSlots: 0
      },
      status: {},
      pending: {},
      errors: {},
      changelog: []
    };
    this.saveStatus();
  }

  saveStatus() {
    fs.writeFileSync(this.statusFile, JSON.stringify(this.status, null, 2));
  }

  // ================================================================================
  // 🔍 파일 감지 및 분석
  // ================================================================================

  async scanMidjourneyFolder() {
    const sourceDir = this.config.metadata.baseSource;
    console.log(`\n${colors.cyan}🔍 Midjourney 폴더 스캔 시작: ${sourceDir}${colors.reset}`);

    try {
      const files = fs.readdirSync(sourceDir)
        .filter(file => file.endsWith('.png'))
        .sort((a, b) => {
          const numA = parseInt(a.replace('.png', ''));
          const numB = parseInt(b.replace('.png', ''));
          return numA - numB;
        });

      console.log(`${colors.blue}📊 발견된 PNG 파일: ${files.length}개${colors.reset}`);

      const changes = {
        new: [],
        modified: [],
        missing: []
      };

      // 기존 파일 체크 (교체 감지)
      for (let i = 1; i <= 148; i++) {
        const fileName = `${i}.png`;
        const filePath = path.join(sourceDir, fileName);
        
        if (fs.existsSync(filePath)) {
          const fileHash = this.calculateFileHash(filePath);
          const existingStatus = this.status.status[i.toString()];
          
          if (existingStatus && existingStatus.md5Hash !== fileHash) {
            changes.modified.push({
              slot: i,
              file: fileName,
              oldHash: existingStatus.md5Hash,
              newHash: fileHash
            });
          }
        } else if (this.status.status[i.toString()]) {
          changes.missing.push(i);
        }
      }

      // 신규 파일 체크 (149번 이상)
      const newFiles = files.filter(file => {
        const num = parseInt(file.replace('.png', ''));
        return num > 148;
      });

      for (const file of newFiles) {
        const num = parseInt(file.replace('.png', ''));
        changes.new.push({
          slot: num,
          file: file,
          size: this.getFileSize(path.join(sourceDir, file))
        });
      }

      return changes;

    } catch (error) {
      console.error(`${colors.red}❌ 폴더 스캔 실패: ${error.message}${colors.reset}`);
      return null;
    }
  }

  calculateFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  }

  getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(1) + 'MB';
  }

  // ================================================================================
  // 🔄 자동 처리 엔진
  // ================================================================================

  async processChanges(changes) {
    console.log(`\n${colors.bright}${colors.magenta}🔄 변경사항 처리 시작${colors.reset}`);

    // 1. 교체된 이미지 처리
    for (const modified of changes.modified) {
      await this.processImageReplacement(modified);
    }

    // 2. 신규 이미지 처리  
    for (const newImg of changes.new) {
      await this.processNewImage(newImg);
    }

    // 3. 누락 이미지 처리
    for (const missing of changes.missing) {
      await this.processMissingImage(missing);
    }

    this.updateScanTimestamp();
    this.saveStatus();
  }

  async processImageReplacement(modified) {
    console.log(`${colors.yellow}🔄 이미지 교체 처리: ${modified.file}${colors.reset}`);
    
    try {
      // 기존 매핑 정보 가져오기
      const existingStatus = this.status.status[modified.slot.toString()];
      
      if (existingStatus) {
        // 동일한 위치에 새 이미지 처리
        const sourceFile = path.join(this.config.metadata.baseSource, modified.file);
        const targetFile = path.join(this.config.metadata.targetBase, existingStatus.targetPath);
        
        await this.convertAndProcess(sourceFile, targetFile, existingStatus);
        
        // 상태 업데이트
        this.status.status[modified.slot.toString()] = {
          ...existingStatus,
          lastProcessed: new Date().toISOString(),
          md5Hash: modified.newHash,
          fileSize: this.getFileSize(sourceFile)
        };

        this.addToChangelog('image_replaced', `${modified.file} 교체 완료 → ${existingStatus.targetPath}`);
        console.log(`${colors.green}✅ 교체 완료: ${modified.file}${colors.reset}`);
      }
      
    } catch (error) {
      console.error(`${colors.red}❌ 교체 실패: ${modified.file} - ${error.message}${colors.reset}`);
      this.addToErrors(modified.slot, 'replacement_failed', error.message);
    }
  }

  async processNewImage(newImg) {
    console.log(`${colors.cyan}➕ 신규 이미지 처리: ${newImg.file}${colors.reset}`);
    
    // 자동 카테고리 추론
    const suggestedCategory = this.suggestCategory(newImg.slot);
    const suggestedPath = this.suggestPath(newImg.slot, suggestedCategory);
    
    // 대기 목록에 추가
    this.status.pending[newImg.slot.toString()] = {
      sourceFile: newImg.file,
      status: "pending_assignment",
      detectedAt: new Date().toISOString(),
      fileSize: newImg.size,
      suggestedCategory: suggestedCategory,
      suggestedPath: suggestedPath,
      requiresManualReview: true
    };

    this.status.metadata.pendingSlots++;
    this.addToChangelog('new_image_detected', `${newImg.file} 신규 이미지 감지 (추천: ${suggestedCategory})`);
    
    console.log(`${colors.yellow}⏳ 대기 목록 추가: ${newImg.file} → ${suggestedCategory}${colors.reset}`);
  }

  suggestCategory(slotNumber) {
    if (slotNumber <= 200) {
      return 'gallery';
    } else if (slotNumber <= 250) {
      return 'blog';
    } else {
      return 'future';
    }
  }

  suggestPath(slotNumber, category) {
    const index = slotNumber - 148;
    return `${category}/${category}-${index.toString().padStart(3, '0')}.jpg`;
  }

  // ================================================================================
  // 🔧 유틸리티 함수들
  // ================================================================================

  async convertAndProcess(sourceFile, targetFile, metadata) {
    // 폴더 생성
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // PNG → JPG 변환 
    const convertCmd = `convert "${sourceFile}" -quality 95 "${targetFile}"`;
    execSync(convertCmd, { stdio: 'pipe' });

    // 메타데이터 삽입
    const description = metadata.description || 'KHAKISHOP 이미지';
    const metadataCmd = `exiftool -overwrite_original -Artist="By khaki shop" -ImageDescription="${description}" -Software="khakishop.com" "${targetFile}"`;
    execSync(metadataCmd, { stdio: 'pipe' });
  }

  addToChangelog(action, details) {
    this.status.changelog.unshift({
      timestamp: new Date().toISOString(),
      action: action,
      details: details
    });

    // 최근 100개만 유지
    if (this.status.changelog.length > 100) {
      this.status.changelog = this.status.changelog.slice(0, 100);
    }
  }

  addToErrors(slot, errorType, details) {
    this.status.errors[slot.toString()] = {
      error: errorType,
      details: details,
      timestamp: new Date().toISOString(),
      requiresAttention: true
    };
    this.status.metadata.errorSlots++;
  }

  updateScanTimestamp() {
    this.status.metadata.lastScan = new Date().toISOString();
  }

  // ================================================================================
  // 📊 상태 리포트
  // ================================================================================

  generateReport() {
    console.log(`\n${colors.bright}${colors.blue}📊 KHAKISHOP 이미지 관리 상태 리포트${colors.reset}`);
    console.log('================================================================================');
    
    const meta = this.status.metadata;
    console.log(`📅 마지막 스캔: ${new Date(meta.lastScan).toLocaleString()}`);
    console.log(`📊 할당된 슬롯: ${meta.assignedSlots}/${meta.totalSlots}`);
    console.log(`⏳ 대기 중: ${meta.pendingSlots}개`);
    console.log(`❌ 오류: ${meta.errorSlots}개`);
    
    if (meta.pendingSlots > 0) {
      console.log(`\n${colors.yellow}⏳ 대기 중인 이미지:${colors.reset}`);
      Object.entries(this.status.pending).forEach(([slot, info]) => {
        console.log(`   ${slot}. ${info.sourceFile} → ${info.suggestedCategory} (${info.fileSize})`);
      });
    }

    if (meta.errorSlots > 0) {
      console.log(`\n${colors.red}❌ 오류가 있는 이미지:${colors.reset}`);
      Object.entries(this.status.errors).forEach(([slot, error]) => {
        console.log(`   ${slot}. ${error.error}: ${error.details}`);
      });
    }

    console.log(`\n${colors.green}💡 다음 단계:${colors.reset}`);
    if (meta.pendingSlots > 0) {
      console.log(`   1. npm run assign-pending - 대기 이미지 수동 할당`);
    }
    if (meta.errorSlots > 0) {
      console.log(`   2. npm run fix-errors - 오류 이미지 수정`);
    }
    console.log(`   3. npm run smart-scan - 스마트 스캔 재실행`);
  }

  // ================================================================================
  // 🚀 메인 실행 함수
  // ================================================================================

  async run() {
    console.log(`${colors.bright}${colors.magenta}🧠 KHAKISHOP 스마트 이미지 매니저 시작${colors.reset}`);
    console.log('================================================================================\n');

    try {
      // 1. 폴더 스캔
      const changes = await this.scanMidjourneyFolder();
      
      if (!changes) {
        console.log(`${colors.red}❌ 스캔 실패${colors.reset}`);
        return;
      }

      // 2. 변경사항 확인
      const totalChanges = changes.new.length + changes.modified.length + changes.missing.length;
      
      if (totalChanges === 0) {
        console.log(`${colors.green}✅ 변경사항 없음 - 모든 이미지가 최신 상태입니다.${colors.reset}`);
      } else {
        console.log(`${colors.yellow}📋 감지된 변경사항:${colors.reset}`);
        console.log(`   • 신규: ${changes.new.length}개`);
        console.log(`   • 교체: ${changes.modified.length}개`);
        console.log(`   • 누락: ${changes.missing.length}개`);

        // 3. 자동 처리
        await this.processChanges(changes);
      }

      // 4. 리포트 생성
      this.generateReport();

    } catch (error) {
      console.error(`${colors.red}❌ 처리 중 오류: ${error.message}${colors.reset}`);
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  const manager = new SmartImageManager();
  manager.run().catch(console.error);
}

module.exports = SmartImageManager; 