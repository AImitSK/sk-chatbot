'use client';

import { useState, useEffect, useCallback } from 'react';
import { Client } from '@botpress/client';
import { AnalyticsData, UserGraphData, MessageData } from './types';
import { initializeDailyStats, getDatesForLast30Days } from './utils';

let botpressClient: Client | null = null;

if (typeof window !== 'undefined') {
  botpressClient = new Client({
    token: process.env.NEXT_PUBLIC_BOTPRESS_TOKEN ?? '',
    workspaceId: process.env.NEXT_PUBLIC_BOTPRESS_WORKSPACE_ID ?? '',
    botId: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID ?? '',
  });
}

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processConversations = useCallback(async () => {
    if (!botpressClient) {
      throw new Error('Botpress Client ist nicht initialisiert');
    }

    // Hole alle Konversationen
    const conversations = await botpressClient.list.conversations({
      sortField: 'updatedAt',
      sortDirection: 'desc'
    }).collect();

    // Filtere nach den letzten 30 Tagen
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentConversations = conversations.filter(conv => 
      new Date(conv.updatedAt) >= thirtyDaysAgo
    );

    return recentConversations;
  }, []);

  const processMessages = useCallback(async (conversations: any[]) => {
    if (!botpressClient) {
      throw new Error('Botpress Client ist nicht initialisiert');
    }

    const messagesPromises = conversations.map(conv =>
      botpressClient!.list.messages({
        conversationId: conv.id
      }).collect()
    );
    
    const allMessages = await Promise.all(messagesPromises);
    return allMessages.flat();
  }, []);

  const calculateDailyStats = useCallback((conversations: any[]) => {
    const dailyStats = initializeDailyStats();
    
    conversations.forEach(conv => {
      const date = new Date(conv.createdAt).toISOString().split('T')[0];
      if (dailyStats.has(date)) {
        const stats = dailyStats.get(date)!;
        stats.total += 1;
        stats.new += 1;
      }
    });

    return Array.from(dailyStats.values());
  }, []);

  const calculateMessagesPerSession = useCallback((conversations: any[], messages: any[]) => {
    return conversations.map(conv => ({
      date: new Date(conv.createdAt).toISOString().split('T')[0],
      messages: messages.filter(msg => msg.conversationId === conv.id).length
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const recentConversations = await processConversations();
        const messages = await processMessages(recentConversations);
        const dailyStats = calculateDailyStats(recentConversations);
        const messagesPerSession = calculateMessagesPerSession(recentConversations, messages);

        setData({
          totalUsers: recentConversations.length,
          newUsers: recentConversations.length,
          returningUsers: 0,
          userGraph: dailyStats,
          botMessages: messages.filter(msg => msg.direction === 'outgoing').length,
          userMessages: messages.filter(msg => msg.direction === 'incoming').length,
          sessions: recentConversations.length,
          messagesPerSession
        });

      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [processConversations, processMessages, calculateDailyStats, calculateMessagesPerSession]);

  return { data, loading, error };
};