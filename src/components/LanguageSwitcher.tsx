'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    // 현재 경로에서 언어 코드 제거
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // 새로운 언어로 라우팅
    const newPath = `/${newLocale}${pathnameWithoutLocale}`;
    
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 라우터 푸시
    router.push(newPath);
  };

  const getLanguageLabel = (locale: Locale): string => {
    const labels: Record<Locale, string> = {
      ko: '한국어',
      en: 'English'
    };
    return labels[locale];
  };

  return (
    <div className="flex items-center space-x-1">
      {locales.map((availableLocale) => (
        <button
          key={availableLocale}
          onClick={() => handleLocaleChange(availableLocale)}
          className={`px-3 py-1 text-sm font-serif tracking-wide transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 ${
            locale === availableLocale
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
          }`}
          aria-label={`언어를 ${getLanguageLabel(availableLocale)}로 변경`}
          title={`Switch to ${getLanguageLabel(availableLocale)}`}
          aria-current={locale === availableLocale ? 'page' : undefined}
        >
          {availableLocale.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher; 