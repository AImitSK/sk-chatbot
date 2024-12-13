import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/table';

interface AnsprechpartnerData {
    Name?: string;
    Email?: string;
    Phone?: string;
}

interface Props {
    data: AnsprechpartnerData;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (updatedData: AnsprechpartnerData) => void;
}

export function TechnischerAnsprechpartnerForm({ 
    data, 
    isEditing, 
    onEdit, 
    onSave, 
    onCancel, 
    onChange 
}: Props) {
    if (isEditing) {
        return (
            <div className="space-y-4 mt-4">
                <input
                    type="text"
                    value={data?.Name || ''}
                    onChange={(e) =>
                        onChange({ ...data, Name: e.target.value })
                    }
                    placeholder="Name"
                    className="border p-2 rounded w-full"
                />
                <input
                    type="email"
                    value={data?.Email || ''}
                    onChange={(e) =>
                        onChange({ ...data, Email: e.target.value })
                    }
                    placeholder="E-Mail-Adresse"
                    className="border p-2 rounded w-full"
                />
                <input
                    type="tel"
                    value={data?.Phone || ''}
                    onChange={(e) =>
                        onChange({ ...data, Phone: e.target.value })
                    }
                    placeholder="Telefonnummer"
                    className="border p-2 rounded w-full"
                />
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={onSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Speichern
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Table className="mt-2 table-fixed w-full border-collapse bg-white rounded-lg shadow">
                <TableBody>
                    <TableRow>
                        <TableCell className="w-1/3 font-semibold text-gray-700">Name</TableCell>
                        <TableCell className="w-2/3">{data?.Name || 'Nicht verfügbar'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-semibold text-gray-700">E-Mail-Adresse</TableCell>
                        <TableCell className="w-2/3">{data?.Email || 'Nicht verfügbar'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-semibold text-gray-700">Telefonnummer</TableCell>
                        <TableCell className="w-2/3">{data?.Phone || 'Nicht verfügbar'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="mt-4">
                <button
                    onClick={onEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Bearbeiten
                </button>
            </div>
        </>
    );
}