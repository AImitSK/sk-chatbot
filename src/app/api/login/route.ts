import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { getUserFromSanity } from '@/sanity/queries';

// Hilfsfunktion zum Abrufen der fehlgeschlagenen Anmeldeversuche
function getFailedAttempts(req: NextRequest): number {
    const failedAttempts = req.cookies.get('failedAttempts')?.value;
    return failedAttempts ? parseInt(failedAttempts) : 0;
}

export async function POST(req: NextRequest) {
    console.log('Login attempt received');
    
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
        
        console.log('Attempting to find user:', username);
        
        // Benutzer aus Sanity abrufen
        const user = await getUserFromSanity(username);
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('User not found');
            // Fehlgeschlagene Versuche erhöhen
            const response = NextResponse.json(
                { message: 'Benutzer nicht gefunden' },
                { status: 401 }
            );
            response.cookies.set('failedAttempts', (failedAttempts + 1).toString(), {
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
        console.log('Comparing passwords');
        const isPasswordCorrect = user.password === password;
        console.log('Password correct:', isPasswordCorrect ? 'Yes' : 'No');
        
        if (!isPasswordCorrect) {
            // Fehlgeschlagene Versuche erhöhen
            const response = NextResponse.json(
                { message: 'Ungültige Anmeldedaten' },
                { status: 401 }
            );
            response.cookies.set('failedAttempts', (failedAttempts + 1).toString(), {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 30 * 60 // 30 Minuten
            });
            return response;
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
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
                role: user.role || 'user',
                email: user.email
            }
        });
        
        // Auth Token setzen
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600 // 1 Stunde
        });
        
        // Fehlgeschlagene Versuche zurücksetzen
        response.cookies.set('failedAttempts', '0', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 60 // 30 Minuten
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Interner Serverfehler' },
            { status: 500 }
        );
    }
}