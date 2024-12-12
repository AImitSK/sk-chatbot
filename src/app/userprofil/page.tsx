'use client';

import { useEffect, useState } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/sanity/client';
import { Heading, Subheading } from '@/components/heading';

async function fetchUserData(username: string) {
    const query = groq`
        *[_type == "user" && username == $username][0]{
            _id,
            username,
            email,
            password,
        }
    `;
    const params = { username };
    return await client.fetch(query, params);
}

async function updateUserProfile(userId: string, updatedData: any) {
    return await client
        .patch(userId)
        .set({
            username: updatedData.username,
            email: updatedData.email,
            password: updatedData.password,
        })
        .commit();
}

export default function Userprofil() {
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('********');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Sichtbarkeit von Passwort
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Benutzerinitialisierung
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const { username } = await response.json();
                    const userData = await fetchUserData(username);

                    if (userData) {
                        setUserId(userData._id);
                        setUsername(userData.username);
                        setEmail(userData.email);
                        setPassword(userData.password || '********');
                    } else {
                        console.error('Nutzer nicht gefunden.');
                    }
                } else {
                    console.error('Fehler beim Abrufen des Benutzers.');
                }
            } catch (err) {
                console.error('Es ist ein Fehler aufgetreten.');
            }
        };

        fetchUser();
    }, []);

    const handleSave = async () => {
        if (!userId) {
            console.error('Benutzer-ID fehlt.');
            return;
        }
        try {
            await updateUserProfile(userId, { username, email, password });
            setSuccessMessage('Profil erfolgreich aktualisiert!');
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(null), 5000); // Erfolgsmeldung nach 5 Sekunden automatisch ausblenden
        } catch (err) {
            console.error('Fehler beim Speichern der Änderungen.');
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <Heading>Einstellungen</Heading>

            {/* Erfolgsmeldung */}
            {successMessage && (
                <div className="my-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md">
                    {successMessage}
                </div>
            )}

            {/* User Profil */}
            <Subheading className="mt-6">User Profil</Subheading>
            <div className="mt-2 bg-white shadow-md rounded-md p-6">
                <div className="space-y-4">
                    {/* Benutzername */}
                    <div className="border-b pb-4">
                        <p className="font-bold text-lg">Benutzername</p>
                        {!isEditing ? (
                            <p className="text-sm">{username}</p>
                        ) : (
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        )}
                    </div>

                    {/* Email */}
                    <div className="border-b pb-4">
                        <p className="font-bold text-lg">Email</p>
                        {!isEditing ? (
                            <p className="text-sm">{email}</p>
                        ) : (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        )}
                    </div>

                    {/* Passwort mit Sichtbarkeit */}
                    <div className="border-b pb-4">
                        <p className="font-bold text-lg">Passwort</p>
                        {!isEditing ? (
                            <p className="text-sm">********</p>
                        ) : (
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {isPasswordVisible ? 'Verbergen' : 'Anzeigen'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-black rounded-md"
                    >
                        {isEditing ? 'Abbrechen' : 'Bearbeiten'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={handleSave}
                            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                        >
                            Speichern
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}