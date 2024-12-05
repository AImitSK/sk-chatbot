import { client } from './client';  // Hier importierst du deinen Sanity-Client
import { groq } from 'next-sanity';  // GROQ-Abfragen

// Beispiel für eine Funktion, die einen Benutzer anhand des Benutzernamens abruft
export async function getUserFromSanity(username: string) {
    const query = groq`*[_type == "user" && username == $username][0]`;  // GROQ-Abfrage, die nach einem Benutzer mit diesem Benutzernamen sucht
    const params = { username };  // Parameter für die Abfrage

    try {
        const user = await client.fetch(query, params);
        return user;
    } catch (error) {
        throw new Error('Fehler beim Abrufen des Benutzers');
    }
}
