/** @type {import('next').NextConfig} */
const path = require('path');
// const createNextIntlPlugin = require('next-intl/plugin');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest.json$/],
  disable: process.env.NODE_ENV === 'development',
});

// const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig = {
  // webpack 설정 제거 - Next.js가 알아서 처리하도록
  // webpack: (config, { dev, isServer }) => {
  //   if (dev) {
  //     // 개발 모드에서 캐시 안정성 향상 - process.cwd() 사용
  //     config.cache = {
  //       type: 'filesystem',
  //       version: 'v1',
  //       cacheDirectory: path.resolve(process.cwd(), '.next/cache/webpack'),
  //       store: 'pack',
  //       buildDependencies: {
  //         config: [__filename],
  //       },
  //     };
  //   }
  //   return config;
  // },

  // 이미지 최적화 설정 - sharp 자동 사용됨
  images: {
    // 최신 이미지 포맷 지원 (AVIF > WebP > JPEG 순서로 우선순위)
    formats: ['image/avif', 'image/webp'],
    
    // 디바이스별 최적화 사이즈
    deviceSizes: [640, 768, 1024, 1280, 1600],
    
    // 이미지 크기별 브레이크포인트
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 허용된 도메인 (로컬 개발 + 추후 CMS/CDN 추가 가능)
    domains: ['localhost'],
    
    // 외부 이미지 패턴 설정
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    
    // 이미지 최적화 활성화
    unoptimized: false,
    
    // 최소 캐시 기간 (초 단위)
    minimumCacheTTL: 31536000, // 1년
  },

  // 실험적 기능
  experimental: {
    // 이미지 최적화 성능 향상
    optimizePackageImports: ['@heroicons/react'],
  },

  // 성능 최적화
  swcMinify: true,
  
  // 컴파일러 최적화
  compiler: {
    // 운영 환경에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

// module.exports = withNextIntl(withPWA(nextConfig));
module.exports = withPWA(nextConfig); 