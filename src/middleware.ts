import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/demo', '/api/seed', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for Firebase session cookie
  const sessionCookie = request.cookies.get('__session')?.value;
  const authToken = request.cookies.get('firebaseAuthToken')?.value;

  if (!sessionCookie && !authToken) {
    // No auth — redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For organizer routes, we need role verification.
  // Since we can't easily decode Firebase tokens in Edge middleware without firebase-admin,
  // we check a role cookie that the client sets after auth.
  if (pathname.startsWith('/organizer')) {
    const userRole = request.cookies.get('userRole')?.value;
    if (userRole !== 'organizer') {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // For mentor routes
  if (pathname.startsWith('/mentor')) {
    const userRole = request.cookies.get('userRole')?.value;
    if (userRole !== 'mentor' && userRole !== 'organizer') {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
};
