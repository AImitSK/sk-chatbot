'use client';

import React from 'react';
import BotpressStats from '@/components/botpressTest';

export default function ConversationStats() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Konversationsstatistiken</h2>
      <BotpressStats />
    </div>
  );
}
