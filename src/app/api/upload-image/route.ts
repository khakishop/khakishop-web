import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { addProtectedImage } from '../../../utils/imageMapServer';

// ================================================================================
// 🔒 보호된 이미지 업로드 API (트랜잭션 보장)
// ================================================================================
// 🎯 목적: 안전한 파일 업로드 + 자동 매핑 + 실패 시 롤백

export async function POST(request: NextRequest) {
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'midjourney');
  let uploadedFilePath: string | null = null;
  
  try {
    // 🗂️ 업로드 디렉토리 확인/생성
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'gallery';
    const description = formData.get('description') as string || '';
    const isProtected = formData.get('isProtected') === 'true';

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: '파일이 업로드되지 않았습니다.' 
      });
    }

    // 🔍 파일 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: '지원되지 않는 파일 형식입니다. (PNG, JPG, JPEG, WebP만 지원)' 
      });
    }

    // 📏 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: '파일 크기가 너무 큽니다. (최대 10MB)' 
      });
    }

    // 🆔 고유 ID 생성 (기존 파일과 겹치지 않도록)
    let imageId: string;
    let fileName: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      attempts++;
      if (attempts > maxAttempts) {
        return NextResponse.json({ 
          success: false, 
          error: '고유 ID 생성 실패. 다시 시도해주세요.' 
        });
      }

      imageId = Date.now().toString() + Math.random().toString(36).substr(2, 6);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
      fileName = `${imageId}.${extension}`;
      uploadedFilePath = path.join(uploadDir, fileName);
    } while (fs.existsSync(uploadedFilePath));

    console.log(`🔄 이미지 업로드 시작: ${fileName} (ID: ${imageId})`);

    // 📁 파일 저장 (1단계)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(uploadedFilePath, buffer);
    console.log(`💾 파일 저장 완료: ${uploadedFilePath}`);

    // 🗺️ 매핑 추가 (2단계 - 트랜잭션)
    const metadata = {
      alt: `khaki shop - ${description || fileName}`,
      title: `${category === 'hero' ? '감성적인 텍스타일 브랜드 khaki shop' : 'khaki shop'} - ${description || fileName}`,
      dataStyle: `${category}-style`,
      category,
      description: description || `업로드된 이미지 ${imageId}`,
      priority: category === 'hero' ? 1 : category === 'landing' ? 1 : 5
    };

    const mappingResult = addProtectedImage(
      fileName, 
      `/images/midjourney/${fileName}`,
      metadata
    );

    if (!mappingResult) {
      // 매핑 실패 시 업로드된 파일 삭제 (롤백)
      try {
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
          console.log(`🗑️ 매핑 실패로 인한 파일 롤백: ${uploadedFilePath}`);
        }
      } catch (rollbackError) {
        console.error('🚨 롤백 실패:', rollbackError);
      }

      return NextResponse.json({ 
        success: false, 
        error: '이미지 매핑 저장에 실패했습니다. 업로드를 다시 시도해주세요.' 
      });
    }

    // ✅ 업로드 성공
    const result = {
      success: true,
      imageId,
      fileName,
      path: `/images/midjourney/${fileName}`,
      category,
      description,
      isProtected,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };

    console.log(`✅ 이미지 업로드 완료:`, result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('🚨 업로드 오류:', error);

    // 🔄 실패 시 정리 작업
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
        console.log(`🗑️ 오류로 인한 파일 정리: ${uploadedFilePath}`);
      } catch (cleanupError) {
        console.error('🚨 파일 정리 실패:', cleanupError);
      }
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 📊 업로드 현황 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      // 업로드 디렉토리 통계
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'midjourney');
      
      if (!fs.existsSync(uploadDir)) {
        return NextResponse.json({
          success: true,
          stats: {
            totalFiles: 0,
            totalSize: 0,
            types: {},
            lastModified: null
          }
        });
      }

      const files = fs.readdirSync(uploadDir);
      const imageFiles = files.filter(file => 
        /\.(png|jpg|jpeg|webp)$/i.test(file)
      );

      let totalSize = 0;
      const types: Record<string, number> = {};
      let lastModified: Date | null = null;

      imageFiles.forEach(fileName => {
        const filePath = path.join(uploadDir, fileName);
        const stats = fs.statSync(filePath);
        
        totalSize += stats.size;
        
        const ext = path.extname(fileName).toLowerCase();
        types[ext] = (types[ext] || 0) + 1;
        
        if (!lastModified || stats.mtime > lastModified) {
          lastModified = stats.mtime;
        }
      });

      return NextResponse.json({
        success: true,
        stats: {
          totalFiles: imageFiles.length,
          totalSize,
          types,
          lastModified: lastModified?.toISOString()
        }
      });
    }

    // 기본: 파일 목록 반환
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'midjourney');
    
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({
        success: true,
        files: []
      });
    }

    const files = fs.readdirSync(uploadDir);
    const imageFiles = files
      .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
      .map(fileName => {
        const filePath = path.join(uploadDir, fileName);
        const stats = fs.statSync(filePath);
        
        return {
          name: fileName,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          path: `/images/midjourney/${fileName}`
        };
      })
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    return NextResponse.json({
      success: true,
      files: imageFiles
    });

  } catch (error) {
    console.error('🚨 업로드 현황 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '업로드 현황을 조회할 수 없습니다.'
    }, { status: 500 });
  }
} 