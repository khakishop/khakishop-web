'use client';

import React, { useState, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from '../../lib/motion';
import type { ImageMapping, ImageMetadata } from '../../utils/imageMap';
import { MASTER_CATEGORIES, getCategoryIcon, getCategoryDisplayName } from '../../utils/constants/categories';
import { LocalDateDisplay } from '../LocalTimeDisplay';

interface AdminImageEditPanelProps {
  image: ImageMapping;
  onSave?: (updatedImage: ImageMapping) => void;
  onClose?: () => void;
  onDelete?: (imageId: string) => void;
  isOpen: boolean;
}

const AdminImageEditPanel = memo(function AdminImageEditPanel({
  image,
  onSave,
  onClose,
  onDelete,
  isOpen
}: AdminImageEditPanelProps) {
  console.log('🎨 AdminImageEditPanel 렌더링:', { hasImage: !!image, isOpen });

  // 모든 useState와 useCallback을 최상위에 배치
  const [editedMetadata, setEditedMetadata] = useState<ImageMetadata>(
    image?.metadata || {
      keywords: [],
      description: image?.fileName ? `${image.fileName} 설명` : '기본 설명',
      subject: [],
      title: image?.fileName || image?.sourceFile || '제목 없음',
      alt: image?.fileName ? `khaki shop - ${image.fileName}` : `khaki shop - ${image?.sourceFile || ''}`,
      category: image?.category || 'uncategorized',
      priority: 5,
      dataStyle: 'default'
    }
  );
  const [isProtected, setIsProtected] = useState(image?.isProtected || false);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  const handleSave = useCallback(async () => {
    if (!onSave || !image) return;
    
    setIsSaving(true);
    try {
      const updatedImage: ImageMapping = {
        ...image,
        metadata: editedMetadata,
        isProtected,
      };
      
      await onSave(updatedImage);
      onClose?.();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editedMetadata, isProtected, image, onSave, onClose]);

  const handleDelete = useCallback(() => {
    if (!onDelete || !image) return;
    
    if (confirm('이 이미지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      onDelete(image.id);
      onClose?.();
    }
  }, [image, onDelete, onClose]);

  const updateMetadata = useCallback((field: keyof ImageMetadata, value: string | number) => {
    setEditedMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const initializeEditState = useCallback(() => {
    if (image) {
      setNewDescription(image.metadata?.description || '');
      setIsProtected(image.isProtected || false);
    }
  }, [image]);

  useEffect(() => {
    initializeEditState();
  }, [initializeEditState]);

  // Early returns는 모든 hooks 이후에 배치
  if (!image) {
    console.warn('⚠️ AdminImageEditPanel: image가 없습니다');
    return null;
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="flex h-full">
            {/* 이미지 미리보기 */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center">
              <div className="p-8">
                <img
                  src={`/images/${image.metadata?.category}/${image.sourceFile}`}
                  alt={image.metadata?.alt || image.sourceFile}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* 편집 패널 */}
            <div className="w-1/2 p-6 overflow-y-auto">
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">이미지 편집</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* 기본 정보 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일명
                  </label>
                  <input
                    type="text"
                    value={image.sourceFile}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID
                  </label>
                  <input
                    type="text"
                    value={image.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={editedMetadata.category}
                    onChange={(e) => updateMetadata('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {MASTER_CATEGORIES.map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.icon} {category.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt 텍스트
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.alt}
                    onChange={(e) => updateMetadata('alt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이미지 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.title}
                    onChange={(e) => updateMetadata('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이미지 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  {editMode ? (
                    <textarea
                      value={newDescription}
                      onChange={(e) => {
                        setNewDescription(e.target.value);
                        updateMetadata('description', e.target.value);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="상세 설명을 입력하세요"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {editedMetadata.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    우선순위
                  </label>
                  <input
                    type="number"
                    value={editedMetadata.priority}
                    onChange={(e) => updateMetadata('priority', parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    데이터 스타일
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.dataStyle}
                    onChange={(e) => updateMetadata('dataStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CSS 클래스나 스타일 이름"
                  />
                </div>

                {/* 보호 설정 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">보호된 이미지</h3>
                    <p className="text-sm text-gray-600">삭제 및 수정이 제한됩니다</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isProtected}
                      onChange={(e) => setIsProtected(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* 메타데이터 정보 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">메타데이터 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">생성일:</span>
                      <span className="text-gray-900">
                        <LocalDateDisplay date={image.createdAt} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">파일 경로:</span>
                      <span className="text-gray-900 text-xs font-mono">
                        {image.targetPath}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={handleDelete}
                  disabled={isProtected}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isProtected
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isProtected ? '보호됨' : '삭제'}
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  {editMode ? (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? '저장 중...' : '저장'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      편집하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default AdminImageEditPanel; 