'use client';

import { useEffect, useState } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/sanity/client';
import { Heading, Subheading } from '@/components/heading';
import { Text } from '@/components/text';
import { FirmenuebersichtForm } from '@/components/firmenprofil/FirmenuebersichtForm';
import { TechnischerAnsprechpartnerForm } from '@/components/firmenprofil/TechnischerAnsprechpartnerForm';
import { BuchhaltungForm } from '@/components/firmenprofil/BuchhaltungForm';

async function fetchUserData(username: string) {
    const query = groq`
        *[_type == "user" && username == $username]{
            ...,
            "projects": *[_type == "projekt" && references(^._id)]{
                ...,
                firma->{
                    _id,
                    _type,
                    _rev,
                    Name,
                    Street,
                    City,
                    ZipCode,
                    Country,
                    TechnischerAnsprechpartner,
                    buchhaltung
                }
            }
        }
    `;
    const params = { username };
    return await client.fetch(query, params);
}

type Firma = {
    Name?: string;
    Street?: string;
    City?: string;
    ZipCode?: string;
    Country?: string;
    TechnischerAnsprechpartner?: {
        Name?: string;
        Email?: string;
        Phone?: string;
    };
    buchhaltung?: {
        Name?: string;
        Email?: string;
        Phone?: string;
    };
};



async function updateFirmaData(firmaId: string, updateData: any, section?: string) {
    try {
        console.log('Updating firma with ID:', firmaId);
        console.log('Update data:', updateData);

        // Holen der Firma direkt über die ID
        const firmaTx = client.transaction();

        if (section === 'TechnischerAnsprechpartner') {
            firmaTx.patch(firmaId, {
                set: {
                    'TechnischerAnsprechpartner': {
                        _type: 'TechnischerAnsprechpartner',
                        Name: updateData.Name,
                        Email: updateData.Email,
                        Phone: updateData.Phone,
                    },
                },
            });
        } else if (section === 'buchhaltung') {
            firmaTx.patch(firmaId, {
                set: {
                    'buchhaltung': {
                        _type: 'buchhaltung',
                        Name: updateData.Name,
                        Email: updateData.Email,
                        Phone: updateData.Phone,
                    },
                },
            });
        } else {
            // Für Hauptfirmendaten
            const updates: Partial<Firma> = {}; // Typ hinzufügen
            if (updateData.Name) updates.Name = updateData.Name;
            if (updateData.Street) updates.Street = updateData.Street;
            if (updateData.City) updates.City = updateData.City;
            if (updateData.ZipCode) updates.ZipCode = updateData.ZipCode;
            if (updateData.Country) updates.Country = updateData.Country;

            firmaTx.patch(firmaId, {
                set: updates,
            });

        }

        // Abschließen der Transaktion
        try {
            const result = await firmaTx.commit();
            console.log('Update result:', result);
            if (result.results && result.results.length > 0) {
                return result.results[0];
            } else {
                throw new Error('Keine Ergebnisse nach Transaktion.');
            }
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Allgemeiner Fehler bei der Aktualisierung:', error);
        throw error;
    }
}

// Typen
type EditingState = {
    firmenuebersicht: number | null;
    technischerAnsprechpartner: number | null;
    buchhaltung: number | null;
};

type SuccessMessages = {
    firmenuebersicht: string | null;
    technischerAnsprechpartner: string | null;
    buchhaltung: string | null;
};

export default function Firmenprofil() {
    const [username, setUsername] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<EditingState>({
        firmenuebersicht: null,
        technischerAnsprechpartner: null,
        buchhaltung: null
    });
    const [editedData, setEditedData] = useState<any>({
        firmenübersicht: null,
        technischerAnsprechpartner: null,
        buchhaltung: null
    });
    const [successMessages, setSuccessMessages] = useState<SuccessMessages>({
        firmenuebersicht: null,
        technischerAnsprechpartner: null,
        buchhaltung: null
    });

    useEffect(() => {
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
        if (username) {
            fetchUserData(username)
                .then(data => {
                    console.log('Fetched data:', data);
                    setUserData(data);
                })
                .catch((err) => {
                    console.error('Fetch error:', err);
                    setError('Fehler beim Laden der Daten');
                });
        }
    }, [username]);

    const handleEdit = (section: keyof EditingState, index: number, data: any) => {
        console.log('Editing section:', section, 'with data:', data);
        setEditing((prev: EditingState) => ({ ...prev, [section]: index }));
        setEditedData((prev: typeof editedData) => ({ ...prev, [section]: { ...data } }));
    };

    const handleSave = async (section: keyof EditingState, index: number) => {
        const data = editedData[section];
        if (!data) return;

        try {
            const firma = userData[0].projects[index].firma;
            console.log('Firma data before update:', firma);

            if (!firma || !firma._id) {
                throw new Error('Keine Firma-ID gefunden');
            }

            const sectionKey = section === 'technischerAnsprechpartner' ? 'TechnischerAnsprechpartner' : 
                            section === 'buchhaltung' ? 'buchhaltung' : undefined;

            console.log('Updating section:', sectionKey, 'with data:', data);
            const updatedFirma = await updateFirmaData(firma._id, data, sectionKey);
            console.log('Updated firma:', updatedFirma);
            
            const updatedUserData = { ...userData };
            updatedUserData[0].projects[index].firma = updatedFirma;

            setUserData(updatedUserData);
            setEditing((prev: EditingState) => ({ ...prev, [section]: null }));
            setEditedData((prev: Partial<SuccessMessages>) => ({ ...prev, [section]: null }));

            // Erfolgsmeldung setzen
            setSuccessMessages(prev => ({ 
                ...prev, 
                [section]: 'Daten erfolgreich aktualisiert!' 
            }));

            // Erfolgsmeldung nach 5 Sekunden ausblenden
            setTimeout(() => {
                setSuccessMessages(prev => ({ 
                    ...prev, 
                    [section]: null 
                }));
            }, 5000);

            if (username) {
                const refreshedData = await fetchUserData(username);
                setUserData(refreshedData);
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
        }
    };

    const handleCancel = (section: keyof EditingState) => {
        setEditing((prev: EditingState) => ({ ...prev, [section]: null }));
        setEditedData((prev: Partial<SuccessMessages>) => ({ ...prev, [section]: null }));
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
                
                console.log('Rendering firma data:', firma);

                return (
                    <div
                        key={project._id}
                        className="bg-gray-100 shadow-sm rounded-lg p-6 mt-8 border-l-4 border-blue-500"
                    >
                        <Subheading>Firmenübersicht {index + 1}</Subheading>
                        {successMessages.firmenuebersicht && (
                            <div className="my-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md">
                                {successMessages.firmenuebersicht}
                            </div>
                        )}
                        <FirmenuebersichtForm
                            data={editedData.firmenübersicht || firma}
                            isEditing={editing.firmenuebersicht === index}
                            onEdit={() => handleEdit('firmenuebersicht', index, firma)}
                            onSave={() => handleSave('firmenuebersicht', index)}
                            onCancel={() => handleCancel('firmenuebersicht')}
                            onChange={(data) =>
                                setEditedData((prev: Partial<SuccessMessages>) => ({
                                    ...prev,
                                    firmenübersicht: data
                                }))
                            }
                        />

                        <Subheading className="mt-6">Technischer Ansprechpartner</Subheading>
                        {successMessages.technischerAnsprechpartner && (
                            <div className="my-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md">
                                {successMessages.technischerAnsprechpartner}
                            </div>
                        )}
                        <TechnischerAnsprechpartnerForm
                            data={editedData.technischerAnsprechpartner || firma.TechnischerAnsprechpartner || {}}
                            isEditing={editing.technischerAnsprechpartner === index}
                            onEdit={() =>
                                handleEdit(
                                    'technischerAnsprechpartner',
                                    index,
                                    firma.TechnischerAnsprechpartner || {}
                                )
                            }
                            onSave={() => handleSave('technischerAnsprechpartner', index)}
                            onCancel={() => handleCancel('technischerAnsprechpartner')}
                            onChange={(data) =>
                                setEditedData((prev: Partial<SuccessMessages>) => ({
                                    ...prev,
                                    technischerAnsprechpartner: data,
                                }))
                            }
                        />

                        <Subheading className="mt-6">Buchhaltungsdetails</Subheading>
                        {successMessages.buchhaltung && (
                            <div className="my-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md">
                                {successMessages.buchhaltung}
                            </div>
                        )}
                        <BuchhaltungForm
                            data={editedData.buchhaltung || firma.buchhaltung || {}}
                            isEditing={editing.buchhaltung === index}
                            onEdit={() => handleEdit('buchhaltung', index, firma.buchhaltung || {})}
                            onSave={() => handleSave('buchhaltung', index)}
                            onCancel={() => handleCancel('buchhaltung')}
                            onChange={(data) =>
                                setEditedData((prev: Partial<SuccessMessages>) => ({
                                    ...prev,
                                    buchhaltung: data
                                }))
                            }
                        />
                    </div>
                );
            })}
        </div>
    );
}