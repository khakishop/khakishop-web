import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // /contact/references -> /ko/references 리다이렉트
  if (pathname === '/contact/references') {
    return NextResponse.redirect(new URL('/ko/references', request.url));
  }
  
  // 기타 contact/* 경로들을 /ko/로 리다이렉트 (필요시)
  if (pathname.startsWith('/contact/') && pathname !== '/ko/contact') {
    const newPath = pathname.replace('/contact/', '/ko/');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // 리다이렉트가 필요한 경로들만 매칭
  matcher: ['/contact/:path*'],
};
