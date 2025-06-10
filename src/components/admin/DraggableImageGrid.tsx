'use client';

import React, { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import type { ImageMapping } from '../../utils/imageMap';
import ImageManagerCard from '../ImageManagerCard';
import { ImageGridSkeleton } from '../ui/Skeleton';

interface DraggableImageGridProps {
  images: ImageMapping[];
  onImageSelect?: (image: ImageMapping) => void;
  onImageEdit?: (image: ImageMapping) => void;
  onImageDelete?: (image: ImageMapping) => void;
  onImageReorder?: (reorderedImages: ImageMapping[]) => Promise<void>;
  selectedImage?: ImageMapping | null;
  onImagesUpdate?: () => void;
  uploadCategory?: string;
  uploadSubcategory?: string;
  loading?: boolean;
  enableDrag?: boolean;
}

interface SortableImageItemProps {
  image: ImageMapping;
  onImageDelete?: (image: ImageMapping) => void;
  onImagesUpdate?: () => void;
  enableDrag: boolean;
}

// 드래그 가능한 이미지 아이템 컴포넌트
function SortableImageItem({ 
  image, 
  onImageDelete, 
  onImagesUpdate, 
  enableDrag 
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
    disabled: !enableDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(enableDrag ? attributes : {})}
      className={`
        relative transition-all duration-200 
        ${isDragging ? 'z-50 shadow-2xl' : 'z-0'}
        ${enableDrag ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
    >
      {/* 드래그 핸들 */}
      {enableDrag && (
        <div
          {...listeners}
          className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm 
                     rounded-lg p-2 shadow-md hover:shadow-lg transition-all
                     cursor-grab active:cursor-grabbing"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-600"
          >
            <circle cx="9" cy="12" r="1"/>
            <circle cx="9" cy="5" r="1"/>
            <circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="12" r="1"/>
            <circle cx="15" cy="5" r="1"/>
            <circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
      )}

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
          console.log('DraggableImageGrid: Image delete requested:', imageId);
          const imageToDelete = image;
          if (imageToDelete && onImageDelete) {
            onImageDelete(imageToDelete);
          }
        }}
      />
    </div>
  );
}

export default function DraggableImageGrid({
  images,
  onImageSelect,
  onImageEdit,
  onImageDelete,
  onImageReorder,
  selectedImage,
  onImagesUpdate,
  uploadCategory,
  uploadSubcategory,
  loading = false,
  enableDrag = true,
}: DraggableImageGridProps) {
  // 이미지들을 displayOrder로 정렬
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      const orderA = a.displayOrder ?? 999999;
      const orderB = b.displayOrder ?? 999999;
      return orderA - orderB;
    });
  }, [images]);

  const [localImages, setLocalImages] = useState<ImageMapping[]>(sortedImages);
  const [isReordering, setIsReordering] = useState(false);

  // images prop이 변경되면 로컬 상태 업데이트
  React.useEffect(() => {
    setLocalImages(sortedImages);
  }, [sortedImages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동해야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localImages.findIndex((item) => item.id === active.id);
      const newIndex = localImages.findIndex((item) => item.id === over?.id);

      const reorderedImages = arrayMove(localImages, oldIndex, newIndex);
      
      // displayOrder 업데이트
      const updatedImages = reorderedImages.map((image, index) => ({
        ...image,
        displayOrder: index,
      }));

      setLocalImages(updatedImages);
      setIsReordering(true);

      try {
        // 순서 변경 API 호출
        if (onImageReorder) {
          await onImageReorder(updatedImages);
        }
      } catch (error) {
        console.error('이미지 순서 변경 실패:', error);
        // 실패 시 원래 순서로 복원
        setLocalImages(sortedImages);
      } finally {
        setIsReordering(false);
      }
    }
  };

  // 로딩 상태
  if (loading) {
    return <ImageGridSkeleton count={8} />;
  }

  // 이미지가 없는 경우
  if (localImages.length === 0) {
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
    <div className="relative">
      {/* 순서 변경 중 오버레이 */}
      {isReordering && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-40 
                        flex items-center justify-center rounded-lg">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 
                          shadow-lg flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              순서 변경 중...
            </span>
          </div>
        </div>
      )}

      {/* 드래그 가능 여부 표시 */}
      {enableDrag && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 
                        px-3 py-2 rounded-lg border border-blue-200">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600"
          >
            <circle cx="9" cy="12" r="1"/>
            <circle cx="9" cy="5" r="1"/>
            <circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="12" r="1"/>
            <circle cx="15" cy="5" r="1"/>
            <circle cx="15" cy="19" r="1"/>
          </svg>
          <span>
            이미지를 드래그하여 순서를 변경할 수 있습니다. 
            오른쪽 상단의 ⋮⋮ 아이콘을 드래그하세요.
          </span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localImages.map(img => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                          gap-6 p-4">
            {localImages.map((image) => (
              <SortableImageItem
                key={image.id}
                image={image}
                onImageDelete={onImageDelete}
                onImagesUpdate={onImagesUpdate}
                enableDrag={enableDrag}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
} 