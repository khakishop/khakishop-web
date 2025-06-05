import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // 임시로 모든 요청을 그대로 통과시킴
  return NextResponse.next();
}

export const config = {
  // 매처를 비활성화
  matcher: []
}; 