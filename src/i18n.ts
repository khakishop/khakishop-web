import { getRequestConfig } from 'next-intl/server';

// 지원하는 언어 목록
export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];

// 기본 언어
export const defaultLocale: Locale = 'ko';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale,
  };
});
