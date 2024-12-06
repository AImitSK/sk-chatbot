import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserFromSanity } from '@/sanity/queries'; // Relativer Pfad zu queries

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, password } = body;

    try {
        // Benutzer aus Sanity abrufen
        const user = await getUserFromSanity(username);

        if (!user) {
            return NextResponse.json({ message: 'Benutzer nicht gefunden' }, { status: 401 });
        }

        // Passwortüberprüfung
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Ungültige Anmeldedaten' }, { status: 401 });
        }

        // Token generieren
        const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
            expiresIn: '1h', // Token läuft nach 1 Stunde ab
        });

        return NextResponse.json({ token }, {
            headers: {
                'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict;`,
            },
        });
    } catch (error) {
        console.error('Fehler bei der Authentifizierung:', error);
        return NextResponse.json({ message: 'Interner Serverfehler' }, { status: 500 });
    }
}