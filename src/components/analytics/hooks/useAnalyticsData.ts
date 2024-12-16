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

interface AnalyticsRecord {
  newUsers: number;
  returningUsers: number;
  botMessages: number;
  userMessages: number;
  sessions: number;
  startDateTimeUtc: string;
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
        const records: AnalyticsRecord[] = result.analytics.records;
        
        // Erstelle ein Map für schnellen Zugriff auf die Daten nach Datum
        const dataByDate = new Map();
        records.forEach(record => {
          // Extrahiere nur das Datum aus dem ISO String (ignoriere die Zeit)
          const [dateStr] = record.startDateTimeUtc.split('T');
          const [year, month, day] = dateStr.split('-');
          
          // Formatiere als DD.MM
          const formattedDate = `${day}.${month}`;
          
          const data = {
            total: record.newUsers + record.returningUsers,
            new: record.newUsers,
            returning: record.returningUsers
          };
          
          dataByDate.set(formattedDate, data);
        });

        // Erstelle ein Array mit allen Daten der letzten 30 Tage
        const today = new Date();
        const last30Days = Array.from({length: 30}, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          return `${day}.${month}`;
        }).reverse();

        // Erstelle das userGraph Array mit allen Tagen
        const userGraphData = last30Days.map(dateStr => {
          const data = dataByDate.get(dateStr) || { total: 0, new: 0, returning: 0 };
          return {
            date: dateStr,
            ...data
          };
        });

        const processedData: AnalyticsData = {
          totalUsers: records.reduce((sum: number, record: AnalyticsRecord) => 
            sum + record.newUsers + record.returningUsers, 0),
          newUsers: records.reduce((sum: number, record: AnalyticsRecord) => 
            sum + record.newUsers, 0),
          returningUsers: records.reduce((sum: number, record: AnalyticsRecord) => 
            sum + record.returningUsers, 0),
          userGraph: userGraphData,
          botMessages: records.reduce((sum: number, record: AnalyticsRecord) => 
            sum + record.botMessages, 0),
          userMessages: records.reduce((sum: number, record: AnalyticsRecord) => 
            sum + record.userMessages, 0),
          sessions: records.reduce((sum: number, record: AnalyticsRecord) => 
            sum + record.sessions, 0),
          messagesPerSession: records.map((record: AnalyticsRecord) => ({
            date: `${new Date(record.startDateTimeUtc).getUTCDate().toString().padStart(2, '0')}.${(new Date(record.startDateTimeUtc).getUTCMonth() + 1).toString().padStart(2, '0')}`,
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