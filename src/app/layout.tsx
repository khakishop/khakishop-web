import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat, DM_Serif_Display, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import FullscreenMenu from '../components/FullscreenMenu';
import { GoogleAnalytics } from '@next/third-parties/google';

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
  title: 'khaki shop | 감성과 기능을 담은 텍스타일 전문점',
  description: '카키샵은 커튼, 블라인드, 전동 시스템 등 감성과 기능을 모두 담은 인테리어 솔루션을 제공합니다.',
  keywords: '카키샵, khaki shop, 커튼, 블라인드, 전동시스템, 텍스타일, 인테리어, 일산, 호수로',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'khaki shop',
    description: '감성과 기능을 담은 커튼 & 블라인드 브랜드',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'khaki shop 대표 이미지'
      }
    ],
    type: 'website',
    locale: 'ko_KR',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="khaki shop" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="khaki shop" />
        <meta name="description" content="커튼과 블라인드의 새로운 기준" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#111111" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Icons */}
        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#111111" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Microsoft */}
        <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
        
        {/* Splash screens */}
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.jpg" sizes="2048x2732" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2224.jpg" sizes="1668x2224" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.jpg" sizes="1536x2048" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.jpg" sizes="1125x2436" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2208.jpg" sizes="1242x2208" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.jpg" sizes="750x1334" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-640-1136.jpg" sizes="640x1136" />
      </head>
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
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
