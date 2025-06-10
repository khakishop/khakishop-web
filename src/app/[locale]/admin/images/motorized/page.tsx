'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMotorizedImagesPage() {
  const router = useRouter();

  useEffect(() => {
    // 메인 관리자 페이지로 리다이렉트하고 모터라이즈드 카테고리 필터 적용
    router.replace('/ko/admin/images?category=motorized&view=browser');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">모터라이즈드 이미지 관리 페이지로 이동 중...</p>
      </div>
    </div>
  );
} 