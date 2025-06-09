import { Inter } from 'next/font/google';
import Link from 'next/link';
import '../../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function AdminLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Logo */}
            <div className="flex items-center">
              <Link href={`/${locale}`} className="flex items-center hover:opacity-80 transition-opacity">
                <h1 className="text-xl font-semibold text-gray-900">
                  KHAKI SHOP
                </h1>
              </Link>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Admin Panel
              </span>
            </div>
            
            {/* Admin Navigation */}
            <nav className="flex items-center space-x-6">
              <Link 
                href={`/${locale}/admin/images`}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>🎨</span>
                이미지 관리
              </Link>
              
              {/* Divider */}
              <div className="w-px h-4 bg-gray-300" />
              
              <Link 
                href={`/${locale}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span>🏠</span>
                홈페이지로
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Admin Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              © 2024 KHAKI SHOP Admin Panel
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                🔒 보안 모드
              </span>
              <span className="flex items-center gap-1">
                ⚡ {process.env.NODE_ENV === 'development' ? 'Development' : 'Production'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 