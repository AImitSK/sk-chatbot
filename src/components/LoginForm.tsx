import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, password } = body;

    // Dummy-Authentifizierung (durch echte Logik ersetzen)
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
            expiresIn: '1h', // Token läuft nach 1 Stunde ab
        });

        return NextResponse.json({ token }, {
            headers: {
                'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict;`,
            },
        });
    } else {
        return NextResponse.json({ message: 'Ungültige Anmeldedaten' }, { status: 401 });
    }
}