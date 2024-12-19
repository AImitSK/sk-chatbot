'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Heading } from '@/components/heading';
import { Fieldset, Label, FieldGroup, Field } from '@/components/fieldset';
import { Input, InputGroup } from '@/components/input';
import { Button } from '@/components/button';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                window.location.href = '/'; // Direkter Redirect nach Login
            } else {
                console.error('Login fehlgeschlagen');
            }
        } catch (err) {
            console.error('Es ist ein Fehler aufgetreten:', err);
        }
    };

    return (
        <div className="flex justify-center items-start mt-10">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
                <Heading level={2} className="text-center mb-6">
                    Anmelden
                </Heading>

                <form onSubmit={handleSubmit}>
                    <Fieldset>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="username">Benutzername</Label>
                                <InputGroup>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Benutzername"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </InputGroup>
                            </Field>
                            <Field>
                                <Label htmlFor="password">Passwort</Label>
                                <InputGroup>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Passwort"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </InputGroup>
                            </Field>
                        </FieldGroup>
                    </Fieldset>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Anmelden
                    </button>
                </form>
            </div>
        </div>
    );
}