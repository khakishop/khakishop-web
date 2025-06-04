import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'khaki shop - 프리미엄 가구 스토어',
  description: '프리미엄 가구와 홈 데코 컬렉션을 만나보세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-white text-neutral-900`}>
        {/* ✅ 상단 메뉴 */}
        <header className="w-full px-6 py-4 flex justify-between items-center border-b">
          <div className="text-xl font-bold">khaki shop</div>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <a href="#">컬렉션</a>
            <a href="#">소개</a>
            <a href="#">연락처</a>
            <a href="#">쇼핑</a>
          </nav>
        </header>

        {/* ✅ 페이지 본문 */}
        <main className="min-h-screen">{children}</main>

        {/* ✅ 하단 푸터 */}
        <footer className="border-t text-sm text-gray-500 px-6 py-8 mt-12">
          <div className="max-w-5xl mx-auto flex justify-between flex-wrap gap-6">
            <div>
              <div className="font-bold mb-2">KHAKI SHOP</div>
              <p>영감을 주는 생활을 위한 창의적인 가구</p>
            </div>
            <div>
              <div className="font-semibold mb-1">쇼핑</div>
              <ul className="space-y-1">
                <li>거실</li>
                <li>다이닝룸</li>
                <li>침실</li>
                <li>서재</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1">회사</div>
              <ul className="space-y-1">
                <li>회사 소개</li>
                <li>장인정신</li>
                <li>쇼룸</li>
                <li>연락처</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1">소셜</div>
              <ul className="space-y-1">
                <li>인스타그램</li>
                <li>페이스북</li>
                <li>핀터레스트</li>
                <li>뉴스레터</li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
