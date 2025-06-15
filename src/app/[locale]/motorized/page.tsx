import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ================================================================================
// 🚀 동적 로딩으로 성능 최적화
// ================================================================================
const MotorizedPageClient = dynamic(() => import('../../../components/MotorizedPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">모터라이즈드 컬렉션 로딩 중...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: '모터라이즈드 컬렉션 | 카키샵',
  description: '미래형 스마트홈을 위한 모터라이즈드 시스템. 음성 제어, 앱 제어, AI 자동화로 편리하고 스마트한 창호 솔루션을 경험하세요.',
  keywords: '모터라이즈드, 스마트커튼, 스마트블라인드, 홈오토메이션, 음성제어, 앱제어, 자동화시스템, IoT창호',
  openGraph: {
    title: '모터라이즈드 컬렉션 | 카키샵',
    description: '미래형 스마트홈을 위한 모터라이즈드 시스템',
    images: [
      {
        url: '/images/motorized/smart-curtain-system/main.jpg',
        width: 1200,
        height: 630,
        alt: '카키샵 모터라이즈드 컬렉션',
      },
    ],
  },
};

export default function MotorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">페이지 준비 중...</p>
        </div>
      </div>
    }>
      <MotorizedPageClient />
    </Suspense>
  );
}
