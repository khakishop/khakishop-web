import '../globals.css';
import { AdminLayoutProvider } from './admin-layout-provider';

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <AdminLayoutProvider>{children}</AdminLayoutProvider>;
}
