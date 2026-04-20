import { useState, useEffect, useRef } from 'react';
import './App.css';
import { MonthlyDashboard } from './components/MonthlyDashboard';
import { YearlyDashboard } from './components/YearlyDashboard';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HabitSelectionScreen } from './components/HabitSelectionScreen';
import { LayoutDashboard, Calendar, Trophy, User, Plus } from 'lucide-react';
import type { Habit } from './types';
import { AddHabitModal } from './components/AddHabitModal';
import { ProfileMenu } from './components/ProfileMenu';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'intro' | 'habits' | 'dashboard'>('intro');
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly' | 'leaderboard'>('monthly');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState('Kullanıcı');
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const currentUid = useRef<string | null>(null);
  const habitsLoaded = useRef(false);

  // Firebase oturumunu dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUid.current = user.uid;
        setUserId(user.uid);
        setUserName(user.displayName || user.email || 'Kullanıcı');

        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.habits && data.habits.length > 0) {
            setUserHabits(data.habits);
            setStep('dashboard');
          } else {
            setStep('intro');
          }
        } else {
          setStep('intro');
        }

        habitsLoaded.current = true;
        setIsAuthenticated(true);
      } else {
        currentUid.current = null;
        setUserId(undefined);
        habitsLoaded.current = false;
        setIsAuthenticated(false);
        setStep('intro');
        setUserHabits([]);
      }
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  // Bildirim kontrolü: saat 20:00+ ve tamamlanmamış alışkanlık varsa hatırlat
  useEffect(() => {
    if (!isAuthenticated || userHabits.length === 0) return;
    const notifEnabled = localStorage.getItem('flowbit_notif') === 'true';
    if (!notifEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const alreadyShown = localStorage.getItem('flowbit_notif_shown') === todayStr;
    if (alreadyShown) return;

    const hours = now.getHours();
    if (hours >= 20) {
      const today = now.getDate();
      const remaining = userHabits.filter(h => !h.completedDays.includes(today)).length;
      if (remaining > 0) {
        new Notification('Flowbit 🌱', {
          body: `${remaining} alışkanlığın henüz tamamlanmadı. Hedeflerine devam et!`,
          icon: '/favicon.svg',
        });
        localStorage.setItem('flowbit_notif_shown', todayStr);
      }
    }
  }, [isAuthenticated, userHabits]);

  const saveHabits = async (habits: Habit[]) => {
    if (!currentUid.current || !habitsLoaded.current) return;
    const score = habits.reduce((s, h) => s + h.completedDays.length * 10 + h.streak * 5, 0);
    const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    await setDoc(doc(db, 'users', currentUid.current), { habits, score, streak: maxStreak }, { merge: true });
  };

  const handleLogin = (_uid: string, name: string) => {
    setUserName(name);
  };

  const handleHabitSelection = async (selected: Habit[]) => {
    habitsLoaded.current = true;
    setUserHabits(selected);
    setStep('dashboard');
    await saveHabits(selected);
  };

  const handleHabitsChange = (updated: Habit[]) => {
    setUserHabits(updated);
    saveHabits(updated);
  };

  const handleAddHabit = (habit: Habit) => {
    const updated = [...userHabits, habit];
    setUserHabits(updated);
    saveHabits(updated);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowProfileMenu(false);
  };

  if (!authChecked) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>Yükleniyor...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginScreen
        onLogin={handleLogin}
        onNavigateToRegister={() => setAuthView('register')}
      />
    ) : (
      <RegisterScreen
        onRegister={handleLogin}
        onNavigateToLogin={() => setAuthView('login')}
      />
    );
  }

  if (step === 'intro') {
    return <OnboardingScreen onNext={() => setStep('habits')} />;
  }

  if (step === 'habits') {
    return <HabitSelectionScreen onComplete={handleHabitSelection} />;
  }

  return (
    <>
      <div className="app-container animate-fade-in">
        <header className="app-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src="/src/assets/flowbit-logo.png"
                alt="Flowbit"
                style={{ width: 32, height: 32, objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Flowbit
              </span>
            </div>
            <div className="profile-avatar" onClick={() => setShowProfileMenu(true)} style={{ cursor: 'pointer' }}>
              <User size={22} color="white" />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Hoş Geldin! 👋</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', fontWeight: 500 }}>Bugün neler yapacaksın?</p>
          </div>
        </header>

        <main style={{ paddingBottom: '100px' }}>
          {activeTab === 'monthly' && (
            <MonthlyDashboard
              initialHabits={userHabits}
              onHabitsChange={handleHabitsChange}
            />
          )}
          {activeTab === 'yearly' && <YearlyDashboard habits={userHabits} />}
          {activeTab === 'leaderboard' && (
            <LeaderboardScreen
              habits={userHabits}
              userName={userName}
              currentUserId={userId}
            />
          )}
        </main>
      </div>

      {showProfileMenu && (
        <ProfileMenu
          onClose={() => setShowProfileMenu(false)}
          onLogout={handleLogout}
        />
      )}

      {showAddModal && (
        <AddHabitModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddHabit}
        />
      )}

      <button className="fab-button" onClick={() => setShowAddModal(true)}>
        <Plus size={32} />
      </button>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          <LayoutDashboard size={24} />
          <span>Dashboard</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy size={24} />
          <span>Sıralama</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'yearly' ? 'active' : ''}`}
          onClick={() => setActiveTab('yearly')}
        >
          <Calendar size={24} />
          <span>İstatistik</span>
        </button>
        <button className="nav-item" onClick={() => setShowProfileMenu(true)}>
          <User size={24} />
          <span>Profil</span>
        </button>
      </nav>
    </>
  );
}

export default App;
