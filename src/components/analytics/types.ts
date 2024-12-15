export interface AnalyticsData {
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  userGraph: UserGraphData[];
  botMessages: number;
  userMessages: number;
  sessions: number;
  messagesPerSession: MessageData[];
}

export interface UserGraphData {
  date: string;
  total: number;
  new: number;
  returning: number;
}

export interface MessageData {
  date: string;
  messages: number;
}

export interface AnalyticsCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export interface LastMonthUsersProps {
  totalUsers: number;
}

export interface UsersGraphProps {
  data: UserGraphData[];
}

export interface LastMonthUserTypesProps {
  newUsers: number;
  returningUsers: number;
}

export interface MessagesPerSessionProps {
  data: MessageData[];
}

export interface LastMonthSessionsProps {
  botMessages: number;
  userMessages: number;
  sessions: number;
}

export interface MessagesBarChartProps {
  data: MessageData[];
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
  valueKey?: string;
  colorKey?: string;
}