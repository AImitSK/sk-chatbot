'use client';

import React from 'react';
import { ConversationDetail } from '@/components/conversation-management/ConversationDetail';
import { useRouter } from 'next/navigation';

export default function ConversationDetailPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      <ConversationDetail 
        conversationId={params.id} 
        onBack={handleBack}
      />
    </div>
  );
}