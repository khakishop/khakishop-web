'use client';

import React, { useMemo, useCallback, useState, useEffect, memo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { motion } from "../lib/motion";
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '../data/projects';

interface VirtualizedProjectGridProps {
  projects: Project[];
  loading?: boolean;
  onProjectClick?: (project: Project) => void;
  itemsPerRow?: number;
  cardHeight?: number;
}

// 고정 카드 크기
const DEFAULT_CARD_WIDTH = 400;
const DEFAULT_CARD_HEIGHT = 520;
const GAP = 32; // gap-8

// 🎨 프로젝트 카드 컴포넌트
const ProjectCard = memo(({ 
  project, 
  index,
  onClick 
}: { 
  project: Project; 
  index: number;
  onClick?: () => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
  }, []);

  // 카테고리 한글 변환
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'Residential':
        return '주거';
      case 'Commercial':
        return '상업';
      case 'F&B':
        return '카페/레스토랑';
      case 'Healthcare':
        return '의료';
      case 'Cultural':
        return '문화';
      default:
        return category;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
      onClick={onClick}
    >
      <Link
        href={`/ko/references/${project.slug}`}
        className="group block h-full"
      >
        <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
          {/* 프로젝트 이미지 */}
          <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
            {!imageError ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                  </div>
                )}
                <Image
                  src={project.mainImage || '/images/hero/hero.jpg'}
                  alt={`${project.title} - ${project.location}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-2">🏠</span>
                <span className="text-sm">이미지 로드 실패</span>
              </div>
            )}

            {/* 카테고리 배지 */}
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs uppercase tracking-wider rounded-full font-medium">
                {getCategoryName(project.category)}
              </span>
            </div>

            {/* 연도 배지 */}
            <div className="absolute top-4 right-4">
              <span className="inline-block px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs uppercase tracking-wider rounded-full font-medium">
                {project.year}
              </span>
            </div>

            {/* 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* 프로젝트 정보 */}
          <div className="p-6 lg:p-8 flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <h3 className="text-xl lg:text-2xl font-serif text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                  {project.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {project.location}
                  </span>
                  {project.size && (
                    <>
                      <span>•</span>
                      <span>{project.size}</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-600 font-light leading-relaxed line-clamp-3 flex-1">
                {project.description}
              </p>
            </div>

            {/* 더보기 링크 */}
            <div className="pt-4 mt-auto">
              <span className="inline-flex items-center text-gray-900 group-hover:text-gray-600 transition-colors duration-300 text-sm uppercase tracking-wider font-medium">
                <span>자세히 보기</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default function VirtualizedProjectGrid({
  projects,
  loading = false,
  onProjectClick,
  itemsPerRow = 3,
  cardHeight = DEFAULT_CARD_HEIGHT
}: VirtualizedProjectGridProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // 컨테이너 크기 감지 - 개선된 버전
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    
    const updateSize = () => {
      const { width, height } = node.getBoundingClientRect();
      console.log('📏 컨테이너 크기 업데이트:', { width, height });
      setContainerSize({ width: width || 1200, height: height || 800 });
    };
    
    // 초기 크기 설정
    updateSize();
    
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    
    resizeObserver.observe(node);
    
    // 윈도우 리사이즈도 감지
    window.addEventListener('resize', updateSize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // 그리드 레이아웃 계산 - 개선된 버전
  const { columnCount, rowCount, columnWidth, rowHeight } = useMemo(() => {
    // 기본값 사용 - 컨테이너 크기가 0이어도 렌더링 가능
    const containerWidth = containerSize.width || 1200;
    const availableWidth = containerWidth - (GAP * 2);
    const columnsCount = Math.max(1, Math.min(itemsPerRow, Math.floor(availableWidth / (DEFAULT_CARD_WIDTH + GAP))));
    const actualColumnWidth = (availableWidth - (GAP * (columnsCount - 1))) / columnsCount;
    const rowsCount = Math.max(1, Math.ceil(projects.length / columnsCount));

    console.log('🧮 그리드 계산:', {
      containerWidth,
      availableWidth,
      columnsCount,
      rowsCount,
      actualColumnWidth,
      projectsLength: projects.length
    });

    return {
      columnCount: columnsCount,
      rowCount: rowsCount,
      columnWidth: actualColumnWidth,
      rowHeight: cardHeight + GAP
    };
  }, [containerSize.width, projects.length, itemsPerRow, cardHeight]);

  // 그리드 아이템 렌더러 - 개선된 버전
  const GridItem = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const projectIndex = rowIndex * columnCount + columnIndex;
    const project = projects[projectIndex];

    if (!project) {
      return <div style={style} />;
    }

    return (
      <div
        style={{
          ...style,
          padding: `0 ${GAP / 2}px ${GAP}px ${GAP / 2}px`,
        }}
      >
        <div className="w-full h-full">
          <ProjectCard
            project={project}
            index={projectIndex}
            onClick={() => onProjectClick?.(project)}
          />
        </div>
      </div>
    );
  }, [projects, columnCount, onProjectClick]);

  // 로딩 스켈레톤 - 개선된 버전
  const LoadingSkeleton = () => (
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
    </div>
  );

  console.log('🎯 VirtualizedProjectGrid 렌더링:', {
    projects: projects.length,
    loading,
    containerSize,
    columnCount,
    rowCount
  });

  // 로딩 상태
  if (loading) {
    return <LoadingSkeleton />;
  }

  // 프로젝트가 없는 경우
  if (projects.length === 0) {
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
  }

  // 가상화 그리드 렌더링 - 항상 렌더링되도록 수정
  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-500">
        그리드 정보: {columnCount}열 × {rowCount}행 (컨테이너: {containerSize.width}×{containerSize.height})
      </div>
      <div 
        ref={containerRef} 
        className="w-full min-h-[600px] border border-gray-200 rounded-lg"
        style={{ padding: `${GAP}px` }}
      >
        {/* 기본 그리드 폴백 - 가상화가 실패할 경우 */}
        {containerSize.width === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 9).map((project, index) => (
              <div key={project.slug} className="h-full">
                <ProjectCard
                  project={project}
                  index={index}
                  onClick={() => onProjectClick?.(project)}
                />
              </div>
            ))}
          </div>
        ) : (
          <Grid
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={Math.min(800, rowCount * (cardHeight + GAP))}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={containerSize.width}
            overscanRowCount={1}
            overscanColumnCount={1}
          >
            {GridItem}
          </Grid>
        )}
      </div>
    </div>
  );
} 