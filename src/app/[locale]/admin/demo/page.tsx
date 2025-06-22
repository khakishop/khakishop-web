'use client';

/**
 * ================================================================================
 * 🎯 Admin Demo Page - 어드민 이미지 관리 시스템 데모
 * ================================================================================
 * 
 * 이 페이지는 ProductImageManager가 모든 어드민 페이지에서 
 * 어떻게 활용될 수 있는지 보여주는 데모입니다.
 */

import {
  ArrowRight,
  Camera,
  Eye,
  Grid,
  Image,
  List,
  Package,
  Settings,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface DemoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  path: string;
  icon: React.ReactNode;
  features: string[];
  imageTypes: string[];
  maxImages: number;
  color: string;
}

const demoItems: DemoItem[] = [
  {
    id: 'curtain-essential-linen',
    title: '에센셜 리넨 커튼',
    description: '고급 리넨 소재의 프리미엄 커튼 상세 관리',
    category: 'collections',
    subcategory: 'curtain',
    path: '/admin/curtain/essential-linen',
    icon: <Package className="w-6 h-6" />,
    features: ['제품 정보 편집', '이미지 관리', '재고 관리', '상태 변경'],
    imageTypes: ['메인', '갤러리', '상세', '썸네일'],
    maxImages: 50,
    color: 'blue'
  },
  {
    id: 'blind-venetian-premium',
    title: '프리미엄 베네치안 블라인드',
    description: '우드 소재 베네치안 블라인드 상세 관리',
    category: 'collections',
    subcategory: 'blind',
    path: '/admin/blind/venetian-premium',
    icon: <Settings className="w-6 h-6" />,
    features: ['제품 정보 편집', '이미지 관리', '재고 관리'],
    imageTypes: ['메인', '갤러리', '상세'],
    maxImages: 30,
    color: 'green'
  },
  {
    id: 'images-global',
    title: '전체 이미지 관리',
    description: '모든 카테고리의 이미지를 한 곳에서 관리',
    category: 'all',
    path: '/admin/images',
    icon: <Image className="w-6 h-6" />,
    features: ['카테고리별 필터링', '일괄 업로드', '이미지 검색', '대량 삭제'],
    imageTypes: ['모든 타입'],
    maxImages: 1000,
    color: 'purple'
  }
];

export default function AdminDemoPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                🎯 어드민 이미지 관리 시스템 데모
              </h1>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                전체 통합 완료
              </span>
            </div>

            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 설명 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            🖼️ 통합 이미지 관리 시스템
          </h2>
          <p className="text-gray-700 mb-4">
            하나의 <code className="bg-blue-100 px-2 py-1 rounded text-sm">ProductImageManager</code> 컴포넌트로
            모든 어드민 페이지에서 일관된 이미지 관리 경험을 제공합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">드래그 앤 드롭</span>
              </div>
              <p className="text-gray-600">어디서든 이미지를 끌어다 놓기만 하면 업로드</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">타입별 관리</span>
              </div>
              <p className="text-gray-600">메인, 갤러리, 상세, 썸네일 이미지 구분 관리</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">실시간 미리보기</span>
              </div>
              <p className="text-gray-600">업로드와 동시에 미리보기 및 편집 가능</p>
            </div>
          </div>
        </div>

        {/* 데모 아이템들 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 사용 가능한 어드민 페이지들
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            각 페이지는 동일한 이미지 관리 시스템을 사용하되, 제품별로 최적화된 설정을 가집니다.
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-gray-300"
              >
                <div className={`h-2 bg-${item.color}-500`}></div>

                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 bg-${item.color}-100 rounded-lg text-${item.color}-600`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.category}{item.subcategory && ` > ${item.subcategory}`}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-gray-700">기능:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                        {item.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{item.features.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-gray-700">이미지 타입:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.imageTypes.map((type, index) => (
                          <span key={index} className={`px-2 py-1 bg-${item.color}-50 text-${item.color}-700 text-xs rounded`}>
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>최대 {item.maxImages}개</span>
                      <span>드래그 앤 드롭 지원</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {demoItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="group block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-${item.color}-100 rounded-lg text-${item.color}-600`}>
                      {item.icon}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{item.category}{item.subcategory && ` > ${item.subcategory}`}</span>
                        <span>•</span>
                        <span>최대 {item.maxImages}개 이미지</span>
                        <span>•</span>
                        <span>{item.imageTypes.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 기술 정보 */}
        <div className="mt-12 bg-gray-900 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">🛠️ 기술 구현</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">재사용 가능한 컴포넌트</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <code>ProductImageManager</code> - 범용 이미지 관리</li>
                <li>• 제품별 맞춤 설정 (타입, 개수, 크기 제한)</li>
                <li>• 일관된 UI/UX 경험</li>
                <li>• 타입세이프한 TypeScript 구현</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">핵심 기능</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 드래그 앤 드롭 업로드</li>
                <li>• 이미지 타입별 분류 (메인/갤러리/상세/썸네일)</li>
                <li>• 실시간 미리보기 및 편집</li>
                <li>• 그리드/리스트 뷰 모드</li>
                <li>• 검색 및 필터링</li>
                <li>• 대량 선택 및 삭제</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 