'use client';

import { useState, useEffect } from 'react';
import type { ImageMapping } from '../utils/imageMap';


export function useImageData(urlCategory: string, urlSubcategory?: string) {
  const [images, setImages] = useState<ImageMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);

        console.log('🚀 API 호출 시작:', { urlCategory, urlSubcategory });

        // 단순하게 모든 이미지 가져오기 (매핑 없이)
        const response = await fetch('/api/sync-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'all' }),
        });

        console.log('📡 API 응답 상태:', response.status);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 받은 데이터:', {
          총개수: data.syncedImages?.length || 0,
          처음5개: data.syncedImages?.slice(0, 5),
        });

        // 모든 이미지 표시 (필터링 없이)
        const allImages = data.syncedImages || [];

        console.log('✅ 최종 이미지:', allImages.length + '개');

        setImages(allImages);
        setError(null);
      } catch (err) {
        console.error('❌ 에러 발생:', err);
        setError(
          err instanceof Error ? err.message : '이미지를 불러올 수 없습니다'
        );
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [urlCategory, urlSubcategory]);

  return { images, loading, error };
}
