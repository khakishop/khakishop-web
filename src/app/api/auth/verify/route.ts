import { NextRequest, NextResponse } from 'next/server';
import { validateJWTToken } from '../../../../lib/auth-utils';
// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('khakishop-auth-token');
    if (!authCookie?.value) {
      return NextResponse.json(
        { authenticated: false, error: 'No token found' },
        { status: 401 }
      );
    }
    const tokenValidation = await validateJWTToken(authCookie.value);

    if (!tokenValidation.isValid) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    return NextResponse.json({
      authenticated: true,
      user: tokenValidation.payload,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
