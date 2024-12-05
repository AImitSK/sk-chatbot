// middleware.ts
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
    const token = getTokenFromCookies(req);
    const failedAttempts = getFailedAttempts(req);

    if (failedAttempts >= 5) {
        // Wenn der Benutzer mehr als 5 fehlgeschlagene Versuche hat, zur Lock-out-Seite umleiten
        return NextResponse.redirect(new URL('/locked', req.url));
    }

    if (!token) {
        // Kein Token, Benutzer wird zur Login-Seite weitergeleitet
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // Hier muss das geheime Schlüssel (SECRET) gesetzt werden, das beim Erstellen des Tokens verwendet wurde
        jwt.verify(token, process.env.JWT_SECRET as string);
        return NextResponse.next(); // Token ist gültig, Zugriff gewähren
    } catch (error) {
        // Token ungültig, Benutzer wird zur Login-Seite weitergeleitet
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
        '/settings/(.*)'     // Alle weiteren Seiten innerhalb von /settings
    ],
};
