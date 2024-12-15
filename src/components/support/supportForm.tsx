"use client";

import React, { useState } from 'react';

export default function SupportForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);
        setError(false);

        try {
            // API-Anfrage an die korrekte Route senden
            const res = await fetch('/api/sendgrid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setIsSuccess(true); // Erfolgsmeldung anzeigen
                } else {
                    console.error(data.message);
                    setError(true); // Fehlermeldung anzeigen
                }
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error:', err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 pt-12 pb-20 px-6 sm:px-12 lg:px-24 mt-24">
            <div className="max-w-screen-xl mx-auto">
                <div className="w-full lg:w-2/3">
                    {/* Headline */}
                    <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                        Kontaktieren Sie unseren Support
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Bitte füllen Sie das folgende Formular aus. Unser Support-Team wird sich schnellstmöglich mit Ihnen in Verbindung setzen.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white rounded-lg shadow-md p-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Ihr Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Max Mustermann"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-3"
                                />
                            </div>
                        </div>

                        {/* E-Mail */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Ihre E-Mail-Adresse
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="max.mustermann@example.com"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-3"
                                />
                            </div>
                        </div>

                        {/* Betreff */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Betreff
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ihr Betreff"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-3"
                                />
                            </div>
                        </div>

                        {/* Nachricht */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Ihre Nachricht
                            </label>
                            <div className="mt-2">
                                <textarea
                                    name="message"
                                    id="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ihr Nachrichtentext..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-3"
                                ></textarea>
                            </div>
                        </div>

                        {/* Senden-Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="block w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isLoading ? 'Wird gesendet...' : 'Senden'}
                            </button>
                        </div>

                        {/* Feedback */}
                        {isSuccess && <p className="text-green-600">E-Mail wurde erfolgreich versendet!</p>}
                        {error && <p className="text-red-600">Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}