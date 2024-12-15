'use client';

import { useState, useEffect } from 'react';

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

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheKey = 'analytics_data';
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Versuche zuerst, gecachte Daten zu laden
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data: cached, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < cacheExpiry) {
            setData(cached);
            setLoading(false);
            return;
          }
        }

        // Hole die Daten von unserer API-Route
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Error fetching analytics data: ' + response.statusText);
        }
        
        const result = await response.json();
        console.log('Analytics API Response:', result);

        if (!result.analytics?.records) {
          throw new Error('Invalid analytics data format');
        }

        // Verarbeite die Rohdaten
        const records = result.analytics.records;
        const processedData: AnalyticsData = {
          totalUsers: records.reduce((sum: number, record: any) => sum + record.newUsers + record.returningUsers, 0),
          newUsers: records.reduce((sum: number, record: any) => sum + record.newUsers, 0),
          returningUsers: records.reduce((sum: number, record: any) => sum + record.returningUsers, 0),
          userGraph: records.map((record: any) => ({
            date: new Date(record.startDateTimeUtc).toLocaleDateString(),
            total: record.newUsers + record.returningUsers,
            new: record.newUsers,
            returning: record.returningUsers
          })),
          botMessages: records.reduce((sum: number, record: any) => sum + record.botMessages, 0),
          userMessages: records.reduce((sum: number, record: any) => sum + record.userMessages, 0),
          sessions: records.reduce((sum: number, record: any) => sum + record.sessions, 0),
          messagesPerSession: records.map((record: any) => ({
            date: new Date(record.startDateTimeUtc).toLocaleDateString(),
            messages: record.userMessages + record.botMessages
          }))
        };

        // Cache die verarbeiteten Daten
        localStorage.setItem(cacheKey, JSON.stringify({
          data: processedData,
          timestamp: Date.now()
        }));

        setData(processedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};