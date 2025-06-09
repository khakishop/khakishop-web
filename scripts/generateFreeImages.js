// ================================================================================
// 🎨 KHAKISHOP 무료 상업용 이미지 생성 시스템
// ================================================================================
// 🎯 목적: Unsplash API로 브랜드 맞춤 고품질 이미지 자동 수집
// 🏷️ 저작권: 100% 상업적 이용 가능 (Unsplash License)
// 🎨 스타일: RIGAS 모티브 + khakishop 감성

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

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

class FreeImageGenerator {
  constructor() {
    this.baseUrl = 'https://source.unsplash.com';
    this.targetDir = '/Users/kiholee/Projects/khakishop-web/public/images';
    this.brandKeywords = this.getBrandKeywords();
    this.imageSpecs = this.getImageSpecifications();
  }

  // ================================================================================
  // 🎨 브랜드 키워드 정의 (RIGAS + khakishop 감성)
  // ================================================================================
  
  getBrandKeywords() {
    return {
      // 🏠 인테리어 공간
      interior: [
        'minimal-living-room',
        'scandinavian-interior', 
        'modern-bedroom',
        'clean-kitchen',
        'natural-light-room',
        'white-interior',
        'cozy-home',
        'contemporary-space'
      ],
      
      // 🪟 커튼/블라인드 중심
      textiles: [
        'white-curtains',
        'linen-curtains',
        'window-blinds',
        'natural-fabric',
        'textile-texture',
        'soft-fabric',
        'window-treatment',
        'home-textiles'
      ],
      
      // 🌅 자연광/분위기
      lighting: [
        'natural-light',
        'afternoon-sun',
        'soft-lighting',
        'window-light',
        'bright-room',
        'sunlight-interior',
        'golden-hour-home',
        'warm-lighting'
      ],
      
      // 🎨 컬러/텍스처
      colors: [
        'neutral-colors',
        'beige-interior',
        'cream-colors',
        'earth-tones',
        'natural-materials',
        'wood-texture',
        'linen-texture',
        'minimalist-design'
      ],
      
      // 🏢 상업공간 (레퍼런스용)
      commercial: [
        'modern-office',
        'cafe-interior',
        'restaurant-design',
        'hotel-lobby',
        'retail-space',
        'gallery-space',
        'workspace-design',
        'commercial-interior'
      ]
    };
  }

  // ================================================================================
  // 📐 이미지 사양 정의
  // ================================================================================
  
  getImageSpecifications() {
    return {
      hero: {
        desktop: '1920x1080',
        mobile: '768x1024',
        tablet: '1024x768'
      },
      collection: {
        card: '600x400',
        banner: '1200x600'
      },
      product: {
        main: '800x800',
        gallery: '600x600',
        detail: '400x400'
      },
      reference: {
        main: '1000x600',
        gallery: '800x600'
      },
      blog: {
        header: '1200x400',
        thumbnail: '400x300'
      }
    };
  }

  // ================================================================================
  // 🔗 Unsplash URL 생성기
  // ================================================================================
  
  generateUnsplashUrl(keyword, width, height, quality = 95) {
    const size = `${width}x${height}`;
    return `${this.baseUrl}/${size}/?${keyword}&q=${quality}&fit=crop&crop=center`;
  }

  generateFeaturedUrl(width, height, featured = true) {
    const size = `${width}x${height}`;
    const featuredParam = featured ? '&featured=true' : '';
    return `${this.baseUrl}/${size}/?interior,home,modern${featuredParam}&q=95`;
  }

  // ================================================================================
  // 📥 이미지 다운로드 함수
  // ================================================================================
  
  async downloadImage(url, filepath, description) {
    return new Promise((resolve, reject) => {
      // 폴더 생성
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const file = fs.createWriteStream(filepath);
      
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            
            // 메타데이터 추가
            try {
              const metadataCmd = `exiftool -overwrite_original -Artist="khakishop.com" -ImageDescription="${description}" -Software="khakishop free image system" -Copyright="Unsplash License (Commercial Use)" "${filepath}"`;
              execSync(metadataCmd, { stdio: 'pipe' });
            } catch (error) {
              console.log(`${colors.yellow}⚠️  메타데이터 추가 실패 (이미지는 정상): ${filepath}${colors.reset}`);
            }
            
            console.log(`${colors.green}✅ 다운로드 완료: ${path.basename(filepath)}${colors.reset}`);
            resolve(filepath);
          });
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        }
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  // ================================================================================
  // 🏠 브랜드 이미지 세트 생성
  // ================================================================================
  
  async generateBrandImageSet() {
    console.log(`${colors.bright}${colors.magenta}🎨 KHAKISHOP 무료 상업용 이미지 생성 시작${colors.reset}`);
    console.log('================================================================================');
    console.log(`${colors.blue}📄 라이선스: Unsplash (완전 무료, 상업적 이용 가능)${colors.reset}`);
    console.log(`${colors.blue}🎯 브랜드: RIGAS 모티브 + khakishop 감성${colors.reset}`);
    console.log(`${colors.blue}🎨 스타일: 미니멀, 자연광, 중성톤, 텍스타일 중심${colors.reset}\n`);

    const imageQueue = [];

    // 1. 🔥 히어로 이미지들
    imageQueue.push({
      url: this.generateUnsplashUrl('minimal+living+room+natural+light', 1920, 1080),
      path: 'hero/hero-desktop.jpg',
      description: 'khakishop 메인 히어로 이미지 - 미니멀 거실 자연광'
    });

    imageQueue.push({
      url: this.generateUnsplashUrl('scandinavian+interior+curtains', 768, 1024),
      path: 'hero/hero-mobile.jpg', 
      description: 'khakishop 모바일 히어로 - 스칸디나비안 인테리어'
    });

    // 2. 🏠 랜딩 페이지 배경들
    imageQueue.push({
      url: this.generateUnsplashUrl('modern+home+afternoon+sunlight', 1920, 1080),
      path: 'landing/hero-main.jpg',
      description: 'khakishop 랜딩 메인 배경 - 모던 홈 오후 햇살'
    });

    imageQueue.push({
      url: this.generateUnsplashUrl('cozy+interior+linen+textiles', 1200, 600),
      path: 'landing/brand-lifestyle.jpg',
      description: 'khakishop 브랜드 라이프스타일 - 아늑한 린넨 인테리어'
    });

    // 3. 🎨 컬렉션 대표 이미지들
    const collections = [
      { key: 'white+linen+curtains+natural', name: 'essential-linen', desc: '에센셜 리넨 컬렉션' },
      { key: 'sheer+curtains+soft+light', name: 'modern-sheer', desc: '모던 셰어 시리즈' },
      { key: 'wooden+blinds+natural+texture', name: 'venetian-premium', desc: '프리미엄 베네치안 블라인드' },
      { key: 'natural+wood+window+treatment', name: 'wood-texture', desc: '우드 텍스처 블라인드' },
      { key: 'smart+home+automated+blinds', name: 'smart-automation', desc: '스마트 자동화 시스템' },
      { key: 'modern+motorized+window+system', name: 'wireless-motor', desc: '무선 모터 컬렉션' },
      { key: 'luxury+curtain+hardware+brass', name: 'designer-hardware', desc: '디자이너 하드웨어' },
      { key: 'elegant+curtain+tieback+design', name: 'luxury-tieback', desc: '럭셔리 타이백' }
    ];

    collections.forEach((collection, index) => {
      imageQueue.push({
        url: this.generateUnsplashUrl(collection.key, 600, 400),
        path: `collections/${collection.name}.jpg`,
        description: `khakishop ${collection.desc} 컬렉션 이미지`
      });
    });

    // 4. 🏢 레퍼런스 프로젝트들
    const references = [
      { key: 'modern+office+minimal+design', project: 'modern-office-gangnam', desc: '강남 모던 오피스' },
      { key: 'minimal+residential+interior', project: 'minimal-residence-bundang', desc: '분당 미니멀 레지던스' },
      { key: 'classic+cafe+interior+design', project: 'classic-cafe-hongdae', desc: '홍대 클래식 카페' },
      { key: 'contemporary+house+natural+light', project: 'contemporary-house-goyang', desc: '고양 컨템포러리 하우스' },
      { key: 'scandinavian+apartment+cozy', project: 'scandinavian-apartment-mapo', desc: '마포 스칸디나비안 아파트' }
    ];

    references.forEach(ref => {
      // 메인 이미지
      imageQueue.push({
        url: this.generateUnsplashUrl(ref.key, 1000, 600),
        path: `references/${ref.project}/main.jpg`,
        description: `khakishop ${ref.desc} 프로젝트 메인 이미지`
      });

      // 갤러리 이미지들
      for (let i = 1; i <= 3; i++) {
        imageQueue.push({
          url: this.generateUnsplashUrl(`${ref.key}+detail+view`, 800, 600),
          path: `references/${ref.project}/gallery-${i}.jpg`,
          description: `khakishop ${ref.desc} 갤러리 ${i}`
        });
      }
    });

    // 5. 🛍️ 제품 이미지들
    const products = [
      { key: 'sheer+curtain+white+elegant', category: 'curtain', name: 'sheer-curtain', desc: '셰어 커튼' },
      { key: 'classic+curtain+linen+natural', category: 'curtain', name: 'classic-curtain', desc: '클래식 커튼' },
      { key: 'wooden+blind+natural+texture', category: 'blind', name: 'wood-blind', desc: '우드 블라인드' },
      { key: 'aluminum+blind+modern+clean', category: 'blind', name: 'aluminum-blind', desc: '알루미늄 블라인드' },
      { key: 'motorized+curtain+system+smart', category: 'motorized', name: 'motorized-curtain-system', desc: '전동 커튼 시스템' }
    ];

    products.forEach(product => {
      // 메인 제품 이미지
      imageQueue.push({
        url: this.generateUnsplashUrl(product.key, 800, 800),
        path: `products/${product.category}/${product.name}/main.jpg`,
        description: `khakishop ${product.desc} 메인 제품 이미지`
      });

      // 디테일 이미지
      imageQueue.push({
        url: this.generateUnsplashUrl(`${product.key}+close+up+detail`, 600, 600),
        path: `products/${product.category}/${product.name}/detail.jpg`,
        description: `khakishop ${product.desc} 상세 이미지`
      });

      // 라이프스타일 이미지
      imageQueue.push({
        url: this.generateUnsplashUrl(`${product.key}+room+lifestyle`, 800, 600),
        path: `products/${product.category}/${product.name}/lifestyle.jpg`,
        description: `khakishop ${product.desc} 라이프스타일 이미지`
      });
    });

    // 6. 🖼️ 갤러리 이미지들
    for (let i = 1; i <= 12; i++) {
      const galleryKeywords = [
        'minimal+interior+inspiration',
        'scandinavian+home+design', 
        'natural+light+interior',
        'modern+textile+design',
        'cozy+living+space'
      ];
      
      const randomKeyword = galleryKeywords[i % galleryKeywords.length];
      
      imageQueue.push({
        url: this.generateUnsplashUrl(randomKeyword, 600, 400),
        path: `gallery/gallery-grid-${i}.jpg`,
        description: `khakishop 갤러리 쇼케이스 ${i}번`
      });
    }

    // 7. 📝 블로그/어바웃 이미지들
    const contentImages = [
      { key: 'interior+design+trends+2024', path: 'blog/design-trends-2024.jpg', desc: '2024 인테리어 디자인 트렌드' },
      { key: 'curtain+maintenance+care+tips', path: 'blog/maintenance-tips.jpg', desc: '커튼 관리 및 케어 팁' },
      { key: 'window+treatment+installation', path: 'blog/installation-guide.jpg', desc: '윈도우 트리트먼트 설치 가이드' },
      { key: 'khakishop+team+workspace', path: 'about/team-workspace.jpg', desc: 'khakishop 팀 워크스페이스' },
      { key: 'textile+manufacturing+process', path: 'about/manufacturing.jpg', desc: 'khakishop 제조 과정' }
    ];

    contentImages.forEach(content => {
      imageQueue.push({
        url: this.generateUnsplashUrl(content.key, 1200, 600),
        path: content.path,
        description: `khakishop ${content.desc}`
      });
    });

    return imageQueue;
  }

  // ================================================================================
  // 🚀 일괄 다운로드 실행
  // ================================================================================
  
  async downloadAllImages() {
    try {
      const imageQueue = await this.generateBrandImageSet();
      console.log(`${colors.cyan}📋 생성할 이미지: ${imageQueue.length}개${colors.reset}\n`);

      let downloaded = 0;
      let failed = 0;

      for (let i = 0; i < imageQueue.length; i++) {
        const image = imageQueue[i];
        const targetPath = path.join(this.targetDir, image.path);
        
        console.log(`${colors.yellow}[${i + 1}/${imageQueue.length}] ${image.path}${colors.reset}`);
        
        try {
          await this.downloadImage(image.url, targetPath, image.description);
          downloaded++;
          
          // 다운로드 간격 (Unsplash API 제한 고려)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.log(`${colors.red}❌ 실패: ${image.path} - ${error.message}${colors.reset}`);
          failed++;
        }
      }

      console.log(`\n${colors.bright}${colors.green}🎉 khakishop 무료 이미지 생성 완료!${colors.reset}`);
      console.log('================================================================================');
      console.log(`${colors.green}✅ 성공: ${downloaded}개${colors.reset}`);
      console.log(`${colors.red}❌ 실패: ${failed}개${colors.reset}`);
      console.log(`${colors.blue}📁 저장 위치: ${this.targetDir}${colors.reset}`);
      console.log(`${colors.magenta}🏷️  라이선스: Unsplash License (상업적 이용 100% 가능)${colors.reset}`);
      console.log(`${colors.cyan}🎨 브랜드 감성: RIGAS 모티브 + khakishop 미니멀 디자인${colors.reset}\n`);

      console.log(`${colors.bright}💡 다음 단계:${colors.reset}`);
      console.log(`   1. ${colors.green}npm run dev${colors.reset} - 웹사이트에서 새 이미지 확인`);
      console.log(`   2. 마음에 들지 않는 이미지가 있다면 개별 재다운로드`);
      console.log(`   3. 브랜드에 맞게 추가 커스터마이징`);

    } catch (error) {
      console.error(`${colors.red}❌ 이미지 생성 실패: ${error.message}${colors.reset}`);
    }
  }

  // ================================================================================
  // 🎯 개별 이미지 재생성
  // ================================================================================
  
  async regenerateSpecificImage(category, imageName, customKeyword = null) {
    console.log(`${colors.cyan}🔄 개별 이미지 재생성: ${category}/${imageName}${colors.reset}`);
    
    // 카테고리별 기본 키워드 매핑
    const categoryKeywords = {
      'hero': 'minimal+living+room+natural+light',
      'collections': 'modern+curtains+textile+design',
      'references': 'interior+design+professional+space',
      'products': 'home+textile+product+clean+background',
      'gallery': 'inspirational+interior+design',
      'blog': 'home+lifestyle+inspiration',
      'about': 'modern+workspace+team+environment'
    };

    const keyword = customKeyword || categoryKeywords[category] || 'minimal+interior+design';
    const specs = this.imageSpecs[category] || { main: '800x600' };
    const [width, height] = Object.values(specs)[0].split('x').map(Number);
    
    const url = this.generateUnsplashUrl(keyword, width, height);
    const targetPath = path.join(this.targetDir, category, `${imageName}.jpg`);
    
    try {
      await this.downloadImage(url, targetPath, `khakishop ${category} ${imageName} 재생성 이미지`);
      console.log(`${colors.green}✅ 재생성 완료: ${category}/${imageName}${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ 재생성 실패: ${error.message}${colors.reset}`);
    }
  }
}

// ================================================================================
// 🚀 스크립트 실행부
// ================================================================================

async function main() {
  const generator = new FreeImageGenerator();
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // 전체 이미지 세트 생성
    await generator.downloadAllImages();
  } else if (args.length >= 2) {
    // 개별 이미지 재생성
    const [category, imageName, customKeyword] = args;
    await generator.regenerateSpecificImage(category, imageName, customKeyword);
  } else {
    console.log(`${colors.yellow}사용법:${colors.reset}`);
    console.log(`  node generateFreeImages.js                    # 전체 이미지 세트 생성`);
    console.log(`  node generateFreeImages.js hero hero-main     # 개별 이미지 재생성`);
    console.log(`  node generateFreeImages.js collections wood-texture "wooden+blinds+premium"  # 커스텀 키워드로 재생성`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FreeImageGenerator; 