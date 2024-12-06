import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Eine Hilfsfunktion, um das Token aus den Cookies zu extrahieren
const getTokenFromCookies = (req: NextRequest): string | null => {
    const cookie = req.cookies.get('authToken');
    return cookie ? cookie.value : null; // .value hier hinzufügen, um den Cookie-Wert zu extrahieren
};

// Eine Hilfsfunktion, um die Anzahl der fehlgeschlagenen Versuche zu bekommen
const getFailedAttempts = (req: NextRequest): number => {
    const attempts = req.cookies.get('failedAttempts');
    return attempts ? parseInt(attempts.value, 10) : 0; // .value hier hinzufügen, um den Wert des Cookies zu extrahieren
};

// Middleware, um das Token zu validieren und Lock-out zu handhaben
export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log('Middleware Request Path:', path);

    // Routen ausschließen, die nicht geprüft werden sollen
    if (path.startsWith('/login') || path.startsWith('/api/login')) {
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

        const decoded = jwt.verify(token, secret);
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
        '/app/(.*)',         // Alle weiteren Seiten innerhalb von /app
        '/profil/(.*)',      // Alle weiteren Seiten innerhalb von /profil
        '/settings/(.*)',    // Alle weiteren Seiten innerhalb von /settings
    ],
};
