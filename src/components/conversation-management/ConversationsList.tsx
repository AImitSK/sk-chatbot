'use client';

import React, { useEffect, useState } from 'react';
import { Client } from '@botpress/client';

const botpressClient = new Client({
    token: process.env.NEXT_PUBLIC_BOTPRESS_TOKEN ?? '',
    workspaceId: process.env.NEXT_PUBLIC_BOTPRESS_WORKSPACE_ID ?? '',
    botId: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID ?? '',
});

interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  tags: { [key: string]: string };
  userId?: string;
}

interface ConversationsListProps {
  onConversationSelect?: (conversationId: string) => void;
}

interface Params {
  sortField: 'updatedAt';
  sortDirection: 'desc';
  nextToken?: string;
}

export function ConversationsList({ onConversationSelect }: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalConversations, setTotalConversations] = useState(0);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        
        const params: Params = {
          sortField: 'updatedAt',
          sortDirection: 'desc',
        };

        if (nextToken) {
          params.nextToken = nextToken;
        }

        const pagedConversations = await botpressClient.list.conversations(params).collect();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filteredConversations = pagedConversations.filter(conv => {
          const conversationDate = new Date(conv.updatedAt);
          return conversationDate >= thirtyDaysAgo;
        });

        // Setze die gefilterten Konversationen
        setConversations(filteredConversations.slice(0, 10));
        
        // Hole die Gesamtanzahl nur für die Pagination
        const totalCount = await botpressClient.list.conversations({
          sortField: 'updatedAt',
          sortDirection: 'desc'
        }).collect();

        const totalFiltered = totalCount.filter(conv => {
          const conversationDate = new Date(conv.updatedAt);
          return conversationDate >= thirtyDaysAgo;
        }).length;

        setTotalConversations(totalFiltered);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Fehler beim Laden der Konversationen');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentPage]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Letzte Aktivität
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConversations.slice(0, 10).map((conversation) => (
                  <tr
                    key={conversation.id}
                    onClick={() => handleRowClick(conversation.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {conversation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(conversation.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vereinfachte Pagination Controls */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between items-center">
              <p className="text-sm text-gray-700">
                Seite {currentPage} von {Math.ceil(totalConversations / itemsPerPage)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Zurück
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalConversations / itemsPerPage)}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Weiter
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ConversationsList;