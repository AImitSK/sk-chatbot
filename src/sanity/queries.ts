import { client } from './client';  // Hier importierst du deinen Sanity-Client
import { groq } from 'next-sanity';  // GROQ-Abfragen

// Beispiel für eine Funktion, die einen Benutzer anhand des Benutzernamens abruft
export async function getUserFromSanity(username: string) {
    console.log('Suche Benutzer:', username);
    
    // Erst alle Benutzer abrufen um zu sehen, was in der Datenbank ist
    const allUsersQuery = groq`*[_type == "user"]{username, password}`;
    try {
        const allUsers = await client.fetch(allUsersQuery);
        console.log('Alle Benutzer in der Datenbank:', allUsers);
    } catch (error) {
        console.error('Fehler beim Abrufen aller Benutzer:', error);
    }

    // Dann den spezifischen Benutzer suchen
    const query = groq`*[_type == "user" && username == $username][0]{
        username,
        password
    }`;
    const params = { username };

    try {
        const user = await client.fetch(query, params);
        console.log('Gefundener Benutzer:', user ? 'Ja' : 'Nein');
        if (user) {
            console.log('Benutzername übereinstimmung:', user.username === username);
            console.log('Passwort vorhanden:', !!user.password);
        }
        return user;
    } catch (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error);
        throw error;
    }
}
