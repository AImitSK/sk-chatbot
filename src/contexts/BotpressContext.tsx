'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@botpress/client';

interface BotpressContextType {
  client: Client | null;
  isLoading: boolean;
  error: string | null;
}

const BotpressContext = createContext<BotpressContextType>({
  client: null,
  isLoading: true,
  error: null,
});

export function BotpressProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeBotpressClient() {
      try {
        const response = await fetch('/api/credentials', {
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Fehler beim Laden der Credentials');
        }

        const { credentials } = await response.json();
        const newClient = new Client({
          token: credentials.token,
          workspaceId: credentials.workspaceId,
          botId: credentials.botId,
        });

        setClient(newClient);
        setError(null);
      } catch (err) {
        console.error('Error initializing Botpress client:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Initialisieren des Botpress Clients');
      } finally {
        setIsLoading(false);
      }
    }

    initializeBotpressClient();
  }, []);

  return (
    <BotpressContext.Provider value={{ client, isLoading, error }}>
      {children}
    </BotpressContext.Provider>
  );
}

export function useBotpress() {
  const context = useContext(BotpressContext);
  if (context === undefined) {
    throw new Error('useBotpress must be used within a BotpressProvider');
  }
  return context;
}
