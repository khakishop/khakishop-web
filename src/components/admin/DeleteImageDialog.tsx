'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from '../../lib/motion';
import type { ImageMapping } from '../../utils/imageMap';

interface DeleteImageDialogProps {
  isOpen: boolean;
  image: ImageMapping | null;
  onClose: () => void;
  onConfirm: (imageId: string) => Promise<boolean>;
  isDeleting?: boolean;
}

export default function DeleteImageDialog({
  isOpen,
  image,
  onClose,
  onConfirm,
  isDeleting = false
}: DeleteImageDialogProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!image) return;

    setIsProcessing(true);
    setDeleteError(null);

    try {
      const success = await onConfirm(image.id);
      
      if (success) {
        onClose();
      } else {
        setDeleteError('이미지 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 확인 처리 오류:', error);
      setDeleteError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setDeleteError(null);
      onClose();
    }
  };

  if (!image) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">🗑️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">
                    이미지 삭제 확인
                  </h3>
                  <p className="text-sm text-red-700">
                    이 작업은 되돌릴 수 없습니다
                  </p>
                </div>
              </div>
            </div>

            {/* 이미지 미리보기 */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt || image.sourceFile}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                    📷
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {image.sourceFile}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {image.targetPath}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {image.metadata?.category || '카테고리 없음'}
                    </span>
                    {image.isProtected && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        🔒 보호됨
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 경고 메시지 */}
            <div className="px-6 py-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-amber-400 text-lg">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-800">
                      다음 작업이 수행됩니다:
                    </h4>
                    <ul className="mt-2 text-sm text-amber-700 space-y-1">
                      <li>• 실제 파일이 서버에서 영구 삭제됩니다</li>
                      <li>• 이미지 매핑 정보가 제거됩니다</li>
                      <li>• 이미지를 사용하는 페이지에서 이미지가 표시되지 않습니다</li>
                      <li>• 이 작업은 되돌릴 수 없습니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 에러 메시지 */}
            {deleteError && (
              <div className="px-6 pb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-red-400 text-sm">❌</span>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm text-red-800">{deleteError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 버튼 영역 */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>삭제 중...</span>
                  </>
                ) : (
                  <>
                    <span>🗑️</span>
                    <span>영구 삭제</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 