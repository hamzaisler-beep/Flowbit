import type { Habit, MonthlyStats } from '../types';

export const MOCK_HABITS: Habit[] = [
  { id: '1', name: 'Sabah 6:00da uyan', target: 23, completedDays: [1,2,3,4,5,7,8,9,10,12,14,15,18,19,20,21], color: '#0ea5e9', streak: 4 },
  { id: '2', name: 'Meditasyon Yap', target: 23, completedDays: [1,2,3,4,6,7,8,9,11,12,13,14,15,16,17], color: '#10b981', streak: 16 },
  { id: '3', name: '20 dakika egzersiz yap', target: 10, completedDays: [1,3,5,8,10,12,15], color: '#f59e0b', streak: 1 },
  { id: '4', name: 'Sosyalleş', target: 15, completedDays: [2,4,6,9,11,13,15], color: '#ef4444', streak: 2 },
  { id: '5', name: '20 dakika kitap oku', target: 23, completedDays: [1,2,3,4,5,6,7,8,9,10,11,12], color: '#8b5cf6', streak: 12 },
  { id: '6', name: 'İngilizce çalış', target: 15, completedDays: [1,2,5,7,8,12,14], color: '#ec4899', streak: 0 },
  { id: '7', name: 'En az 2 litre su iç', target: 23, completedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], color: '#3b82f6', streak: 15 },
];

export const MONTHLY_STATS: MonthlyStats = {
  month: 'Mart 2026',
  continuity: 138,
  dailyProgress: 71,
  weeklyProgress: 40,
  monthlyProgress: 40,
};

export const YEARLY_DATA = {
  months: [
    { name: 'Ocak', completed: 180, target: 220 },
    { name: 'Şubat', completed: 160, target: 200 },
    { name: 'Mart', completed: 196, target: 624 },
    { name: 'Nisan', completed: 0, target: 624 },
    { name: 'Mayıs', completed: 0, target: 624 },
    { name: 'Haziran', completed: 0, target: 624 },
    { name: 'Temmuz', completed: 0, target: 624 },
    { name: 'Ağustos', completed: 0, target: 624 },
    { name: 'Eylül', completed: 0, target: 624 },
    { name: 'Ekim', completed: 0, target: 624 },
    { name: 'Kasım', completed: 0, target: 624 },
    { name: 'Aralık', completed: 0, target: 624 },
  ]
};
