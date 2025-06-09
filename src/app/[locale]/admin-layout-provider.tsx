'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Navbar, FullscreenMenu } from '../../components';

interface AdminLayoutProviderProps {
  children: ReactNode;
}

export function AdminLayoutProvider({ children }: AdminLayoutProviderProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes('/admin') || false;

  if (isAdminPage) {
    // Admin 페이지에서는 메뉴 없이 children만 렌더링
    return <>{children}</>;
  }

  // 일반 페이지에서는 Navbar와 FullscreenMenu 포함
  return (
    <>
      {/* 네비게이션 바 */}
      <Navbar />
      
      {/* 풀스크린 메뉴 */}
      <FullscreenMenu />
      
      {/* 메인 콘텐츠 */}
      {children}
    </>
  );
} 