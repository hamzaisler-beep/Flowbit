import type { Habit } from '../types';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  isCurrentUser?: boolean;
}

const MOCK_USERS: Omit<LeaderboardUser, 'isCurrentUser'>[] = [];

const RANK_COLORS = ['#f59e0b', '#94a3b8', '#b45309'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

function calcScore(habits: Habit[]): number {
  return habits.reduce((sum, h) => sum + h.completedDays.length * 10 + h.streak * 5, 0);
}

interface Props {
  habits: Habit[];
  userName?: string;
}

export const LeaderboardScreen = ({ habits, userName = 'Sen' }: Props) => {
  const userScore = calcScore(habits);
  const userStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const allUsers: LeaderboardUser[] = [
    ...MOCK_USERS,
    { id: 'current', name: userName, avatar: '⭐', score: userScore, streak: userStreak, isCurrentUser: true },
  ].sort((a, b) => b.score - a.score);

  const top3 = allUsers.slice(0, 3);
  const rest = allUsers.slice(3);
  const userRank = allUsers.findIndex(u => u.isCurrentUser) + 1;

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '8px 0 28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Haftalık Sıralama</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: 4 }}>
          Bu haftaki en iyi alışkanlık takipçileri
        </p>
      </div>

      {/* Podium */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
        {podiumOrder.map((user, i) => {
          if (!user) return null;
          const rank = allUsers.indexOf(user) + 1;
          const heights = [100, 130, 85]; // 2nd, 1st, 3rd
          const h = heights[i];
          return (
            <div key={user.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
              {rank <= 3 && <span style={{ fontSize: '1.4rem' }}>{RANK_LABELS[rank - 1]}</span>}
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: user.isCurrentUser ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'var(--surface-alt)',
                border: `2px solid ${RANK_COLORS[rank - 1]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: `0 4px 16px ${RANK_COLORS[rank - 1]}44`,
              }}>{user.avatar}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 70 }}>{user.name}</span>
              <div style={{
                width: '100%', height: h,
                background: `linear-gradient(180deg, ${RANK_COLORS[rank - 1]}33, ${RANK_COLORS[rank - 1]}11)`,
                borderRadius: '12px 12px 0 0',
                border: `1px solid ${RANK_COLORS[rank - 1]}44`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: RANK_COLORS[rank - 1] }}>{user.score}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600 }}>puan</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your rank badge if not in top 3 */}
      {userRank > 3 && (
        <div style={{
          margin: '0 0 20px',
          padding: '14px 18px',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(37,99,235,0.1))',
          border: '1px solid rgba(14,165,233,0.3)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-blue)', minWidth: 28 }}>#{userRank}</span>
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Senin Sıralaман</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{userScore} puan · {userStreak} gün seri</div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
            +{allUsers[userRank - 2]?.score - userScore} puan<br />
            <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>üste geç</span>
          </div>
        </div>
      )}

      {/* Rest of list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rest.map((user) => {
          const rank = allUsers.indexOf(user) + 1;
          return (
            <div key={user.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              background: user.isCurrentUser ? 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(37,99,235,0.08))' : 'var(--surface)',
              border: user.isCurrentUser ? '1px solid rgba(14,165,233,0.3)' : '1px solid var(--border)',
              borderRadius: 14,
            }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dim)', minWidth: 24, textAlign: 'center' }}>{rank}</span>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: user.isCurrentUser ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'var(--surface-alt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                border: '1px solid var(--border)',
              }}>{user.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: user.isCurrentUser ? 'var(--accent-blue)' : 'var(--text-main)' }}>
                  {user.name} {user.isCurrentUser && <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>(sen)</span>}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{user.streak} gün seri</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-muted)' }}>{user.score} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>puan</span></span>
            </div>
          );
        })}
      </div>

      {/* Score info */}
      <div style={{ marginTop: 24, padding: '14px 16px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.6 }}>
          Puan hesaplama: her tamamlanan gün <strong style={{ color: 'var(--text-muted)' }}>×10</strong> · her seri günü <strong style={{ color: 'var(--text-muted)' }}>×5</strong>
        </p>
      </div>
    </div>
  );
};
