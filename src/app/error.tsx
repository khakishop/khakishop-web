'use client';

import React from 'react';
import { Button } from '../components';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* 에러 코드 */}
        <div className="mb-8">
          <h1 className="text-8xl lg:text-9xl font-serif text-neutral-200 leading-none mb-4">
            500
          </h1>
          <div className="w-24 h-0.5 bg-neutral-300 mx-auto"></div>
        </div>

        {/* 메인 메시지 */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif text-neutral-800 leading-tight tracking-tight">
            서버 오류가 발생했습니다
          </h2>
          <p className="text-lg text-neutral-500 font-light leading-relaxed max-w-lg mx-auto">
            죄송합니다. 일시적인 서버 문제로 인해 페이지를 불러올 수 없습니다. 
            잠시 후 다시 시도해주시거나 홈페이지로 돌아가세요.
          </p>
        </div>

        {/* 에러 상세 정보 (개발 환경에서만) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-neutral-50 rounded-lg text-left">
            <p className="text-sm text-neutral-600 font-mono">
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-sm text-neutral-600 font-mono mt-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        {/* CTA 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={reset}
            variant="primary" 
            size="lg"
            className="min-w-[180px]"
          >
            다시 시도하기
          </Button>
          
          <Button 
            href="/" 
            variant="secondary" 
            size="lg"
            className="min-w-[180px]"
          >
            홈으로 돌아가기
          </Button>
        </div>

        {/* 추가 도움말 */}
        <div className="mt-16 pt-8 border-t border-neutral-100">
          <p className="text-sm text-neutral-400 font-light">
            문제가 지속적으로 발생한다면{' '}
            <a 
              href="/contact" 
              className="text-neutral-600 hover:text-neutral-800 underline transition-colors duration-300"
            >
              기술지원팀
            </a>
            으로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
} 