'use client';

/**
 * ================================================================================
 * 🪟 Curtain Detail Admin Page - 커튼 상세 어드민 페이지
 * ================================================================================
 * 
 * 기능:
 * - 커튼 제품 정보 관리
 * - 커튼 이미지 관리 (메인, 갤러리, 상세, 썸네일)
 * - 드래그 앤 드롭 이미지 업로드
 * - 실시간 이미지 편집 및 삭제
 */

import { ArrowLeft, Eye, Save, Settings } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductImageManager from '../../../../../components/admin/ProductImageManager';

interface CurtainProduct {
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

export default function CurtainDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const curtainId = params.id as string;

  const [curtain, setCurtain] = useState<CurtainProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 모의 커튼 데이터
  useEffect(() => {
    // 실제로는 API 호출
    setTimeout(() => {
      setCurtain({
        id: curtainId,
        name: '에센셜 리넨 커튼',
        description: '고급 리넨 소재로 제작된 프리미엄 커튼입니다. 자연스러운 질감과 우아한 드레이프가 특징입니다.',
        category: 'collections',
        subcategory: 'curtain',
        price: 89000,
        stock: 15,
        status: 'active',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-06-20T00:00:00Z'
      });
      setIsLoading(false);
    }, 1000);
  }, [curtainId]);

  // 커튼 정보 저장
  const handleSave = async () => {
    if (!curtain) return;

    try {
      // 실제로는 API 호출
      console.log('커튼 정보 저장:', curtain);
      alert('커튼 정보가 저장되었습니다.');
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (files: File[], type: string) => {
    console.log(`커튼 ${curtainId}에 ${type} 이미지 업로드:`, files.map(f => f.name));

    // 실제로는 서버 업로드 API 호출
    // 여기서는 모의 응답 반환
    return files.map((file, index) => ({
      id: `curtain_${curtainId}_${type}_${Date.now()}_${index}`,
      url: URL.createObjectURL(file),
      filename: file.name,
      alt: `${curtain?.name} ${type} 이미지`,
      category: 'collections',
      subcategory: 'curtain',
      productId: curtainId,
      type: type as any,
      order: index,
      size: file.size,
      uploadDate: new Date().toISOString(),
      tags: ['curtain', 'collections', type, curtain?.name || '']
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">커튼 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!curtain) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">커튼을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 커튼 ID({curtainId})에 해당하는 제품이 없습니다.</p>
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
                  🪟 커튼 관리: {curtain.name}
                </h1>
                <p className="text-sm text-gray-500">ID: {curtain.id}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${curtain.status === 'active' ? 'bg-green-100 text-green-800' :
                  curtain.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                {curtain.status === 'active' && '활성'}
                {curtain.status === 'inactive' && '비활성'}
                {curtain.status === 'draft' && '임시저장'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open(`/curtain/${curtain.id}`, '_blank')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <Eye className="w-4 h-4" />
                <span>미리보기</span>
              </button>
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
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </button>
              )}
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
                      value={curtain.name}
                      onChange={(e) => setCurtain(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-900">{curtain.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                  {isEditing ? (
                    <textarea
                      value={curtain.description}
                      onChange={(e) => setCurtain(prev => prev ? { ...prev, description: e.target.value } : null)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-900">{curtain.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={curtain.price}
                        onChange={(e) => setCurtain(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p className="text-gray-900">{curtain.price.toLocaleString()}원</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={curtain.stock}
                        onChange={(e) => setCurtain(prev => prev ? { ...prev, stock: Number(e.target.value) } : null)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p className="text-gray-900">{curtain.stock}개</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  {isEditing ? (
                    <select
                      value={curtain.status}
                      onChange={(e) => setCurtain(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                      <option value="draft">임시저장</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {curtain.status === 'active' && '활성'}
                      {curtain.status === 'inactive' && '비활성'}
                      {curtain.status === 'draft' && '임시저장'}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>생성일: {new Date(curtain.createdAt).toLocaleDateString('ko-KR')}</p>
                    <p>수정일: {new Date(curtain.updatedAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 이미지 관리 */}
          <div className="lg:col-span-2">
            <ProductImageManager
              productId={curtain.id}
              category={curtain.category}
              subcategory={curtain.subcategory}
              title="커튼 이미지 관리"
              allowedTypes={['main', 'gallery', 'detail', 'thumbnail']}
              maxImages={50}
              maxFileSize={10}
              onImageUpload={handleImageUpload}
              onImagesChange={(images) => {
                console.log('커튼 이미지 변경:', images);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 