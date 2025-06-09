// ================================================================================
// 🎯 KHAKISHOP - 중앙화된 이미지 관리 훅
// ================================================================================
// 목적: 상태 관리 로직 분리, 초기화 순서 문제 방지, 무한 루프 방지

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from '../lib/imports';
import type { ImageMapping } from '../utils/imageMap';
import type { ApiResponse } from '../types/api';

interface UseImageManagerOptions {
  autoSync?: boolean;
  syncInterval?: number;
  maxRetries?: number;
}

interface UseImageManagerReturn {
  // State
  mappedImages: ImageMapping[];
  loading: boolean;
  error: string | null;
  lastSyncTime: Date | null;

  // Actions
  syncImages: () => Promise<void>;
  updateImage: (
    imageId: string,
    updates: Partial<ImageMapping>
  ) => Promise<void>;
  deleteImage: (imageId: string) => Promise<void>;
  uploadImage: (file: File, metadata: any) => Promise<void>;

  // Computed
  categoryStats: Record<string, number>;
  protectedImages: ImageMapping[];

  // Utils
  isReady: boolean;
  retryCount: number;
}

export function useImageManager(
  options: UseImageManagerOptions = {}
): UseImageManagerReturn {
  const {
    autoSync = true,
    syncInterval = 30000, // 30초
    maxRetries = 3,
  } = options;

  // ================================================================================
  // 🔒 상태 관리 (안전한 초기화)
  // ================================================================================

  const [mappedImages, setMappedImages] = useState<ImageMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Refs for cleanup and abort control
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ================================================================================
  // 🔄 이미지 동기화 로직 (무한 루프 방지)
  // ================================================================================

  const syncImages = useCallback(async (): Promise<void> => {
    if (loading || !isMountedRef.current) return;

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/sync-images?stats=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRepair: false, includeStats: true }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`동기화 실패: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (!isMountedRef.current) return;

      if (result.success && result.data?.mappedImages) {
        setMappedImages(result.data.mappedImages);
        setLastSyncTime(new Date());
        setRetryCount(0);
        setIsReady(true);
      } else {
        throw new Error(result.message || '동기화 데이터 형식 오류');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;

      if (!isMountedRef.current) return;

      console.error('🔥 이미지 동기화 실패:', error);
      setError(error.message);

      // 재시도 로직
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        syncTimeoutRef.current = setTimeout(
          () => {
            if (isMountedRef.current) {
              syncImages();
            }
          },
          2000 * (retryCount + 1)
        ); // 점진적 백오프
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [loading, retryCount, maxRetries]);

  // ================================================================================
  // 📊 계산된 값들 (메모이제이션)
  // ================================================================================

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    mappedImages.forEach((img) => {
      const category = img.metadata?.category || 'unknown';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  }, [mappedImages]);

  const protectedImages = useMemo(() => {
    return mappedImages.filter((img) => img.isProtected);
  }, [mappedImages]);

  // ================================================================================
  // 🛠️ CRUD 작업들
  // ================================================================================

  const updateImage = useCallback(
    async (imageId: string, updates: Partial<ImageMapping>) => {
      if (!isMountedRef.current) return;

      // 낙관적 업데이트
      setMappedImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, ...updates } : img))
      );

      try {
        // API 호출 로직...
        console.log('🔄 이미지 업데이트:', imageId, updates);
      } catch (error) {
        console.error('❌ 이미지 업데이트 실패:', error);
        // 실패 시 재동기화
        await syncImages();
      }
    },
    [syncImages]
  );

  const deleteImage = useCallback(
    async (imageId: string) => {
      if (!isMountedRef.current) return;

      // 낙관적 업데이트
      setMappedImages((prev) => prev.filter((img) => img.id !== imageId));

      try {
        // API 호출 로직...
        console.log('🗑️ 이미지 삭제:', imageId);
      } catch (error) {
        console.error('❌ 이미지 삭제 실패:', error);
        await syncImages();
      }
    },
    [syncImages]
  );

  const uploadImage = useCallback(
    async (file: File, metadata: any) => {
      if (!isMountedRef.current) return;

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('업로드 실패');
        }

        // 업로드 후 재동기화
        await syncImages();
      } catch (error) {
        console.error('❌ 이미지 업로드 실패:', error);
        setError(error instanceof Error ? error.message : '업로드 실패');
      } finally {
        setLoading(false);
      }
    },
    [syncImages]
  );

  // ================================================================================
  // 🚀 생명주기 관리
  // ================================================================================

  useEffect(() => {
    isMountedRef.current = true;

    // 초기 동기화
    if (autoSync) {
      syncImages();
    }

    // 정기 동기화
    if (autoSync && syncInterval > 0) {
      const interval = setInterval(() => {
        if (isMountedRef.current && !loading) {
          syncImages();
        }
      }, syncInterval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [autoSync, syncInterval, syncImages, loading]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    mappedImages,
    loading,
    error,
    lastSyncTime,

    // Actions
    syncImages,
    updateImage,
    deleteImage,
    uploadImage,

    // Computed
    categoryStats,
    protectedImages,

    // Utils
    isReady,
    retryCount,
  };
}
