import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

// Hilfsfunktion zum Extrahieren des Tokens aus den Cookies
function getTokenFromCookies(req: NextRequest): string | null {
    return req.cookies.get('authToken')?.value || null;
}

// Hilfsfunktion zum Abrufen der fehlgeschlagenen Anmeldeversuche
function getFailedAttempts(req: NextRequest): number {
    const failedAttempts = req.cookies.get('failedAttempts')?.value;
    return failedAttempts ? parseInt(failedAttempts) : 0;
}

// Middleware, um das Token zu validieren und Lock-out zu handhaben
export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log('Middleware Request Path:', path);

    // Liste der öffentlichen Routen und Dateitypen, die nicht geschützt werden sollen
    const publicRoutes = [
        '/login',
        '/api/login',
        '/api/unlock',
        '/locked',
        '/support',
        '/favicon.ico',
        '/_next',
        '/studio'  // Sanity Studio Route
    ];

    // Liste der geschützten Routen, die einen Login erfordern
    const protectedRoutes = [
        '/',  // Dashboard
        '/profil',
        '/rechnungen',
        '/admin'
    ];

    // Prüfen, ob die aktuelle Route öffentlich ist oder ein Bild/Asset ist
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isAsset = path.match(/\.(jpg|jpeg|png|gif|ico|svg|css|js)$/);

    // Assets und öffentliche Routen durchlassen
    if (isAsset || isPublicRoute) {
        console.log('Public route or asset accessed:', path);
        return NextResponse.next();
    }

    // Wenn es keine geschützte Route ist, durchlassen
    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    const token = getTokenFromCookies(req);
    const failedAttempts = getFailedAttempts(req);

    // Prüfen auf zu viele fehlgeschlagene Versuche
    if (failedAttempts >= 5) {
        console.log('Redirecting to locked page due to too many failed attempts.');
        return NextResponse.redirect(new URL('/locked', req.url));
    }

    // Prüfen ob ein Token vorhanden ist
    if (!token) {
        console.log('No token found. Redirecting to login page.');
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }

        // Token decodieren und Benutzerrolle prüfen
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jose.jwtVerify(token, secretKey);
        const decoded = payload as {
            username: string;
            role?: string;
            isActive?: boolean;
        };

        // Prüfen, ob der Benutzer noch aktiv ist
        if (decoded.isActive === false) {
            console.log('User is inactive. Redirecting to locked page.');
            return NextResponse.redirect(new URL('/locked', req.url));
        }

        // Admin-Routen prüfen
        if (path.startsWith('/admin') && decoded.role !== 'admin') {
            console.log('Non-admin user trying to access admin route. Redirecting to home.');
            return NextResponse.redirect(new URL('/', req.url));
        }

        console.log('Token successfully verified:', decoded);
        return NextResponse.next();
    } catch (error) {
        if (error instanceof Error) {
            console.error('Token verification failed:', error.message);
        } else {
            console.error('Unexpected error during token verification:', error);
        }
        console.log('Token verification failed. Redirecting to login page.');
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// Definiere die Middleware-Konfiguration für alle Routen
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
