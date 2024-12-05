// src/app/api/loginUser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, password } = body;

    // Dummy-Validierung (ersetzte sie durch deine eigene Logik)
    if (username === 'admin' && password === 'password') {
        // Erstelle ein JWT-Token
        const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        return NextResponse.json({ token }, {
            headers: {
                'Set-Cookie': `authToken=${token}; path=/; Secure; HttpOnly; SameSite=Strict`,
            }
        });
    } else {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
}
