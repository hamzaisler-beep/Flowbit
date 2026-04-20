import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CircularProgress } from './CircularProgress';
import { TrendingUp, Target, Award } from 'lucide-react';
import type { Habit } from '../types';

interface YearlyDashboardProps {
  habits: Habit[];
}

export const YearlyDashboard = ({ habits }: YearlyDashboardProps) => {
  // Mock yearly data logic: using current habits completions
  const totalCompleted = habits.reduce((acc, h) => acc + h.completedDays.length, 0);
  const yearlyTarget = habits.length * 365;
  const yearlyProgress = yearlyTarget > 0 ? Math.round((totalCompleted / yearlyTarget) * 100) : 0;

  // Mock monthly data for chart
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const chartData = months.map((m, i) => {
    // Only March has data in our mock today (index 2)
    const completed = i === 2 ? totalCompleted : 0;
    const target = habits.length * 31;
    return { name: m, completed, target };
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section>
        <h3 className="mobile-card-title">Yıllık Özet (2026)</h3>
        <div className="momentum-grid">
          <CircularProgress value={yearlyProgress} label="Süreklilik" color="var(--accent-blue)" size={80} />
          <CircularProgress value={yearlyProgress} label="Yıllık" color="var(--accent-green)" size={80} />
          <CircularProgress value={0} label="Çeyrek" color="var(--accent-yellow)" size={80} />
          <CircularProgress value={totalCompleted} label="Toplam" color="var(--accent-purple)" size={80} />
        </div>
      </section>

      <div className="mobile-card">
        <h3 className="mobile-card-title">Yıllık Trend</h3>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completed > 0 ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section>
        <h3 className="mobile-card-title">Başarılarım</h3>
        <div className="mobile-card" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <TrendingUp color="var(--accent-green)" />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>En İyi Ay: {totalCompleted > 0 ? 'Mart' : '-'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>%{yearlyProgress} Tamamlama Oranı</div>
          </div>
        </div>
        <div className="mobile-card" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Target color="var(--accent-blue)" />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>Yıllık Hedef: {yearlyTarget}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Tamamlanan: {totalCompleted}</div>
          </div>
        </div>
      </section>
    </div>
  );
};
