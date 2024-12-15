import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, message: 'Alle Felder müssen ausgefüllt werden.' },
                { status: 400 }
            );
        }

        const msg = {
            to: 's.kuehne@sk-online-marketing.de', // Empfänger (ändern Sie dies entsprechend)
            from: 's.kuehne@sk-online-marketing.de', // Verifizierter Absender
            subject: `Chatbot Support: ${subject}`,
            text: `Nachricht von ${name} (${email}):\n${message}`,
        };

        await sgMail.send(msg);

        return NextResponse.json({ success: true, message: 'E-Mail erfolgreich gesendet!' });
    } catch (error) {
        console.error('Fehler beim Senden der E-Mail:', error);

        return NextResponse.json(
            { success: false, message: 'Interner Serverfehler beim Senden der E-Mail.' },
            { status: 500 }
        );
    }
}