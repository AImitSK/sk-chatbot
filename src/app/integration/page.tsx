'use client';

import React, { useEffect, useState } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/sanity/client';
import { ClipboardIcon } from '@heroicons/react/24/solid';

import { Field, FieldGroup, Label } from '@/components/fieldset';
import { InputGroup } from '@/components/input';
import { Heading, Subheading } from '@/components/heading';

export default function IntegrationSettings() {
    const [projects, setProjects] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Daten abrufen
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const query = groq`
          *[_type == "user"]{
            "projects": *[_type == "projekt"]{
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
                const data = await client.fetch(query);

                if (data.length > 0) {
                    setProjects(data[0]?.projects || []);
                } else {
                    setError('Keine Projektdaten gefunden.');
                }
            } catch (err) {
                setError('Fehler beim Laden der Projektdaten.');
                console.error(err);
            }
        };

        fetchProjects().catch((err) => console.error('Fehler bei fetchProjects:', err));
    }, []);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setSuccessMessage('Erfolgreich kopiert!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Fehler beim Kopieren in die Zwischenablage:', err);
        }
    };

    if (error) {
        return (
            <div className="max-w-6xl mx-auto mt-8 p-4 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="max-w-6xl mx-auto mt-8 p-4 text-gray-600">
                <p>Keine Projekte verfügbar.</p>
            </div>
        );
    }
    return (
        <div className="max-w-6xl mx-auto mt-10">
            <Heading level={1} className="mb-8 uppercase">
                Integration
            </Heading>

            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">
                    <p className="text-white">{successMessage}</p>
                </div>
            )}

            {projects.map((project, index) => (
                <div key={index}>
                    <Heading level={2} className="mt-8 mb-6">
                        Projekt: {project.name || 'Unbenanntes Projekt'}
                    </Heading>
                    <p className="mb-6">
                        Nutzen Sie die folgenden Code-Snippets, um Ihren KI-Bot mit anderen zu teilen oder in Ihre Webseite zu integrieren.
                    </p>

                    {/* Shareable-Link */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <Subheading level={3} className="mb-4 font-semibold">
                            Teilbarer Link
                        </Subheading>
                        <FieldGroup>
                            <Field>
                                <Label>Teilen Sie diesen Link, damit andere Ihren Chatbot schnell testen können:</Label>
                                <div className="flex items-start">
                                <textarea
                                    readOnly
                                    value={project.botpress.shareableLink}
                                    className="w-full bg-blue-50 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-300 flex-grow"
                                />
                                    <button
                                        onClick={() => copyToClipboard(project.botpress.shareableLink)}
                                        className="ml-4 rounded cursor-pointer focus:outline-none focus:ring flex-shrink-0"
                                    >
                                        <ClipboardIcon className="h-5 w-5 text-blue-500" />
                                    </button>
                                </div>
                            </Field>
                        </FieldGroup>
                    </div>

                    {/* Embed-Code */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <Subheading level={3} className="mb-4 font-semibold">
                            Einbettungscode
                        </Subheading>
                        <FieldGroup>
                            <Field>
                                <Label>Kopieren Sie diesen Code und fügen Sie ihn in den HTML-Code Ihrer Webseite ein:</Label>
                                <div className="flex items-start">
                                <textarea
                                    readOnly
                                    value={project.botpress.embedCode}
                                    className="w-full bg-blue-50 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-300 flex-grow"
                                />
                                    <button
                                        onClick={() => copyToClipboard(project.botpress.embedCode)}
                                        className="ml-4 rounded cursor-pointer focus:outline-none focus:ring flex-shrink-0"
                                    >
                                        <ClipboardIcon className="h-5 w-5 text-blue-500" />
                                    </button>
                                </div>
                            </Field>
                        </FieldGroup>
                    </div>

                    {/* Client-ID */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <Subheading level={3} className="mb-4 font-semibold">
                            Client-ID
                        </Subheading>
                        <FieldGroup>
                            <Field>
                                <Label>Verwenden Sie die Client-ID, um Ihren Bot eindeutig zu identifizieren. Diese ID wird benötigt, wenn Sie den Bot ohne die Webchat-Oberfläche nutzen möchten.</Label>
                                <div className="flex items-start">
                                <textarea
                                    readOnly
                                    value={project.botpress.clientId}
                                    className="w-full bg-blue-50 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-300 flex-grow"
                                />
                                    <button
                                        onClick={() => copyToClipboard(project.botpress.clientId)}
                                        className="ml-4 rounded cursor-pointer focus:outline-none focus:ring flex-shrink-0"
                                    >
                                        <ClipboardIcon className="h-5 w-5 text-blue-500" />
                                    </button>
                                </div>
                            </Field>
                        </FieldGroup>
                    </div>
                </div>
            ))}
        </div>
    );
}