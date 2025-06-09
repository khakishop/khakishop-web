'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';

interface ImageUploadZoneProps {
  category: string;
  subcategory?: string;
  onUploadSuccess?: (uploadedFiles: string[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  fileSize?: number;
}

export default function ImageUploadZone({
  category,
  subcategory,
  onUploadSuccess,
  onUploadError,
  maxFiles = 10,
  maxSizeMB = 10
}: ImageUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메모이제이션된 유효성 검사 설정
  const uploadConfig = useMemo(() => ({
    maxSizeBytes: maxSizeMB * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'] as const,
  }), [maxSizeMB]);

  // 파일 유효성 검사 (메모이제이션)
  const validateFile = useCallback((file: File): string | null => {
    if (!uploadConfig.allowedTypes.includes(file.type as any)) {
      return `지원하지 않는 파일 형식입니다: ${file.type}`;
    }
    if (file.size > uploadConfig.maxSizeBytes) {
      return `파일 크기가 너무 큽니다: ${(file.size / 1024 / 1024).toFixed(2)}MB (최대 ${maxSizeMB}MB)`;
    }
    return null;
  }, [uploadConfig, maxSizeMB]);

  // 배치 업로드 처리 (성능 최적화)
  const uploadFile = useCallback(async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (subcategory) {
      formData.append('subcategory', subcategory);
    }

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `업로드 실패: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '업로드 실패');
      }

      // 성공 상태 업데이트
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          progress: 100,
          status: 'success'
        }
      }));

      return result;
    } catch (error) {
      // 에러 상태 업데이트
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: 'error',
          error: errorMessage
        }
      }));
      throw error;
    }
  }, [category, subcategory]);

  // 배치 파일 처리 (debounced)
  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // 파일 수 제한 확인
    if (files.length > maxFiles) {
      onUploadError?.(`최대 ${maxFiles}개의 파일까지 업로드 가능합니다.`);
      return;
    }

    // 모든 파일 유효성 검사
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (validationErrors.length > 0) {
      onUploadError?.(validationErrors.join('\n'));
      return;
    }

    if (validFiles.length === 0) {
      onUploadError?.('유효한 파일이 없습니다.');
      return;
    }

    // 업로드 진행 상태 초기화
    const initialProgress: Record<string, UploadProgress> = {};
    validFiles.forEach(file => {
      initialProgress[file.name] = {
        fileName: file.name,
        progress: 0,
        status: 'uploading',
        fileSize: file.size
      };
    });
    setUploadProgress(initialProgress);
    setIsUploading(true);

    try {
      // 배치 업로드 실행 (병렬 처리, 최대 3개씩)
      const uploadPromises = validFiles.map(async (file, index) => {
        // 스태거드 업로드로 서버 부하 분산
        await new Promise(resolve => setTimeout(resolve, index * 100));
        return uploadFile(file);
      });

      const results = await Promise.allSettled(uploadPromises);
      
      // 결과 처리
      const successful: string[] = [];
      const failed: string[] = [];

      results.forEach((result, index) => {
        const fileName = validFiles[index].name;
        if (result.status === 'fulfilled') {
          successful.push(fileName);
        } else {
          failed.push(`${fileName}: ${result.reason}`);
        }
      });

      // 콜백 실행
      if (successful.length > 0) {
        onUploadSuccess?.(successful);
      }

      if (failed.length > 0) {
        onUploadError?.(failed.join('\n'));
      }

      // 3초 후 진행 상태 초기화
      setTimeout(() => {
        setUploadProgress({});
      }, 3000);

    } catch (error) {
      console.error('배치 업로드 실패:', error);
      onUploadError?.(error instanceof Error ? error.message : '업로드 실패');
    } finally {
      setIsUploading(false);
    }
  }, [maxFiles, validateFile, uploadFile, onUploadSuccess, onUploadError]);

  // 드래그 앤 드롭 핸들러들
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  // 클릭 업로드 핸들러
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
    // 파일 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  // 진행 상태 관련 계산
  const progressEntries = Object.values(uploadProgress);
  const hasActiveUploads = progressEntries.length > 0;
  const completedCount = progressEntries.filter(p => p.status === 'success').length;
  const errorCount = progressEntries.filter(p => p.status === 'error').length;
  const uploadingCount = progressEntries.filter(p => p.status === 'uploading').length;

  return (
    <div className="space-y-4">
      {/* 메인 업로드 영역 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 scale-105'
            : isUploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isUploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={uploadConfig.allowedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {!isUploading ? (
          <div className="space-y-4">
            <div className="text-4xl mb-4">
              {isDragOver ? '📤' : '📷'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragOver ? '파일을 놓아주세요' : '이미지 업로드'}
              </h3>
              <p className="text-gray-600 mb-4">
                파일을 드래그 앤 드롭하거나 클릭하여 선택하세요
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>✅ 지원 형식: {uploadConfig.allowedExtensions.join(', ')}</p>
                <p>📏 최대 크기: {maxSizeMB}MB</p>
                <p>📦 최대 파일 수: {maxFiles}개</p>
                <p>📁 업로드 위치: {category}{subcategory ? `/${subcategory}` : ''}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl animate-bounce">⬆️</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                업로드 중...
              </h3>
              <p className="text-gray-600">
                {uploadingCount}개 업로드 중 · {completedCount}개 완료 · {errorCount}개 실패
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 업로드 진행 상태 */}
      {hasActiveUploads && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <span>📊</span>
            <span>업로드 진행 상태</span>
          </h4>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {progressEntries.map((progress) => (
              <div key={progress.fileName} className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {progress.fileName}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {progress.fileSize && `${(progress.fileSize / 1024 / 1024).toFixed(2)}MB`}
                    </span>
                  </div>
                  
                  {progress.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {progress.status === 'error' && progress.error && (
                    <p className="text-xs text-red-600 mt-1">{progress.error}</p>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  {progress.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                  {progress.status === 'success' && (
                    <span className="text-green-600 text-sm">✅</span>
                  )}
                  {progress.status === 'error' && (
                    <span className="text-red-600 text-sm">❌</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* 전체 진행률 표시 */}
          {progressEntries.length > 1 && (
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">전체 진행률</span>
                <span className="text-gray-900 font-medium">
                  {Math.round((completedCount + errorCount) / progressEntries.length * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(completedCount + errorCount) / progressEntries.length * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 