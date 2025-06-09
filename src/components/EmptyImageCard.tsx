'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from "../lib/motion";
import {
  validateImageFile,
  getAcceptMimeTypesString,
} from '../utils/validateImageFile';
import { generateMetadataForUpload } from '../utils/imageMap';

// ================================================================================
// 🎨 KHAKISHOP 빈 이미지 카드 (드래그 앤 드롭 영역)
// ================================================================================
// 🎯 목적: 새로운 이미지 업로드를 위한 감성적인 드래그 앤 드롭 카드
// 🎨 스타일: khaki shop 브랜드 감성, 홈페이지와 일치하는 디자인
// ✅ 허용: JPG, JPEG, PNG만
// 🛡️ 기능: 드래그 앤 드롭, 파일 선택, 실시간 유효성 검사

interface EmptyImageCardProps {
  onUpload: (file: File, metadata: any) => Promise<void>;
  category?: string;
  disabled?: boolean;
}

export default function EmptyImageCard({
  onUpload,
  category = 'gallery',
  disabled = false,
}: EmptyImageCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'success' | 'error' | 'validation-error'
  >('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // khaki shop 브랜드 색상 (홈페이지와 동일)
  const colors = {
    cream: '#F7F5F3',
    warmWhite: '#FEFDFB',
    earthBrown: '#8B7A6B',
    textPrimary: '#2D2823',
    textSecondary: '#4A453E',
    accent: '#E8E5E1',
    khakiBeige: '#D4C4A8',
  };

  // 카테고리 아이콘
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      hero: '🌟',
      landing: '🏠',
      projects: '🏗️',
      collections: '🎨',
      references: '🏢',
      products: '🛍️',
      gallery: '🖼️',
      blog: '📝',
      about: '👥',
      future: '🚀',
    };
    return icons[category] || '📷';
  };

  // 파일 업로드 처리
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file || disabled) return;

      const validationResult = validateImageFile(file, 10);
      if (!validationResult.isValid) {
        setValidationMessage(
          validationResult.message +
            (validationResult.suggestedAction
              ? ` ${validationResult.suggestedAction}`
              : '')
        );
        setUploadStatus('validation-error');
        setTimeout(() => {
          setUploadStatus('idle');
          setValidationMessage('');
        }, 4000);
        return;
      }

      setIsUploading(true);
      setUploadStatus('idle');
      setValidationMessage('');
      setUploadProgress(0);

      try {
        const metadata = generateMetadataForUpload(
          file.name,
          category,
          `새로 업로드된 ${category} 이미지`
        );

        // 진행률 시뮬레이션
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 20;
          });
        }, 200);

        await onUpload(file, metadata);

        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadStatus('success');
        setValidationMessage(
          `✅ 업로드 완료! ${(file.size / 1024 / 1024).toFixed(2)}MB`
        );

        setTimeout(() => {
          setUploadStatus('idle');
          setValidationMessage('');
          setUploadProgress(0);
        }, 3000);
      } catch (error) {
        console.error('업로드 오류:', error);
        setUploadStatus('error');
        setValidationMessage(
          `❌ 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
        );

        setTimeout(() => {
          setUploadStatus('idle');
          setValidationMessage('');
          setUploadProgress(0);
        }, 5000);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, category, disabled]
  );

  // 드래그 앤 드롭 이벤트 핸들러들
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (!disabled) {
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
          handleFileUpload(files[0]);
        }
      }
    },
    [handleFileUpload, disabled]
  );

  // 파일 선택 핸들러
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  // 클릭 핸들러
  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      {/* 🎨 감성적 업로드 카드 - 홈페이지 스타일 */}
      <div
        className={`
          relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg
          transition-all duration-300 ease-out cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}
          ${isDragOver ? 'scale-[0.98] shadow-2xl ring-4 ring-blue-200' : ''}
          ${isUploading ? 'scale-[0.98] brightness-75' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* 🌈 그라디언트 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />

        {/* 📸 중앙 콘텐츠 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isUploading ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                {/* 업로드 아이콘 */}
                <motion.div
                  animate={{
                    scale: isDragOver ? [1, 1.2, 1] : 1,
                    rotate: isDragOver ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isDragOver ? Infinity : 0,
                  }}
                  className={`
                    text-8xl mb-4 transition-all duration-300
                    ${isDragOver ? 'filter drop-shadow-lg' : 'text-gray-400 group-hover:text-blue-500'}
                  `}
                >
                  {isDragOver ? '📤' : '📸'}
                </motion.div>

                {/* 메인 텍스트 */}
                <h3
                  className={`
                  text-xl font-semibold mb-2 transition-colors duration-300
                  ${isDragOver ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}
                `}
                >
                  {isDragOver ? '이미지를 드롭하세요' : '새 이미지 업로드'}
                </h3>

                {/* 설명 텍스트 */}
                <p
                  className={`
                  text-sm mb-4 transition-colors duration-300
                  ${isDragOver ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'}
                `}
                >
                  {isDragOver
                    ? 'JPG, PNG 파일만 허용됩니다'
                    : '클릭하거나 파일을 드래그해서 업로드하세요'}
                </p>

                {/* 카테고리 배지 */}
                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                  {getCategoryIcon(category)} {category}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                {/* 업로드 진행 상태 */}
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  업로드 중...
                </h3>
                <div className="w-48 bg-gray-200 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {Math.round(uploadProgress)}% 완료
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🌓 호버 오버레이 */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent
          transition-opacity duration-300
          ${isDragOver ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'}
        `}
        />

        {/* 📂 드래그 오버레이 */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm border-4 border-dashed border-blue-400 rounded-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-blue-600 text-center"
              >
                <div className="text-4xl mb-2">⬇️</div>
                <div className="font-medium">지금 드롭하세요!</div>
              </motion.div>
            </div>
          </div>
        )}

        {/* 🔄 업로드 진행 오버레이 */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <div className="text-blue-600 font-medium">이미지 처리 중...</div>
            </div>
          </div>
        )}
      </div>

      {/* 📊 상태 메시지 */}
      <AnimatePresence>
        {validationMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`
              mt-3 p-3 rounded-lg text-sm font-medium
              ${
                uploadStatus === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : uploadStatus === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
              }
            `}
          >
            {validationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔧 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptMimeTypesString()}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </motion.div>
  );
}
