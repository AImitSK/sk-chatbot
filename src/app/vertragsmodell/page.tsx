'use client';

import { useEffect, useState } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/sanity/client';
import { Heading, Subheading } from '@/components/heading';
import { Table, TableBody, TableCell, TableRow } from '@/components/table';
import { Text } from '@/components/text';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'; // Heroicons importieren
import { format, differenceInMonths } from 'date-fns'; // Externe Bibliothek für Datumsformatierung und Berechnung

// Definiertes Vertragsmodell-Schema
interface Vertragsmodell {
    name: string;
    freeKiSpend: number;
    hitlFunktion: boolean;
    emailSupport: boolean;
    telefonSupport: boolean;
    preis: number;
}

interface Vertragsdaten extends Vertragsmodell {
    vertragsbeginn: string;
    vertragsende: string;
}

async function fetchUserData(username: string) {
    const query = groq`
        *[_type == "user" && username == $username]{
            "projects": *[_type == "projekt" && references(^._id)]{
                "vertragsmodell": vertragsmodell->{
                    name,
                    freeKiSpend,
                    hitlFunktion,
                    emailSupport,
                    telefonSupport,
                    preis
                },
                vertragsbeginn,
                vertragsende
            }
        }
    `;
    const params = { username };
    return await client.fetch(query, params);
}

export default function VertragsmodellPage() {
    const [username, setUsername] = useState<string | null>(null);
    const [vertragsdaten, setVertragsdaten] = useState<Vertragsdaten | null>(null);
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
        if (username) {
            fetchUserData(username)
                .then((data) => {
                    const projekt = data[0]?.projects[0] || null;
                    if (projekt) {
                        setVertragsdaten({
                            ...projekt.vertragsmodell,
                            vertragsbeginn: projekt.vertragsbeginn,
                            vertragsende: projekt.vertragsende,
                        });
                    }
                })
                .catch(() => setError('Fehler beim Laden der Daten.'));
        }
    }, [username]);

    if (error) {
        return <Text>{error}</Text>;
    }

    if (!vertragsdaten) {
        return <Text>Keine Vertragsdaten zugeordnet.</Text>;
    }

    // Vertragslaufzeit berechnen
    const vertragsbeginnFormatted = format(new Date(vertragsdaten.vertragsbeginn), 'dd.MM.yyyy');
    const vertragsendeFormatted = format(new Date(vertragsdaten.vertragsende), 'dd.MM.yyyy');
    const laufzeitInMonaten = differenceInMonths(
        new Date(vertragsdaten.vertragsende),
        new Date(vertragsdaten.vertragsbeginn)
    );

    return (
        <div className="container mx-auto mt-10 px-4">
            <Heading>Vertragsmodell</Heading>

            <Subheading className="mt-6">Details des Vertragsmodells</Subheading>
            <Table className="mt-2 table-fixed w-full">
                <TableBody>
                    <TableRow>
                        <TableCell className="font-bold">Name</TableCell>
                        <TableCell>{vertragsdaten.name || 'Nicht angegeben'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Free KI Spend</TableCell>
                        <TableCell>{`€${vertragsdaten.freeKiSpend}/Monat`}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">HITL Funktion</TableCell>
                        <TableCell>
                            {vertragsdaten.hitlFunktion ? (
                                <CheckIcon className="h-5 w-5 text-green-500 inline" />
                            ) : (
                                <XMarkIcon className="h-5 w-5 text-red-500 inline" />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Email Support</TableCell>
                        <TableCell>
                            {vertragsdaten.emailSupport ? (
                                <CheckIcon className="h-5 w-5 text-green-500 inline" />
                            ) : (
                                <XMarkIcon className="h-5 w-5 text-red-500 inline" />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Telefon Support</TableCell>
                        <TableCell>
                            {vertragsdaten.telefonSupport ? (
                                <CheckIcon className="h-5 w-5 text-green-500 inline" />
                            ) : (
                                <XMarkIcon className="h-5 w-5 text-red-500 inline" />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Preis</TableCell>
                        <TableCell>{`€${vertragsdaten.preis}/Monat`}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Vertragslaufzeit</TableCell>
                        <TableCell>{`${vertragsbeginnFormatted} – ${vertragsendeFormatted}`}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Laufzeit</TableCell>
                        <TableCell>{`${laufzeitInMonaten} Monate`}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}