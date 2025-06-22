"use client";

/**
 * ================================================================================
 * 🎯 DragDropProvider.tsx - 향상된 드래그 앤 드롭 업로드 시스템
 * ================================================================================
 * 
 * 개선사항:
 * - 실제 파일 업로드 API 연동
 * - 세밀한 진행률 표시
 * - 파일 형식 및 크기 검증
 * - 에러 처리 및 재시도 기능
 * - 업로드 완료 후 자동 새로고침
 * - 여러 파일 동시 업로드 지원
 */

import { AlertCircle, CheckCircle, FileImage, RefreshCw, Upload, X } from 'lucide-react';
import { ChangeEvent, DragEvent, useCallback, useRef, useState } from 'react';

interface DragDropProviderProps {
  children: React.ReactNode;
  onImageUpload: (files: File[]) => Promise<void>;
  onUploadComplete?: () => void; // 업로드 완료 후 콜백
}

interface UploadFile {
  file: File;
  id: string;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  retryCount: number;
}

export default function DragDropProvider({
  children,
  onImageUpload,
  onUploadComplete
}: DragDropProviderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 검증 함수
  const validateFile = useCallback((file: File): string | null => {
    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return `파일 크기가 너무 큽니다: ${(file.size / 1024 / 1024).toFixed(1)}MB (최대 10MB)`;
    }

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return `지원하지 않는 파일 형식입니다: ${file.type}`;
    }

    // 파일명 검증
    if (file.name.length > 100) {
      return '파일명이 너무 깁니다 (최대 100자)';
    }

    return null;
  }, []);

  // 실제 API 업로드 함수
  const uploadSingleFile = useCallback(async (uploadFile: UploadFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('category', 'gallery'); // 기본 카테고리
      formData.append('handleDuplicate', 'rename'); // 중복 파일 처리

      const xhr = new XMLHttpRequest();

      // 업로드 진행률 추적
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, progress }
                : f
            )
          );
        }
      });

      // 업로드 완료 처리
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              console.log('✅ 업로드 성공:', response);
              setUploadFiles(prev =>
                prev.map(f =>
                  f.id === uploadFile.id
                    ? { ...f, status: 'success', progress: 100 }
                    : f
                )
              );
              resolve();
            } else {
              throw new Error(response.message || '업로드 실패');
            }
          } catch (error) {
            reject(new Error('서버 응답 파싱 실패'));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      });

      // 업로드 에러 처리
      xhr.addEventListener('error', () => {
        reject(new Error('네트워크 오류가 발생했습니다'));
      });

      // 업로드 시작
      xhr.open('POST', '/api/admin/upload-image');
      xhr.send(formData);
    });
  }, []);

  // 파일 재시도 업로드
  const retryUpload = useCallback(async (uploadFileId: string) => {
    const uploadFile = uploadFiles.find(f => f.id === uploadFileId);
    if (!uploadFile) return;

    if (uploadFile.retryCount >= 3) {
      setUploadFiles(prev =>
        prev.map(f =>
          f.id === uploadFileId
            ? { ...f, status: 'error', error: '최대 재시도 횟수 초과 (3회)' }
            : f
        )
      );
      return;
    }

    setUploadFiles(prev =>
      prev.map(f =>
        f.id === uploadFileId
          ? { ...f, status: 'uploading', progress: 0, retryCount: f.retryCount + 1, error: undefined }
          : f
      )
    );

    try {
      await uploadSingleFile(uploadFile);
    } catch (error) {
      setUploadFiles(prev =>
        prev.map(f =>
          f.id === uploadFileId
            ? {
              ...f,
              status: 'error',
              error: error instanceof Error ? error.message : '알 수 없는 오류'
            }
            : f
        )
      );
    }
  }, [uploadFiles, uploadSingleFile]);

  // 파일 처리 함수 (먼저 선언)
  const processFiles = useCallback((files: File[]) => {
    // 파일 수 제한 (한 번에 최대 10개)
    if (files.length > 10) {
      alert('한 번에 최대 10개의 파일까지 업로드할 수 있습니다.');
      return;
    }

    // 파일 검증 및 준비
    const validFiles: UploadFile[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          file,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          preview: URL.createObjectURL(file),
          status: 'pending',
          progress: 0,
          retryCount: 0
        });
      }
    });

    // 검증 오류가 있는 경우 알림
    if (errors.length > 0) {
      alert(`다음 파일들에 문제가 있습니다:\n\n${errors.join('\n')}`);
    }

    // 유효한 파일이 있는 경우 업로드 모달 표시
    if (validFiles.length > 0) {
      setUploadFiles(validFiles);
      setShowUploadModal(true);
    }
  }, [validateFile]);

  // 드래그 이벤트 핸들러
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    // 실제로 영역을 벗어났는지 확인
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  // 파일 제거
  const removeFile = useCallback((id: string) => {
    setUploadFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  // 모든 파일 업로드 실행
  const handleUpload = useCallback(async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    setOverallProgress(0);

    const totalFiles = uploadFiles.length;
    let completedFiles = 0;

    try {
      // 순차적으로 업로드 (서버 부하 방지)
      for (const uploadFile of uploadFiles) {
        setUploadFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: 'uploading', progress: 0 }
              : f
          )
        );

        try {
          await uploadSingleFile(uploadFile);
          completedFiles++;
          setOverallProgress(Math.round((completedFiles / totalFiles) * 100));
        } catch (error) {
          console.error(`업로드 실패: ${uploadFile.file.name}`, error);
          setUploadFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id
                ? {
                  ...f,
                  status: 'error',
                  error: error instanceof Error ? error.message : '업로드 실패'
                }
                : f
            )
          );
        }
      }

      // 성공한 파일 수 계산
      const successCount = uploadFiles.filter(f => f.status === 'success').length;

      if (successCount > 0) {
        // 업로드 완료 후 콜백 실행 (페이지 새로고침 등)
        console.log(`✅ ${successCount}개 파일 업로드 완료`);
        onUploadComplete?.();

        // 성공 알림
        setTimeout(() => {
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 z-[200] bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg';
          notification.innerHTML = `
            <div class="flex items-center space-x-2">
              <span class="text-lg">✅</span>
              <div>
                <div class="font-medium">${successCount}개 이미지 업로드 완료!</div>
                <div class="text-sm opacity-90">페이지가 자동으로 새로고침됩니다</div>
              </div>
            </div>
          `;
          document.body.appendChild(notification);

          setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 300);
          }, 3000);
        }, 1000);

        // 3초 후 모달 닫기 및 페이지 새로고침
        setTimeout(() => {
          setShowUploadModal(false);
          window.location.reload(); // 강제 새로고침으로 이미지 목록 업데이트
        }, 3000);
      }

    } catch (error) {
      console.error('업로드 프로세스 오류:', error);
      alert('업로드 중 예기치 않은 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  }, [uploadFiles, uploadSingleFile, onUploadComplete]);

  // 파일 크기 포맷 함수
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // 모달 닫기
  const closeModal = useCallback(() => {
    if (isUploading) {
      if (!confirm('업로드가 진행 중입니다. 정말 취소하시겠습니까?')) {
        return;
      }
    }

    setShowUploadModal(false);
    uploadFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setUploadFiles([]);
    setOverallProgress(0);
  }, [isUploading, uploadFiles]);

  // 통계 계산
  const uploadStats = {
    total: uploadFiles.length,
    pending: uploadFiles.filter(f => f.status === 'pending').length,
    uploading: uploadFiles.filter(f => f.status === 'uploading').length,
    success: uploadFiles.filter(f => f.status === 'success').length,
    error: uploadFiles.filter(f => f.status === 'error').length
  };

  return (
    <div
      className="relative min-h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}

      {/* 향상된 드래그 오버레이 */}
      {isDragOver && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 shadow-2xl border-2 border-blue-500 border-dashed max-w-md mx-4">
            <div className="text-center">
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                이미지를 여기에 드롭하세요
              </h3>
              <p className="text-gray-600 mb-2">
                JPG, PNG, WebP, GIF 파일을 지원합니다
              </p>
              <p className="text-sm text-gray-500">
                최대 10개 파일, 각 파일당 10MB 이하
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 업로드 버튼 */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 z-30"
        title="이미지 업로드"
      >
        <Upload className="w-6 h-6" />
      </button>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 향상된 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">

            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  📤 이미지 업로드
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {uploadStats.total}개 파일 | {uploadStats.success}개 완료 | {uploadStats.error}개 실패
                </p>
              </div>

              {/* 전체 진행률 */}
              {isUploading && (
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {overallProgress}%
                  </span>
                </div>
              )}

              <button
                onClick={closeModal}
                disabled={isUploading}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 파일 목록 */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {uploadFiles.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
                  >
                    {/* 이미지 미리보기 */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={uploadFile.preview}
                        alt={uploadFile.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* 파일 정보 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadFile.file.size)}
                      </p>

                      {/* 진행률 바 */}
                      {uploadFile.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {uploadFile.progress}% 업로드 중... {uploadFile.retryCount > 0 && `(재시도 ${uploadFile.retryCount})`}
                          </div>
                        </div>
                      )}

                      {/* 에러 메시지 */}
                      {uploadFile.status === 'error' && uploadFile.error && (
                        <div className="mt-2 text-xs text-red-600">
                          ❌ {uploadFile.error}
                        </div>
                      )}
                    </div>

                    {/* 상태 표시 및 액션 */}
                    <div className="flex items-center gap-2">
                      {uploadFile.status === 'pending' && (
                        <div className="text-gray-400">
                          <FileImage className="w-5 h-5" />
                        </div>
                      )}

                      {uploadFile.status === 'uploading' && (
                        <div className="text-blue-500 animate-spin">
                          <RefreshCw className="w-5 h-5" />
                        </div>
                      )}

                      {uploadFile.status === 'success' && (
                        <div className="text-green-500">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}

                      {uploadFile.status === 'error' && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          {uploadFile.retryCount < 3 && (
                            <button
                              onClick={() => retryUpload(uploadFile.id)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                            >
                              재시도
                            </button>
                          )}
                        </div>
                      )}

                      {/* 삭제 버튼 */}
                      {!isUploading && uploadFile.status !== 'uploading' && (
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 업로드 오류 요약 */}
              {uploadStats.error > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">{uploadStats.error}개 파일 업로드 실패</span>
                  </div>
                  <p className="text-sm text-red-700">
                    파일 크기, 형식을 확인하거나 재시도 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              {/* 업로드 성공 요약 */}
              {uploadStats.success > 0 && uploadStats.success === uploadStats.total && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">모든 파일 업로드 완료! 🎉</span>
                  </div>
                  <p className="text-sm text-green-700">
                    이미지 목록이 곧 자동으로 새로고침됩니다.
                  </p>
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                {uploadStats.total > 0 && (
                  <span>
                    총 {uploadStats.total}개 |
                    ✅ {uploadStats.success}개 완료 |
                    ❌ {uploadStats.error}개 실패
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  disabled={isUploading}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? '업로드 중...' : '닫기'}
                </button>

                {uploadStats.pending > 0 && (
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || uploadFiles.length === 0}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        업로드 중...
                      </span>
                    ) : (
                      `📤 ${uploadStats.pending}개 파일 업로드`
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
