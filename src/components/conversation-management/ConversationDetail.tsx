'use client';

import React, { useEffect, useState } from 'react';
import { useBotpress } from '@/contexts/BotpressContext';

interface Message {
  id: string;
  conversationId: string;
  direction: 'incoming' | 'outgoing';
  createdAt: string;
  payload: { [key: string]: any };
  userId?: string;
  type?: string;
  tags?: { [key: string]: string };
}

interface ConversationDetailProps {
  conversationId: string;
  onBack?: () => void;
}

export function ConversationDetail({ conversationId, onBack }: ConversationDetailProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { client, isLoading: isClientLoading, error: clientError } = useBotpress();

  useEffect(() => {
    const fetchConversationData = async () => {
      if (!client) return;
      
      try {
        setIsLoading(true);

        const response = await client.getConversation({ id: conversationId });
        const messagesResponse = await client.list.messages({
          conversationId
        }).collect();

        const sortedMessages = messagesResponse.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setDetails(response);
        setMessages(sortedMessages);

      } catch (err) {
        console.error('Error fetching conversation data:', err);
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setIsLoading(false);
      }
    };

    if (conversationId && client) {
      fetchConversationData();
    }
  }, [conversationId, client]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    } catch {
      return '-';
    }
  };

  const renderMessagePayload = (payload: { [key: string]: any }) => {
    if (payload.text) {
      return <div className="text-gray-900">{payload.text}</div>;
    }

    if (payload.items && Array.isArray(payload.items)) {
      return (
        <div className="space-y-2">
          {payload.items.map((item: any, index: number) => (
            <div key={index}>
              {item.text && <div>{item.text}</div>}
              {item.title && <div className="font-bold">{item.title}</div>}
              {item.subtitle && <div className="text-sm">{item.subtitle}</div>}
            </div>
          ))}
        </div>
      );
    }

    return (
      <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(payload, null, 2)}
      </pre>
    );
  };

  const getUserId = () => {
    if (details?.conversation?.tags?.['webchat:owner']) {
      return details.conversation.tags['webchat:owner'];
    }
    return 'Anonymer Benutzer';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white rounded-md hover:bg-gray-50 border"
        >
          ← Zurück
        </button>
        <h2 className="text-xl">
          Chat: {conversationId}
        </h2>
      </div>

      {isLoading ? (
        <div className="p-4 text-center">Laden...</div>
      ) : error ? (
        <div className="p-4 text-red-600">
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Details */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold text-xl mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p>
                  <span className="text-gray-600">Channel: </span>
                  <span>webchat</span>
                </p>
                <p>
                  <span className="text-gray-600">Erstellt: </span>
                  <span>{formatDate(details?.conversation?.createdAt)}</span>
                </p>
                <p>
                  <span className="text-gray-600">Aktualisiert: </span>
                  <span>{formatDate(details?.conversation?.updatedAt)}</span>
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  <span className="text-gray-600">Tags: </span>
                  <span className="text-gray-500">Keine Tags</span>
                </p>
                <p>
                  <span className="text-gray-600">User: </span>
                  <span className="text-gray-500">{getUserId()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${message.direction === 'incoming' ? 'bg-blue-50' : 'bg-gray-50'} p-4 rounded-lg`}
              >
                <div className="text-sm text-gray-500 mb-1">
                  {message.direction === 'incoming' ? 'User' : 'Bot'} • {formatDate(message.createdAt)}
                </div>
                {renderMessagePayload(message.payload)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversationDetail;