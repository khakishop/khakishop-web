'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
// import { motion } from "../../../lib/motion";
import VirtualizedProjectGrid from '../../../components/VirtualizedProjectGrid';
import Pagination from '../../../components/ui/Pagination';
import type { Project } from '../../../data/projects';

// 🔧 디버깅: Static fallback 데이터
const FALLBACK_PROJECTS: Project[] = [
  {
    slug: 'classic-cafe-hongdae',
    title: 'Classic Cafe Hongdae',
    category: 'F&B',
    year: '2023',
    location: '홍대',
    description: '클래식한 감성의 카페 공간 커튼 시공. 따뜻하고 아늑한 분위기 연출로 고객들의 휴식 공간을 완성했습니다.',
    mainImage: '/images/references/classic-cafe-hongdae/main.svg'
  },
  {
    slug: 'modern-office-gangnam',
    title: 'Modern Office Gangnam',
    category: 'Commercial',
    year: '2024',
    location: '강남구',
    description: '현대적 감각의 오피스 공간을 위한 맞춤형 블라인드 시공. 업무 효율성과 미적 완성도를 동시에 추구한 프로젝트입니다.',
    mainImage: '/images/references/modern-office-gangnam/main.svg'
  }
];

// 🔄 API 응답 타입
interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
  error?: string;
  message?: string;
  pagination: {
    page: number;
    limit: number;
    totalProjects: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  filters: {
    search: string;
    category: string;
    year: string;
    sortBy: string;
    sortOrder: string;
  };
  stats?: {
    totalProjects: number;
    categories: Record<string, number>;
    years: Record<string, number>;
    availableCategories: string[];
    availableYears: string[];
  };
}

// 📋 필터 상태 타입
interface FilterState {
  search: string;
  category: string;
  year: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// 🎛️ 기본 필터 설정
const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: '',
  year: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

// 📊 로딩 상태 enum
enum LoadingState {
  INITIAL_LOADING = 'initial_loading',
  FALLBACK_SHOWN = 'fallback_shown',
  API_SUCCESS = 'api_success',
  API_ERROR = 'api_error',
  REFETCHING = 'refetching'
}

export default function ReferencesPageClient() {
  console.log('🚀 ReferencesPageClient 시작');

  // 📋 상태 관리 - React 18 패턴 적용
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS); // fallback으로 초기화
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.FALLBACK_SHOWN);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ProjectsApiResponse['pagination'] | null>(null);
  const [stats, setStats] = useState<ProjectsApiResponse['stats'] | null>(null);
  
  // 🎯 현재 페이지 및 필터 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    year: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // 🎯 검색어 디바운싱
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const itemsPerPage = 12;

  // 디바운싱 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // 📡 API 호출 함수 - 상세 로깅 및 중복 요청 방지 개선
  const fetchProjects = useCallback(async (page: number, filterState: FilterState, isInitialLoad = false) => {
    console.log("✅ fetchProjects 실행됨", { page, filterState, isInitialLoad });
    
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();
    
    const currentLoadingState = isInitialLoad ? LoadingState.INITIAL_LOADING : LoadingState.REFETCHING;
    setLoadingState(currentLoadingState);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: filterState.search,
        category: filterState.category,
        year: filterState.year,
        sortBy: filterState.sortBy,
        sortOrder: filterState.sortOrder,
        includeStats: 'true'
      });

      console.log('🌐 API 호출 URL:', `/api/projects?${queryParams}`);
      
      const response = await fetch(`/api/projects?${queryParams}`, {
        signal: abortControllerRef.current.signal
      });
      
      console.log('📡 API 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const data: ProjectsApiResponse = await response.json();
      console.log('📦 API 응답 데이터:', data);

      if (data.success && data.data) {
        // 🎉 API 성공 시 데이터 업데이트
        setProjects(data.data);
        setPagination(data.pagination);
        if (data.stats) {
          setStats(data.stats);
        }
        setLoadingState(LoadingState.API_SUCCESS);
        
        console.log('✅ 프로젝트 데이터 업데이트 완료:', {
          projectsCount: data.data.length,
          currentPage: data.pagination.page,
          totalPages: data.pagination.totalPages,
          transition: isInitialLoad ? 'fallback → API' : 'refetch'
        });
      } else {
        throw new Error(data.message || 'API 응답 데이터가 올바르지 않습니다');
      }
    } catch (err) {
      // AbortError는 무시 (의도적 취소)
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🚫 API 요청 취소됨');
        return;
      }
      
      console.error('❌ fetchProjects 에러:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      
      // 에러 발생 시 fallback 데이터 유지 로직 개선
      if (projects.length === 0 || (projects.length === 2 && projects === FALLBACK_PROJECTS)) {
        console.log('🔄 fallback 데이터 유지');
        setProjects(FALLBACK_PROJECTS);
        setLoadingState(LoadingState.API_ERROR);
      } else {
        // 이미 API 데이터가 있다면 유지
        setLoadingState(LoadingState.API_ERROR);
      }
    }
  }, [projects]);

  // 📄 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    console.log('🌀 초기 useEffect 실행됨');
    
    const searchFilters = {
      ...filters,
      search: debouncedSearch
    };
    
    // 첫 로딩은 fallback에서 시작하여 자연스럽게 전환
    fetchProjects(currentPage, searchFilters, true);
    
    // cleanup 함수
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // 의존성 배열을 빈 배열로 하여 한 번만 실행

  // 📄 페이지 또는 필터 변경 시 데이터 리페치
  useEffect(() => {
    // 초기 로드가 아닌 경우에만 리페치
    if (loadingState !== LoadingState.INITIAL_LOADING && loadingState !== LoadingState.FALLBACK_SHOWN) {
      console.log('🔄 필터/페이지 변경으로 인한 리페치');
      
      const searchFilters = {
        ...filters,
        search: debouncedSearch
      };
      
      fetchProjects(currentPage, searchFilters, false);
    }
  }, [currentPage, debouncedSearch, filters.category, filters.year, filters.sortBy, filters.sortOrder, loadingState]);

  // 🎯 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage: number) => {
    console.log('📄 페이지 변경:', { from: currentPage, to: newPage });
    setCurrentPage(newPage);
    
    // 페이지 변경 시 맨 위로 스크롤
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, [currentPage]);

  // 🔍 필터 변경 핸들러들
  const handleSearchChange = useCallback((value: string) => {
    console.log('🔍 검색어 변경:', value);
    setFilters(prev => ({ ...prev, search: value }));
    // 검색 시 첫 페이지로 리셋
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    console.log('🏷️ 카테고리 변경:', category);
    setFilters(prev => ({ ...prev, category }));
    // 필터 변경 시 첫 페이지로 리셋
    setCurrentPage(1);
  }, []);

  const handleYearChange = useCallback((year: string) => {
    console.log('📅 연도 변경:', year);
    setFilters(prev => ({ ...prev, year }));
    // 필터 변경 시 첫 페이지로 리셋
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    console.log('🔄 정렬 변경:', { sortBy, sortOrder });
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
    // 정렬 변경 시 첫 페이지로 리셋
    setCurrentPage(1);
  }, []);

  // 🔄 필터 초기화
  const handleResetFilters = useCallback(() => {
    console.log('🔄 필터 초기화');
    setFilters({
      search: '',
      category: '',
      year: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  }, []);

  // 🎯 현재 상태 계산
  const isLoading = loadingState === LoadingState.INITIAL_LOADING || loadingState === LoadingState.REFETCHING;
  const isShowingFallback = loadingState === LoadingState.FALLBACK_SHOWN || 
                            (loadingState === LoadingState.API_ERROR && projects === FALLBACK_PROJECTS);
  const hasApiData = loadingState === LoadingState.API_SUCCESS && projects.length > 0;

  // 🎯 컴포넌트 렌더링 로그
  console.log('🎯 ReferencesPageClient 렌더링:', {
    projects: projects.length,
    loadingState,
    error,
    pagination,
    stats,
    currentPage,
    filters,
    isLoading,
    isShowingFallback,
    hasApiData
  });

  // 🏷️ 카테고리 이름 변환
  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Residential': '주거',
      'Commercial': '상업',
      'F&B': '카페/레스토랑',
      'Healthcare': '의료',
      'Cultural': '문화',
    };
    return categoryMap[category] || category;
  };

  // 🎨 렌더링
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 mb-6 leading-tight">
              프로젝트
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed">
              다양한 공간에서 펼쳐지는 우리의 이야기들.<br className="hidden sm:block"/>
              각각의 프로젝트는 공간과 사람, 그리고 빛이 만나는 특별한 순간을 담고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 🔍 검색 및 필터 섹션 */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="space-y-8">
            {/* 검색창 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  프로젝트 찾기
                </h2>
                <p className="text-gray-600">검색어나 필터를 사용해 원하는 프로젝트를 찾아보세요</p>
              </div>

              {/* 검색창 */}
              <div className="relative">
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="프로젝트명, 위치, 설명 검색..."
                  value={filters.search}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                  onChange={(e) => {
                    handleSearchChange(e.target.value);
                  }}
                />
              </div>

              {/* 필터 옵션들 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 카테고리 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={filters.category}
                    onChange={(e) => {
                      handleCategoryChange(e.target.value);
                    }}
                    className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="">모든 카테고리</option>
                    {stats?.availableCategories?.map(category => (
                      <option key={category} value={category}>
                        {getCategoryName(category)} ({stats.categories[category] || 0})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 연도 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연도</label>
                  <select
                    value={filters.year}
                    onChange={(e) => {
                      handleYearChange(e.target.value);
                    }}
                    className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="">모든 연도</option>
                    {stats?.availableYears?.map(year => (
                      <option key={year} value={year}>
                        {year}년 ({stats.years[year] || 0})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 정렬 옵션 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
                    }}
                    className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="date-desc">최신순</option>
                    <option value="date-asc">오래된순</option>
                    <option value="title-asc">이름순 (A-Z)</option>
                    <option value="title-desc">이름순 (Z-A)</option>
                  </select>
                </div>

                {/* 필터 초기화 버튼 */}
                <div className="flex items-end">
                  <button
                    onClick={handleResetFilters}
                    className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    초기화
                  </button>
                </div>
              </div>

              {/* 활성 필터 표시 */}
              {(filters.search || filters.category || filters.year || filters.sortBy !== 'date' || filters.sortOrder !== 'desc') && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">활성 필터:</span>
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      검색: "{filters.search}"
                      <button 
                        onClick={() => handleSearchChange('')}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {getCategoryName(filters.category)}
                      <button 
                        onClick={() => handleCategoryChange('')}
                        className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {filters.year && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {filters.year}년
                      <button 
                        onClick={() => handleYearChange('')}
                        className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 프로젝트 그리드 섹션 */}
      <section className="py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* 디버깅 정보 표시 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              프로젝트 그리드 ({projects.length}개 로드됨, 상태: {loadingState})
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              오류: {error ? '❌' : '✅'} | Fallback: {isShowingFallback ? '🔄' : '✅'} | API: {hasApiData ? '✅' : '⏳'}
            </p>
          </div>

          {/* 오류 메시지 - API 실패 시만 표시 */}
          {error && loadingState === LoadingState.API_ERROR && !isShowingFallback && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-red-900 mb-2">API 오류 발생</h3>
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={() => {
                    const searchFilters = { ...filters, search: debouncedSearch };
                    fetchProjects(currentPage, searchFilters, false);
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 🎯 메인 프로젝트 그리드 - Suspense 스타일 렌더링 */}
          {!error || isShowingFallback ? (
            <Suspense fallback={
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white transition ease-in-out duration-150">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    프로젝트 로딩 중...
                  </div>
                </div>
                <ProjectGridSkeleton />
              </div>
            }>
              <ProjectGridContent
                projects={projects}
                isLoading={isLoading}
                isShowingFallback={isShowingFallback}
                hasApiData={hasApiData}
                loadingState={loadingState}
              />
            </Suspense>
          ) : null}

          {/* 📄 페이지네이션 컴포넌트 */}
          <PaginationSection
            pagination={pagination}
            currentPage={currentPage}
            projects={projects}
            loadingState={loadingState}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </div>
  );
}

// 🎨 프로젝트 그리드 스켈레톤 컴포넌트
const ProjectGridSkeleton = React.memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="aspect-[4/3] bg-gray-200"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
));

ProjectGridSkeleton.displayName = 'ProjectGridSkeleton';

// 🎯 프로젝트 그리드 메인 콘텐츠 컴포넌트
interface ProjectGridContentProps {
  projects: Project[];
  isLoading: boolean;
  isShowingFallback: boolean;
  hasApiData: boolean;
  loadingState: LoadingState;
}

const ProjectGridContent = React.memo<ProjectGridContentProps>(({ 
  projects, 
  isLoading, 
  isShowingFallback, 
  hasApiData, 
  loadingState 
}) => {
  console.log('🎨 ProjectGridContent 렌더링:', { 
    projectsCount: projects.length, 
    isLoading, 
    isShowingFallback, 
    hasApiData, 
    loadingState 
  });

  if (projects.length > 0) {
    return (
      <div className="relative">
        {/* 전환 상태 표시 */}
        {isShowingFallback && (
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm text-center">
                🔄 fallback 데이터 표시 중... API 로딩: {isLoading ? '진행중' : '대기중'}
              </p>
            </div>
          </div>
        )}
        
        <div className={isShowingFallback ? 'mt-16' : ''}>
          <VirtualizedProjectGrid
            projects={projects}
            loading={false} // 개별 로딩은 VirtualizedProjectGrid 내부에서 처리
            onProjectClick={(project) => {
              window.location.href = `/ko/references/${project.slug}`;
            }}
          />
        </div>
      </div>
    );
  }

  // 로딩 중이면 스켈레톤 표시
  if (isLoading) {
    return <ProjectGridSkeleton />;
  }

  // 데이터가 없는 경우
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-gray-900">
            프로젝트가 없습니다
          </h3>
          <p className="text-gray-600 font-light">
            조건에 맞는 프로젝트를 찾을 수 없습니다.
          </p>
        </div>
      </div>
    </div>
  );
});

ProjectGridContent.displayName = 'ProjectGridContent';

// 📄 페이지네이션 섹션 컴포넌트
interface PaginationSectionProps {
  pagination: ProjectsApiResponse['pagination'] | null;
  currentPage: number;
  projects: Project[];
  loadingState: LoadingState;
  onPageChange: (page: number) => void;
}

const PaginationSection = React.memo<PaginationSectionProps>(({ 
  pagination, 
  currentPage, 
  projects, 
  loadingState, 
  onPageChange 
}) => {
  const isLoading = loadingState === LoadingState.INITIAL_LOADING || loadingState === LoadingState.REFETCHING;

  // API 데이터 기반 페이지네이션
  if (pagination && pagination.totalPages > 1) {
    return (
      <div className="mt-16 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          totalItems={pagination.totalProjects}
          itemsPerPage={pagination.limit}
        />
      </div>
    );
  }

  // Fallback 또는 로딩 중 상태 표시
  if (projects.length > 0) {
    return (
      <div className="mt-16 flex justify-center">
        <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>페이지 {currentPage}</span>
            <span>•</span>
            <span>{projects.length}개 프로젝트</span>
            {isLoading && (
              <>
                <span>•</span>
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingState === LoadingState.INITIAL_LOADING ? 'API 로딩 중...' : '업데이트 중...'}
                </span>
              </>
            )}
            {loadingState === LoadingState.FALLBACK_SHOWN && (
              <>
                <span>•</span>
                <span className="text-blue-600">fallback 데이터</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
});

PaginationSection.displayName = 'PaginationSection';
