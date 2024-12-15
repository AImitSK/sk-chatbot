import { client } from './client';  // Hier importierst du deinen Sanity-Client
import { groq } from 'next-sanity';  // GROQ-Abfragen

// Beispiel für eine Funktion, die einen Benutzer anhand des Benutzernamens abruft
export async function getUserFromSanity(username: string) {
    console.log('Searching for user:', username);

    // Dann den spezifischen Benutzer suchen
    const query = groq`*[_type == "user" && username == $username][0]{
        username,
        password,
        email,
        role,
        "profileImage": profileImage.asset->url
    }`;
    const params = { username };

    try {
        const user = await client.fetch(query, params);
        console.log('User found:', user ? 'Yes' : 'No');
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

// GROQ Query für Benutzerdaten
const userDataQuery = groq`
*[_type == "user" && username == $username][0] {
  "projects": *[_type == "projekt" && references(^._id)] {
    name,
    botpress {
      clientId,
      personalAccessToken,
      botId,
      workspaceId
    }
  }
}`

// Funktion zum Abrufen von Benutzerdaten mit zugehörigen Projekten
export async function fetchUserData(username: string) {
    try {
        const result = await client.fetch(userDataQuery, { username });
        console.log('Projects found:', result?.projects?.length || 0);
        return result;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}