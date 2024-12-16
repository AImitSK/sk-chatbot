'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Client } from '@botpress/client';
import { useAuth } from './AuthContext';

interface BotpressContextType {
  client: Client | null;
  isLoading: boolean;
  error: string | null;
  refreshClient: () => Promise<void>;
}

const BotpressContext = createContext<BotpressContextType>({
  client: null,
  isLoading: true,
  error: null,
  refreshClient: async () => {},
});

export function BotpressProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const initializeBotpressClient = useCallback(async () => {
    if (!user) {
      setClient(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
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
        botId: credentials.botId
      });

      setClient(newClient);
      setError(null);
    } catch (err) {
      console.error('Error initializing Botpress client:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Initialisieren des Botpress Clients');
      setClient(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    initializeBotpressClient();
  }, [initializeBotpressClient]);

  // Auto-Refresh alle 50 Minuten
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(() => {
      initializeBotpressClient();
    }, 50 * 60 * 1000); // 50 Minuten

    return () => clearInterval(refreshInterval);
  }, [user, initializeBotpressClient]);

  return (
    <BotpressContext.Provider value={{ client, isLoading, error, refreshClient: initializeBotpressClient }}>
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
