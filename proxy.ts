import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ['/checkout', '/profile', '/orders', '/admin'];
    
    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/checkout/:path*', '/profile/:path*', '/orders/:path*', '/admin/:path*', '/login', '/register'],
};