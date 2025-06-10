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
  // ================================================================================
  // 🚀 성능 최적화 설정
  // ================================================================================
  
  // 실험적 기능 - 성능 향상
  experimental: {
    // CSS 최적화
    optimizeCss: true,
    
    // 패키지 임포트 최적화 - 트리 쉐이킹 개선
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      '@heroicons/react',
      'react-icons',
      'lodash'
    ],
    
    // 서버 컴포넌트 최적화
    serverComponentsExternalPackages: ['sharp'],
    
    // 동적 라우트 최적화
    optimizeServerReact: true,
    
    // 메모리 사용량 최적화
    useDeploymentId: true,
    useDeploymentIdServerActions: true,
  },

  // 컴파일러 최적화
  compiler: {
    // 운영 환경에서 console 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    
    // React Refresh 최적화
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    
    // 스타일드 컴포넌트 최적화
    styledComponents: true,
  },

  // 이미지 최적화 설정 - AVIF/WebP 지원
  images: {
    // 최신 이미지 포맷 지원 (AVIF > WebP > JPEG 순서)
    formats: ['image/avif', 'image/webp'],
    
    // 디바이스별 최적화 사이즈
    deviceSizes: [480, 640, 768, 1024, 1280, 1600, 1920],
    
    // 이미지 크기별 브레이크포인트
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    
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
    
    // 최소 캐시 기간 (1년)
    minimumCacheTTL: 31536000,
    
    // 레이지 로딩 기본 활성화
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Webpack 설정 - 향상된 번들링
  webpack: (config, { dev, isServer, webpack }) => {
    // ================================================================================
    // 🎯 모듈 해결 최적화
    // ================================================================================
    
    // Framer Motion과 emotion 호환성 설정
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emotion/is-prop-valid': require.resolve('@emotion/is-prop-valid'),
      '@emotion/styled': require.resolve('@emotion/styled'),
      '@emotion/react': require.resolve('@emotion/react'),
    };

    // ESM 호환성 강화
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
      '.mjs': ['.mjs', '.js'],
    };

    // ================================================================================
    // 📦 패키지 최적화
    // ================================================================================
    
    // Framer Motion 트랜스파일 설정
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/(framer-motion|@emotion)/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // ================================================================================
    // ⚡ 성능 최적화
    // ================================================================================
    
    if (!isServer) {
      // 클라이언트 번들 최적화
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 20,
            },
            lib: {
              test(module) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.nameForCondition() || '');
              },
              name(module) {
                const hash = crypto.createHash('sha1');
                const data = module.libIdent ? module.libIdent({ context: config.context }) : module.identifier();
                if (data) {
                  hash.update(data);
                } else {
                  hash.update('default');
                }
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              chunks: 'all',
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    if (dev) {
      // 개발 모드 캐시 최적화
      config.cache = {
        type: 'filesystem',
        version: 'v3-optimized',
        cacheDirectory: path.resolve(process.cwd(), '.next/cache/webpack'),
        store: 'pack',
        buildDependencies: {
          config: [__filename],
        },
        managedPaths: [path.resolve(process.cwd(), 'node_modules')],
        profile: false,
        maxMemoryGenerations: 5,
      };

      // 빠른 새로고침 최적화
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named',
        emitOnErrors: false,
      };
    }

    // 번들 분석기 (선택적)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // 트랜스파일할 패키지들
  transpilePackages: [
    'framer-motion', 
    '@emotion/is-prop-valid',
    '@emotion/styled',
    '@emotion/react',
    'lucide-react'
  ],

  // ================================================================================
  // 🔧 기타 최적화 설정
  // ================================================================================
  
  // SWC 미니파이어 활성화
  swcMinify: true,
  
  // TypeScript 빌드 최적화
  typescript: {
    // 빌드 시 타입 체크 건너뛰기 (개발 중에만)
    ignoreBuildErrors: false,
  },
  
  // ESLint 빌드 최적화
  eslint: {
    // 빌드 시 ESLint 건너뛰기 (개발 중에만)
    ignoreDuringBuilds: false,
  },

  // 출력 설정
  output: 'standalone',
  
  // 압축 설정
  compress: true,
  
  // 전원 비트레이싱 설정
  poweredByHeader: false,
  
  // X-Powered-By 헤더 비활성화
  generateEtags: true,
  
  // HTTP 압축
  httpAgentOptions: {
    keepAlive: true,
  },
};

// Crypto import for chunk naming
const crypto = require('crypto');

// module.exports = withNextIntl(withPWA(nextConfig));
module.exports = withPWA(nextConfig); 