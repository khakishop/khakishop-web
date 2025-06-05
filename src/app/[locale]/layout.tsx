import { Inter } from 'next/font/google';
import '../globals.css';
import { Navbar, FullscreenMenu } from '../../components';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale || 'ko'}>
      <body className={inter.className}>
        {/* 네비게이션 바 */}
        <Navbar />
        
        {/* 풀스크린 메뉴 */}
        <FullscreenMenu />
        
        {/* 메인 콘텐츠 */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
} 