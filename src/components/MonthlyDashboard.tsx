import type { Habit } from '../types';
import { CircularProgress } from './CircularProgress';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, Flame, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MonthlyDashboardProps {
  initialHabits: Habit[];
}

export const MonthlyDashboard = ({ initialHabits }: MonthlyDashboardProps) => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  const now = new Date();
  const today = now.getDate();
  const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const getDayName = (dayOfMonth: number) =>
    DAY_NAMES[new Date(now.getFullYear(), now.getMonth(), dayOfMonth).getDay()];

  // Calculate dynamic metrics
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedDays.includes(today)).length;
  const dailyProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const daysPassedThisMonth = today;
  const totalPossibleChecks = totalHabits * daysPassedThisMonth;
  const totalActualChecks = habits.reduce((acc, h) => acc + h.completedDays.filter(d => d <= today).length, 0);
  const monthlyProgress = totalPossibleChecks > 0 ? Math.round((totalActualChecks / totalPossibleChecks) * 100) : 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => today - (6 - i)).filter(d => d > 0);
  const weeklyChecks = habits.reduce((acc, h) => acc + h.completedDays.filter(d => last7Days.includes(d)).length, 0);
  const weeklyProgress = totalHabits > 0 ? Math.round((weeklyChecks / (totalHabits * last7Days.length)) * 100) : 0;

  const continuity = totalHabits > 0 ? Math.min(100, Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / totalHabits * 10)) : 0;

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = today - (6 - i);
    if (day <= 0) return { day: '', progress: 0 };
    const completedCount = habits.filter(h => h.completedDays.includes(day)).length;
    return {
      day: getDayName(day),
      progress: totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0,
    };
  });

  const toggleDay = (habitId: string, day: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isCurrentlyCompleted = h.completedDays.includes(day);
        const completedDays = isCurrentlyCompleted
          ? h.completedDays.filter(d => d !== day)
          : [...h.completedDays, day];
        
        // Simple streak calculation for the demo
        let newStreak = h.streak;
        if (!isCurrentlyCompleted) newStreak++;
        else if (newStreak > 0) newStreak--;

        return { ...h, completedDays, streak: newStreak };
      }
      return h;
    }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section>
        <h3 className="mobile-card-title">Momentum</h3>
        <div className="momentum-grid">
          <CircularProgress value={continuity} label="Süreklilik" color="var(--accent-blue)" size={80} />
          <CircularProgress value={dailyProgress} label="Günlük" color="var(--accent-green)" size={80} />
          <CircularProgress value={weeklyProgress} label="Haftalık" color="var(--accent-yellow)" size={80} />
          <CircularProgress value={monthlyProgress} label="Aylık" color="var(--accent-purple)" size={80} />
        </div>
      </section>

      <div className="mobile-card">
        <h3 className="mobile-card-title">Haftalık Performans</h3>
        <div style={{ height: '150px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <Line type="monotone" dataKey="progress" stroke="var(--accent-green)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-green)' }} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="var(--text-dim)" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }}
                itemStyle={{ color: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 className="mobile-card-title" style={{ margin: 0 }}>Bugünkü Hedefler</h3>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}
          >
            {showHistory ? 'Günü Göster' : 'Tüm Ay'} <ChevronRight size={14} />
          </button>
        </div>

        {!showHistory ? (
          <div className="habit-list">
            {habits.map(habit => {
              const checked = habit.completedDays.includes(today);
              return (
                <div key={habit.id} className="habit-list-item" onClick={() => toggleDay(habit.id, today)}>
                  <div className={`habit-checkbox ${checked ? 'checked' : ''}`} style={checked ? { background: habit.color } : {}}>
                    {checked && <Check size={18} color="white" />}
                  </div>
                  <div className="habit-info">
                    <div className="habit-name">{habit.name}</div>
                    <div className="habit-streak-badge">
                      <Flame size={10} style={{ display: 'inline', marginRight: '4px' }} />
                      {habit.streak} Günlük Seri
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mobile-card history-table-container">
            <h3 className="mobile-card-title">{now.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })} Geçmişi</h3>
            <table className="habit-table">
              <thead>
                <tr>
                  <th className="habit-row-name" style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>ALIŞKANLIK</th>
                  {Array.from({ length: 31 }, (_, i) => (
                    <th key={i} className="day-header">{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map(habit => (
                  <tr key={habit.id}>
                    <td className="habit-row-name" style={{ fontSize: '0.7rem', minWidth: '100px' }}>{habit.name}</td>
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = i + 1;
                      const isCompleted = habit.completedDays.includes(day);
                      return (
                        <td key={i}>
                          <div 
                            className={`day-cell ${isCompleted ? 'completed' : ''}`}
                            style={{ 
                              width: '20px', 
                              height: '20px', 
                              backgroundColor: isCompleted ? habit.color : 'rgba(255,255,255,0.03)' 
                            }}
                            onClick={() => toggleDay(habit.id, day)}
                          >
                            {isCompleted && <Check size={8} />}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
