import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/table';

interface FirmaData {
    Name?: string;
    Street?: string;
    City?: string;
    ZipCode?: string;
    Country?: string;
}

interface Props {
    data: FirmaData;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (updatedData: FirmaData) => void;
}

export function FirmenuebersichtForm({
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
                    type="text"
                    value={data?.Street || ''}
                    onChange={(e) =>
                        onChange({ ...data, Street: e.target.value })
                    }
                    placeholder="Straße"
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    value={data?.City || ''}
                    onChange={(e) =>
                        onChange({ ...data, City: e.target.value })
                    }
                    placeholder="Stadt"
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    value={data?.ZipCode || ''}
                    onChange={(e) =>
                        onChange({ ...data, ZipCode: e.target.value })
                    }
                    placeholder="PLZ"
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    value={data?.Country || ''}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            Country: e.target.value,
                        })
                    }
                    placeholder="Land"
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
            <Table className="mt-4 table-fixed w-full border-collapse bg-white rounded-lg shadow">
                <TableBody>
                    <TableRow>
                        <TableCell className="w-1/3 font-semibold text-gray-700">Name</TableCell>
                        <TableCell className="w-2/3">{data?.Name || 'Nicht verfügbar'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-semibold text-gray-700">Straße</TableCell>
                        <TableCell className="w-2/3">{data?.Street || 'Nicht verfügbar'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-semibold text-gray-700">Stadt</TableCell>
                        <TableCell className="w-2/3">{data?.City || 'Nicht verfügbar'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-semibold text-gray-700">PLZ</TableCell>
                        <TableCell className="w-2/3">{data?.ZipCode || 'Nicht verfügbar'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-semibold text-gray-700">Land</TableCell>
                        <TableCell className="w-2/3">{data?.Country || 'Nicht verfügbar'}</TableCell>
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