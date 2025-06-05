import { Client } from '@notionhq/client';
import { unstable_cache } from 'next/cache';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 블로그 포스트 타입 정의
export interface NotionPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  published: boolean;
  date: string;
  coverImage?: string;
  tags?: string[];
  author?: string;
  lastEditedTime?: string;
  readingTime?: number;
}

// 에러 타입 정의
export interface NotionError {
  code: string;
  message: string;
  status?: number;
}

// Notion 속성값을 안전하게 추출하는 헬퍼 함수들
const getPlainText = (richText: any[]): string => {
  return richText?.map((text: any) => text.plain_text).join('') || '';
};

const getTitle = (title: any[]): string => {
  return title?.map((text: any) => text.plain_text).join('') || '';
};

const getDate = (date: any): string => {
  return date?.start || new Date().toISOString().split('T')[0];
};

const getCheckbox = (checkbox: any): boolean => {
  return checkbox || false;
};

const getUrl = (url: any): string => {
  return url || '';
};

const getMultiSelect = (multiSelect: any[]): string[] => {
  return multiSelect?.map((item: any) => item.name) || [];
};

// 읽기 시간 계산 함수 (대략적)
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200; // 평균 읽기 속도
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// 슬러그 생성 함수 (개선된 버전)
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-가-힣]/g, '') // 영문, 숫자, 공백, 하이픈, 한글만 허용
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변경
    .replace(/-+/g, '-') // 연속된 하이픈을 하나로 변경
    .replace(/^-+|-+$/g, '') // 시작과 끝의 하이픈 제거
    .trim();
};

// 환경변수 검증 함수
const validateEnvironment = (): NotionError | null => {
  if (!process.env.NOTION_API_KEY) {
    return {
      code: 'MISSING_API_KEY',
      message: 'NOTION_API_KEY 환경변수가 설정되지 않았습니다.'
    };
  }

  if (!process.env.NOTION_DATABASE_ID) {
    return {
      code: 'MISSING_DATABASE_ID',
      message: 'NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.'
    };
  }

  return null;
};

// 캐시된 포스트 조회 함수
const getCachedNotionPosts = unstable_cache(
  async (): Promise<NotionPost[]> => {
    const envError = validateEnvironment();
    if (envError) {
      console.warn(`Notion 설정 오류: ${envError.message}`);
      return [];
    }

    try {
      // Notion 데이터베이스 쿼리
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      });

      // 데이터 변환
      const posts: NotionPost[] = response.results.map((page: any) => {
        const properties = page.properties;
        
        const title = getTitle(properties.Title?.title || properties.Name?.title || []);
        const summary = getPlainText(properties.Summary?.rich_text || []);
        const slug = properties.Slug?.rich_text 
          ? getPlainText(properties.Slug.rich_text) 
          : generateSlug(title);

        return {
          id: page.id,
          title,
          slug,
          summary,
          published: getCheckbox(properties.Published?.checkbox),
          date: getDate(properties.Date?.date),
          coverImage: getUrl(properties.CoverImage?.url),
          tags: getMultiSelect(properties.Tags?.multi_select || []),
          author: getPlainText(properties.Author?.rich_text || []) || 'khaki shop',
          lastEditedTime: page.last_edited_time,
          readingTime: calculateReadingTime(summary),
        };
      });

      return posts;
    } catch (error: any) {
      console.error('Notion API 호출 중 오류 발생:', error);
      
      // Notion API 특정 에러 처리
      if (error.code === 'object_not_found') {
        console.error('데이터베이스를 찾을 수 없습니다. DATABASE_ID를 확인하세요.');
      } else if (error.code === 'unauthorized') {
        console.error('인증 오류입니다. API_KEY와 데이터베이스 권한을 확인하세요.');
      }
      
      return [];
    }
  },
  ['notion-posts'],
  {
    tags: ['notion-posts'],
    revalidate: 3600, // 1시간 캐시
  }
);

// Notion 데이터베이스에서 블로그 게시글 목록을 가져오는 함수 (캐시 적용)
export async function getNotionPosts(): Promise<NotionPost[]> {
  return getCachedNotionPosts();
}

// 특정 게시글을 ID로 가져오는 함수 (캐시 적용)
export const getNotionPost = unstable_cache(
  async (id: string): Promise<NotionPost | null> => {
    const envError = validateEnvironment();
    if (envError) {
      console.warn(`Notion 설정 오류: ${envError.message}`);
      return null;
    }

    try {
      const response = await notion.pages.retrieve({ page_id: id });
      const properties = (response as any).properties;

      if (!properties) {
        return null;
      }

      const title = getTitle(properties.Title?.title || properties.Name?.title || []);
      const summary = getPlainText(properties.Summary?.rich_text || []);
      const slug = properties.Slug?.rich_text 
        ? getPlainText(properties.Slug.rich_text) 
        : generateSlug(title);

      return {
        id: response.id,
        title,
        slug,
        summary,
        published: getCheckbox(properties.Published?.checkbox),
        date: getDate(properties.Date?.date),
        coverImage: getUrl(properties.CoverImage?.url),
        tags: getMultiSelect(properties.Tags?.multi_select || []),
        author: getPlainText(properties.Author?.rich_text || []) || 'khaki shop',
        lastEditedTime: (response as any).last_edited_time,
        readingTime: calculateReadingTime(summary),
      };
    } catch (error: any) {
      console.error('Notion 게시글 조회 중 오류 발생:', error);
      return null;
    }
  },
  ['notion-post'],
  {
    tags: ['notion-post'],
    revalidate: 3600, // 1시간 캐시
  }
);

// 슬러그로 게시글을 찾는 함수 (최적화된 버전)
export async function getNotionPostBySlug(slug: string): Promise<NotionPost | null> {
  try {
    const posts = await getNotionPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('슬러그로 게시글 조회 중 오류 발생:', error);
    return null;
  }
}

// 태그별 게시글 조회 함수 (새로 추가)
export async function getNotionPostsByTag(tag: string): Promise<NotionPost[]> {
  try {
    const posts = await getNotionPosts();
    return posts.filter(post => 
      post.tags?.some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    );
  } catch (error) {
    console.error('태그별 게시글 조회 중 오류 발생:', error);
    return [];
  }
}

// 모든 태그 조회 함수 (새로 추가)
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getNotionPosts();
    const allTags = posts.flatMap(post => post.tags || []);
    return Array.from(new Set(allTags)).sort();
  } catch (error) {
    console.error('태그 목록 조회 중 오류 발생:', error);
    return [];
  }
}

// 관련 게시글 조회 함수 (새로 추가)
export async function getRelatedPosts(currentPost: NotionPost, limit: number = 3): Promise<NotionPost[]> {
  try {
    const allPosts = await getNotionPosts();
    
    // 현재 게시글 제외
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
    
    // 태그가 겹치는 게시글 우선 추천
    const relatedPosts = otherPosts
      .map(post => {
        const commonTags = currentPost.tags?.filter(tag => 
          post.tags?.includes(tag)
        ).length || 0;
        
        return { post, score: commonTags };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
    
    // 태그가 겹치는 게시글이 부족한 경우 최신 게시글로 채우기
    if (relatedPosts.length < limit) {
      const remaining = limit - relatedPosts.length;
      const latestPosts = otherPosts
        .filter(post => !relatedPosts.includes(post))
        .slice(0, remaining);
      
      relatedPosts.push(...latestPosts);
    }
    
    return relatedPosts;
  } catch (error) {
    console.error('관련 게시글 조회 중 오류 발생:', error);
    return [];
  }
}

// Notion 블록 콘텐츠를 가져오는 함수 (캐시 적용)
export const getNotionBlocks = unstable_cache(
  async (pageId: string) => {
    const envError = validateEnvironment();
    if (envError) {
      console.warn(`Notion 설정 오류: ${envError.message}`);
      return [];
    }

    try {
      const response = await notion.blocks.children.list({
        block_id: pageId,
      });

      return response.results;
    } catch (error) {
      console.error('Notion 블록 조회 중 오류 발생:', error);
      return [];
    }
  },
  ['notion-blocks'],
  {
    tags: ['notion-blocks'],
    revalidate: 3600, // 1시간 캐시
  }
);

// 캐시 무효화 함수 (관리자용)
export async function revalidateNotionCache() {
  try {
    // Next.js revalidateTag 사용 (서버 액션에서 호출)
    const { revalidateTag } = await import('next/cache');
    revalidateTag('notion-posts');
    revalidateTag('notion-post');
    revalidateTag('notion-blocks');
    
    return { success: true, message: '캐시가 성공적으로 무효화되었습니다.' };
  } catch (error) {
    console.error('캐시 무효화 중 오류 발생:', error);
    return { success: false, message: '캐시 무효화에 실패했습니다.' };
  }
} 