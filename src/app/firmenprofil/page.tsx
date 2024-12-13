'use client';

import { useEffect, useState } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/sanity/client';
import { Heading, Subheading } from '@/components/heading';
import { Text } from '@/components/text';
import { Table, TableBody, TableCell, TableRow } from '@/components/table';

async function fetchUserData(username: string) {
    const query = groq`
        *[_type == "user" && username == $username]{
            ...,
            "projects": *[_type == "projekt" && references(^._id)]{
                ...,
                firma->{
                    Name,
                    Street,
                    City,
                    ZipCode,
                    Country,
                    TaxNumber,
                    TechnischerAnsprechpartner,
                    buchhaltung
                }
            }
        }
    `;
    const params = { username };
    return await client.fetch(query, params);
}

async function updateFirmaData(projectId: string, updatedFirma: any) {
    return await client
        .patch(projectId)
        .set({ firma: updatedFirma })
        .commit();
}

export default function Firmenprofil() {
    const [username, setUsername] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedFirma, setEditedFirma] = useState<any>(null);

    useEffect(() => {
        // Benutzername abrufen
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                } else {
                    console.error('Fehler beim Abrufen der Benutzerinformationen');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        // Benutzer- und Firmendaten abrufen
        if (username) {
            fetchUserData(username)
                .then(data => setUserData(data))
                .catch(() => setError('Fehler beim Laden der Daten'));
        }
    }, [username]);

    const handleEdit = (index: number, firma: any) => {
        setEditingIndex(index);
        setEditedFirma({ ...firma });
    };

    const handleSave = async (projectId: string) => {
        if (!editedFirma) return;
        try {
            await updateFirmaData(projectId, editedFirma);
            const updatedUserData = { ...userData };
            updatedUserData[0].projects[editingIndex as number].firma = editedFirma;
            setUserData(updatedUserData);
            setEditingIndex(null);
        } catch (error) {
            console.error('Fehler beim Speichern der Firmendaten:', error);
        }
    };

    if (error) {
        return (
            <div className="text-center mt-10">
                <Text>{error}</Text>
            </div>
        );
    }

    if (!userData || userData.length === 0) {
        return (
            <div className="text-center mt-10">
                <Text>Keine Benutzerdaten gefunden</Text>
            </div>
        );
    }

    const user = userData[0];

    return (
        <div className="container mx-auto mt-10 px-4">
            <Heading>Firmenprofil</Heading>

            {user.projects.slice(0, 3).map((project: any, index: number) => {
                const firma = project.firma || {};

                return (
                    <div
                        key={project._id}
                        className="bg-gray-100 shadow-sm rounded-lg p-6 mt-8 border-l-4 border-blue-500"
                    >
                        <Subheading>Firmenübersicht {index + 1}</Subheading>

                        {editingIndex === index ? (
                            <div className="space-y-4 mt-4">
                                <input
                                    type="text"
                                    value={editedFirma?.Name || ''}
                                    onChange={(e) =>
                                        setEditedFirma({ ...editedFirma, Name: e.target.value })
                                    }
                                    placeholder="Name"
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    value={editedFirma?.Street || ''}
                                    onChange={(e) =>
                                        setEditedFirma({ ...editedFirma, Street: e.target.value })
                                    }
                                    placeholder="Straße"
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    value={editedFirma?.City || ''}
                                    onChange={(e) =>
                                        setEditedFirma({ ...editedFirma, City: e.target.value })
                                    }
                                    placeholder="Stadt"
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    value={editedFirma?.ZipCode || ''}
                                    onChange={(e) =>
                                        setEditedFirma({ ...editedFirma, ZipCode: e.target.value })
                                    }
                                    placeholder="PLZ"
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    value={editedFirma?.Country || ''}
                                    onChange={(e) =>
                                        setEditedFirma({
                                            ...editedFirma,
                                            Country: e.target.value,
                                        })
                                    }
                                    placeholder="Land"
                                    className="border p-2 rounded w-full"
                                />
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        onClick={() => setEditingIndex(null)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={() => handleSave(project._id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Speichern
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Table className="mt-4 table-fixed w-full border-collapse bg-white rounded-lg shadow">
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="w-1/3 font-semibold text-gray-700">Name</TableCell>
                                        <TableCell className="w-2/3">{firma?.Name || 'Nicht verfügbar'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="w-1/3 font-semibold text-gray-700">Straße</TableCell>
                                        <TableCell className="w-2/3">{firma?.Street || 'Nicht verfügbar'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="w-1/3 font-semibold text-gray-700">Stadt</TableCell>
                                        <TableCell className="w-2/3">{firma?.City || 'Nicht verfügbar'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="w-1/3 font-semibold text-gray-700">PLZ</TableCell>
                                        <TableCell className="w-2/3">{firma?.ZipCode || 'Nicht verfügbar'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="w-1/3 font-semibold text-gray-700">Land</TableCell>
                                        <TableCell className="w-2/3">{firma?.Country || 'Nicht verfügbar'}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        )}

                        <div className="mt-4">
                            {editingIndex !== index && (
                                <button
                                    onClick={() => handleEdit(index, firma)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Bearbeiten
                                </button>
                            )}
                        </div>
                        <Subheading className="mt-6">Technischer Ansprechpartner</Subheading>
                        <Table className="mt-2 table-fixed w-full border-collapse bg-white rounded-lg shadow">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/3 font-semibold text-gray-700">Name</TableCell>
                                    <TableCell className="w-2/3">
                                        {firma.TechnischerAnsprechpartner?.Name || 'Nicht verfügbar'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/3 font-semibold text-gray-700">E-Mail-Adresse</TableCell>
                                    <TableCell className="w-2/3">
                                        {firma.TechnischerAnsprechpartner?.Email || 'Nicht verfügbar'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/3 font-semibold text-gray-700">Telefonnummer</TableCell>
                                    <TableCell className="w-2/3">
                                        {firma.TechnischerAnsprechpartner?.Phone || 'Nicht verfügbar'}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Subheading className="mt-6">Buchhaltungsdetails</Subheading>
                        <Table className="mt-2 table-fixed w-full border-collapse bg-white rounded-lg shadow">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/3 font-semibold text-gray-700">Name</TableCell>
                                    <TableCell className="w-2/3">{firma.buchhaltung?.Name || 'Nicht verfügbar'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/3 font-semibold text-gray-700">E-Mail-Adresse</TableCell>
                                    <TableCell className="w-2/3">{firma.buchhaltung?.Email || 'Nicht verfügbar'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/3 font-semibold text-gray-700">Telefonnummer</TableCell>
                                    <TableCell className="w-2/3">{firma.buchhaltung?.Phone || 'Nicht verfügbar'}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                    </div>

                );
            })}
        </div>
    );
}