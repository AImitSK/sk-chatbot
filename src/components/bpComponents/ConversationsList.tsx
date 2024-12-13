'use client';

import React, { useEffect, useState } from 'react';
import { Client } from '@botpress/client';

// Botpress Client initialisieren
const botpressClient = new Client({
    token: process.env.NEXT_PUBLIC_BOTPRESS_TOKEN ?? '',
    workspaceId: process.env.NEXT_PUBLIC_BOTPRESS_WORKSPACE_ID ?? '',
    botId: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID ?? '',
});

interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  userId?: string;
}

interface ConversationsListProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function ConversationsList({ onConversationSelect }: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30); // Letzte 30 Tage

        const fetchedConversations = await botpressClient.list.conversations({
          from: startDate.toISOString(),
          to: endDate.toISOString()
        }).collect();

        // Sortiere nach updatedAt, neueste zuerst
        const sortedConversations = fetchedConversations
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 10); // Nur die letzten 10 Konversationen

        setConversations(sortedConversations);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Fehler beim Laden der Konversationen');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const formatDate = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - messageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `vor ${diffDays} Tagen`;
  };

  const filteredConversations = conversations.filter(conv => 
    conv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (conversationId: string) => {
    if (onConversationSelect) {
      onConversationSelect(conversationId);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <input
            type="text"
            placeholder="Suche nach Conversation ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button className="p-2 border rounded-md">
            🔍
          </button>
        </div>
        <div className="relative ml-2">
          <button className="px-3 py-2 border rounded-md flex items-center">
            ⚙️ Filter
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left">Integration</th>
                <th className="px-4 py-3 text-left">Last Modified</th>
                <th className="px-4 py-3 text-left">Conversation Identifier</th>
                <th className="px-4 py-3 text-left">Summary</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                      <span>Lade Konversationen...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Keine Konversationen gefunden
                  </td>
                </tr>
              ) : (
                filteredConversations.map((conversation) => (
                  <tr 
                    key={conversation.id}
                    className="border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(conversation.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Webchat</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(conversation.updatedAt)}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {conversation.id}
                    </td>
                    <td className="px-4 py-3">
                      {conversation.userId && `User: ${conversation.userId}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ConversationsList;