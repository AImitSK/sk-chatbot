'use client';

import { useState, useEffect } from 'react';
import { Client } from '@botpress/client';

let botpressClient: Client | null = null;

if (typeof window !== 'undefined') {
  botpressClient = new Client({
    token: process.env.NEXT_PUBLIC_BOTPRESS_TOKEN ?? '',
    workspaceId: process.env.NEXT_PUBLIC_BOTPRESS_WORKSPACE_ID ?? '',
    botId: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID ?? '',
  });
}

interface AnalyticsData {
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  userGraph: {
    date: string;
    total: number;
    new: number;
    returning: number;
  }[];
  botMessages: number;
  userMessages: number;
  sessions: number;
  messagesPerSession: {
    date: string;
    messages: number;
  }[];
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  direction: 'incoming' | 'outgoing';
  conversationId: string;
}

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheKey = 'analytics_data';
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const fetchData = async () => {
      if (!botpressClient) {
        setError('Botpress Client ist nicht initialisiert');
        setLoading(false);
        return;
      }

      // Check cache first
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { data: storedData, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < cacheExpiry) {
          setData(storedData);
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        
        // Get last 30 days timestamp
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch conversations
        const conversations = await botpressClient.list.conversations({
          sortField: 'updatedAt',
          sortDirection: 'desc'
        }).collect();

        // Filter conversations on client side
        const filteredConversations = conversations.filter(conv => 
          new Date(conv.updatedAt) >= thirtyDaysAgo
        );

        // Batch fetch messages for all conversations
        const batchSize = 10;
        const allMessages: Message[] = [];
        for (let i = 0; i < filteredConversations.length; i += batchSize) {
          const batch = filteredConversations.slice(i, i + batchSize);
          const batchPromises = batch.map(conv =>
            botpressClient!.list.messages({
              conversationId: conv.id
            }).collect()
          );
          const batchMessages = await Promise.all(batchPromises);
          const mappedMessages = batchMessages.flat().map(msg => ({
            id: msg.id,
            content: msg.payload.text || JSON.stringify(msg.payload),
            timestamp: new Date(msg.createdAt),
            direction: msg.direction,
            conversationId: msg.conversationId
          }));
          allMessages.push(...mappedMessages);
        }

        // Initialize daily stats with Map for O(1) lookup
        const dailyStats = new Map();
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          dailyStats.set(dateString, {
            date: dateString,
            total: 0,
            new: 0,
            returning: 0
          });
        }

        // Process conversations in a single pass
        const userSessions = new Set();
        filteredConversations.forEach(conv => {
          const date = new Date(conv.createdAt).toISOString().split('T')[0];
          if (dailyStats.has(date)) {
            const stats = dailyStats.get(date);
            stats.total += 1;
            if (!userSessions.has(conv.id)) {
              stats.new += 1;
              userSessions.add(conv.id);
            } else {
              stats.returning += 1;
            }
          }
        });

        const sortedStats = Array.from(dailyStats.values())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const analyticsData = {
          totalUsers: filteredConversations.length,
          newUsers: userSessions.size,
          returningUsers: filteredConversations.length - userSessions.size,
          userGraph: sortedStats,
          botMessages: allMessages.filter(msg => msg.direction === 'outgoing').length,
          userMessages: allMessages.filter(msg => msg.direction === 'incoming').length,
          sessions: filteredConversations.length,
          messagesPerSession: filteredConversations.map(conv => ({
            date: new Date(conv.createdAt).toISOString().split('T')[0],
            messages: allMessages.filter(msg => msg.conversationId === conv.id).length
          }))
        };

        // Cache the data
        localStorage.setItem(cacheKey, JSON.stringify({
          data: analyticsData,
          timestamp: Date.now()
        }));

        setData(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};