import React from 'react';
import BotpressStats from '@/botpress/components/BotpressStats';

export default async function ConversationsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Conversations Dashboard</h1>
      <div className="space-y-6">
        <BotpressStats />
        {/* Hier können später weitere Sektionen hinzugefügt werden */}
      </div>
    </div>
  );
}
