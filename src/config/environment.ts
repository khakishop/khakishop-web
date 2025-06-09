// ================================================================================
// 🎯 KHAKISHOP - 환경별 설정 관리
// ================================================================================
// 목적: 개발/프로덕션 환경 불일치 방지, 중앙화된 설정 관리

interface EnvironmentConfig {
  // 🌐 API 설정
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };

  // 🖼️ 이미지 처리 설정
  images: {
    maxSize: number;
    allowedTypes: string[];
    compressionQuality: number;
    placeholderUrl: string;
  };

  // 🔄 동기화 설정
  sync: {
    interval: number;
    batchSize: number;
    maxConcurrent: number;
  };

  // 🐛 디버깅/로깅
  debug: {
    enableConsoleLog: boolean;
    enableApiLog: boolean;
    enablePerformanceLog: boolean;
  };

  // 🚀 성능 설정
  performance: {
    enableVirtualScrolling: boolean;
    itemsPerPage: number;
    preloadThreshold: number;
  };
}

// 🏠 개발 환경 설정
const developmentConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  images: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    compressionQuality: 80,
    placeholderUrl: '/images/placeholder-dev.jpg',
  },
  sync: {
    interval: 30000, // 30초
    batchSize: 50,
    maxConcurrent: 3,
  },
  debug: {
    enableConsoleLog: true,
    enableApiLog: true,
    enablePerformanceLog: true,
  },
  performance: {
    enableVirtualScrolling: false, // 개발 시 디버깅 용이성
    itemsPerPage: 20,
    preloadThreshold: 5,
  },
};

// 🚀 프로덕션 환경 설정
const productionConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'https://khakishop.kr',
    timeout: 15000,
    retryAttempts: 5,
    retryDelay: 2000,
  },
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    compressionQuality: 85,
    placeholderUrl: '/images/placeholder.jpg',
  },
  sync: {
    interval: 60000, // 60초
    batchSize: 100,
    maxConcurrent: 5,
  },
  debug: {
    enableConsoleLog: false,
    enableApiLog: false,
    enablePerformanceLog: false,
  },
  performance: {
    enableVirtualScrolling: true,
    itemsPerPage: 50,
    preloadThreshold: 10,
  },
};

// 🧪 테스트 환경 설정
const testConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://localhost:3001',
    timeout: 5000,
    retryAttempts: 1,
    retryDelay: 500,
  },
  images: {
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/png'],
    compressionQuality: 70,
    placeholderUrl: '/images/placeholder-test.jpg',
  },
  sync: {
    interval: 10000, // 10초
    batchSize: 10,
    maxConcurrent: 1,
  },
  debug: {
    enableConsoleLog: true,
    enableApiLog: true,
    enablePerformanceLog: false,
  },
  performance: {
    enableVirtualScrolling: false,
    itemsPerPage: 10,
    preloadThreshold: 2,
  },
};

// ================================================================================
// 🎯 환경 감지 및 설정 선택
// ================================================================================

function getEnvironmentType(): 'development' | 'production' | 'test' {
  // Next.js 환경 변수 체크
  if (process.env.NODE_ENV === 'test') return 'test';
  if (process.env.NODE_ENV === 'production') return 'production';
  if (process.env.NODE_ENV === 'development') return 'development';

  // 브라우저 환경에서의 감지
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') return 'development';
    if (window.location.hostname.includes('test')) return 'test';
    return 'production';
  }

  return 'development';
}

// ================================================================================
// 🚀 메인 설정 객체 (타입 안전성 보장)
// ================================================================================

const config: EnvironmentConfig = (() => {
  const env = getEnvironmentType();

  switch (env) {
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    case 'development':
    default:
      return developmentConfig;
  }
})();

// ================================================================================
// 🛠️ 유틸리티 함수들
// ================================================================================

export function isProduction(): boolean {
  return getEnvironmentType() === 'production';
}

export function isDevelopment(): boolean {
  return getEnvironmentType() === 'development';
}

export function isTest(): boolean {
  return getEnvironmentType() === 'test';
}

export function getApiUrl(endpoint: string): string {
  return `${config.api.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

export function shouldLog(type: keyof typeof config.debug): boolean {
  return config.debug[type];
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // 파일 크기 검증
  if (file.size > config.images.maxSize) {
    return {
      valid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${Math.round(config.images.maxSize / 1024 / 1024)}MB까지 가능합니다.`,
    };
  }

  // 파일 타입 검증
  if (!config.images.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `지원하지 않는 파일 형식입니다. 허용된 형식: ${config.images.allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

// ================================================================================
// 🎯 메인 Export
// ================================================================================

export default config;
export type { EnvironmentConfig };
