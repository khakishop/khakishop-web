'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  ImageIcon,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ProjectCard } from './ProjectCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  details?: string;
  specs?: string;
  client?: string;
  date?: string;
  area?: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export default function CategoryManagePage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 토스트 메시지 표시 함수
  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info') => {
      const id = Date.now().toString();
      const toast: ToastMessage = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      // 3초 후 자동 제거
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  // 지원되는 카테고리 확인 (MASTER_CATEGORIES와 동일하게 확장)
  const supportedCategories = [
    'hero', // 메인 히어로 이미지
    'landing', // 랜딩 페이지 이미지
    'projects', // OUR PROJECTS 페이지용
    'references', // REFERENCES 페이지용
    'curtain', // 개별 커튼 페이지용 (기존 유지)
    'blind', // 개별 블라인드 페이지용 (기존 유지)
    'motorized', // 개별 전동시스템 페이지용 (기존 유지)
    'collection', // 단일 컬렉션 페이지용
    'about', // 회사 소개 페이지용
    'contact', // 연락처 페이지용
    'gallery', // 갤러리 페이지용
  ];
  const isSupportedCategory = supportedCategories.includes(category);

  useEffect(() => {
    if (isSupportedCategory) {
      loadCategoryProducts();
    } else {
      setError(`지원되지 않는 카테고리입니다: ${category}`);
      setIsLoading(false);
    }
  }, [category, isSupportedCategory]);

  const loadCategoryProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${category}`);

      if (!response.ok) {
        throw new Error(
          `API 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
        if (data.products?.length === 0) {
          showToast(
            `${getCategoryDisplayName(category)} 카테고리에 제품이 없습니다.`,
            'info'
          );
        }
      } else {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('제품 로드 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '제품을 불러오는데 실패했습니다.';
      setError(errorMessage);
      setProducts([]);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCategoryProducts();
    setIsRefreshing(false);
    showToast('제품 목록을 새로고침했습니다.', 'success');
  };

  const handleAddProduct = async () => {
    try {
      const newProduct: Product =
        category === 'projects'
          ? {
              id: `${Date.now()}`,
              name: '새 프로젝트',
              description: '프로젝트 설명을 입력하세요',
              price: '완료',
              image: '/images/placeholder.jpg',
              client: '고객명',
              date: new Date().toISOString().slice(0, 7).replace('-', '.'),
              area: '100평',
            }
          : {
              id: `${Date.now()}`,
              name: '새 제품',
              description: '제품 설명을 입력하세요',
              price: '0원',
              image: '/images/placeholder.jpg',
            };

      // API 호출하여 서버에 추가
      const response = await fetch(`/api/products/${category}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setProducts((prev) => [...prev, newProduct]);
        setIsEditing(newProduct.id);
        showToast('새 제품이 추가되었습니다.', 'success');
      } else {
        throw new Error('제품 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('제품 추가 실패:', error);
      showToast('제품 추가에 실패했습니다.', 'error');
    }
  };

  const handleEditProduct = (id: string) => {
    setIsEditing(id);
  };

  const handleSaveProduct = async (id: string, updatedProduct: Product) => {
    try {
      const response = await fetch(`/api/products/${category}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p))
        );
        setIsEditing(null);
        showToast('제품이 성공적으로 수정되었습니다.', 'success');
        await loadCategoryProducts(); // 최신 데이터로 새로고침
      } else {
        throw new Error('제품 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('제품 저장 실패:', error);
      showToast('제품 저장에 실패했습니다.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const product = products.find((p) => p.id === id);
    const productName = product?.name || '제품';

    if (!confirm(`정말로 "${productName}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${category}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`"${productName}"이(가) 삭제되었습니다.`, 'success');
      } else {
        throw new Error('제품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('제품 삭제 실패:', error);
      showToast('제품 삭제에 실패했습니다.', 'error');
    }
  };

  const getCategoryDisplayName = (cat: string) => {
    const names: Record<string, string> = {
      curtain: '커튼',
      blind: '블라인드',
      motorized: '전동시스템',
      projects: '프로젝트',
    };
    return names[cat] || cat;
  };

  const getToastIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const getToastColorClass = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  // 지원되지 않는 카테고리인 경우
  if (!isSupportedCategory) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            지원되지 않는 카테고리
          </h1>
          <p className="text-gray-600 mb-4">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {category}
            </span>{' '}
            카테고리는 지원되지 않습니다.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            지원되는 카테고리: {supportedCategories.join(', ')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="min-h-[80px] bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </div>

        {/* 제품 카드 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            오류가 발생했습니다
          </h1>
          <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              다시 시도
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              이전 페이지로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* 토스트 메시지 */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white border-l-4 transition-all duration-300 transform translate-x-0 ${getToastColorClass(toast.type)}`}
            style={{ minWidth: '300px' }}
          >
            <span className="text-lg">{getToastIcon(toast.type)}</span>
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[80px] bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {getCategoryDisplayName(category)} 제품 관리
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            총 {products.length}개 제품 • {category} 카테고리
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            새로고침
          </button>
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Plus size={20} />새 제품 추가
          </button>
        </div>
      </div>

      {/* 제품 목록 */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => {
            // 깜빡거림 방지를 위한 고정 높이 컨테이너
            return (
              <div key={product.id} className="min-h-[500px]">
                {category === 'projects' ? (
                  <ProjectCard
                    product={product}
                    isEditing={isEditing === product.id}
                    onEdit={() => handleEditProduct(product.id)}
                    onSave={(updatedProduct) =>
                      handleSaveProduct(product.id, updatedProduct)
                    }
                    onDelete={() => handleDeleteProduct(product.id)}
                    onCancel={() => setIsEditing(null)}
                  />
                ) : (
                  <ProductCard
                    product={product}
                    isEditing={isEditing === product.id}
                    onEdit={() => handleEditProduct(product.id)}
                    onSave={(updatedProduct) =>
                      handleSaveProduct(product.id, updatedProduct)
                    }
                    onDelete={() => handleDeleteProduct(product.id)}
                    onCancel={() => setIsEditing(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              {getCategoryDisplayName(category)} 제품이 없습니다
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              첫 번째 제품을 추가하여 카테고리를 시작해보세요.
            </p>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <Plus size={18} />첫 번째 제품 추가하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 일반 제품 카드 컴포넌트 (Projects가 아닌 경우)
function ProductCard({
  product,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
}: {
  product: Product;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (product: Product) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [editData, setEditData] = useState(product);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setEditData(product);
    }
  }, [isEditing, product]);

  const handleSave = () => {
    onSave(editData);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isEditing) {
    return (
      <div className="h-full border-2 border-blue-300 rounded-lg p-6 bg-blue-50 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              제품명
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="제품명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              제품 설명
            </label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="제품 설명을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                가격
              </label>
              <input
                type="text"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10,000원"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                배지
              </label>
              <select
                value={editData.badge || ''}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    badge: e.target.value || undefined,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">배지 없음</option>
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="SALE">SALE</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="BEST">BEST</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              이미지 URL
            </label>
            <input
              type="url"
              value={editData.image}
              onChange={(e) =>
                setEditData({ ...editData, image: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              저장
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-medium transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full shadow-md ${
              product.badge === 'NEW'
                ? 'bg-green-500 text-white'
                : product.badge === 'HOT'
                  ? 'bg-red-500 text-white'
                  : product.badge === 'SALE'
                    ? 'bg-orange-500 text-white'
                    : product.badge === 'PREMIUM'
                      ? 'bg-purple-500 text-white'
                      : product.badge === 'BEST'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-500 text-white'
            }`}
          >
            {product.badge}
          </span>
        )}

        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {product.price}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-1 flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
          >
            <Edit2 size={16} />
            편집
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
          >
            <Trash2 size={16} />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
