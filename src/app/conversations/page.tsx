'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ConversationsList } from '@/components/bpComponents/ConversationsList';

export default function ConversationsPage() {
  const router = useRouter();

  const handleConversationSelect = (conversationId: string) => {
    router.push(`/conversations/${conversationId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Conversations</h1>
      <ConversationsList onConversationSelect={handleConversationSelect} />
    </div>
  );
}