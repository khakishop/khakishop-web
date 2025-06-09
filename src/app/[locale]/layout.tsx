import { Inter } from 'next/font/google';
import '../globals.css';
import { AdminLayoutProvider } from './admin-layout-provider';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <AdminLayoutProvider>
      {children}
    </AdminLayoutProvider>
  );
} 