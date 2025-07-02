'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, ImageIcon, MapPin, Calendar, Home } from 'lucide-react';

interface ProjectProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  client?: string;
  date?: string;
  area?: string;
}

interface ProjectCardProps {
  product: ProjectProduct;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (product: ProjectProduct) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function ProjectCard({
  product,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
}: ProjectCardProps) {
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
      <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              프로젝트명
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="프로젝트명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              프로젝트 설명
            </label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="프로젝트 설명을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                고객
              </label>
              <input
                type="text"
                value={editData.client || ''}
                onChange={(e) =>
                  setEditData({ ...editData, client: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="고객명"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                시공일
              </label>
              <input
                type="text"
                value={editData.date || ''}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2024.03"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                시공 면적
              </label>
              <input
                type="text"
                value={editData.area || ''}
                onChange={(e) =>
                  setEditData({ ...editData, area: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="200평"
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
                <option value="PREMIUM">PREMIUM</option>
                <option value="LUXURY">LUXURY</option>
                <option value="MODERN">MODERN</option>
                <option value="SMART">SMART</option>
                <option value="VIEW">VIEW</option>
                <option value="CLASSIC">CLASSIC</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium"
            >
              저장
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-medium"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group">
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
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-md ${
              product.badge === 'PREMIUM'
                ? 'bg-purple-500 text-white'
                : product.badge === 'LUXURY'
                  ? 'bg-yellow-500 text-white'
                  : product.badge === 'MODERN'
                    ? 'bg-blue-500 text-white'
                    : product.badge === 'SMART'
                      ? 'bg-green-500 text-white'
                      : product.badge === 'VIEW'
                        ? 'bg-cyan-500 text-white'
                        : product.badge === 'CLASSIC'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-500 text-white'
            }`}
          >
            {product.badge}
          </span>
        )}

        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          {product.price}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-2 mb-4">
          {product.client && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home size={14} />
              <span>{product.client}</span>
            </div>
          )}
          {product.date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} />
              <span>{product.date}</span>
            </div>
          )}
          {product.area && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} />
              <span>{product.area}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
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
