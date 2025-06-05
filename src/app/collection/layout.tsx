import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collection | khaki shop',
  description: '엄선된 텍스타일 컬렉션으로 공간의 품격을 높여보세요. 커튼, 블라인드, 전동 시스템, 액세서리까지 다양한 컬렉션을 만나보세요.',
  keywords: '텍스타일 컬렉션, 커튼 컬렉션, 블라인드 컬렉션, 전동 시스템, 인테리어 액세서리, khaki shop',
  openGraph: {
    title: 'Collection | khaki shop',
    description: '엄선된 텍스타일 컬렉션으로 공간의 품격을 높여보세요.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'khaki shop collection'
      }
    ],
    type: 'website',
    locale: 'ko_KR',
  }
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 