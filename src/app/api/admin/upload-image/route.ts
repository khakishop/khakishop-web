import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const imageKey = formData.get('imageKey') as string;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    if (!imageKey) {
      return NextResponse.json({ error: '이미지 키가 없습니다.' }, { status: 400 });
    }

    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 10MB 이하여야 합니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 이미지 키에 따른 저장 경로 결정
    let targetDir = '';
    let fileName = '';

    switch (imageKey) {
      case 'hero':
        targetDir = 'public/images/hero';
        fileName = 'hero.jpg';
        break;
      case 'curtain':
        targetDir = 'public/images/references';
        fileName = 'curtain-modern-livingroom-1.png';
        break;
      case 'blind':
        targetDir = 'public/images/references';
        fileName = 'blind-minimal-bedroom-1.png';
        break;
      case 'motorized':
        targetDir = 'public/images/references';
        fileName = 'motorized-smart-livingroom-1.png';
        break;
      case 'projects':
        targetDir = 'public/images/projects';
        fileName = 'our-projects-bg.jpg';
        break;
      default:
        return NextResponse.json({ error: '유효하지 않은 이미지 키입니다.' }, { status: 400 });
    }

    // 디렉토리 생성 (존재하지 않는 경우)
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    // 파일 저장
    const filePath = path.join(targetDir, fileName);
    await writeFile(filePath, buffer);

    // 웹 경로 생성
    const webPath = filePath.replace('public', '').replace(/\\/g, '/');

    // 캐시 무효화를 위한 타임스탬프 추가
    const cacheBuster = `?v=${Date.now()}`;
    const finalPath = webPath + cacheBuster;

    console.log(`✅ 이미지 업로드 성공: ${imageKey} -> ${finalPath}`);

    return NextResponse.json({
      success: true,
      imagePath: finalPath,
      imageKey,
      message: '이미지가 성공적으로 업로드되었습니다.'
    });

  } catch (error) {
    console.error('❌ 이미지 업로드 오류:', error);
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 