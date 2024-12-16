export const formatDate = (dateStr: string) => {
  return dateStr; // Die Daten kommen bereits im richtigen Format (DD.MM)
};

export const sortDataByDate = (data: any[]) => {
  return [...data].sort((a, b) => {
    const [dayA, monthA] = a.date.split('.');
    const [dayB, monthB] = b.date.split('.');
    
    // Vergleiche zuerst den Monat, dann den Tag
    if (monthA !== monthB) {
      return parseInt(monthA) - parseInt(monthB);
    }
    return parseInt(dayA) - parseInt(dayB);
  });
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