// ================================================================================
// 🎨 KHAKISHOP 브랜드 그래픽 생성 시스템
// ================================================================================
// 🎯 목적: CSS/SVG 기반 브랜드 그래픽 및 폴백 시스템
// 🎨 스타일: RIGAS 모티브 + khakishop 브랜드 컬러
// 💡 장점: 이미지 없이도 브랜드 일관성 유지

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

class BrandGraphicsGenerator {
  constructor() {
    this.targetDir = '/Users/kiholee/Projects/khakishop-web/public';
    this.brandColors = this.getBrandColors();
    this.patterns = this.getPatterns();
  }

  // ================================================================================
  // 🎨 khakishop 브랜드 컬러 팔레트 (RIGAS 모티브)
  // ================================================================================
  
  getBrandColors() {
    return {
      // 주 색상 (중성톤 미니멀)
      primary: {
        cream: '#F7F5F3',
        warmWhite: '#FEFDFB',
        softBeige: '#F5F2EE',
        naturalLinen: '#F0EDE8'
      },
      
      // 보조 색상 (따뜻한 중성)
      secondary: {
        warmGray: '#E8E5E1',
        lightTaupe: '#D9D5D0',
        softSand: '#CDC8C1',
        stoneDust: '#B8B3AC'
      },
      
      // 액센트 색상 (자연스러운 포인트)
      accent: {
        earthBrown: '#8B7A6B',
        naturalWood: '#A0927D',
        deepLinen: '#7C6F5F',
        warmCharcoal: '#5D564E'
      },
      
      // 텍스트 색상
      text: {
        primary: '#2D2823',
        secondary: '#4A453E',
        light: '#6B645B',
        subtle: '#8B857C'
      }
    };
  }

  // ================================================================================
  // 🎨 브랜드 패턴 및 텍스처
  // ================================================================================
  
  getPatterns() {
    return {
      // 미니멀 기하학 패턴
      geometric: [
        'linear-gradient(45deg, transparent 30%, rgba(139, 122, 107, 0.05) 30%, rgba(139, 122, 107, 0.05) 70%, transparent 70%)',
        'linear-gradient(135deg, rgba(248, 245, 243, 0.8) 0%, rgba(232, 229, 225, 0.8) 100%)',
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 122, 107, 0.03) 2px, rgba(139, 122, 107, 0.03) 4px)'
      ],
      
      // 린넨/텍스타일 텍스처 시뮬레이션
      textile: [
        'radial-gradient(circle at 25% 25%, rgba(139, 122, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(160, 146, 125, 0.1) 0%, transparent 50%)',
        'linear-gradient(90deg, rgba(247, 245, 243, 0.8) 0%, rgba(240, 237, 232, 0.8) 50%, rgba(247, 245, 243, 0.8) 100%)'
      ],
      
      // 자연광 그라디언트
      lighting: [
        'linear-gradient(180deg, rgba(254, 253, 251, 1) 0%, rgba(247, 245, 243, 0.95) 70%, rgba(232, 229, 225, 0.9) 100%)',
        'radial-gradient(ellipse at center top, rgba(254, 253, 251, 1) 0%, rgba(247, 245, 243, 0.8) 100%)',
        'linear-gradient(135deg, rgba(254, 253, 251, 1) 0%, rgba(247, 245, 243, 0.9) 50%, rgba(240, 237, 232, 0.8) 100%)'
      ]
    };
  }

  // ================================================================================
  // 🖼️ SVG 패턴 생성기
  // ================================================================================
  
  generateSVGPattern(type, width = 100, height = 100) {
    const patterns = {
      linen: `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="linen" patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#F7F5F3"/>
              <circle cx="1" cy="1" r="0.5" fill="#E8E5E1" opacity="0.3"/>
              <circle cx="3" cy="3" r="0.5" fill="#D9D5D0" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#linen)"/>
        </svg>
      `,
      
      minimal: `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="minimal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FEFDFB"/>
              <stop offset="50%" stop-color="#F7F5F3"/>
              <stop offset="100%" stop-color="#F0EDE8"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#minimal)"/>
        </svg>
      `,
      
      texture: `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="noise">
              <feTurbulence baseFrequency="0.9" numOctaves="1" result="noise"/>
              <feColorMatrix in="noise" type="saturate" values="0"/>
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0.05 0.1 0.15"/>
              </feComponentTransfer>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="#F7F5F3"/>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.3"/>
        </svg>
      `
    };
    
    return patterns[type] || patterns.minimal;
  }

  // ================================================================================
  // 🎨 CSS 브랜드 변수 생성
  // ================================================================================
  
  generateBrandCSS() {
    const css = `
/* ================================================================================
   🎨 KHAKISHOP 브랜드 CSS 변수 & 유틸리티
   ================================================================================ */

:root {
  /* 🎨 브랜드 컬러 팔레트 */
  --khaki-cream: #F7F5F3;
  --khaki-warm-white: #FEFDFB;
  --khaki-soft-beige: #F5F2EE;
  --khaki-natural-linen: #F0EDE8;
  
  --khaki-warm-gray: #E8E5E1;
  --khaki-light-taupe: #D9D5D0;
  --khaki-soft-sand: #CDC8C1;
  --khaki-stone-dust: #B8B3AC;
  
  --khaki-earth-brown: #8B7A6B;
  --khaki-natural-wood: #A0927D;
  --khaki-deep-linen: #7C6F5F;
  --khaki-warm-charcoal: #5D564E;
  
  --khaki-text-primary: #2D2823;
  --khaki-text-secondary: #4A453E;
  --khaki-text-light: #6B645B;
  --khaki-text-subtle: #8B857C;

  /* 🎨 브랜드 그라디언트 */
  --khaki-gradient-hero: linear-gradient(180deg, var(--khaki-warm-white) 0%, var(--khaki-cream) 70%, var(--khaki-warm-gray) 100%);
  --khaki-gradient-card: linear-gradient(135deg, var(--khaki-warm-white) 0%, var(--khaki-cream) 50%, var(--khaki-natural-linen) 100%);
  --khaki-gradient-subtle: linear-gradient(90deg, var(--khaki-cream) 0%, var(--khaki-natural-linen) 50%, var(--khaki-cream) 100%);
  
  /* 🎨 브랜드 쉐도우 */
  --khaki-shadow-soft: 0 4px 20px rgba(139, 122, 107, 0.1);
  --khaki-shadow-medium: 0 8px 32px rgba(139, 122, 107, 0.15);
  --khaki-shadow-strong: 0 16px 48px rgba(139, 122, 107, 0.2);
  
  /* 📐 브랜드 반응형 */
  --khaki-radius: 8px;
  --khaki-radius-large: 16px;
  --khaki-spacing: 1.5rem;
  --khaki-spacing-large: 3rem;
}

/* ================================================================================
   🎨 이미지 폴백 유틸리티
   ================================================================================ */

.khaki-fallback-hero {
  background: var(--khaki-gradient-hero);
  position: relative;
  overflow: hidden;
}

.khaki-fallback-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 40px,
    rgba(139, 122, 107, 0.03) 40px,
    rgba(139, 122, 107, 0.03) 80px
  );
  pointer-events: none;
}

.khaki-fallback-collection {
  background: var(--khaki-gradient-card);
  box-shadow: var(--khaki-shadow-soft);
  border-radius: var(--khaki-radius);
}

.khaki-fallback-product {
  background: var(--khaki-warm-white);
  border: 2px solid var(--khaki-warm-gray);
  border-radius: var(--khaki-radius);
  position: relative;
}

.khaki-fallback-product::after {
  content: '🏠';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  opacity: 0.3;
  color: var(--khaki-earth-brown);
}

.khaki-fallback-gallery {
  background: var(--khaki-gradient-subtle);
  position: relative;
}

.khaki-fallback-gallery::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 40%,
    rgba(139, 122, 107, 0.1) 0%,
    transparent 50%
  ), radial-gradient(
    circle at 80% 80%,
    rgba(160, 146, 125, 0.1) 0%,
    transparent 50%
  );
}

/* ================================================================================
   🎨 타이포그래피 중심 디자인
   ================================================================================ */

.khaki-hero-text {
  background: var(--khaki-gradient-hero);
  padding: var(--khaki-spacing-large);
  text-align: center;
  border-radius: var(--khaki-radius-large);
  box-shadow: var(--khaki-shadow-medium);
}

.khaki-hero-text h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 300;
  color: var(--khaki-text-primary);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.khaki-hero-text p {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--khaki-text-secondary);
  font-weight: 300;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ================================================================================
   🎨 브랜드 애니메이션
   ================================================================================ */

@keyframes khaki-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes khaki-glow {
  0%, 100% {
    box-shadow: var(--khaki-shadow-soft);
  }
  50% {
    box-shadow: var(--khaki-shadow-medium);
  }
}

.khaki-animate-in {
  animation: khaki-fade-in 0.8s ease-out;
}

.khaki-hover-glow:hover {
  animation: khaki-glow 2s ease-in-out infinite;
  transition: all 0.3s ease;
}

/* ================================================================================
   🎨 이미지 로딩 상태
   ================================================================================ */

.khaki-image-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--khaki-radius);
}

.khaki-image-loading {
  background: var(--khaki-gradient-card);
  position: relative;
}

.khaki-image-loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: khaki-shimmer 2s infinite;
}

@keyframes khaki-shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* ================================================================================
   🎨 반응형 브랜드 레이아웃
   ================================================================================ */

@media (max-width: 768px) {
  :root {
    --khaki-spacing: 1rem;
    --khaki-spacing-large: 2rem;
  }
  
  .khaki-hero-text {
    padding: var(--khaki-spacing);
  }
}

/* ================================================================================
   🎨 다크모드 지원 (미래 확장용)
   ================================================================================ */

@media (prefers-color-scheme: dark) {
  :root {
    --khaki-cream: #2D2823;
    --khaki-warm-white: #3A3530;
    --khaki-text-primary: #F7F5F3;
    --khaki-text-secondary: #E8E5E1;
  }
}
`;

    return css;
  }

  // ================================================================================
  // 📱 반응형 이미지 폴백 컴포넌트
  // ================================================================================
  
  generateImageFallbackComponent() {
    return `
// ================================================================================
// 🎨 KHAKISHOP 이미지 폴백 컴포넌트
// ================================================================================

import React, { useState } from 'react';
import Image from 'next/image';

interface KhakiImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackType?: 'hero' | 'collection' | 'product' | 'gallery';
  priority?: boolean;
}

export default function KhakiImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackType = 'collection',
  priority = false
}: KhakiImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const fallbackClasses = {
    hero: 'khaki-fallback-hero',
    collection: 'khaki-fallback-collection', 
    product: 'khaki-fallback-product',
    gallery: 'khaki-fallback-gallery'
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div 
        className={\`khaki-image-container \${fallbackClasses[fallbackType]} \${className}\`}
        style={{ width: width || '100%', height: height || 'auto', minHeight: '200px' }}
      >
        <div className="khaki-hero-text">
          <h3 style={{ color: 'var(--khaki-text-primary)', margin: 0 }}>
            khakishop
          </h3>
          <p style={{ color: 'var(--khaki-text-secondary)', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            {alt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={\`khaki-image-container \${className}\`}>
      {imageLoading && (
        <div 
          className="khaki-image-loading"
          style={{ width: width || '100%', height: height || 'auto', minHeight: '200px' }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={imageLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}
      />
    </div>
  );
}
`;
  }

  // ================================================================================
  // 🚀 파일 생성 및 저장
  // ================================================================================
  
  async generateAllGraphics() {
    console.log(`${colors.bright}${colors.magenta}🎨 KHAKISHOP 브랜드 그래픽 시스템 생성 시작${colors.reset}`);
    console.log('================================================================================');

    try {
      // 1. CSS 파일 생성
      const cssPath = path.join(this.targetDir, 'styles', 'khaki-brand.css');
      const cssDir = path.dirname(cssPath);
      if (!fs.existsSync(cssDir)) {
        fs.mkdirSync(cssDir, { recursive: true });
      }
      
      fs.writeFileSync(cssPath, this.generateBrandCSS());
      console.log(`${colors.green}✅ 브랜드 CSS 생성: ${cssPath}${colors.reset}`);

      // 2. SVG 패턴들 생성
      const svgDir = path.join(this.targetDir, 'graphics', 'patterns');
      if (!fs.existsSync(svgDir)) {
        fs.mkdirSync(svgDir, { recursive: true });
      }

      const svgPatterns = ['linen', 'minimal', 'texture'];
      svgPatterns.forEach(pattern => {
        const svgContent = this.generateSVGPattern(pattern, 400, 300);
        const svgPath = path.join(svgDir, `${pattern}-pattern.svg`);
        fs.writeFileSync(svgPath, svgContent);
        console.log(`${colors.green}✅ SVG 패턴 생성: ${pattern}-pattern.svg${colors.reset}`);
      });

      // 3. React 컴포넌트 생성
      const componentPath = path.join('/Users/kiholee/Projects/khakishop-web/src/components', 'KhakiImage.tsx');
      const componentDir = path.dirname(componentPath);
      if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
      }
      
      fs.writeFileSync(componentPath, this.generateImageFallbackComponent());
      console.log(`${colors.green}✅ 폴백 컴포넌트 생성: KhakiImage.tsx${colors.reset}`);

      // 4. 브랜드 로고 SVG 생성
      const logoSVG = this.generateBrandLogo();
      const logoPath = path.join(this.targetDir, 'graphics', 'khakishop-logo.svg');
      fs.writeFileSync(logoPath, logoSVG);
      console.log(`${colors.green}✅ 브랜드 로고 생성: khakishop-logo.svg${colors.reset}`);

      console.log(`\n${colors.bright}${colors.green}🎉 브랜드 그래픽 시스템 생성 완료!${colors.reset}`);
      console.log('================================================================================');
      console.log(`${colors.blue}📁 CSS 스타일: /public/styles/khaki-brand.css${colors.reset}`);
      console.log(`${colors.blue}🎨 SVG 패턴: /public/graphics/patterns/${colors.reset}`);
      console.log(`${colors.blue}⚛️  React 컴포넌트: /src/components/KhakiImage.tsx${colors.reset}`);
      console.log(`${colors.blue}🏷️  브랜드 로고: /public/graphics/khakishop-logo.svg${colors.reset}`);

      console.log(`\n${colors.bright}💡 사용 방법:${colors.reset}`);
      console.log(`   1. CSS Import: import '/styles/khaki-brand.css'`);
      console.log(`   2. 컴포넌트: import KhakiImage from '@/components/KhakiImage'`);
      console.log(`   3. 폴백 클래스: className="khaki-fallback-hero"`);

    } catch (error) {
      console.error(`${colors.red}❌ 브랜드 그래픽 생성 실패: ${error.message}${colors.reset}`);
    }
  }

  // ================================================================================
  // 🏷️ 브랜드 로고 SVG
  // ================================================================================
  
  generateBrandLogo() {
    return `
<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B7A6B"/>
      <stop offset="100%" stop-color="#A0927D"/>
    </linearGradient>
  </defs>
  
  <!-- 배경 -->
  <rect width="200" height="60" fill="#FEFDFB" rx="8"/>
  
  <!-- 텍스트 -->
  <text x="20" y="40" font-family="'Inter', sans-serif" font-size="24" font-weight="300" fill="url(#logoGradient)">
    khakishop
  </text>
  
  <!-- 포인트 -->
  <circle cx="180" cy="30" r="4" fill="#8B7A6B" opacity="0.6"/>
  <circle cx="185" cy="25" r="2" fill="#A0927D" opacity="0.4"/>
</svg>
    `.trim();
  }
}

// ================================================================================
// 🚀 스크립트 실행
// ================================================================================

async function main() {
  const generator = new BrandGraphicsGenerator();
  await generator.generateAllGraphics();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = BrandGraphicsGenerator; 