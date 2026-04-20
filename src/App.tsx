import { useState } from 'react';
import './App.css';
import { MonthlyDashboard } from './components/MonthlyDashboard';
import { YearlyDashboard } from './components/YearlyDashboard';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HabitSelectionScreen } from './components/HabitSelectionScreen';
import { LayoutDashboard, Calendar, Search, User, Plus } from 'lucide-react';
import type { Habit } from './types';
import { AddHabitModal } from './components/AddHabitModal';
import { ProfileMenu } from './components/ProfileMenu';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'intro' | 'habits' | 'dashboard'>('intro');
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogin = () => {
    console.log('Login triggered');
    setIsAuthenticated(true);
  };

  const handleHabitSelection = (selected: Habit[]) => {
    console.log('Habits selected:', selected);
    setUserHabits(selected);
    setStep('dashboard');
  };

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
          {/* Top bar: logo + profil */}
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

          {/* Greeting */}
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Hoş Geldin! 👋</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', fontWeight: 500 }}>Bugün neler yapacaksın?</p>
          </div>
        </header>

        <main style={{ paddingBottom: '100px' }}>
          {activeTab === 'monthly' ? (
            <MonthlyDashboard initialHabits={userHabits} />
          ) : (
            <YearlyDashboard habits={userHabits} />
          )}
        </main>
      </div>

      {showProfileMenu && (
        <ProfileMenu
          onClose={() => setShowProfileMenu(false)}
          onLogout={() => { setShowProfileMenu(false); setIsAuthenticated(false); }}
        />
      )}

      {showAddModal && (
        <AddHabitModal
          onClose={() => setShowAddModal(false)}
          onAdd={(habit) => setUserHabits(prev => [...prev, habit])}
        />
      )}

      {/* Floating Action Button */}
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
        <button className="nav-item">
          <Search size={24} />
          <span>Keşfet</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'yearly' ? 'active' : ''}`}
          onClick={() => setActiveTab('yearly')}
        >
          <Calendar size={24} />
          <span>İstatistik</span>
        </button>
        <button className="nav-item">
          <User size={24} />
          <span>Profil</span>
        </button>
      </nav>
    </>
  );
}

export default App;
