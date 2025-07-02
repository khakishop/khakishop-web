import { Inter } from 'next/font/google';
import '../../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased`}>
        {/* Auth 전용 최소 레이아웃 - 헤더/푸터/네비 없음 */}
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: 'KHAKI SHOP - 관리자 로그인',
  description: 'KHAKI SHOP 관리자 로그인 페이지',
};
