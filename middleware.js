import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('jwt_token')?.value;
    
    // Define route types
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isAdminRoute = pathname.startsWith('/admin-panel');
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    let payload = null;

    // 1. CRITICAL: Only attempt to verify if the token exists
    if (token) {
        try {
            const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
            const verified = await jwtVerify(token, SECRET_KEY, {
                algorithms: ['HS256'],
            });
            payload = verified.payload;
        } catch (error) {
            console.error("JWT Verification failed:", error.message);
            // If token is invalid/expired, we treat them as logged out
            payload = null; 
        }
    }

    // 2. Logic A: Redirect to login if trying to access protected route without valid payload
    if ((isProtectedRoute || isAdminRoute) && !payload) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Admin Authorization
    if (isAdminRoute && payload?.role !== "admin") {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 4. Logic B: Redirect to dashboard if logged-in user tries to access login/register
    if (isAuthRoute && payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};