export interface Habit {
  id: string;
  name: string;
  target: number;
  completedDays: number[]; // Array of day numbers (1-31)
  color: string;
  streak: number;
}

export interface MonthlyStats {
  month: string;
  continuity: number;
  dailyProgress: number;
  weeklyProgress: number;
  monthlyProgress: number;
}

export interface YearlyStats {
  year: number;
  months: {
    name: string;
    completed: number;
    target: number;
  }[];
}
