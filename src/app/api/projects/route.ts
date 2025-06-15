import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getProjectsByCategory, type Project } from '../../../data/projects';

// 동적 라우트로 설정
export const dynamic = 'force-dynamic';

// 🚀 프로젝트 API - 페이지네이션, 검색, 필터링 지원
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    // 📄 페이지네이션 파라미터
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = (page - 1) * limit;
    
    // 🔍 검색 및 필터 파라미터
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const year = searchParams.get('year') || '';
    const sortBy = searchParams.get('sortBy') || 'date'; // date, title, location
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc, desc
    
    // 📊 통계 요청 여부
    const includeStats = searchParams.get('includeStats') === 'true';
    
    console.log('🔍 프로젝트 API 요청:', {
      page,
      limit,
      search,
      category,
      year,
      sortBy,
      sortOrder,
      includeStats
    });

    // 📂 기본 프로젝트 목록 가져오기
    let projects = getAllProjects();
    
    // 🔍 카테고리 필터링
    if (category && category !== 'all') {
      projects = getProjectsByCategory(category as Project['category']);
    }
    
    // 🔍 검색 필터링
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      projects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.location.toLowerCase().includes(searchTerm) ||
        project.description?.toLowerCase().includes(searchTerm) ||
        project.client?.toLowerCase().includes(searchTerm)
      );
    }
    
    // 🔍 연도 필터링
    if (year) {
      projects = projects.filter(project => project.year === year);
    }
    
    // 📊 정렬
    projects.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ko');
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location, 'ko');
          break;
        case 'year':
          comparison = a.year.localeCompare(b.year);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'date':
        default:
          // 최신 프로젝트 우선 (연도 기준)
          comparison = b.year.localeCompare(a.year);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // 📄 페이지네이션 적용
    const totalProjects = projects.length;
    const totalPages = Math.ceil(totalProjects / limit);
    const paginatedProjects = projects.slice(offset, offset + limit);
    
    // 📊 응답 데이터 구성
    const response: any = {
      success: true,
      data: paginatedProjects,
      pagination: {
        page,
        limit,
        totalProjects,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null
      },
      filters: {
        search,
        category,
        year,
        sortBy,
        sortOrder
      },
      timestamp: new Date().toISOString()
    };
    
    // 📊 통계 정보 포함
    if (includeStats) {
      const allProjects = getAllProjects();
      const categories = Array.from(new Set(allProjects.map(p => p.category)));
      const years = Array.from(new Set(allProjects.map(p => p.year))).sort().reverse();
      
      const categoryStats = categories.reduce((acc, cat) => {
        acc[cat] = allProjects.filter(p => p.category === cat).length;
        return acc;
      }, {} as Record<string, number>);
      
      const yearStats = years.reduce((acc, yr) => {
        acc[yr] = allProjects.filter(p => p.year === yr).length;
        return acc;
      }, {} as Record<string, number>);
      
      response.stats = {
        totalProjects: allProjects.length,
        categories: categoryStats,
        years: yearStats,
        availableCategories: categories,
        availableYears: years
      };
    }
    
    console.log('✅ 프로젝트 API 응답:', {
      총프로젝트: totalProjects,
      현재페이지: page,
      반환된수: paginatedProjects.length,
      총페이지: totalPages
    });
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ 프로젝트 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 