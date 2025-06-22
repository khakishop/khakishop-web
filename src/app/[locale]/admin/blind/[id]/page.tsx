'use client';

/**
 * ================================================================================
 * 🪟 Blind Detail Admin Page - 블라인드 상세 어드민 페이지
 * ================================================================================
 */

import { ArrowLeft, Settings } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductImageManager from '../../../../../components/admin/ProductImageManager';

interface BlindProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export default function BlindDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const blindId = params.id as string;

  const [blind, setBlind] = useState<BlindProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setBlind({
        id: blindId,
        name: '프리미엄 베네치안 블라인드',
        description: '고급 우드 소재의 베네치안 블라인드입니다. 정밀한 각도 조절과 우아한 디자인이 특징입니다.',
        category: 'collections',
        subcategory: 'blind',
        price: 129000,
        stock: 8,
        status: 'active',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-06-20T00:00:00Z'
      });
      setIsLoading(false);
    }, 1000);
  }, [blindId]);

  const handleImageUpload = async (files: File[], type: string) => {
    console.log(`블라인드 ${blindId}에 ${type} 이미지 업로드:`, files.map(f => f.name));

    return files.map((file, index) => ({
      id: `blind_${blindId}_${type}_${Date.now()}_${index}`,
      url: URL.createObjectURL(file),
      filename: file.name,
      alt: `${blind?.name} ${type} 이미지`,
      category: 'collections',
      subcategory: 'blind',
      productId: blindId,
      type: type as any,
      order: index,
      size: file.size,
      uploadDate: new Date().toISOString(),
      tags: ['blind', 'collections', type, blind?.name || '']
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">블라인드 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!blind) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">블라인드를 찾을 수 없습니다</h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            이전 페이지로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  🪟 블라인드 관리: {blind.name}
                </h1>
                <p className="text-sm text-gray-500">ID: {blind.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isEditing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                <Settings className="w-4 h-4" />
                <span>{isEditing ? '편집 취소' : '편집 모드'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 기본 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제품명</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={blind.name}
                      onChange={(e) => setBlind(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-900">{blind.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                  {isEditing ? (
                    <textarea
                      value={blind.description}
                      onChange={(e) => setBlind(prev => prev ? { ...prev, description: e.target.value } : null)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-900">{blind.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
                    <p className="text-gray-900">{blind.price.toLocaleString()}원</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
                    <p className="text-gray-900">{blind.stock}개</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 이미지 관리 */}
          <div className="lg:col-span-2">
            <ProductImageManager
              productId={blind.id}
              category={blind.category}
              subcategory={blind.subcategory}
              title="블라인드 이미지 관리"
              allowedTypes={['main', 'gallery', 'detail']}
              maxImages={30}
              maxFileSize={8}
              onImageUpload={handleImageUpload}
              onImagesChange={(images) => {
                console.log('블라인드 이미지 변경:', images);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 