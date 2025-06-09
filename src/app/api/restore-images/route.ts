import { NextRequest, NextResponse } from 'next/server';
import {
  validateAndRepairImageStore,
  getStoreStats,
  setImageProtection,
} from '../../../utils/imageMapServer';

// ================================================================================
// 🔧 KHAKISHOP 이미지 시스템 복원 & 무결성 검사 API
// ================================================================================
// 🎯 목적: 자동 시스템 복원, 무결성 검사, 데이터 보호 관리
// 🛡️ 기능: 파일-매핑 동기화, 보호 설정, 백업 관리

export async function POST(request: NextRequest) {
  try {
    const { action, imageId, isProtected } = await request.json();

    switch (action) {
      case 'repair':
        // 🔧 시스템 무결성 검사 및 자동 복원
        console.log('🔧 시스템 무결성 검사 시작...');
        const repairResult = await validateAndRepairImageStore();

        if (repairResult.success) {
          console.log(
            `✅ 무결성 검사 완료: 복원 ${repairResult.repaired.length}개, 누락 ${repairResult.missing.length}개`
          );

          return NextResponse.json({
            success: true,
            message: '시스템 무결성 검사가 완료되었습니다.',
            repaired: repairResult.repaired,
            missing: repairResult.missing,
            stats: getStoreStats(),
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: '시스템 복원 중 오류가 발생했습니다.',
              details: repairResult,
            },
            { status: 500 }
          );
        }

      case 'protect':
        // 🛡️ 이미지 보호 설정
        if (!imageId || typeof isProtected !== 'boolean') {
          return NextResponse.json(
            {
              success: false,
              error: 'imageId와 isProtected 값이 필요합니다.',
            },
            { status: 400 }
          );
        }

        const protectionResult = setImageProtection(imageId, isProtected);

        if (protectionResult) {
          return NextResponse.json({
            success: true,
            message: `이미지 ${imageId}의 보호 설정이 ${isProtected ? '활성화' : '비활성화'}되었습니다.`,
            imageId,
            isProtected,
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: '이미지 보호 설정에 실패했습니다.',
            },
            { status: 500 }
          );
        }

      case 'stats':
        // 📊 시스템 통계 조회
        const stats = getStoreStats();
        return NextResponse.json({
          success: true,
          stats,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              '지원되지 않는 작업입니다. (repair, protect, stats 중 하나를 선택하세요)',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('🚨 복원 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

// GET 요청: 시스템 상태 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'health') {
      // 🏥 시스템 건강 상태 체크
      const stats = getStoreStats();
      const healthCheck = await validateAndRepairImageStore();

      const isHealthy =
        healthCheck.success &&
        healthCheck.missing.length === 0 &&
        stats.totalImages > 0;

      return NextResponse.json({
        success: true,
        healthy: isHealthy,
        stats,
        issues: {
          missingFiles: healthCheck.missing,
          repairedMappings: healthCheck.repaired,
        },
        recommendations: getHealthRecommendations(healthCheck, stats),
      });
    }

    // 기본: 통계 정보 반환
    const stats = getStoreStats();
    return NextResponse.json({
      success: true,
      stats,
      message: '시스템이 정상적으로 작동 중입니다.',
    });
  } catch (error) {
    console.error('🚨 상태 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '시스템 상태를 조회할 수 없습니다.',
      },
      { status: 500 }
    );
  }
}

// 🏥 건강 상태 기반 권장사항 생성
function getHealthRecommendations(
  healthCheck: { success: boolean; repaired: string[]; missing: string[] },
  stats: any
): string[] {
  const recommendations: string[] = [];

  if (healthCheck.missing.length > 0) {
    recommendations.push(
      `${healthCheck.missing.length}개의 파일이 누락되었습니다. 백업에서 복원하거나 매핑을 정리하세요.`
    );
  }

  if (healthCheck.repaired.length > 0) {
    recommendations.push(
      `${healthCheck.repaired.length}개의 매핑이 자동 복원되었습니다. 메타데이터를 확인하세요.`
    );
  }

  if (stats.totalImages === 0) {
    recommendations.push(
      '이미지가 하나도 없습니다. 기본 이미지를 업로드하세요.'
    );
  }

  if (stats.protectedImages === 0) {
    recommendations.push(
      '보호된 이미지가 없습니다. 중요한 이미지는 보호 설정을 권장합니다.'
    );
  }

  if (stats.protectedImages / stats.totalImages < 0.5) {
    recommendations.push(
      '보호된 이미지 비율이 낮습니다. 핵심 이미지들에 보호 설정을 고려하세요.'
    );
  }

  if (!stats.lastSync) {
    recommendations.push(
      '마지막 동기화 정보가 없습니다. 시스템 복원을 실행하세요.'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ 시스템이 완벽한 상태입니다!');
  }

  return recommendations;
}
