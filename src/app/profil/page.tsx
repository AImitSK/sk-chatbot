'use client';

import { useEffect, useState } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/sanity/client';
import { Heading, Subheading } from '@/components/heading';
import { Text } from '@/components/text';
import { Table, TableBody, TableCell, TableRow } from '@/components/table';

interface UserData {
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    profileImage: string | null;
}

async function fetchUserData(username: string) {
    const query = groq`
        *[_type == "user" && username == $username]{
            ...,
            "projects": *[_type == "projekt" && references(^._id)]{
                ...,
                botpress {
                    embedCode,
                    clientId,
                    personalAccessToken,
                    botId
                },
                vertragsmodell->,
                firma->{
                    ...,
                    TechnischerAnsprechpartner,
                    buchhaltung
                }
            }
        }
    `;
    const params = { username };
    return await client.fetch(query, params);
}

export default function Settings() {
    const [username, setUsername] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

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
                    const data: UserData = await response.json();
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
        if (username) {
            fetchUserData(username)
                .then(data => setUserData(data))
                .catch(() => setError('Fehler beim Laden der Daten'));
        }
    }, [username]);

    if (error) {
        return <Text>{error}</Text>;
    }

    if (!userData || userData.length === 0) {
        return <Text>Keine Benutzerdaten gefunden</Text>;
    }

    const user = userData[0];

    return (
        <div className="container mx-auto mt-10 px-4">
            <Heading>Einstellungen</Heading>

            <Subheading className="mt-6">User Profil</Subheading>
            <Table className="mt-2 table-fixed w-full">
                <TableBody>
                    <TableRow>
                        <TableCell className="w-1/2 break-words">Benutzername</TableCell>
                        <TableCell className="w-1/2 break-words">{user.username}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/2 break-words">Email</TableCell>
                        <TableCell className="w-1/2 break-words">{user.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/2 break-words">Rolle</TableCell>
                        <TableCell className="w-1/2 break-words">{user.role}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/2 break-words">Aktiv</TableCell>
                        <TableCell className="w-1/2 break-words">{user.isActive ? 'Ja' : 'Nein'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            {user.projects.map((project: any) => (
                <div key={project._id} className="mt-8">
                    <Subheading>Projekt: {project.name}</Subheading>
                    <Table className="mt-2 table-fixed w-full">
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Projektname</TableCell>
                                <TableCell className="w-1/2 break-words">{project.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Vertragsbeginn</TableCell>
                                <TableCell className="w-1/2 break-words">{project.vertragsbeginn}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Vertragsende</TableCell>
                                <TableCell className="w-1/2 break-words">{project.vertragsende}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Weblink</TableCell>
                                <TableCell className="w-1/2 break-words">{project.weblink}</TableCell>
                            </TableRow>
                            {/* <TableRow>
    <TableCell className="w-1/2 break-all">Botpress Embed Code</TableCell>
    <TableCell className="w-1/2 break-all">{project.botpress.embedCode}</TableCell>
</TableRow> */}
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Botpress ClientId</TableCell>
                                <TableCell className="w-1/2 break-words">{project.botpress.clientId || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Botpress PersonalAccessToken</TableCell>
                                <TableCell className="w-1/2 break-words">{project.botpress.personalAccessToken || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Botpress BotId</TableCell>
                                <TableCell className="w-1/2 break-words">{project.botpress.botId || 'N/A'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Subheading className="mt-6">Firma</Subheading>
                    <Table className="mt-2 table-fixed w-full">
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Name</TableCell>
                                <TableCell className="w-1/2 break-words">{project.firma ? project.firma.Name : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Stadt</TableCell>
                                <TableCell className="w-1/2 break-words">{project.firma ? project.firma.City : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">PLZ</TableCell>
                                <TableCell className="w-1/2 break-words">{project.firma ? project.firma.ZipCode : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Land</TableCell>
                                <TableCell className="w-1/2 break-words">{project.firma ? project.firma.Country : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/2 break-words">Steuernummer</TableCell>
                                <TableCell className="w-1/2 break-words">{project.firma ? project.firma.TaxNumber : 'N/A'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Subheading className="mt-6">Technischer Ansprechpartner</Subheading>
                    {project.firma && project.firma.TechnischerAnsprechpartner ? (
                        <Table className="mt-2 table-fixed w-full">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Name</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.firma.TechnischerAnsprechpartner.Name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Email</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.firma.TechnischerAnsprechpartner.Email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Telefon</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.firma.TechnischerAnsprechpartner.Phone}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <Text>N/A</Text>
                    )}

                    <Subheading className="mt-6">Buchhaltung</Subheading>
                    {project.firma && project.firma.buchhaltung ? (
                        <Table className="mt-2 table-fixed w-full">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Name</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.firma.buchhaltung.Name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Email</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.firma.buchhaltung.Email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Telefon</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.firma.buchhaltung.Phone}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <Text>N/A</Text>
                    )}

                    <Subheading className="mt-6">Vertragsmodell Details</Subheading>
                    {project.vertragsmodell ? (
                        <Table className="mt-2 table-fixed w-full">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Name</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.vertragsmodell.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Free KI Spend</TableCell>
                                    <TableCell className="w-1/2 break-words">€{project.vertragsmodell.freeKiSpend}/Monat</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">HITL Funktion</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.vertragsmodell.hitlFunktion ? 'Ja' : 'Nein'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Email Support</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.vertragsmodell.emailSupport ? 'Ja' : 'Nein'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Telefon Support</TableCell>
                                    <TableCell className="w-1/2 break-words">{project.vertragsmodell.telefonSupport ? 'Ja' : 'Nein'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-1/2 break-words">Preis</TableCell>
                                    <TableCell className="w-1/2 break-words">€{project.vertragsmodell.preis}/Monat</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <Text>N/A</Text>
                    )}
                </div>
            ))}
        </div>
    );
}