export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

export const sortDataByDate = <T extends { date: string }>(data: T[]): T[] => {
  return [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const calculatePercentage = (value: number, total: number): number => {
  return Math.round((value / total) * 100);
};

export const getDatesForLast30Days = (): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates.reverse();
};

export const initializeDailyStats = (): Map<string, { date: string; total: number; new: number; returning: number }> => {
  const dailyStats = new Map();
  const dates = getDatesForLast30Days();

  dates.forEach(date => {
    dailyStats.set(date, {
      date,
      total: 0,
      new: 0,
      returning: 0
    });
  });

  return dailyStats;
};