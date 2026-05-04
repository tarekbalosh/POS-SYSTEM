import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  
  // Extract subdomain (e.g., tenant1.yourpos.com -> tenant1)
  const subdomain = hostname.split('.')[0];
  
  // Define reserved subdomains that should NOT be treated as tenants
  const reservedSubdomains = ['www', 'app', 'localhost', 'api', 'admin'];
  const isTenantSubdomain = subdomain && !reservedSubdomains.includes(subdomain);

  if (isTenantSubdomain) {
    const headers = new Headers(request.headers);
    // Inject the tenant subdomain into headers for the app to consume
    headers.set('x-tenant-id', subdomain);
    
    // Also set a cookie for client-side tenant persistence if needed
    const response = NextResponse.next({
      request: {
        headers,
      },
    });
    
    response.cookies.set('x-tenant-id', subdomain, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, images, etc.)
    '/((?!_next/static|_next/image|favicon.ico|api/|sounds/).*)',
  ],
};
