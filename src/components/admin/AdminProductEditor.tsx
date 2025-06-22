'use client';

import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Image } from '../../lib/imports';
import { motion } from '../../lib/motion';

// 타입 정의
interface ProductImage {
  src: string;
  alt: string;
  isMain?: boolean;
}

interface Product {
  slug: string;
  title: string;
  category: string;
  description: string;
  images: ProductImage[];
  minPrice?: number;
  maxPrice?: number;
  tags: string[];
}

// Mock Data
const getMockProduct = (slug: string): Product => ({
  slug,
  title: '모던 린넨 커튼',
  category: 'curtain',
  description: '자연스러운 질감과 우아한 드레이프가 특징인 모던 린넨 커튼입니다. 공간에 따뜻함과 편안함을 더해주며, 다양한 인테리어 스타일과 조화롭게 어울립니다.',
  images: [
    { src: '/images/references/curtain-modern-livingroom-1.jpg', alt: '메인 이미지', isMain: true },
    { src: '/images/references/curtain-modern-livingroom-2.jpg', alt: '상세 이미지 1' },
    { src: '/images/references/curtain-modern-livingroom-3.jpg', alt: '상세 이미지 2' }
  ],
  minPrice: 150000,
  maxPrice: 350000,
  tags: ['린넨', '모던', '거실용', '차광', '맞춤제작']
});

// 이미지 에디터 컴포넌트
interface ImageEditorProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

const ImageEditor = ({ images, onChange }: ImageEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File, index?: number) => {
    setIsUploading(true);
    try {
      // 실제 업로드 로직 대신 임시 URL 생성
      const tempUrl = URL.createObjectURL(file);

      if (typeof index === 'number') {
        // 기존 이미지 교체
        const newImages = [...images];
        newImages[index] = { ...newImages[index], src: tempUrl };
        onChange(newImages);
      } else {
        // 새 이미지 추가
        const newImage: ProductImage = {
          src: tempUrl,
          alt: `새 이미지 ${images.length + 1}`,
          isMain: images.length === 0
        };
        onChange([...images, newImage]);
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // 메인 이미지가 삭제된 경우 첫 번째 이미지를 메인으로 설정
    if (images[index]?.isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    onChange(newImages);
  };

  const setMainImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isMain: i === index
    }));
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">이미지 관리</h3>
        <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          + 이미지 추가
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />

              {/* 메인 이미지 배지 */}
              {image.isMain && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  메인
                </div>
              )}

              {/* 컨트롤 오버레이 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  {!image.isMain && (
                    <button
                      onClick={() => setMainImage(index)}
                      className="bg-blue-500/80 hover:bg-blue-600/80 px-2 py-1 rounded text-white text-xs"
                    >
                      메인 설정
                    </button>
                  )}
                  <label className="cursor-pointer bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-white text-xs">
                    변경
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, index);
                      }}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => removeImage(index)}
                    className="bg-red-500/80 hover:bg-red-600/80 px-2 py-1 rounded text-white text-xs"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>

            {/* 이미지 설명 편집 */}
            <input
              type="text"
              value={image.alt}
              onChange={(e) => {
                const newImages = [...images];
                newImages[index].alt = e.target.value;
                onChange(newImages);
              }}
              className="mt-2 w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 outline-none"
              placeholder="이미지 설명"
            />
          </motion.div>
        ))}
      </div>

      {isUploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">업로드 중...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// 텍스트 입력 컴포넌트
interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

const TextInput = ({ label, value, onChange, placeholder, multiline = false, rows = 1 }: TextInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-colors"
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

// 가격 범위 에디터 컴포넌트
interface PriceRangeEditorProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

const PriceRangeEditor = ({ min, max, onChange }: PriceRangeEditorProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">가격 범위</label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">최소 가격</label>
          <input
            type="number"
            value={min}
            onChange={(e) => onChange(Number(e.target.value), max)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
            placeholder="최소 가격"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">최대 가격</label>
          <input
            type="number"
            value={max}
            onChange={(e) => onChange(min, Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
            placeholder="최대 가격"
          />
        </div>
      </div>
      <div className="text-sm text-gray-600">
        ₩{min.toLocaleString()} - ₩{max.toLocaleString()}
      </div>
    </div>
  );
};

// 태그 선택기 컴포넌트
interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const TagSelector = ({ selectedTags, onChange }: TagSelectorProps) => {
  const [newTag, setNewTag] = useState('');

  const predefinedTags = [
    '린넨', '면', '실크', '벨벳', '쉬폰',
    '모던', '클래식', '미니멀', '빈티지', '럭셔리',
    '거실용', '침실용', '서재용', '주방용', '욕실용',
    '차광', '반차광', '투명', '방수', '항균',
    '맞춤제작', '기성품', '세탁가능', '드라이클리닝'
  ];

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };

  const handleNewTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">태그</label>

      {/* 선택된 태그 */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* 새 태그 추가 */}
      <form onSubmit={handleNewTagSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
          placeholder="새 태그 추가"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          추가
        </button>
      </form>

      {/* 미리 정의된 태그 */}
      <div className="space-y-2">
        <div className="text-sm text-gray-600">추천 태그:</div>
        <div className="flex flex-wrap gap-2">
          {predefinedTags
            .filter(tag => !selectedTags.includes(tag))
            .map(tag => (
              <button
                key={tag}
                onClick={() => addTag(tag)}
                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                + {tag}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// 리치 텍스트 에디터 컴포넌트 (간단한 버전)
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">상세 설명</label>
      <div className="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-colors">
        <div className="border-b border-gray-200 px-3 py-2 bg-gray-50 rounded-t-lg">
          <div className="flex space-x-2">
            <button
              type="button"
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              onClick={() => {
                // 간단한 볼드 토글 (실제 구현시 더 복잡한 로직 필요)
                const textarea = document.querySelector('textarea[data-rich-editor]') as HTMLTextAreaElement;
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const selectedText = value.substring(start, end);
                  const newValue = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
                  onChange(newValue);
                }
              }}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              onClick={() => {
                const textarea = document.querySelector('textarea[data-rich-editor]') as HTMLTextAreaElement;
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const selectedText = value.substring(start, end);
                  const newValue = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
                  onChange(newValue);
                }
              }}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              onClick={() => {
                onChange(value + '\n\n• ');
              }}
            >
              목록
            </button>
          </div>
        </div>
        <textarea
          data-rich-editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border-none outline-none resize-none rounded-b-lg"
          placeholder="제품에 대한 상세한 설명을 입력하세요. **볼드**, *이탤릭*, • 목록 등을 사용할 수 있습니다."
        />
      </div>
      <div className="text-xs text-gray-500">
        마크다운 문법을 사용할 수 있습니다. **볼드**, *이탤릭*, • 목록
      </div>
    </div>
  );
};

// 저장 버튼 컴포넌트
interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SaveButton = ({ onClick, disabled = false }: SaveButtonProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
      <button
        type="button"
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        취소
      </button>
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        저장
      </button>
    </div>
  );
};

// 메인 AdminProductEditor 컴포넌트
interface AdminProductEditorProps {
  slug?: string;
}

export default function AdminProductEditor({ slug = 'modern-linen-curtain' }: AdminProductEditorProps) {
  const params = useParams();
  const locale = params?.locale as string || 'ko';

  // Mock 데이터로 초기화
  const mockProduct = getMockProduct(slug);

  // 각 필드별 상태 관리
  const [title, setTitle] = useState(mockProduct.title);
  const [category, setCategory] = useState(mockProduct.category);
  const [description, setDescription] = useState(mockProduct.description);
  const [images, setImages] = useState<ProductImage[]>(mockProduct.images);
  const [minPrice, setMinPrice] = useState(mockProduct.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(mockProduct.maxPrice || 0);
  const [tags, setTags] = useState<string[]>(mockProduct.tags);

  // 저장 핸들러
  const handleSave = useCallback(() => {
    const productData = {
      slug,
      title,
      category,
      description,
      images,
      minPrice,
      maxPrice,
      tags,
      updatedAt: new Date().toISOString()
    };

    console.log('=== 제품 데이터 저장 ===');
    console.log(productData);
    console.log('========================');

    // 실제 저장 API 호출 시뮬레이션
    alert('제품 데이터가 저장되었습니다! 콘솔을 확인해주세요.');
  }, [slug, title, category, description, images, minPrice, maxPrice, tags]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">제품 편집</h1>
              <p className="text-gray-600 mt-1">컴포넌트 기반 편집 시스템</p>
            </div>
            <div className="text-sm text-gray-500">
              Slug: {slug}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-8">

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TextInput
                label="제품명"
                value={title}
                onChange={setTitle}
                placeholder="제품명을 입력하세요"
              />
              <TextInput
                label="카테고리"
                value={category}
                onChange={setCategory}
                placeholder="카테고리를 입력하세요"
              />
            </div>

            {/* 가격 범위 */}
            <PriceRangeEditor
              min={minPrice}
              max={maxPrice}
              onChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
            />

            {/* 태그 */}
            <TagSelector
              selectedTags={tags}
              onChange={setTags}
            />

            {/* 설명 */}
            <RichTextEditor
              value={description}
              onChange={setDescription}
            />

            {/* 이미지 */}
            <ImageEditor
              images={images}
              onChange={setImages}
            />

            {/* 저장 버튼 */}
            <SaveButton
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 