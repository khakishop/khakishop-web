'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

// 로그인 폼 상태 타입
interface LoginFormState {
  email: string;
  password: string;
  isLoggingIn: boolean;
  showPassword: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
}

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'ko';

  // 로그인 폼 상태
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    isLoggingIn: false,
    showPassword: false,
    errors: {},
  });

  // 토큰이 있는지 확인하여 이미 로그인된 경우 리디렉션
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // 쿠키에서 토큰 확인
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.authenticated) {
            // 이미 로그인된 상태 - 대시보드로 리디렉션
            console.log('이미 로그인된 상태입니다:', result.user);
            router.replace(`/${locale}/admin`);
          }
        }
      } catch (error) {
        // 인증 확인 실패는 무시 (로그인 페이지 표시)
        console.log('인증 상태 확인 실패 (정상):', error);
      }
    };

    checkExistingAuth();
  }, [router, locale]);

  // 입력 필드 변경 핸들러
  const handleInputChange = useCallback(
    (field: keyof Pick<LoginFormState, 'email' | 'password'>) => {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormState((prev) => ({
          ...prev,
          [field]: value,
          errors: {
            ...prev.errors,
            [field]: undefined,
            general: undefined,
          },
        }));
      };
    },
    []
  );

  // 폼 검증
  const validateForm = useCallback((): boolean => {
    const errors: LoginFormState['errors'] = {};

    // 이메일 검증
    if (!formState.email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 비밀번호 검증
    if (!formState.password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (formState.password.length < 6) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    // 에러 상태 업데이트
    setFormState((prev) => ({ ...prev, errors }));

    return Object.keys(errors).length === 0;
  }, [formState.email, formState.password]);

  // 로그인 처리
  const handleLogin = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // 이미 로그인 중이면 리턴
      if (formState.isLoggingIn) return;

      // 폼 검증
      if (!validateForm()) return;

      setFormState((prev) => ({ ...prev, isLoggingIn: true, errors: {} }));

      try {
        const credentials = {
          email: formState.email.trim(),
          password: formState.password,
        };

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (result.success && result.user) {
          // 로그인 성공
          console.log('✅ 로그인 성공:', result.user);

          // URL 파라미터에서 원래 접근하려던 페이지 확인
          const returnTo = searchParams.get('returnTo');

          if (returnTo) {
            // 원래 접근하려던 페이지로 리디렉션
            console.log('🔄 원래 페이지로 복귀:', returnTo);
            router.replace(decodeURIComponent(returnTo));
          } else {
            // 기본 어드민 대시보드로 리디렉션 (환영 메시지와 함께)
            router.replace(`/${locale}/admin?welcome=true`);
          }
        } else {
          // 로그인 실패
          setFormState((prev) => ({
            ...prev,
            errors: {
              general: result.message || '로그인에 실패했습니다.',
            },
          }));
        }
      } catch (error) {
        console.error('로그인 요청 오류:', error);
        setFormState((prev) => ({
          ...prev,
          errors: {
            general: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
          },
        }));
      } finally {
        setFormState((prev) => ({ ...prev, isLoggingIn: false }));
      }
    },
    [formState, validateForm, router, locale, searchParams]
  );

  // 비밀번호 표시/숨김 토글
  const togglePasswordVisibility = useCallback(() => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* 로그인 카드 */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              KHAKISHOP Admin
            </h1>
            <p className="text-orange-100 text-sm">
              어드민 시스템에 로그인하세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* 전체 에러 메시지 */}
              {formState.errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {formState.errors.general}
                </div>
              )}

              {/* 이메일 필드 */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange('email')}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 ${
                    formState.errors.email
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="admin@khakishop.com"
                  disabled={formState.isLoggingIn}
                />
                {formState.errors.email && (
                  <p className="text-red-600 text-sm">
                    {formState.errors.email}
                  </p>
                )}
              </div>

              {/* 비밀번호 필드 */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={formState.showPassword ? 'text' : 'password'}
                    value={formState.password}
                    onChange={handleInputChange('password')}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200 ${
                      formState.errors.password
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    placeholder="비밀번호를 입력하세요"
                    disabled={formState.isLoggingIn}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={formState.isLoggingIn}
                  >
                    {formState.showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formState.errors.password && (
                  <p className="text-red-600 text-sm">
                    {formState.errors.password}
                  </p>
                )}
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={formState.isLoggingIn}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  formState.isLoggingIn
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {formState.isLoggingIn ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                    <span>로그인 중...</span>
                  </div>
                ) : (
                  '로그인'
                )}
              </button>

              {/* 계정 정보 안내 */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  🔑 테스트 계정
                </h3>
                <div className="text-xs text-blue-600 space-y-1">
                  <div>
                    <strong>이메일:</strong> admin@khakishop.com
                  </div>
                  <div>
                    <strong>비밀번호:</strong> admin123!
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* 하단 링크 */}
          <div className="px-8 pb-8 text-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
            >
              <span>🏠</span>
              홈페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
