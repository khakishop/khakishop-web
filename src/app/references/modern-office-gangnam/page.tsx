'use client';

import React from 'react';
import Link from 'next/link';

export default function ModernOfficeGangnamPage() {
  // 프로젝트 이미지 갤러리 (placeholder 데이터)
  const projectImages = [
    { id: 1, src: '', alt: '모던 오피스 전체 전경' },
    { id: 2, src: '', alt: '리셉션 공간' },
    { id: 3, src: '', alt: '회의실 인테리어' },
    { id: 4, src: '', alt: '개방형 사무 공간' },
    { id: 5, src: '', alt: '휴게 공간' },
    { id: 6, src: '', alt: '디테일 샷' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 뒤로가기 네비게이션 */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/references"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            References로 돌아가기
          </Link>
        </div>
      </div>

      {/* 프로젝트 헤더 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            모던 오피스 인테리어
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <p className="text-xl text-gray-600 mb-2">서울 강남구</p>
              <p className="text-sm text-gray-500">프로젝트 완료: 2024년 3월</p>
            </div>
            <div className="flex space-x-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">오피스</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">모던</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">400㎡</span>
            </div>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            강남구에 위치한 IT 기업의 새로운 오피스 공간을 현대적이고 기능적으로 재탄생시킨 프로젝트입니다. 
            개방형 레이아웃과 자연 채광을 극대화하여 직원들의 창의성과 업무 효율성을 높이는 공간을 구현했습니다.
          </p>
        </div>
      </div>

      {/* 메인 이미지 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-medium">메인 이미지</p>
            </div>
          </div>
        </div>
      </div>

      {/* 프로젝트 상세 정보 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 프로젝트 설명 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">프로젝트 개요</h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                이번 프로젝트는 급성장하고 있는 스타트업의 새로운 본사 오피스 공간을 디자인하는 것이었습니다. 
                기존의 폐쇄적인 사무실 구조를 탈피하고, 창의적이고 협업이 활발한 업무 환경을 만드는 것이 주요 목표였습니다.
              </p>
              <p>
                개방형 레이아웃을 기본으로 하되, 집중이 필요한 업무를 위한 독립 공간도 적절히 배치했습니다. 
                자연광을 최대한 활용하고, 녹색 식물과 자연 소재를 활용하여 직원들의 스트레스를 줄이고 
                생산성을 높일 수 있는 환경을 조성했습니다.
              </p>
              <p>
                특히 다양한 형태의 미팅 공간과 휴게 공간을 통해 자연스러운 소통이 이루어질 수 있도록 했으며, 
                최신 스마트 오피스 기술을 도입하여 효율적인 업무 환경을 구축했습니다.
              </p>
            </div>
          </div>

          {/* 프로젝트 정보 */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">프로젝트 정보</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">위치</dt>
                <dd className="text-base text-gray-900">서울 강남구 테헤란로</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">면적</dt>
                <dd className="text-base text-gray-900">400㎡ (약 120평)</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">기간</dt>
                <dd className="text-base text-gray-900">2024.01 - 2024.03 (3개월)</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">스타일</dt>
                <dd className="text-base text-gray-900">모던, 미니멀</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">주요 포인트</dt>
                <dd className="text-base text-gray-900">개방형 레이아웃, 자연 채광, 스마트 오피스</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* 이미지 갤러리 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">프로젝트 갤러리</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectImages.map((image) => (
            <div key={image.id} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Image</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 다른 프로젝트 보기 */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">다른 프로젝트도 확인해보세요</h2>
          <p className="text-gray-600 mb-8">더 많은 인테리어 프로젝트와 완성된 공간들을 만나보실 수 있습니다.</p>
          <Link 
            href="/references"
            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            모든 프로젝트 보기
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 