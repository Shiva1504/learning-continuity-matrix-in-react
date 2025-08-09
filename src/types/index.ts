export interface EngagementEntry {
  date: string; // ISO 8601 format (YYYY-MM-DD)
  isCompleted: boolean;
}

export interface PeerEntry {
  id: number;
  displayName: string;
  continuityCount: number;
}

export interface EngagementWeek {
  startDate: Date;
  days: {
    date: Date;
    isCompleted: boolean;
    isToday: boolean;
  }[];
}

export interface MotivationMessage {
  title: string;
  description: string;
  emoji: string;
}
