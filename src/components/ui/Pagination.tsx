'use client';

import React, { memo } from 'react';
import { motion } from "../../lib/motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showJumpToFirst?: boolean;
  showJumpToLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination = memo(({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showJumpToFirst = true,
  showJumpToLast = true,
  maxVisiblePages = 5
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  // 표시할 페이지 번호 계산
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // 시작 또는 끝 부분에서 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 py-6 border-t border-gray-200"
    >
      {/* 페이지 정보 */}
      {showInfo && (
        <div className="text-sm text-gray-600 font-light">
          <span className="font-medium text-gray-900">{startItem}</span>
          {' - '}
          <span className="font-medium text-gray-900">{endItem}</span>
          {' / 총 '}
          <span className="font-medium text-gray-900">{totalItems}</span>
          개 항목
        </div>
      )}

      {/* 페이지네이션 버튼들 */}
      <div className="flex items-center space-x-2">
        {/* 첫 페이지로 */}
        {showJumpToFirst && currentPage > 2 && (
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="첫 페이지"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 이전 페이지 */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 페이지 번호들 */}
        <div className="flex items-center space-x-1">
          {/* 시작 부분에 ... 표시 */}
          {visiblePages[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                1
              </button>
              {visiblePages[0] > 2 && (
                <span className="px-2 py-2 text-sm text-gray-400">...</span>
              )}
            </>
          )}

          {/* 표시할 페이지 번호들 */}
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* 끝 부분에 ... 표시 */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="px-2 py-2 text-sm text-gray-400">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* 다음 페이지 */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 마지막 페이지로 */}
        {showJumpToLast && currentPage < totalPages - 1 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            title="마지막 페이지"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination; 