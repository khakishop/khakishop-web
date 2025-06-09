// ================================================================================
// 🎨 KHAKISHOP CSS 기반 폴백 이미지 생성 시스템
// ================================================================================
// 🎯 목적: 실제 이미지 없이도 브랜드 일관성 유지 가능한 시스템
// 💡 장점: 다운로드 없음, 즉시 사용 가능, 완전 커스터마이징

const fs = require('fs');
const path = require('path');

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

class FallbackImageCreator {
  constructor() {
    this.targetDir = '/Users/kiholee/Projects/khakishop-web/public';
    this.brandColors = this.getBrandColors();
  }

  getBrandColors() {
    return {
      cream: '#F7F5F3',
      warmWhite: '#FEFDFB',
      softBeige: '#F5F2EE',
      naturalLinen: '#F0EDE8',
      warmGray: '#E8E5E1',
      lightTaupe: '#D9D5D0',
      earthBrown: '#8B7A6B',
      naturalWood: '#A0927D',
      textPrimary: '#2D2823',
      textSecondary: '#4A453E'
    };
  }

  // ================================================================================
  // 🎨 HTML Canvas 기반 이미지 생성 (Node.js 환경에서 SVG로 대체)
  // ================================================================================

  generateSVGImage(type, width, height, title, subtitle = '') {
    const { cream, warmWhite, earthBrown, textPrimary, textSecondary } = this.brandColors;
    
    const templates = {
      hero: `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${warmWhite}"/>
              <stop offset="50%" stop-color="${cream}"/>
              <stop offset="100%" stop-color="#E8E5E1"/>
            </linearGradient>
            <pattern id="heroPattern" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect width="40" height="40" fill="url(#heroGrad)"/>
              <line x1="0" y1="20" x2="40" y2="20" stroke="${earthBrown}" stroke-width="0.5" opacity="0.1"/>
              <line x1="20" y1="0" x2="20" y2="40" stroke="${earthBrown}" stroke-width="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#heroPattern)"/>
          
          <g transform="translate(${width/2}, ${height/2})">
            <text text-anchor="middle" y="-20" font-family="Inter, sans-serif" font-size="36" font-weight="300" fill="${textPrimary}">
              ${title}
            </text>
            <text text-anchor="middle" y="20" font-family="Inter, sans-serif" font-size="16" font-weight="300" fill="${textSecondary}">
              ${subtitle || 'khakishop premium interiors'}
            </text>
            <circle cx="0" cy="50" r="3" fill="${earthBrown}" opacity="0.6"/>
          </g>
        </svg>
      `,
      
      collection: `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="collGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="${warmWhite}"/>
              <stop offset="100%" stop-color="${cream}"/>
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#collGrad)" rx="8"/>
          
          <g transform="translate(${width/2}, ${height/2})">
            <rect x="-60" y="-30" width="120" height="60" fill="${warmWhite}" rx="8" opacity="0.8" filter="url(#softGlow)"/>
            <text text-anchor="middle" y="-5" font-family="Inter, sans-serif" font-size="18" font-weight="400" fill="${textPrimary}">
              ${title}
            </text>
            <text text-anchor="middle" y="15" font-family="Inter, sans-serif" font-size="12" font-weight="300" fill="${textSecondary}">
              ${subtitle || 'khakishop collection'}
            </text>
          </g>
          
          <path d="M20,20 Q30,10 40,20 T60,20" stroke="${earthBrown}" stroke-width="1" fill="none" opacity="0.3"/>
        </svg>
      `,
      
      product: `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="prodGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stop-color="${warmWhite}"/>
              <stop offset="100%" stop-color="#F0EDE8"/>
            </radialGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#prodGrad)" rx="4"/>
          <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="none" stroke="#E8E5E1" stroke-width="1" rx="4"/>
          
          <g transform="translate(${width/2}, ${height/2})">
            <rect x="-40" y="-25" width="80" height="50" fill="${earthBrown}" opacity="0.1" rx="4"/>
            <text text-anchor="middle" y="0" font-family="Inter, sans-serif" font-size="14" font-weight="400" fill="${textPrimary}">
              ${title}
            </text>
            <text text-anchor="middle" y="15" font-family="Inter, sans-serif" font-size="10" fill="${textSecondary}">
              ${subtitle || 'khakishop product'}
            </text>
          </g>
        </svg>
      `,
      
      gallery: `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="galGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${cream}"/>
              <stop offset="50%" stop-color="#F0EDE8"/>
              <stop offset="100%" stop-color="#E8E5E1"/>
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#galGrad)"/>
          
          <circle cx="${width*0.3}" cy="${height*0.3}" r="20" fill="${warmWhite}" opacity="0.6"/>
          <circle cx="${width*0.7}" cy="${height*0.7}" r="15" fill="${earthBrown}" opacity="0.2"/>
          
          <g transform="translate(${width/2}, ${height/2})">
            <text text-anchor="middle" y="0" font-family="Inter, sans-serif" font-size="16" font-weight="300" fill="${textPrimary}">
              ${title}
            </text>
          </g>
        </svg>
      `
    };

    return templates[type] || templates.collection;
  }

  // ================================================================================
  // 🎨 이미지 세트 정의
  // ================================================================================

  getImageSet() {
    return {
      hero: [
        { name: 'hero-desktop', width: 1920, height: 1080, title: 'khakishop', subtitle: 'premium window treatments' },
        { name: 'hero-mobile', width: 768, height: 1024, title: 'khakishop', subtitle: 'minimal design' }
      ],
      
      collections: [
        { name: 'essential-linen', width: 600, height: 400, title: 'Essential Linen', subtitle: 'natural elegance' },
        { name: 'modern-sheer', width: 600, height: 400, title: 'Modern Sheer', subtitle: 'soft transparency' },
        { name: 'venetian-premium', width: 600, height: 400, title: 'Venetian Premium', subtitle: 'classic sophistication' },
        { name: 'wood-texture', width: 600, height: 400, title: 'Wood Texture', subtitle: 'natural warmth' },
        { name: 'smart-automation', width: 600, height: 400, title: 'Smart Automation', subtitle: 'intelligent control' },
        { name: 'wireless-motor', width: 600, height: 400, title: 'Wireless Motor', subtitle: 'effortless operation' },
        { name: 'designer-hardware', width: 600, height: 400, title: 'Designer Hardware', subtitle: 'premium finishes' },
        { name: 'luxury-tieback', width: 600, height: 400, title: 'Luxury Tieback', subtitle: 'elegant details' }
      ],
      
      products: [
        { name: 'sheer-curtain-main', width: 800, height: 800, title: 'Sheer Curtain', subtitle: 'premium quality' },
        { name: 'classic-curtain-main', width: 800, height: 800, title: 'Classic Curtain', subtitle: 'timeless design' },
        { name: 'wood-blind-main', width: 800, height: 800, title: 'Wood Blind', subtitle: 'natural materials' },
        { name: 'aluminum-blind-main', width: 800, height: 800, title: 'Aluminum Blind', subtitle: 'modern functionality' }
      ],
      
      gallery: [
        { name: 'gallery-1', width: 600, height: 400, title: 'Inspiration' },
        { name: 'gallery-2', width: 600, height: 400, title: 'Design' },
        { name: 'gallery-3', width: 600, height: 400, title: 'Lifestyle' },
        { name: 'gallery-4', width: 600, height: 400, title: 'Premium' }
      ],
      
      references: [
        { name: 'modern-office-main', width: 1000, height: 600, title: 'Modern Office', subtitle: 'professional spaces' },
        { name: 'minimal-residence-main', width: 1000, height: 600, title: 'Minimal Residence', subtitle: 'clean living' },
        { name: 'classic-cafe-main', width: 1000, height: 600, title: 'Classic Cafe', subtitle: 'commercial elegance' }
      ]
    };
  }

  // ================================================================================
  // 🚀 폴백 이미지 생성 실행
  // ================================================================================

  async createAllFallbackImages() {
    console.log(`${colors.bright}${colors.magenta}🎨 KHAKISHOP CSS 기반 폴백 이미지 생성 시작${colors.reset}`);
    console.log('================================================================================');

    const imageSet = this.getImageSet();
    let totalCreated = 0;

    try {
      for (const [category, images] of Object.entries(imageSet)) {
        console.log(`\n${colors.cyan}📁 ${category} 카테고리 생성 중...${colors.reset}`);
        
        const categoryDir = path.join(this.targetDir, 'images', category);
        if (!fs.existsSync(categoryDir)) {
          fs.mkdirSync(categoryDir, { recursive: true });
        }

        for (const image of images) {
          const svgContent = this.generateSVGImage(
            category === 'collections' ? 'collection' : category.slice(0, -1),
            image.width,
            image.height,
            image.title,
            image.subtitle
          );
          
          const filePath = path.join(categoryDir, `${image.name}.svg`);
          fs.writeFileSync(filePath, svgContent);
          
          console.log(`${colors.green}✅ ${image.name}.svg${colors.reset} (${image.width}x${image.height})`);
          totalCreated++;
        }
      }

      // 추가로 PNG 백업용 HTML 생성
      await this.createHTMLPreview();

      console.log(`\n${colors.bright}${colors.green}🎉 폴백 이미지 생성 완료!${colors.reset}`);
      console.log('================================================================================');
      console.log(`${colors.blue}📊 생성된 이미지: ${totalCreated}개${colors.reset}`);
      console.log(`${colors.blue}📁 저장 위치: ${this.targetDir}/images/[category]/[name].svg${colors.reset}`);
      console.log(`${colors.blue}🎨 형식: SVG (벡터, 무한 확대 가능)${colors.reset}`);
      console.log(`${colors.blue}🏷️  라이선스: 완전 자체 제작 (저작권 문제 없음)${colors.reset}`);

      console.log(`\n${colors.bright}💡 사용 방법:${colors.reset}`);
      console.log(`   1. Next.js Image: <Image src="/images/hero/hero-desktop.svg" ... />`);
      console.log(`   2. CSS 배경: background-image: url('/images/collections/modern-sheer.svg')`);
      console.log(`   3. HTML: <img src="/images/gallery/gallery-1.svg" alt="..." />`);
      console.log(`   4. 미리보기: http://localhost:3000/image-preview.html`);

    } catch (error) {
      console.error(`${colors.red}❌ 폴백 이미지 생성 실패: ${error.message}${colors.reset}`);
    }
  }

  // ================================================================================
  // 📱 HTML 미리보기 페이지 생성
  // ================================================================================

  async createHTMLPreview() {
    const imageSet = this.getImageSet();
    
    let htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>khakishop 폴백 이미지 미리보기</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #FEFDFB 0%, #F7F5F3 100%);
            margin: 0;
            padding: 2rem;
            color: #2D2823;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        h1 {
            text-align: center;
            font-weight: 300;
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: #8B7A6B;
        }
        
        .category {
            margin-bottom: 3rem;
        }
        
        .category h2 {
            font-weight: 400;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #4A453E;
            border-bottom: 1px solid #E8E5E1;
            padding-bottom: 0.5rem;
        }
        
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .image-card {
            background: white;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(139, 122, 107, 0.1);
            transition: transform 0.3s ease;
        }
        
        .image-card:hover {
            transform: translateY(-2px);
        }
        
        .image-card img {
            width: 100%;
            height: auto;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        
        .image-info h3 {
            margin: 0 0 0.5rem 0;
            font-weight: 400;
            color: #2D2823;
        }
        
        .image-info p {
            margin: 0;
            color: #6B645B;
            font-size: 0.9rem;
        }
        
        .hero-images .image-card img {
            max-height: 200px;
            object-fit: cover;
        }
        
        footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #E8E5E1;
            color: #8B857C;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 khakishop 폴백 이미지 시스템</h1>
        
        <div class="category hero-images">
            <h2>🔥 Hero Images</h2>
            <div class="image-grid">`;

    // 각 카테고리별 이미지 추가
    for (const [category, images] of Object.entries(imageSet)) {
      if (category !== 'hero') {
        htmlContent += `
        </div>
        </div>
        
        <div class="category">
            <h2>${this.getCategoryIcon(category)} ${this.getCategoryTitle(category)}</h2>
            <div class="image-grid">`;
      }

      for (const image of images) {
        htmlContent += `
                <div class="image-card">
                    <img src="/images/${category}/${image.name}.svg" alt="${image.title}" loading="lazy">
                    <div class="image-info">
                        <h3>${image.title}</h3>
                        <p>${image.subtitle || `${image.width}x${image.height}`}</p>
                    </div>
                </div>`;
      }
    }

    htmlContent += `
            </div>
        </div>
        
        <footer>
            <p>🏷️ 모든 이미지는 khakishop 자체 제작으로 저작권 문제가 없습니다.</p>
            <p>🎨 RIGAS 모티브 + khakishop 브랜드 감성으로 디자인되었습니다.</p>
        </footer>
    </div>
</body>
</html>`;

    const htmlPath = path.join(this.targetDir, 'image-preview.html');
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`${colors.green}✅ HTML 미리보기 생성: /image-preview.html${colors.reset}`);
  }

  getCategoryIcon(category) {
    const icons = {
      hero: '🔥',
      collections: '🎨',
      products: '🛍️',
      gallery: '🖼️',
      references: '🏢'
    };
    return icons[category] || '📁';
  }

  getCategoryTitle(category) {
    const titles = {
      hero: 'Hero Images',
      collections: 'Collections',
      products: 'Products', 
      gallery: 'Gallery',
      references: 'References'
    };
    return titles[category] || category;
  }
}

// ================================================================================
// 🚀 스크립트 실행
// ================================================================================

async function main() {
  const creator = new FallbackImageCreator();
  await creator.createAllFallbackImages();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FallbackImageCreator; 