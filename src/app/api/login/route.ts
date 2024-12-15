import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { getUserFromSanity } from '@/sanity/queries';

// Hilfsfunktion zum Abrufen der fehlgeschlagenen Anmeldeversuche
function getFailedAttempts(req: NextRequest): number {
    const failedAttempts = req.cookies.get('failedAttempts')?.value;
    return failedAttempts ? parseInt(failedAttempts) : 0;
}

export async function POST(req: NextRequest) {
    // Prüfen, ob zu viele fehlgeschlagene Versuche vorliegen
    const failedAttempts = getFailedAttempts(req);
    if (failedAttempts >= 5) {
        return NextResponse.json(
            { message: 'Zu viele fehlgeschlagene Anmeldeversuche. Ihr Konto wurde gesperrt.' },
            { status: 403 }
        );
    }

    try {
        const body = await req.json();
        const { username, password } = body;

        // Benutzer aus Sanity abrufen
        const user = await getUserFromSanity(username);

        if (!user) {
            // Fehlgeschlagene Versuche erhöhen
            const response = NextResponse.json(
                { message: 'Benutzer nicht gefunden' },
                { status: 401 }
            );
            response.cookies.set({
                name: 'failedAttempts',
                value: (failedAttempts + 1).toString(),
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 30 * 60 // 30 Minuten
            });
            return response;
        }

        // Prüfen, ob der Benutzer aktiv ist (falls das Feld existiert)
        if (user.isActive === false) { // Nur prüfen, wenn explizit auf false gesetzt
            return NextResponse.json(
                { message: 'Ihr Konto wurde deaktiviert. Bitte wenden Sie sich an den Administrator.' },
                { status: 403 }
            );
        }

        // Direkter Passwortvergleich, da die Passwörter im Klartext gespeichert sind
        const isPasswordCorrect = user.password === password;

        if (!isPasswordCorrect) {
            // Fehlgeschlagene Versuche erhöhen
            const response = NextResponse.json(
                { message: 'Ungültige Anmeldedaten' },
                { status: 401 }
            );
            response.cookies.set({
                name: 'failedAttempts',
                value: (failedAttempts + 1).toString(),
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 30 * 60 // 30 Minuten
            });
            return response;
        }

        if (!process.env.JWT_SECRET) {
            return NextResponse.json(
                { message: 'Server Konfigurationsfehler' },
                { status: 500 }
            );
        }

        // Token generieren mit zusätzlichen Benutzerinformationen
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({
            username,
            role: user.role || 'user', // Standardrolle 'user' wenn nicht gesetzt
            isActive: user.isActive !== false // Aktiv, wenn nicht explizit deaktiviert
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(secret);

        // Erfolgreicher Login - Failed Attempts zurücksetzen
        const response = NextResponse.json({
            token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role || 'user',
                profileImage: user.profileImage,
            },
            refresh: true // Signal zum Neuladen der Seite
        });

        // Auth Token setzen mit angepassten Cookie-Einstellungen
        const isDevelopment = process.env.NODE_ENV === 'development';
        response.cookies.set({
            name: 'authToken',
            value: token,
            path: '/',
            httpOnly: true,
            secure: !isDevelopment, // In Entwicklung kein HTTPS erforderlich
            sameSite: isDevelopment ? 'lax' : 'strict', // Weniger strikt in Entwicklung
            maxAge: 60 * 60 // 1 Stunde
        });

        // Failed Attempts Cookie auch anpassen
        if (failedAttempts > 0) {
            response.cookies.set({
                name: 'failedAttempts',
                value: '0',
                path: '/',
                httpOnly: true,
                secure: !isDevelopment,
                sameSite: isDevelopment ? 'lax' : 'strict',
                maxAge: 30 * 60
            });
        }

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
            { status: 500 }
        );
    }
}