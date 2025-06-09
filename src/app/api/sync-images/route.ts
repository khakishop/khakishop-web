import { NextRequest, NextResponse } from 'next/server';
import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { validateAndRepairImageStore, syncImageMap, getAllImageInfo, getStoreStats } from '../../../utils/imageMapServer';
import { getCategoryPriority as getGlobalCategoryPriority, getAllCategoryFolders } from '../../../utils/constants/categories';

// ================================================================================
// 🔄 KHAKISHOP 이미지 동기화 API (보호된 시스템 통합)
// ================================================================================
// 🎯 목적: 파일-매핑 동기화 + 무결성 검사 + 보호된 저장소 관리
// 🛡️ 기능: 자동 복원, 실시간 상태, 완전한 데이터 일관성

// 🎯 카테고리별 우선순위 설정
function getCategoryPriority(category: string): number {
  // 중앙화된 카테고리 시스템 사용
  return getGlobalCategoryPriority(category);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRepair = searchParams.get('repair') === 'true';
    const includeStats = searchParams.get('stats') === 'true';

    console.log('🔄 이미지 동기화 API 시작...', { forceRepair, includeStats });

    // 1. 무결성 검사 및 자동 복원 (필요시)
    if (forceRepair) {
      console.log('🔧 강제 무결성 검사 및 복원 시작...');
      const repairResult = await validateAndRepairImageStore();
      
      if (!repairResult.success) {
        console.error('❌ 시스템 복원 실패:', repairResult);
        return NextResponse.json({
          success: false,
          error: '시스템 복원에 실패했습니다.',
          details: repairResult
        }, { status: 500 });
      }
      
      console.log(`✅ 시스템 복원 완료: 복원 ${repairResult.repaired.length}개, 누락 ${repairResult.missing.length}개`);
    }

    // 2. 기본 파일-매핑 동기화
    await syncImageMap();

    // 3. 매핑된 이미지 정보 가져오기
    const mappedImages = getAllImageInfo();

    // 4. 실제 파일 목록 스캔 - 중앙화된 카테고리 폴더 사용
    const imagesBaseDir = join(process.cwd(), 'public', 'images');
    let physicalFiles: Array<{
      name: string;
      size: number;
      modified: string;
      path: string;
      mapped: boolean;
      category: string;
    }> = [];

    try {
      // 🎯 중앙화된 카테고리 폴더 목록 사용
      const categoryFolders = [
        'midjourney',  // 기존 폴더 (gallery로 매핑)
        ...getAllCategoryFolders()  // 중앙화된 카테고리 폴더들
      ];

      for (const folder of categoryFolders) {
        const categoryDir = join(imagesBaseDir, folder);
        
        try {
          // 폴더가 존재하는지 확인
          const dirExists = readdirSync(categoryDir);
          const files = dirExists.filter(file => 
            /\.(png|jpg|jpeg|webp|svg)$/i.test(file)
          );

          const categoryFiles = files.map(fileName => {
            const filePath = join(categoryDir, fileName);
            const stats = statSync(filePath);
            const isMapped = mappedImages.some(mapped => 
              mapped.targetPath.includes(fileName) || mapped.sourceFile === fileName
            );
            
            return {
              name: fileName,
              size: stats.size,
              modified: stats.mtime.toISOString(),
              path: `/images/${folder}/${fileName}`,
              mapped: isMapped,
              category: folder === 'midjourney' ? 'gallery' : folder // midjourney 폴더는 gallery로 매핑
            };
          });

          physicalFiles.push(...categoryFiles);
          
        } catch (error) {
          // 해당 카테고리 폴더가 없으면 건너뛰기
          console.log(`📁 카테고리 폴더 없음: ${folder}`);
        }
      }

      physicalFiles.sort((a, b) => 
        new Date(b.modified).getTime() - new Date(a.modified).getTime()
      );

      console.log(`📂 스캔된 파일들:`, {
        총파일수: physicalFiles.length,
        카테고리별: physicalFiles.reduce((acc, file) => {
          acc[file.category] = (acc[file.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });

    } catch (error) {
      console.warn('⚠️ 물리적 파일 스캔 실패:', error);
      // 스캔 실패해도 매핑된 데이터는 반환
    }

    // 5. 매핑되지 않은 파일들 자동 매핑 추가
    const unmappedFiles = physicalFiles.filter(file => !file.mapped);
    let newlyMappedCount = 0;

    if (unmappedFiles.length > 0) {
      console.log(`📝 ${unmappedFiles.length}개의 매핑되지 않은 파일 발견, 자동 매핑 생성 중...`);
      
      const { addImageToMap } = await import('../../../utils/imageMapServer');
      
      for (const file of unmappedFiles) {
        try {
          // 파일명에서 확장자 제거하여 ID 생성
          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
          const imageId = `auto_${Date.now()}_${fileNameWithoutExt}`;
          
          const success = addImageToMap(
            file.name,
            file.path,
            {
              description: `자동 매핑된 ${file.category} 이미지 - ${file.name}`,
              category: file.category,
              priority: getCategoryPriority(file.category),
              alt: `khaki shop ${file.category} - ${fileNameWithoutExt}`,
              title: `khaki shop ${file.category} - ${fileNameWithoutExt}`,
              dataStyle: `${file.category}-auto`
            },
            false // 기본적으로 보호되지 않음
          );

          if (success) {
            newlyMappedCount++;
            // 물리적 파일 목록에서 매핑 상태 업데이트
            file.mapped = true;
            console.log(`✅ 자동 매핑 생성: ${imageId} -> ${file.path}`);
          }
        } catch (error) {
          console.warn(`⚠️ ${file.name} 자동 매핑 실패:`, error);
        }
      }

      // 새로 매핑이 추가되었으면 다시 매핑 정보 로드
      if (newlyMappedCount > 0) {
        console.log(`✅ ${newlyMappedCount}개 파일 자동 매핑 완료`);
        await syncImageMap(); // 재동기화
        const updatedMappedImages = getAllImageInfo(); // 업데이트된 매핑 정보 가져오기
        
        // 응답에 사용할 매핑 정보 업데이트
        mappedImages.length = 0;
        mappedImages.push(...updatedMappedImages);
      }
    }

    // 6. 통계 데이터 생성
    const storeStats = getStoreStats();
    
    // 7. 매핑-파일 일치성 분석
    const missingFiles = mappedImages.filter(mapped => 
      !physicalFiles.some(file => 
        mapped.targetPath.includes(file.name) || file.name === mapped.sourceFile
      )
    );

    // 8. 응답 데이터 구성
    const responseData = {
      success: true,
      timestamp: new Date().toISOString(),
      
      // 🗺️ 매핑된 이미지 (보호된 저장소 기반)
      mappedImages: mappedImages.map(image => ({
        id: image.id,
        sourceFile: image.sourceFile,
        targetPath: image.targetPath,
        isProtected: image.isProtected,
        createdAt: image.createdAt,
        metadata: {
          description: image.metadata.description,
          category: image.metadata.category,
          priority: image.metadata.priority,
          alt: image.metadata.alt,
          title: image.metadata.title
        }
      })),

      // 📁 물리적 파일들
      physicalFiles,

      // 📊 시스템 통계
      ...(includeStats && {
        stats: {
          store: storeStats,
          sync: {
            totalMapped: mappedImages.length,
            totalPhysical: physicalFiles.length,
            protectedImages: mappedImages.filter(img => img.isProtected).length,
            unmappedFiles: unmappedFiles.length,
            missingFiles: missingFiles.length,
            syncPercentage: physicalFiles.length > 0 
              ? Math.round((physicalFiles.filter(f => f.mapped).length / physicalFiles.length) * 100)
              : 0
          }
        }
      }),

      // ⚠️ 일치성 이슈
      issues: {
        unmappedFiles: unmappedFiles.map(file => ({
          name: file.name,
          path: file.path,
          size: file.size,
          recommendation: '자동 매핑 생성을 권장합니다.'
        })),
        missingFiles: missingFiles.map(mapped => ({
          id: mapped.id,
          sourceFile: mapped.sourceFile,
          targetPath: mapped.targetPath,
          recommendation: mapped.isProtected 
            ? '보호된 이미지입니다. 백업에서 복원하거나 수동으로 다시 업로드하세요.'
            : '매핑을 제거하거나 파일을 다시 업로드하세요.'
        }))
      },

      // 💡 권장사항
      recommendations: generateRecommendations(mappedImages, physicalFiles, storeStats)
    };

    console.log('✅ 이미지 동기화 완료:', {
      mappedImages: mappedImages.length,
      physicalFiles: physicalFiles.length,
      unmappedFiles: unmappedFiles.length,
      missingFiles: missingFiles.length,
      protectedImages: mappedImages.filter(img => img.isProtected).length
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('🚨 이미지 동기화 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST 요청: 강제 동기화 및 복원
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, forceRepair, includeStats } = body;

    console.log('🔄 이미지 동기화 API 시작... (POST)', { forceRepair, includeStats });
    
    // 📁 projects 폴더 이미지들 수동 추가 
    const { addImageToMap } = await import('../../../utils/imageMapServer');
    const projectsDir = join(process.cwd(), 'public', 'images', 'projects');
    
    if (existsSync(projectsDir)) {
      const files = readdirSync(projectsDir).filter(file => 
        /\.(png|jpg|jpeg|webp|svg)$/i.test(file)
      );
      
      console.log(`📁 projects 폴더에서 ${files.length}개 파일 발견`);
      
      for (const fileName of files) {
        try {
          const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
          const targetPath = `/images/projects/${fileName}`;
          
          // 이미 매핑된 것이 있는지 확인
          const existingMappings = getAllImageInfo();
          const alreadyMapped = existingMappings.some(mapping => 
            mapping.targetPath === targetPath || mapping.sourceFile === fileName
          );
          
          if (!alreadyMapped) {
            addImageToMap(
              fileName,
              targetPath,
              {
                description: `프로젝트 이미지 - ${fileNameWithoutExt}`,
                category: 'projects',
                priority: 2,
                alt: `khaki shop 프로젝트 - ${fileNameWithoutExt}`,
                title: `완성된 공간들 - ${fileNameWithoutExt}`,
                dataStyle: 'project-showcase'
              },
              false
            );
            console.log(`✅ projects 이미지 매핑 추가: ${fileName}`);
          }
        } catch (error) {
          console.warn(`⚠️ ${fileName} 매핑 실패:`, error);
        }
      }
    }

    // 1. 무결성 검사 및 자동 복원 (필요시)
    if (forceRepair) {
      console.log('🔧 강제 무결성 검사 및 복원 시작...');
      const repairResult = await validateAndRepairImageStore();
      
      if (!repairResult.success) {
        console.error('❌ 시스템 복원 실패:', repairResult);
        return NextResponse.json({
          success: false,
          error: '시스템 복원에 실패했습니다.',
          details: repairResult
        }, { status: 500 });
      }
      
      console.log(`✅ 시스템 복원 완료: 복원 ${repairResult.repaired.length}개, 누락 ${repairResult.missing.length}개`);
    }

    // 2. 기본 파일-매핑 동기화
    await syncImageMap();

    // 3. 매핑된 이미지 정보 가져오기
    const mappedImages = getAllImageInfo();
    const storeStats = getStoreStats();

    const responseData = {
      success: true,
      timestamp: new Date().toISOString(),
      
      data: {
        mappedImages: mappedImages.map(image => ({
          id: image.id,
          sourceFile: image.sourceFile,
          targetPath: image.targetPath,
          isProtected: image.isProtected,
          createdAt: image.createdAt,
          metadata: {
            description: image.metadata.description,
            category: image.metadata.category,
            priority: image.metadata.priority,
            alt: image.metadata.alt,
            title: image.metadata.title
          }
        })),

        ...(includeStats && { stats: storeStats })
      }
    };

    console.log('✅ 이미지 동기화 완료:', {
      mappedImages: mappedImages.length,
      protectedImages: mappedImages.filter(img => img.isProtected).length
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('🚨 이미지 동기화 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 💡 일반 권장사항 생성
function generateRecommendations(
  mappedImages: any[], 
  physicalFiles: any[], 
  storeStats: any
): string[] {
  const recommendations: string[] = [];

  if (physicalFiles.length === 0) {
    recommendations.push('❗ 이미지 폴더가 비어있습니다. 기본 이미지들을 업로드하세요.');
  }

  if (mappedImages.length === 0) {
    recommendations.push('❗ 이미지 매핑이 없습니다. 시스템 초기화가 필요합니다.');
  }

  const unmappedCount = physicalFiles.filter(f => !f.mapped).length;
  if (unmappedCount > 0) {
    recommendations.push(`📁 ${unmappedCount}개의 파일이 매핑되지 않았습니다. 자동 매핑을 실행하세요.`);
  }

  const missingCount = mappedImages.filter(mapped => 
    !physicalFiles.some(file => 
      mapped.targetPath.includes(file.name) || file.name === mapped.sourceFile
    )
  ).length;
  
  if (missingCount > 0) {
    recommendations.push(`⚠️ ${missingCount}개의 매핑된 파일이 실제로 존재하지 않습니다.`);
  }

  const protectedCount = mappedImages.filter(img => img.isProtected).length;
  if (protectedCount === 0 && mappedImages.length > 0) {
    recommendations.push('🔒 보호된 이미지가 없습니다. 중요한 이미지들에 보호 설정을 권장합니다.');
  }

  if (protectedCount > 0 && protectedCount / mappedImages.length < 0.3) {
    recommendations.push('🛡️ 보호된 이미지 비율이 낮습니다. 핵심 이미지들에 추가 보호 설정을 고려하세요.');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ 시스템이 완벽한 상태입니다!');
  }

  return recommendations;
}

// 🏥 건강 상태 권장사항 생성
function generateHealthRecommendations(
  healthResult: any,
  mappings: any[],
  storeStats: any
): string[] {
  const recommendations: string[] = [];

  if (!healthResult.success) {
    recommendations.push('🚨 시스템 무결성 검사에 실패했습니다. 수동 복원이 필요합니다.');
  }

  if (healthResult.missing.length > 0) {
    recommendations.push(`📁 ${healthResult.missing.length}개의 파일이 누락되었습니다. 백업에서 복원하세요.`);
  }

  if (healthResult.repaired.length > 0) {
    recommendations.push(`🔧 ${healthResult.repaired.length}개의 매핑이 자동 복원되었습니다.`);
  }

  if (mappings.length === 0) {
    recommendations.push('📷 시스템에 이미지가 없습니다. 초기 이미지를 업로드하세요.');
  }

  if (!storeStats?.lastSync) {
    recommendations.push('🔄 마지막 동기화 정보가 없습니다. 전체 동기화를 실행하세요.');
  }

  if (recommendations.length === 0) {
    recommendations.push('💚 시스템이 완전히 건강한 상태입니다!');
  }

  return recommendations;
} 