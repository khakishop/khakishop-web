'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  getCategoryByKey, 
  getSubcategories, 
  getCategoryBreadcrumb,
  hasSubcategories 
} from '../../../../../utils/constants/categories';

// ================================================================================
// 🔒 KHAKISHOP 카테고리별 하위 분류 페이지
// ================================================================================
// 🎯 목적: 특정 카테고리의 하위 분류들을 보여주고 선택할 수 있는 페이지

export default function CategorySubcategoriesPage() {
  const params = useParams();
  const categoryKey = params.category as string;
  
  const category = getCategoryByKey(categoryKey);
  const subcategories = getSubcategories(categoryKey);
  const breadcrumb = getCategoryBreadcrumb(categoryKey);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            카테고리를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">
            요청하신 카테고리 '{categoryKey}'가 존재하지 않습니다.
          </p>
          <Link
            href="/admin/images"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* 브레드크럼 */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link 
                  href="/admin/images"
                  className="hover:text-blue-600"
                >
                  📂 이미지 관리
                </Link>
                <span>/</span>
                <span className="font-medium text-gray-900">
                  {category.icon} {category.displayName}
                </span>
              </nav>
            </div>
            <Link
              href="/admin/images"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← 카테고리 목록으로
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 카테고리 정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {category.displayName}
              </h1>
              <p className="text-gray-600 mt-1">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* 하위 분류가 있는 경우 */}
        {hasSubcategories(categoryKey) ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                🗂️ 하위 분류 ({subcategories.length}개)
              </h2>
              <p className="text-sm text-gray-600">
                하위 분류를 선택하여 해당 카테고리의 이미지를 관리하세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory.key}
                  href={`/admin/images/${categoryKey}/${subcategory.key}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-2xl">{subcategory.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                          {subcategory.displayName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {subcategory.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        우선순위: {subcategory.priority}
                      </span>
                      <div className="text-blue-600 group-hover:text-blue-700">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* 하위 분류가 없는 경우 - 직접 이미지 관리 페이지로 리다이렉트 */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🖼️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              하위 분류가 없는 카테고리입니다
            </h2>
            <p className="text-gray-600 mb-6">
              이 카테고리는 직접 이미지를 관리할 수 있습니다.
            </p>
            <Link
              href={`/admin/images/${categoryKey}/manage`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              이미지 관리하기
            </Link>
          </div>
        )}

        {/* 통계 정보 */}
        {hasSubcategories(categoryKey) && (
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📊 하위 분류 통계
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {subcategories.length}
                </div>
                <div className="text-sm text-gray-600">총 하위 분류</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...subcategories.map(sub => sub.priority))}
                </div>
                <div className="text-sm text-gray-600">최고 우선순위</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    subcategories.reduce((sum, sub) => sum + sub.priority, 0) / subcategories.length
                  )}
                </div>
                <div className="text-sm text-gray-600">평균 우선순위</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 