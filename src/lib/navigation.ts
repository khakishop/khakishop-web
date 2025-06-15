// ================================================================================
// 🌐 KHAKISHOP - i18n 라우팅 헬퍼 유틸리티
// ================================================================================
// 목적: 모든 내부 링크에 자동으로 locale을 포함시켜 404 에러 방지

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';

// ================================================================================
// 🎯 타입 정의
// ================================================================================

export type Locale = 'ko' | 'en';

export interface LocalizedNavigationHook {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
}

// ================================================================================
// 🔧 헬퍼 함수들
// ================================================================================

/**
 * 현재 locale을 가져오는 함수
 */
export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return 'ko'; // SSR 기본값
  
  const pathname = window.location.pathname;
  const localeMatch = pathname.match(/^\/([a-z]{2})\//);
  return (localeMatch?.[1] as Locale) || 'ko';
}

/**
 * 경로에 locale을 포함시키는 함수
 * @param path - 변환할 경로
 * @param locale - 사용할 locale (선택사항)
 * @returns locale이 포함된 경로
 */
export function createLocalizedHref(path: string, locale?: Locale): string {
  const currentLocale = locale || getCurrentLocale();
  
  // 이미 locale이 포함된 경우
  if (path.match(/^\/[a-z]{2}\//)) {
    return path;
  }
  
  // 외부 링크인 경우
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }
  
  // 앵커 링크인 경우
  if (path.startsWith('#')) {
    return path;
  }
  
  // 루트 경로인 경우
  if (path === '/') {
    return `/${currentLocale}`;
  }
  
  // 일반 경로인 경우
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${currentLocale}${cleanPath}`;
}

/**
 * 현재 경로에서 locale을 제거한 순수 경로를 반환
 * @param pathname - 현재 경로
 * @returns locale이 제거된 경로
 */
export function getLocalizedPath(pathname: string): string {
  const localeMatch = pathname.match(/^\/[a-z]{2}(\/.*)?$/);
  return localeMatch?.[1] || '/';
}

/**
 * 경로가 현재 페이지와 일치하는지 확인
 * @param path - 확인할 경로
 * @param exact - 정확히 일치해야 하는지 여부
 * @returns 일치 여부
 */
export function isActivePath(path: string, exact: boolean = false): boolean {
  if (typeof window === 'undefined') return false;
  
  const currentPath = getLocalizedPath(window.location.pathname);
  const targetPath = path.startsWith('/') ? path : `/${path}`;
  
  if (exact) {
    return currentPath === targetPath;
  }
  
  return currentPath.startsWith(targetPath);
}

// ================================================================================
// 🪝 커스텀 훅들
// ================================================================================

/**
 * locale을 자동으로 포함하는 라우터 훅
 */
export function useLocalizedRouter(): LocalizedNavigationHook {
  const router = useRouter();
  
  return {
    push: (path: string) => {
      const localizedPath = createLocalizedHref(path);
      router.push(localizedPath);
    },
    replace: (path: string) => {
      const localizedPath = createLocalizedHref(path);
      router.replace(localizedPath);
    },
    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),
  };
}

/**
 * 현재 locale 정보를 제공하는 훅
 */
export function useCurrentLocale(): {
  locale: Locale;
  isKorean: boolean;
  isEnglish: boolean;
} {
  const params = useParams();
  const locale = (params?.locale as Locale) || getCurrentLocale();
  
  return {
    locale,
    isKorean: locale === 'ko',
    isEnglish: locale === 'en',
  };
}

/**
 * 경로 정보를 제공하는 훅
 */
export function useLocalizedPathname(): {
  pathname: string;
  localizedPathname: string;
  isActive: (path: string, exact?: boolean) => boolean;
} {
  const pathname = usePathname();
  const localizedPathname = getLocalizedPath(pathname);
  
  return {
    pathname: localizedPathname,
    localizedPathname: pathname,
    isActive: (path: string, exact: boolean = false) => isActivePath(path, exact),
  };
}

// ================================================================================
// 🎯 편의 함수들
// ================================================================================

/**
 * 다국어 경로 생성기
 */
export const routes = {
  home: () => '/',
  projects: () => '/projects',
  project: (slug: string) => `/projects/${slug}`,
  curtain: () => '/curtain',
  curtainDetail: (slug: string) => `/curtain/${slug}`,
  blind: () => '/blind',
  blindDetail: (slug: string) => `/blind/${slug}`,
  motorized: () => '/motorized',
  motorizedDetail: (slug: string) => `/motorized/${slug}`,
  collection: () => '/collection',
  references: () => '/references',
  referenceDetail: (slug: string) => `/references/${slug}`,
  about: () => '/about',
  contact: () => '/contact',
  admin: {
    images: () => '/admin/images',
  },
} as const;

/**
 * 모든 라우트를 locale 포함 경로로 변환
 */
export function createLocalizedRoutes(locale?: Locale) {
  const targetLocale = locale || getCurrentLocale();
  
  return Object.fromEntries(
    Object.entries(routes).map(([key, value]) => [
      key,
      typeof value === 'function' 
        ? (arg?: string) => createLocalizedHref(value(arg || ''), targetLocale)
        : typeof value === 'object'
        ? Object.fromEntries(
            Object.entries(value).map(([subKey, subValue]) => [
              subKey,
              typeof subValue === 'function'
                ? (arg?: string) => createLocalizedHref((subValue as Function)(arg || ''), targetLocale)
                : createLocalizedHref(subValue as string, targetLocale)
            ])
          )
        : createLocalizedHref(value as string, targetLocale)
    ])
  );
}

export default {
  createLocalizedHref,
  getLocalizedPath,
  getCurrentLocale,
  isActivePath,
  useLocalizedRouter,
  useCurrentLocale,
  useLocalizedPathname,
  routes,
  createLocalizedRoutes,
}; 