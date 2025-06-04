import type { Metadata } from 'next';
import { Inter, Montserrat, DM_Serif_Display, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import FullscreenMenu from '../components/FullscreenMenu';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-montserrat'
});
const dmSerifDisplay = DM_Serif_Display({ 
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-dm-serif'
});
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-noto-kr'
});

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
      <body className={`${inter.className} ${montserrat.variable} ${dmSerifDisplay.variable} ${notoSansKR.variable} bg-white text-neutral-900`}>
        {/* Fullscreen Menu Component */}
        <FullscreenMenu />

        {/* ✅ 페이지 본문 */}
        <main className="min-h-screen">{children}</main>

        {/* ✅ 하단 푸터 - Modern Editorial Style */}
        <footer className="bg-white border-t border-gray-100 text-[#111111] py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* 4-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* MENU Column */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#111111]">MENU</h3>
                <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Home Page</a></li>
                  <li><a href="#" className="hover:text-gray-600 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Collection</a></li>
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Catalogue</a></li>
                </ul>
              </div>

              {/* SOCIAL MEDIA Column */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#111111]">SOCIAL MEDIA</h3>
                <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Facebook</a></li>
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Pinterest</a></li>
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Newsletter</a></li>
                </ul>
              </div>

              {/* CONTACT US Column */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#111111]">CONTACT US</h3>
                <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Showroom</a></li>
                  <li><a href="#" className="hover:text-gray-600 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-gray-600 transition-colors">via Email</a></li>
                </ul>
              </div>

              {/* LOCATION Column */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#111111]">LOCATION</h3>
                <div className="text-sm space-y-2">
                  <a 
                    href="https://naver.me/F0wo4Ive" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:text-gray-600 transition-colors hover:underline cursor-pointer"
                  >
                    <p>경기도 고양시 일산동구<br />호수로 430번길 24</p>
                    <p className="mt-2">T: 0507-1372-0358</p>
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription Form */}
            <div className="mb-12">
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Subscribe and stay informed"
                    className="w-full px-6 py-4 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#111111] transition-colors pr-16"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[#111111] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Brand Message */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-600">머무는 곳이 머물고 싶은 곳이 되도록</p>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-xs text-gray-500 tracking-wider">© 2025 KHAKI SHOP • with quiet intention</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
