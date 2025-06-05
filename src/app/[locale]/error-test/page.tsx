'use client';

import React from 'react';
import { Button } from '../../../components';

export default function ErrorTestPage() {
  const triggerError = () => {
    throw new Error('테스트용 서버 에러입니다. 에러 페이지가 올바르게 작동하는지 확인하기 위한 것입니다.');
  };

  const triggerAsyncError = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error('비동기 테스트 에러입니다.');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* 테스트 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-serif text-neutral-800 leading-tight tracking-tight mb-6">
            에러 페이지 테스트
          </h1>
          <p className="text-lg text-neutral-500 font-light leading-relaxed">
            다양한 에러 상황을 시뮬레이션하여 에러 페이지의 작동을 확인할 수 있습니다.
          </p>
        </div>

        {/* 테스트 버튼들 */}
        <div className="space-y-6">
          <div className="p-6 bg-neutral-50 rounded-2xl">
            <h3 className="text-xl font-serif text-neutral-700 mb-3">즉시 에러 발생</h3>
            <p className="text-sm text-neutral-500 mb-4">버튼 클릭 시 즉시 에러를 발생시켜 500 에러 페이지를 표시합니다.</p>
            <Button 
              onClick={triggerError}
              variant="primary"
              size="md"
            >
              즉시 에러 발생
            </Button>
          </div>

          <div className="p-6 bg-neutral-50 rounded-2xl">
            <h3 className="text-xl font-serif text-neutral-700 mb-3">비동기 에러 발생</h3>
            <p className="text-sm text-neutral-500 mb-4">1초 후 비동기 에러를 발생시킵니다.</p>
            <Button 
              onClick={triggerAsyncError}
              variant="secondary"
              size="md"
            >
              비동기 에러 발생
            </Button>
          </div>

          <div className="p-6 bg-neutral-50 rounded-2xl">
            <h3 className="text-xl font-serif text-neutral-700 mb-3">404 에러 테스트</h3>
            <p className="text-sm text-neutral-500 mb-4">존재하지 않는 페이지로 이동하여 404 페이지를 표시합니다.</p>
            <Button 
              href="/ko/non-existent-page-404-test"
              variant="link"
              size="md"
            >
              404 페이지로 이동
            </Button>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="mt-12 pt-8 border-t border-neutral-100">
          <Button 
            href="/ko"
            variant="secondary"
            size="lg"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
} 