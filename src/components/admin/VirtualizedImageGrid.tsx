import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import type { ImageMapping } from '../../utils/imageMap';
import ImageManagerCard from '../ImageManagerCard';
import { ImageGridSkeleton } from '../ui/Skeleton';

interface VirtualizedImageGridProps {
  images: ImageMapping[];
  onImageSelect?: (image: ImageMapping) => void;
  onImageEdit?: (image: ImageMapping) => void;
  onImageDelete?: (image: ImageMapping) => void;
  selectedImage?: ImageMapping | null;
  onImagesUpdate?: () => void;
  uploadCategory?: string;
  uploadSubcategory?: string;
  loading?: boolean;
}

// 고정 카드 크기
const CARD_WIDTH = 280;
const CARD_HEIGHT = 280;
const GAP = 24; // gap-6

export default function VirtualizedImageGrid({
  images,
  onImageSelect,
  onImageEdit,
  onImageDelete,
  selectedImage,
  onImagesUpdate,
  uploadCategory,
  uploadSubcategory,
  loading = false
}: VirtualizedImageGridProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // 컨테이너 크기 감지
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    
    resizeObserver.observe(node);
    
    // 초기 크기 설정
    const { width, height } = node.getBoundingClientRect();
    setContainerSize({ width, height });
    
    return () => resizeObserver.disconnect();
  }, []);

  // 그리드 레이아웃 계산
  const { columnCount, rowCount, columnWidth, rowHeight } = useMemo(() => {
    if (containerSize.width === 0) {
      return { columnCount: 1, rowCount: 1, columnWidth: CARD_WIDTH, rowHeight: CARD_HEIGHT };
    }

    const availableWidth = containerSize.width - 24; // padding
    const columnsCount = Math.max(1, Math.floor(availableWidth / (CARD_WIDTH + GAP)));
    const actualColumnWidth = (availableWidth - (GAP * (columnsCount - 1))) / columnsCount;
    const rowsCount = Math.ceil(images.length / columnsCount);

    return {
      columnCount: columnsCount,
      rowCount: rowsCount,
      columnWidth: actualColumnWidth,
      rowHeight: CARD_HEIGHT + GAP
    };
  }, [containerSize.width, images.length]);

  // 그리드 아이템 렌더러
  const GridItem = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const imageIndex = rowIndex * columnCount + columnIndex;
    const image = images[imageIndex];

    if (!image) {
      return <div style={style} />;
    }

    return (
      <div
        style={{
          ...style,
          padding: `0 ${GAP / 2}px ${GAP}px ${GAP / 2}px`,
        }}
      >
        <div className="w-full h-full">
          <ImageManagerCard
            imageData={image}
            onUpdate={(imageId: string, newPath: string) => {
              console.log('Image updated:', imageId, newPath);
              onImagesUpdate?.();
            }}
            onProtectionToggle={(imageId: string, isProtected: boolean) => {
              console.log('Protection toggled:', imageId, isProtected);
              onImagesUpdate?.();
            }}
            onDelete={(imageId: string) => {
              console.log('VirtualizedImageGrid: Image delete requested:', imageId);
              const imageToDelete = images.find(img => img.id === imageId);
              if (imageToDelete && onImageDelete) {
                onImageDelete(imageToDelete);
              }
            }}
          />
        </div>
      </div>
    );
  }, [images, columnCount, onImagesUpdate, onImageDelete]);

  // 로딩 상태
  if (loading) {
    return <ImageGridSkeleton count={8} />;
  }

  // 이미지가 없는 경우
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📷</div>
        <h3 className="text-lg font-medium mb-2">이미지가 없습니다</h3>
        <p className="text-sm text-center">
          {uploadCategory ? 
            `${uploadCategory} 카테고리에 이미지를 업로드해보세요.` :
            '이미지를 업로드하거나 동기화를 실행해보세요.'
          }
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[600px]"
      style={{ padding: '12px' }}
    >
      {containerSize.width > 0 && (
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={Math.min(containerSize.height, 800)} // 최대 높이 제한
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={containerSize.width}
          overscanRowCount={2} // 성능 최적화: 2행 미리 렌더링
          overscanColumnCount={1}
        >
          {GridItem}
        </Grid>
      )}
    </div>
  );
} 