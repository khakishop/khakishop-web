import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ================================================================================
// 🚀 동적 로딩으로 성능 최적화
// ================================================================================
const BlindPageClient = dynamic(() => import('../../../components/BlindPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">블라인드 컬렉션 로딩 중...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: '블라인드 컬렉션 | 카키샵',
  description: '정밀한 빛 조절과 공간의 미학을 완성하는 프리미엄 블라인드 컬렉션. 베네치안, 버티컬, 롤러, 로만, 패널 블라인드까지 다양한 스타일을 만나보세요.',
  keywords: '블라인드, 베네치안블라인드, 버티컬블라인드, 롤러블라인드, 로만블라인드, 패널블라인드, 창문블라인드, 사무실블라인드',
  openGraph: {
    title: '블라인드 컬렉션 | 카키샵',
    description: '정밀한 빛 조절과 공간의 미학을 완성하는 프리미엄 블라인드 컬렉션',
    images: [
      {
        url: '/images/blind/premium-venetian-collection/blind-premium-venetian-collection-1.jpg',
        width: 1200,
        height: 630,
        alt: '카키샵 블라인드 컬렉션',
      },
    ],
  },
};

export default function BlindPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">페이지 준비 중...</p>
        </div>
      </div>
    }>
      <BlindPageClient />
    </Suspense>
  );
}
