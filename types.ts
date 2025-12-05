export type SessionType = 'SESSION_1' | 'SESSION_2' | 'SESSION_3' | 'SESSION_4' | 'BREAK' | 'LUNCH';

export interface ScheduleBlock {
  id: string;
  title: string;
  durationMinutes: number;
  startTimeLabel: string; // Display string "09:00"
  type: SessionType;
}

export interface ThemeColors {
  primary: string;
  bg: string;
  text: string;
}