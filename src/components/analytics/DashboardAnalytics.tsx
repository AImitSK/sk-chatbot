'use client';

import React from 'react';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import {
  LastMonthUsers,
  UsersGraph,
  LastMonthUserTypes,
  MessagesPerSession,
  LastMonthSessions,
  MessagesBarChart
} from '.';

// Loading Components
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[320px] bg-gray-200 rounded-xl"></div>
  </div>
);

const WideLoadingSkeleton = () => (
  <div className="animate-pulse col-span-2">
    <div className="h-[320px] bg-gray-200 rounded-xl"></div>
  </div>
);

const DashboardAnalytics = () => {
  const { data, loading, error } = useAnalyticsData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton />
          <WideLoadingSkeleton />
          <LoadingSkeleton />
          <WideLoadingSkeleton />
          <LoadingSkeleton />
          <WideLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Fehler beim Laden der Analytics: {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Erste Reihe */}
        <LastMonthUsers totalUsers={data.totalUsers} />
        <UsersGraph data={data.userGraph} />
        <LastMonthUserTypes 
          newUsers={data.newUsers} 
          returningUsers={data.returningUsers}
        />
        
        {/* Zweite Reihe */}
        <MessagesPerSession data={data.messagesPerSession} />
        <LastMonthSessions 
          botMessages={data.botMessages}
          userMessages={data.userMessages}
          sessions={data.sessions}
        />

        {/* Dritte Reihe */}
        <MessagesBarChart data={data.messagesPerSession} />
      </div>
    </div>
  );
};

export default DashboardAnalytics;