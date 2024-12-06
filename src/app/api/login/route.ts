import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
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
        const token = jwt.sign({
            username,
            role: user.role || 'user', // Standardrolle 'user' wenn nicht gesetzt
            isActive: user.isActive !== false // Aktiv, wenn nicht explizit deaktiviert
        }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token läuft nach 1 Stunde ab
        });

        // Erfolgreicher Login - Failed Attempts zurücksetzen
        const response = NextResponse.json({ 
            token,
            user: {
                username: user.username,
                role: user.role || 'user',
                email: user.email
            }
        }, {
            headers: {
                'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
            },
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