'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageItem } from '../hooks/useImageManager';

// SVG 아이콘 컴포넌트들 (lucide-react 대신 인라인 SVG 사용)
const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Edit2Icon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const Trash2Icon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const ZoomInIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6" />
  </svg>
);

const RotateIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

interface ImageDetailModalProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (imageId: string) => void;
  onUpdate?: (imageId: string, updates: Partial<ImageItem>) => Promise<void>;
}

export default function ImageDetailModal({
  image,
  isOpen,
  onClose,
  onDelete,
  onUpdate
}: ImageDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageBrightness, setImageBrightness] = useState(1);
  const [imageContrast, setImageContrast] = useState(1);
  const [imageSaturation, setImageSaturation] = useState(1);
  const [imageBlur, setImageBlur] = useState(0);
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [exifData, setExifData] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    alt: '',
    category: '',
    subcategory: '',
    tags: [] as string[],
    filename: '',
    title: '',
    description: '',
    photographer: '',
    location: '',
    keywords: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'edit' | 'metadata' | 'exif'>('info');
  const imageRef = useRef<HTMLImageElement>(null);

  // 모든 useCallback hooks를 early return 전에 정의
  const handleCopyUrl = useCallback(async () => {
    if (!image) return;
    try {
      await navigator.clipboard.writeText(image.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('URL 복사 실패:', err);
      alert('URL 복사에 실패했습니다.');
    }
  }, [image]);

  const handleDownload = useCallback(() => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [image]);

  const handleDelete = useCallback(() => {
    if (!image) return;
    if (confirm('정말로 이 이미지를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      onDelete(image.id);
      onClose();
    }
  }, [image, onDelete, onClose]);

  const handleSave = useCallback(async () => {
    if (!onUpdate || !image) return;

    setIsSaving(true);
    try {
      await onUpdate(image.id, {
        alt: editForm.alt,
        category: editForm.category,
        subcategory: editForm.subcategory || undefined,
        tags: editForm.tags,
        filename: editForm.filename,
        title: editForm.title,
        description: editForm.description,
        photographer: editForm.photographer,
        location: editForm.location,
        keywords: editForm.keywords
      });
      setIsEditing(false);
      alert('이미지 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('이미지 업데이트 실패:', error);
      alert('이미지 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [image, editForm, onUpdate]);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !editForm.tags.includes(newTag.trim())) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  }, [newTag, editForm.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleAddKeyword = useCallback(() => {
    if (newKeyword.trim() && !editForm.keywords.includes(newKeyword.trim())) {
      setEditForm(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  }, [newKeyword, editForm.keywords]);

  const handleRemoveKeyword = useCallback((keywordToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  }, []);

  const handleZoomIn = useCallback(() => {
    setImageScale(prev => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setImageScale(prev => Math.max(prev - 0.25, 0.25));
  }, []);

  const handleRotate = useCallback(() => {
    setImageRotation(prev => (prev + 90) % 360);
  }, []);

  const handleResetFilters = useCallback(() => {
    setImageScale(1);
    setImageRotation(0);
    setImageBrightness(1);
    setImageContrast(1);
    setImageSaturation(1);
    setImageBlur(0);
  }, []);

  const applyImageFilters = useCallback(() => {
    return {
      transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
      filter: `brightness(${imageBrightness}) contrast(${imageContrast}) saturate(${imageSaturation}) blur(${imageBlur}px)`
    };
  }, [imageScale, imageRotation, imageBrightness, imageContrast, imageSaturation, imageBlur]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  }, []);

  // EXIF 데이터 로드 (Mock 데이터로 시뮬레이션)
  const loadExifData = useCallback(async (imageUrl: string) => {
    try {
      // 실제 환경에서는 EXIF 라이브러리 사용
      const mockExif = {
        camera: 'Canon EOS R5',
        lens: 'RF 24-70mm f/2.8L IS USM',
        focalLength: '50mm',
        aperture: 'f/2.8',
        shutterSpeed: '1/200s',
        iso: 'ISO 400',
        dateTime: '2024-01-20 14:30:22',
        gps: { lat: 37.5665, lng: 126.9780 },
        dimensions: { width: 3840, height: 2160 },
        colorSpace: 'sRGB',
        whiteBalance: 'Auto'
      };
      setExifData(mockExif);
    } catch (error) {
      console.error('EXIF 데이터 로드 실패:', error);
    }
  }, []);

  const getImageDimensions = useCallback(() => {
    if (imageRef.current) {
      return {
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight
      };
    }
    return { width: 0, height: 0 };
  }, []);

  // 이미지가 변경될 때 편집 폼 초기화
  useEffect(() => {
    if (image) {
      setEditForm({
        alt: image.alt,
        category: image.category,
        subcategory: image.subcategory || '',
        tags: [...image.tags],
        filename: image.filename,
        title: image.title || '',
        description: image.description || '',
        photographer: image.photographer || '',
        location: image.location || '',
        keywords: image.keywords || []
      });
      setImageScale(1);
      setImageRotation(0);
      setImageBrightness(1);
      setImageContrast(1);
      setImageSaturation(1);
      setImageBlur(0);
      setActiveTab('info');
      loadExifData(image.url);
    }
  }, [image, loadExifData]);

  // Early return - 모든 hooks 이후에 위치
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">

        {/* 향상된 헤더 */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              🖼️ 이미지 상세 정보
            </h2>
            {isEditing && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                편집 모드
              </span>
            )}
            <div className="text-sm text-gray-500">
              {image.filename}
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { key: 'info', label: '정보', icon: '📋' },
              { key: 'edit', label: '편집', icon: '✏️' },
              { key: 'metadata', label: '메타데이터', icon: '🏷️' },
              { key: 'exif', label: 'EXIF', icon: '📷' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  <SaveIcon />
                  <span>{isSaving ? '저장 중...' : '저장'}</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  취소
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <XIcon />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(95vh-80px)]">

          {/* 왼쪽: 향상된 이미지 프리뷰 */}
          <div className="lg:w-2/3 p-6 flex flex-col bg-gray-100">
            {/* 고급 이미지 컨트롤 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white rounded hover:bg-gray-50 shadow-sm"
                  title="축소"
                >
                  <ZoomOutIcon />
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {Math.round(imageScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white rounded hover:bg-gray-50 shadow-sm"
                  title="확대"
                >
                  <ZoomInIcon />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 bg-white rounded hover:bg-gray-50 shadow-sm"
                  title="회전"
                >
                  <RotateIcon />
                </button>
                <button
                  onClick={() => setShowAdvancedEdit(!showAdvancedEdit)}
                  className={`px-3 py-2 rounded shadow-sm text-sm ${showAdvancedEdit
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-50'
                    }`}
                >
                  🎨 고급편집
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2 bg-white rounded hover:bg-gray-50 shadow-sm text-sm"
                  title="원본으로 리셋"
                >
                  리셋
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {(() => {
                  if (imageRef.current) {
                    return `${imageRef.current.naturalWidth} × ${imageRef.current.naturalHeight} px`;
                  }
                  return '이미지 로딩 중...';
                })()}
              </div>
            </div>

            {/* 고급 편집 패널 */}
            {showAdvancedEdit && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <h4 className="text-sm font-medium mb-3">이미지 조정</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      밝기 ({Math.round(imageBrightness * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={imageBrightness}
                      onChange={(e) => setImageBrightness(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      대비 ({Math.round(imageContrast * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={imageContrast}
                      onChange={(e) => setImageContrast(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      채도 ({Math.round(imageSaturation * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={imageSaturation}
                      onChange={(e) => setImageSaturation(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      블러 ({imageBlur}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={imageBlur}
                      onChange={(e) => setImageBlur(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 향상된 이미지 컨테이너 */}
            <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-inner">
              <div className="relative max-w-full max-h-full overflow-auto">
                <img
                  ref={imageRef}
                  src={image.url}
                  alt={image.alt}
                  className="transition-all duration-200"
                  style={applyImageFilters()}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />

                {/* 이미지 로딩 실패 시 오버레이 */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg" style={{ display: 'none' }}>
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                      📷
                    </div>
                    <p className="text-sm">이미지 미리보기</p>
                    <p className="text-xs text-gray-400 mt-1">{image.filename}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 향상된 상세 정보 */}
          <div className="lg:w-1/3 p-6 overflow-y-auto bg-white">
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* 파일 정보 섹션 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    📁 파일 정보
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        파일명
                      </label>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                        {image.filename}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          파일 크기
                        </label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          업로드 날짜
                        </label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {formatDate(image.uploadDate)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        이미지 URL
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={image.url}
                          readOnly
                          className="flex-1 text-xs text-gray-600 bg-gray-100 p-2 rounded-l border"
                        />
                        <button
                          onClick={handleCopyUrl}
                          className={`px-3 py-2 rounded-r border border-l-0 transition-colors ${copySuccess
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          title={copySuccess ? 'URL 복사됨!' : 'URL 복사'}
                        >
                          <CopyIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 기본 정보 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    📋 기본 정보
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        제목
                      </label>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                        {image.title || '제목 없음'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        설명
                      </label>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border min-h-[60px]">
                        {image.description || '설명 없음'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          카테고리
                        </label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {image.category}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          하위 카테고리
                        </label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {image.subcategory || '없음'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 태그 섹션 */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <TagIcon />
                    <span className="ml-2">태그</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {image.tags.length === 0 && (
                      <p className="text-sm text-gray-500">태그가 없습니다</p>
                    )}
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleCopyUrl}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <CopyIcon />
                      {copySuccess ? '복사됨!' : 'URL 복사'}
                    </button>

                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <DownloadIcon />
                      다운로드
                    </button>
                  </div>

                  <button
                    onClick={() => window.open(image.url, '_blank')}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                  >
                    <ExternalLinkIcon />
                    새 탭에서 보기
                  </button>

                  <button
                    onClick={() => setActiveTab('edit')}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                  >
                    <Edit2Icon />
                    편집
                  </button>

                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    <Trash2Icon />
                    삭제
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <div className="space-y-6">
                {/* 편집 모드 안내 */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 text-lg">✏️</span>
                    <div>
                      <h4 className="font-medium text-orange-800">편집 모드</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        이미지 정보를 수정하고 저장하세요.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 편집 폼 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      제목
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이미지 제목을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      설명
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이미지에 대한 자세한 설명을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt 텍스트 (접근성)
                    </label>
                    <input
                      type="text"
                      value={editForm.alt}
                      onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="스크린 리더를 위한 이미지 설명"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        촬영자
                      </label>
                      <input
                        type="text"
                        value={editForm.photographer}
                        onChange={(e) => setEditForm(prev => ({ ...prev, photographer: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="사진작가 이름"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        촬영 장소
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="촬영 위치"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        카테고리
                      </label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="collections">Collections</option>
                        <option value="references">References</option>
                        <option value="projects">Projects</option>
                        <option value="products">Products</option>
                        <option value="gallery">Gallery</option>
                        <option value="hero">Hero</option>
                        <option value="landing">Landing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        하위 카테고리
                      </label>
                      <input
                        type="text"
                        value={editForm.subcategory}
                        onChange={(e) => setEditForm(prev => ({ ...prev, subcategory: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="하위 카테고리"
                      />
                    </div>
                  </div>

                  {/* 태그 편집 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      태그
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editForm.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="새 태그 입력"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        추가
                      </button>
                    </div>
                  </div>

                  {/* 키워드 편집 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      검색 키워드
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editForm.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {keyword}
                          <button
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="검색 키워드 입력"
                      />
                      <button
                        onClick={handleAddKeyword}
                        className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        추가
                      </button>
                    </div>
                  </div>

                  {/* 저장 버튼 */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                    >
                      <SaveIcon />
                      {isSaving ? '저장 중...' : '변경사항 저장'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metadata' && (
              <div className="space-y-6">
                {/* 메타데이터 정보 */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    📊 메타데이터
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-gray-600 mb-1">파일 형식</div>
                        <div className="font-medium">{image.filename.split('.').pop()?.toUpperCase()}</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-gray-600 mb-1">표시 순서</div>
                        <div className="font-medium">#{image.order}</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-gray-600 mb-1">업로드 상태</div>
                        <div className="font-medium text-green-600">완료</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-gray-600 mb-1">압축률</div>
                        <div className="font-medium">85%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 이미지 분석 */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    🤖 AI 분석 (시뮬레이션)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">감지된 객체</div>
                      <div className="flex flex-wrap gap-2">
                        {['커튼', '창문', '거실', '가구'].map((obj, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">주요 색상</div>
                      <div className="flex gap-2">
                        {['#8B7A6B', '#F5F5DC', '#D2B48C', '#A0522D'].map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">이미지 품질</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">92/100 (우수)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exif' && (
              <div className="space-y-6">
                {/* EXIF 데이터 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    📷 EXIF 정보
                  </h3>
                  {exifData ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">카메라</div>
                          <div className="text-sm font-medium">{exifData.camera}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">렌즈</div>
                          <div className="text-sm font-medium">{exifData.lens}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">조리개</div>
                          <div className="text-sm font-medium">{exifData.aperture}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">셔터 속도</div>
                          <div className="text-sm font-medium">{exifData.shutterSpeed}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">ISO</div>
                          <div className="text-sm font-medium">{exifData.iso}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">초점거리</div>
                          <div className="text-sm font-medium">{exifData.focalLength}</div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-gray-600 mb-1">촬영 일시</div>
                        <div className="text-sm font-medium">{exifData.dateTime}</div>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-gray-600 mb-1">이미지 크기</div>
                        <div className="text-sm font-medium">
                          {exifData.dimensions.width} × {exifData.dimensions.height} px
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">색상 공간</div>
                          <div className="text-sm font-medium">{exifData.colorSpace}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">화이트 밸런스</div>
                          <div className="text-sm font-medium">{exifData.whiteBalance}</div>
                        </div>
                      </div>

                      {exifData.gps && (
                        <div className="bg-blue-50 p-3 rounded border">
                          <div className="text-xs text-gray-600 mb-1">GPS 좌표</div>
                          <div className="text-sm font-medium">
                            {exifData.gps.lat.toFixed(6)}, {exifData.gps.lng.toFixed(6)}
                          </div>
                          <button
                            onClick={() => window.open(`https://maps.google.com/?q=${exifData.gps.lat},${exifData.gps.lng}`, '_blank')}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            지도에서 보기 →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded border text-center">
                      <div className="text-gray-400 text-2xl mb-2">📷</div>
                      <p className="text-sm text-gray-600">EXIF 데이터를 로딩 중...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 