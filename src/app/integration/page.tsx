'use client';

import React, { useEffect, useState } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/sanity/client';
import { ClipboardIcon } from '@heroicons/react/24/solid';

export default function IntegrationSettings() {
    const [username, setUsername] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Für Erfolgsmeldung

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                } else {
                    console.error('Fehler beim Abrufen des Benutzers');
                }
            } catch (error) {
                console.error('Benutzerdaten konnten nicht geladen werden:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (username) {
            const fetchProjects = async () => {
                try {
                    const query = groq`
                        *[_type == "user" && username == $username]{
                            "projects": *[_type == "projekt" && references(^._id)]{
                                name,
                                botpress {
                                    embedCode,
                                    clientId,
                                    botId,
                                    shareableLink
                                }
                            }
                        }
                    `;

                    const data = await client.fetch(query, { username });

                    if (data.length > 0) {
                        const uniqueProjects = data[0]?.projects?.filter((project: any, index: number, self: any[]) =>
                            index === self.findIndex((p) => p.botpress.botId === project.botpress.botId)
                        );

                        setProjects(uniqueProjects || []);
                    } else {
                        setError('Keine Projektdaten gefunden.');
                    }
                } catch (err) {
                    setError('Fehler beim Laden der Projektdaten.');
                    console.error(err);
                }
            };

            fetchProjects();
        }
    }, [username]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setSuccessMessage('Erfolgreich kopiert!'); // Erfolgsmeldung setzen
        setTimeout(() => setSuccessMessage(null), 3000); // Nach 3 Sekunden ausblenden
    };

    if (error) {
        return <div className="max-w-6xl mx-auto mt-8 p-4 text-red-600">{error}</div>;
    }

    if (!projects || projects.length === 0) {
        return <div className="max-w-6xl mx-auto mt-8 p-4 text-gray-600">Keine Projekte verfügbar.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-6">Integration</h1>

            {/* Erfolgsmeldung */}
            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">
                    {successMessage}
                </div>
            )}

            {projects.map((project, index) => (
                <div key={index} className="mb- p-8 border rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Projekt: {project.name || 'Unbenanntes Projekt'}</h2>
                    <p className="mb-12 text-sm text-gray-600">
                        Verwenden Sie die folgenden Code-Snippets um Ihre KI Bot zu Teilen oder in Ihr Webprojket zu integrieren.
                    </p>
                    {/* Teilbarer Link */}
                    <div className="mb-12">
                        <h2 className="text-lg font-bold mb-2">Teilbarer Link</h2>
                        <p className="mb-2 text-sm text-gray-600">
                            Teilen Sie den folgenden Link mit Leuten, die Ihren Chatbot schnell testen möchten.
                        </p>
                        <div className="flex items-start">
                            <pre
                                className="border rounded p-2 bg-gray-100 text-sm break-words w-full"
                                style={{wordWrap: 'break-word', whiteSpace: 'normal'}}
                            >
                                {project.botpress?.shareableLink || 'Nicht verfügbar'}
                            </pre>
                            {project.botpress?.shareableLink && (
                                <ClipboardIcon
                                    className="w-6 h-6 ml-2 text-blue-600 cursor-pointer hover:text-blue-800"
                                    onClick={() => copyToClipboard(project.botpress?.shareableLink)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Einbettungscode */}
                    <div className="mb-12">
                        <h2 className="text-lg font-bold mb-2">Einbettungscode</h2>
                        <p className="mb-2 text-sm text-gray-600">
                            Kopieren Sie diesen Code und fügen Sie ihn auf Ihrer Webseite ein.
                        </p>
                        <div className="flex items-start">
                            <pre
                                className="border rounded p-2 bg-gray-100 text-sm break-words w-full"
                                style={{wordWrap: 'break-word', whiteSpace: 'normal'}}
                            >
                                {project.botpress?.embedCode || 'Nicht verfügbar'}
                            </pre>
                            {project.botpress?.embedCode && (
                                <ClipboardIcon
                                    className="w-6 h-6 ml-2 text-blue-600 cursor-pointer hover:text-blue-800"
                                    onClick={() => copyToClipboard(project.botpress?.embedCode)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Client-ID */}
                    <div className="mb-12">
                        <h2 className="text-lg font-bold mb-2">Client-ID</h2>
                        <p className="mb-2 text-sm text-gray-600">
                            Die Client-ID wird verwendet, um den Client im Webchat zu identifizieren. Verwenden Sie dies
                            nur,
                            wenn Sie den Client ohne die Webchat-Schnittstelle verwenden möchten.
                        </p>
                        <div className="flex items-start">
                            <pre
                                className="border rounded p-2 bg-gray-100 text-sm break-words w-full"
                                style={{wordWrap: 'break-word', whiteSpace: 'normal'}}
                            >
                                {project.botpress?.clientId || 'Nicht verfügbar'}
                            </pre>
                            {project.botpress?.clientId && (
                                <ClipboardIcon
                                    className="w-6 h-6 ml-2 text-blue-600 cursor-pointer hover:text-blue-800"
                                    onClick={() => copyToClipboard(project.botpress?.clientId)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}