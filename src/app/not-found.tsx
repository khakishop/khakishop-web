'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../components';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* 에러 코드 */}
        <div className="mb-8">
          <h1 className="text-8xl lg:text-9xl font-serif text-neutral-200 leading-none mb-4">
            404
          </h1>
          <div className="w-24 h-0.5 bg-neutral-300 mx-auto"></div>
        </div>

        {/* 메인 메시지 */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif text-neutral-800 leading-tight tracking-tight">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-lg text-neutral-500 font-light leading-relaxed max-w-lg mx-auto">
            죄송합니다. 요청하신 페이지가 존재하지 않거나 이동되었을 수
            있습니다. URL을 다시 확인해주시거나 홈페이지로 돌아가세요.
          </p>
        </div>

        {/* CTA 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            href="/"
            variant="primary"
            size="lg"
            className="min-w-[180px]"
          >
            홈으로 돌아가기
          </Button>

          <Button
            href="/collection"
            variant="secondary"
            size="lg"
            className="min-w-[180px]"
          >
            컬렉션 보기
          </Button>
        </div>

        {/* 추가 도움말 */}
        <div className="mt-16 pt-8 border-t border-neutral-100">
          <p className="text-sm text-neutral-400 font-light">
            계속해서 문제가 발생한다면{' '}
            <Link
              href="/contact"
              className="text-neutral-600 hover:text-neutral-800 underline transition-colors duration-300"
            >
              고객지원
            </Link>
            으로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
