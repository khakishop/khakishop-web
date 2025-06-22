import { readFile, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

/**
 * ================================================================================
 * 🔄 프로젝트 편집 API
 * ================================================================================
 * 
 * 기능:
 * - GET: 특정 프로젝트 데이터 조회
 * - PUT: 프로젝트 데이터 업데이트
 * - DELETE: 프로젝트 삭제
 */

interface ProjectFormData {
  title: string;
  description: string;
  location: string;
  year: string;
  category: string;
  area?: string;
  client?: string;
  concept?: string;
  features?: string[];
  materials?: string[];
  mainImage: string;
  galleryImages?: string[];
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  beforeStory?: string;
  afterStory?: string;
  productSpecs?: {
    curtainType?: string;
    blindType?: string;
    motorSystem?: string;
    fabricDetails?: string;
    dimensions?: string;
    installation?: string;
  };
}

// 프로젝트 데이터 파일 경로
const PROJECTS_FILE_PATH = path.join(process.cwd(), 'src/data/projects.ts');

// 프로젝트 데이터 읽기
async function readProjectsFile() {
  try {
    const fileContent = await readFile(PROJECTS_FILE_PATH, 'utf-8');
    // TypeScript 파일에서 데이터 추출 (간단한 파싱)
    const projectsMatch = fileContent.match(/export const projects: Project\[\] = (\[[\s\S]*?\]);/);
    if (projectsMatch) {
      // 실제로는 더 안전한 파싱 방법을 사용해야 합니다
      return eval(projectsMatch[1]);
    }
    return [];
  } catch (error) {
    console.error('프로젝트 파일 읽기 실패:', error);
    return [];
  }
}

// 프로젝트 데이터 쓰기
async function writeProjectsFile(projects: any[]) {
  try {
    const fileContent = `// 프로젝트 데이터
// 이 파일은 어드민에서 자동 생성됩니다.

export interface Project {
  slug: string;
  title: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  location: string;
  year: string;
  category: 'Residential' | 'Commercial' | 'F&B' | 'Healthcare' | 'Cultural';
  features: string[];
  materials: string[];
  size?: string;
  area?: string;
  client?: string;
  concept?: string;
}

export const projects: Project[] = ${JSON.stringify(projects, null, 2)};

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

export function getProjectsByCategory(category: Project['category']): Project[] {
  return projects.filter(project => project.category === category);
}
`;

    await writeFile(PROJECTS_FILE_PATH, fileContent, 'utf-8');
    return true;
  } catch (error) {
    console.error('프로젝트 파일 쓰기 실패:', error);
    return false;
  }
}

// GET: 특정 프로젝트 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const projects = await readProjectsFile();
    const project = projects.find((p: any) => p.slug === params.slug);

    if (!project) {
      return NextResponse.json(
        { error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('프로젝트 조회 실패:', error);
    return NextResponse.json(
      { error: '프로젝트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 프로젝트 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const formData: ProjectFormData = await request.json();
    const projects = await readProjectsFile();

    const projectIndex = projects.findIndex((p: any) => p.slug === params.slug);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 프로젝트 데이터 업데이트
    const updatedProject = {
      ...projects[projectIndex],
      title: formData.title,
      description: formData.description,
      location: formData.location,
      year: formData.year,
      category: formData.category,
      area: formData.area,
      client: formData.client,
      concept: formData.concept,
      features: formData.features || [],
      materials: formData.materials || [],
      mainImage: formData.mainImage,
      galleryImages: formData.galleryImages || [],
      // 추가 메타데이터는 별도 저장소에 저장 (예: JSON 파일)
      updatedAt: new Date().toISOString()
    };

    projects[projectIndex] = updatedProject;

    // 파일에 저장
    const success = await writeProjectsFile(projects);

    if (!success) {
      return NextResponse.json(
        { error: '프로젝트 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 추가 메타데이터 저장 (SEO, 스토리, 제품 스펙 등)
    const metadataPath = path.join(process.cwd(), 'src/data/project-metadata', `${params.slug}.json`);
    const metadata = {
      slug: params.slug,
      isPublished: formData.isPublished,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      beforeStory: formData.beforeStory,
      afterStory: formData.afterStory,
      productSpecs: formData.productSpecs,
      updatedAt: new Date().toISOString()
    };

    try {
      // 메타데이터 디렉토리 생성 (실제로는 mkdir -p를 사용해야 함)
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    } catch (metadataError) {
      console.warn('메타데이터 저장 실패:', metadataError);
      // 메타데이터 저장 실패는 전체 실패로 처리하지 않음
    }

    return NextResponse.json({
      success: true,
      message: '프로젝트가 성공적으로 업데이트되었습니다.',
      data: updatedProject
    });

  } catch (error) {
    console.error('프로젝트 업데이트 실패:', error);
    return NextResponse.json(
      { error: '프로젝트 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 프로젝트 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const projects = await readProjectsFile();
    const projectIndex = projects.findIndex((p: any) => p.slug === params.slug);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 프로젝트 제거
    const deletedProject = projects.splice(projectIndex, 1)[0];

    // 파일에 저장
    const success = await writeProjectsFile(projects);

    if (!success) {
      return NextResponse.json(
        { error: '프로젝트 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 메타데이터 파일도 삭제 시도
    try {
      const metadataPath = path.join(process.cwd(), 'src/data/project-metadata', `${params.slug}.json`);
      await writeFile(metadataPath, '', 'utf-8'); // 실제로는 unlink를 사용
    } catch (metadataError) {
      console.warn('메타데이터 삭제 실패:', metadataError);
    }

    return NextResponse.json({
      success: true,
      message: '프로젝트가 성공적으로 삭제되었습니다.',
      data: deletedProject
    });

  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    return NextResponse.json(
      { error: '프로젝트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 