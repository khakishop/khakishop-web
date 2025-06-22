'use client';

/**
 * ================================================================================
 * 🖼️ ProductImageManager - 범용 제품 이미지 관리 컴포넌트
 * ================================================================================
 * 
 * 용도:
 * - 모든 어드민 페이지에서 재사용 가능한 이미지 관리
 * - 제품별, 카테고리별 이미지 관리
 * - 드래그 앤 드롭 업로드 지원
 * - 실시간 이미지 편집 및 삭제
 * 
 * 사용 예시:
 * - /admin/curtain/[id] - 커튼 상세 이미지 관리
 * - /admin/blind/[id] - 블라인드 상세 이미지 관리
 * - /admin/products/[category]/[id] - 제품 상세 이미지 관리
 */

import { Download, Eye, Filter, Grid, List, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

interface ProductImage {
  id: string;
  url: string;
  filename: string;
  alt: string;
  category: string;
  subcategory?: string;
  productId?: string;
  type: 'main' | 'gallery' | 'detail' | 'thumbnail';
  order: number;
  size: number;
  uploadDate: string;
  tags: string[];
}

interface ProductImageManagerProps {
  // 필수 props
  productId: string;
  category: string;
  subcategory?: string;

  // 선택적 props
  title?: string;
  allowedTypes?: ('main' | 'gallery' | 'detail' | 'thumbnail')[];
  maxImages?: number;
  maxFileSize?: number; // MB
  initialImages?: ProductImage[];

  // 콜백 함수들
  onImagesChange?: (images: ProductImage[]) => void;
  onImageUpload?: (files: File[], type: string) => Promise<ProductImage[]>;
  onImageDelete?: (imageId: string) => Promise<void>;
  onImageUpdate?: (imageId: string, updates: Partial<ProductImage>) => Promise<void>;
  onImageReorder?: (imageIds: string[]) => Promise<void>;
}

export default function ProductImageManager({
  productId,
  category,
  subcategory,
  title = '이미지 관리',
  allowedTypes = ['main', 'gallery', 'detail', 'thumbnail'],
  maxImages = 20,
  maxFileSize = 10,
  initialImages = [],
  onImagesChange,
  onImageUpload,
  onImageDelete,
  onImageUpdate,
  onImageReorder
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('gallery');

  // 이미지 필터링
  const filteredImages = images.filter(image => {
    const matchesType = filterType === 'all' || image.type === filterType;
    const matchesSearch = image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // 타입별 이미지 개수
  const imageTypeCounts = {
    all: images.length,
    main: images.filter(img => img.type === 'main').length,
    gallery: images.filter(img => img.type === 'gallery').length,
    detail: images.filter(img => img.type === 'detail').length,
    thumbnail: images.filter(img => img.type === 'thumbnail').length,
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      await handleImageUpload(files);
    }
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;

    // 파일 크기 검증
    const oversizedFiles = files.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`파일 크기가 ${maxFileSize}MB를 초과합니다: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // 최대 이미지 개수 검증
    if (images.length + files.length > maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    setIsUploading(true);

    try {
      if (onImageUpload) {
        const newImages = await onImageUpload(files, selectedType);
        setImages(prev => [...prev, ...newImages]);
        onImagesChange?.([...images, ...newImages]);
      } else {
        // 기본 모의 업로드
        const newImages: ProductImage[] = files.map((file, index) => ({
          id: `${productId}_${Date.now()}_${index}`,
          url: URL.createObjectURL(file),
          filename: file.name,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          category,
          subcategory,
          productId,
          type: selectedType as any,
          order: images.length + index,
          size: file.size,
          uploadDate: new Date().toISOString(),
          tags: [category, subcategory, selectedType].filter(Boolean) as string[]
        }));

        setImages(prev => [...prev, ...newImages]);
        onImagesChange?.([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
      setShowUploadModal(false);
    }
  };

  // 이미지 삭제
  const handleImageDelete = async (imageId: string) => {
    if (!confirm('정말로 이 이미지를 삭제하시겠습니까?')) return;

    try {
      if (onImageDelete) {
        await onImageDelete(imageId);
      }

      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      setSelectedImages(prev => prev.filter(id => id !== imageId));
      onImagesChange?.(updatedImages);
    } catch (error) {
      console.error('Image delete error:', error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {category}{subcategory && ` > ${subcategory}`} | {productId}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>이미지 추가</span>
            </button>

            {selectedImages.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(`선택된 ${selectedImages.length}개 이미지를 삭제하시겠습니까?`)) {
                    selectedImages.forEach(handleImageDelete);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>선택 삭제 ({selectedImages.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 타입 필터 */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">전체 ({imageTypeCounts.all})</option>
                {allowedTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'main' && `메인 (${imageTypeCounts.main})`}
                    {type === 'gallery' && `갤러리 (${imageTypeCounts.gallery})`}
                    {type === 'detail' && `상세 (${imageTypeCounts.detail})`}
                    {type === 'thumbnail' && `썸네일 (${imageTypeCounts.thumbnail})`}
                  </option>
                ))}
              </select>
            </div>

            {/* 검색 */}
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="파일명, 설명, 태그 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1 w-64"
              />
            </div>
          </div>

          {/* 뷰 모드 */}
          <div className="flex items-center space-x-1 bg-white rounded border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div
        className={`min-h-96 transition-all duration-200 ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? '검색 결과가 없습니다' : '이미지가 없습니다'}
            </h4>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              {searchTerm || filterType !== 'all'
                ? '다른 검색어나 필터를 시도해보세요.'
                : '드래그 앤 드롭으로 이미지를 업로드하거나 "이미지 추가" 버튼을 클릭하세요.'
              }
            </p>
          </div>
        ) : (
          <div className="p-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedImages.includes(image.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                      }`}
                    onClick={() => {
                      setSelectedImages(prev =>
                        prev.includes(image.id)
                          ? prev.filter(id => id !== image.id)
                          : [...prev, image.id]
                      );
                    }}
                  >
                    {/* 이미지 */}
                    <div className="aspect-square relative bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />

                      {/* 타입 배지 */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${image.type === 'main' ? 'bg-red-500' :
                            image.type === 'gallery' ? 'bg-blue-500' :
                              image.type === 'detail' ? 'bg-green-500' :
                                'bg-gray-500'
                          }`}>
                          {image.type === 'main' && '메인'}
                          {image.type === 'gallery' && '갤러리'}
                          {image.type === 'detail' && '상세'}
                          {image.type === 'thumbnail' && '썸네일'}
                        </span>
                      </div>

                      {/* 호버 오버레이 */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(image.url, '_blank');
                            }}
                            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                            title="미리보기"
                          >
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const link = document.createElement('a');
                              link.href = image.url;
                              link.download = image.filename;
                              link.click();
                            }}
                            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                            title="다운로드"
                          >
                            <Download className="w-4 h-4 text-gray-700" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageDelete(image.id);
                            }}
                            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 이미지 정보 */}
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 text-sm truncate" title={image.filename}>
                        {image.filename.replace(/\.[^/.]+$/, '')}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>{formatFileSize(image.size)}</span>
                        <span>#{image.order}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${selectedImages.includes(image.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    onClick={() => {
                      setSelectedImages(prev =>
                        prev.includes(image.id)
                          ? prev.filter(id => id !== image.id)
                          : [...prev, image.id]
                      );
                    }}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 ml-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {image.filename}
                        </h4>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 text-xs rounded-full text-white ${image.type === 'main' ? 'bg-red-500' :
                              image.type === 'gallery' ? 'bg-blue-500' :
                                image.type === 'detail' ? 'bg-green-500' :
                                  'bg-gray-500'
                            }`}>
                            {image.type === 'main' && '메인'}
                            {image.type === 'gallery' && '갤러리'}
                            {image.type === 'detail' && '상세'}
                            {image.type === 'thumbnail' && '썸네일'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                        <span>{formatFileSize(image.size)} • {formatDate(image.uploadDate)}</span>
                        <span>순서: #{image.order}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                        {image.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{image.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(image.url, '_blank');
                        }}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                        title="미리보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = image.url;
                          link.download = image.filename;
                          link.click();
                        }}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                        title="다운로드"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageDelete(image.id);
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 드래그 오버레이 */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                이미지를 여기에 드롭하세요
              </h3>
              <p className="text-blue-700">
                최대 {maxImages}개, {maxFileSize}MB 이하의 이미지 파일
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">이미지 업로드</h3>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 타입
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {allowedTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'main' && '메인 이미지'}
                      {type === 'gallery' && '갤러리 이미지'}
                      {type === 'detail' && '상세 이미지'}
                      {type === 'thumbnail' && '썸네일 이미지'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  이미지를 드래그하거나 클릭하여 선택하세요
                </p>
                <p className="text-sm text-gray-500">
                  최대 {maxFileSize}MB, {maxImages}개까지 업로드 가능
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      handleImageUpload(files);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                  파일 선택
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로딩 오버레이 */}
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">이미지 업로드 중...</p>
          </div>
        </div>
      )}
    </div>
  );
} 