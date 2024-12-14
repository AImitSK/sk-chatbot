export const COLORS = {
  total: '#2563eb',    // Blau
  new: '#16a34a',      // Grün
  returning: '#f59e0b', // Orange
  bot: '#2563eb',      // Blau für Bot
  user: '#16a34a'      // Grün für User
} as const;

export const CHART_MARGINS = {
  top: 5,
  right: 10,
  left: -25,
  bottom: 0
} as const;

export const CHART_CONFIG = {
  height: 220,
  legendHeight: 36,
  fontSize: 11,
  iconSize: 8
} as const;

export const GRADIENT_STOPS = {
  start: {
    offset: '5%',
    opacity: 0.1
  },
  end: {
    offset: '95%',
    opacity: 0
  }
} as const;