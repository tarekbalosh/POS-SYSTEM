import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests to pass through (no auth enforced here)
  return NextResponse.next();
}

export const config = {
  // Only run middleware on app pages, NOT on static public files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|images/|sw-.*\\.js).*)',
  ],
};
