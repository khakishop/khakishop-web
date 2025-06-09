'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ================================================================================
// 🏥 KHAKISHOP 시스템 상태 카드 (홈페이지 스타일)
// ================================================================================
// 🎯 목적: 이미지 시스템의 건강 상태를 직관적으로 표시
// 🎨 스타일: khaki shop 브랜드 감성, 현대적 카드 디자인
// 🔧 기능: 실시간 상태 모니터링, 건강도 체크, 통계 표시

interface SystemStatusCardProps {
  systemHealth?: any;
  storeStats?: any;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function SystemStatusCard({
  systemHealth,
  storeStats,
  onRefresh,
  loading = false
}: SystemStatusCardProps) {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // khaki shop 브랜드 색상 (홈페이지와 동일)
  const colors = {
    cream: '#F7F5F3',
    warmWhite: '#FEFDFB',
    earthBrown: '#8B7A6B',
    textPrimary: '#2D2823',
    textSecondary: '#4A453E',
    accent: '#E8E5E1',
    khakiBeige: '#D4C4A8'
  };

  // 시스템 상태 결정
  const getSystemStatus = () => {
    if (loading) {
      return { status: 'loading', icon: '🔄', message: '상태 확인 중...' };
    }

    if (!systemHealth && !storeStats) {
      return { status: 'unknown', icon: '❓', message: '상태 정보 없음' };
    }

    if (systemHealth?.error) {
      return { status: 'error', icon: '🚨', message: '시스템 오류 감지' };
    }

    if (systemHealth?.missing?.length > 0) {
      return { status: 'warning', icon: '⚠️', message: `${systemHealth.missing.length}개 파일 누락` };
    }

    return { status: 'healthy', icon: '✅', message: '모든 시스템 정상' };
  };

  const status = getSystemStatus();

  // 새로고침 핸들러
  const handleRefresh = () => {
    if (onRefresh && !loading) {
      onRefresh();
      setLastRefresh(new Date());
    }
  };

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'loading':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E5E1] overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏥</div>
            <div>
              <h3 className="text-white font-medium">시스템 상태</h3>
              <p className="text-blue-100 text-sm">실시간 모니터링</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
          >
            <div className={`text-white text-lg ${loading ? 'animate-spin' : ''}`}>
              🔄
            </div>
          </motion.button>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-4 space-y-4">
        {/* 시스템 상태 표시 */}
        <div className={`p-3 rounded-xl border ${getStatusColor(status.status)}`}>
          <div className="flex items-center gap-3">
            <div className="text-xl">{status.icon}</div>
            <div>
              <div className="font-medium">{status.message}</div>
              {lastRefresh && (
                <div className="text-xs opacity-70 mt-1">
                  마지막 확인: {lastRefresh.toLocaleTimeString('ko-KR')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 통계 정보 */}
        {storeStats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-[#F7F5F3] rounded-xl">
              <div className="text-xl font-light text-[#2D2823]">
                {storeStats.totalImages || 0}
              </div>
              <div className="text-xs text-[#4A453E] uppercase tracking-wider">
                총 이미지
              </div>
            </div>
            
            <div className="text-center p-3 bg-emerald-50 rounded-xl">
              <div className="text-xl font-light text-emerald-700">
                {storeStats.protectedImages || 0}
              </div>
              <div className="text-xs text-emerald-600 uppercase tracking-wider">
                보호된 이미지
              </div>
            </div>
          </div>
        )}

        {/* 카테고리 통계 */}
        {storeStats?.categories && Object.keys(storeStats.categories).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-[#2D2823] mb-2">카테고리별 분포</h4>
            <div className="space-y-2">
              {Object.entries(storeStats.categories).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center text-sm">
                  <span className="text-[#4A453E] capitalize">{category}</span>
                  <span className="text-[#2D2823] font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 오류 및 경고 */}
        {systemHealth?.missing && systemHealth.missing.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-600">⚠️</span>
              <span className="text-sm font-medium text-amber-800">누락된 파일</span>
            </div>
            <div className="text-xs text-amber-700 space-y-1">
              {systemHealth.missing.slice(0, 3).map((file: string, index: number) => (
                <div key={index} className="truncate">• {file}</div>
              ))}
              {systemHealth.missing.length > 3 && (
                <div className="text-amber-600">...그 외 {systemHealth.missing.length - 3}개</div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
            >
              🔧 자동 복구
            </motion.button>
          </div>
        )}

        {/* 성능 정보 */}
        {systemHealth?.performance && (
          <div className="bg-gray-50 rounded-xl p-3">
            <h4 className="text-sm font-medium text-[#2D2823] mb-2">성능 정보</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-white rounded">
                <div className="font-medium text-[#2D2823]">
                  {systemHealth.performance.responseTime || 'N/A'}ms
                </div>
                <div className="text-[#4A453E]">응답시간</div>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <div className="font-medium text-[#2D2823]">
                  {systemHealth.performance.uptime || 'N/A'}%
                </div>
                <div className="text-[#4A453E]">가동률</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 