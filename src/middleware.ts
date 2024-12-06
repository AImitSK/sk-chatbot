import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log('Middleware Request Path:', path);

    // Routen ausschließen, die nicht geprüft werden sollen
    if (path.startsWith('/login') || 
        path.startsWith('/api/login') || 
        path.startsWith('/api/unlock') || 
        path.startsWith('/locked')) {
        console.log('Excluding path from middleware:', path);
        return NextResponse.next();
    }

    const token = getTokenFromCookies(req);
    const failedAttempts = getFailedAttempts(req);

    if (failedAttempts >= 5) {
        console.log('Redirecting to locked page due to too many failed attempts.');
        return NextResponse.redirect(new URL('/locked', req.url));
    }

    if (!token) {
        console.log('No token found. Redirecting to login.');
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }

        // Token decodieren und Benutzerrolle prüfen
        const decoded = jwt.verify(token, secret) as { 
            username: string;
            role?: string;
            isActive?: boolean;
        };

        // Prüfen, ob der Benutzer noch aktiv ist (falls das Feld existiert)
        if (decoded.isActive === false) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Admin-Routen prüfen
        if (path.startsWith('/admin') && decoded.role !== 'admin') {
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
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// Definiere explizite Routen, die geschützt werden sollen
export const config = {
    matcher: [
        '/app/page',         // Geschützte Homepage
        '/profil/page',      // Geschützte Profil-Seite
        '/settings/page',    // Geschützte Einstellungs-Seite
        '/admin/(.*)',       // Admin-Bereich (nur für Administratoren)
        '/app/(.*)',         // Alle weiteren Seiten innerhalb von /app
        '/profil/(.*)',      // Alle weiteren Seiten innerhalb von /profil
        '/settings/(.*)',    // Alle weiteren Seiten innerhalb von /settings
    ],
};
