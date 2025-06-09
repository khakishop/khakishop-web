// ================================================================================
// 📊 KHAKISHOP - 통합 모니터링 시스템
// ================================================================================

import React from 'react';

// ================================================================================
// 🎯 성능 추적 클래스
// ================================================================================

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  tags?: Record<string, string>;
}

class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];

  trackPageLoad(pageName: string) {
    if (typeof window !== 'undefined' && performance) {
      const navigationTiming = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigationTiming) {
        this.addMetric({
          name: 'page_load_time',
          value: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
          unit: 'ms',
          tags: { page: pageName },
        });
      }
    }
  }

  trackApiCall(endpoint: string, duration: number, success: boolean) {
    this.addMetric({
      name: 'api_response_time',
      value: duration,
      unit: 'ms',
      tags: {
        endpoint,
        status: success ? 'success' : 'error',
      },
    });
  }

  trackMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      this.addMetric({
        name: 'memory_used',
        value: memory.usedJSHeapSize,
        unit: 'bytes',
      });
    }
  }

  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance:', metric);
    }
  }

  flushMetrics() {
    this.metrics = [];
  }
}

export const performanceTracker = new PerformanceTracker();

// ================================================================================
// 🚨 에러 추적 유틸리티
// ================================================================================

export function captureError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('📝 Error captured:', error, context);
  }
}

export function trackUserAction(
  action: string,
  properties?: Record<string, any>
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('👤 User Action:', action, properties);
  }
}

// ================================================================================
// 🎛️ 모니터링 훅
// ================================================================================

export function usePerformanceMonitoring(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      performanceTracker.trackApiCall(
        `component_${componentName}`,
        duration,
        true
      );
    };
  }, [componentName]);
}
