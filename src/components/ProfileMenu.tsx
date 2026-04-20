import { useState, useRef, useEffect } from 'react';
import { X, Camera, User, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';

interface Props {
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileMenu = ({ onClose, onLogout }: Props) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('Kullanıcı');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem('flowbit_notif') === 'true');
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const saveName = () => {
    if (tempName.trim()) setName(tempName.trim());
    setEditingName(false);
  };

  const toggleNotifications = async () => {
    if (!('Notification' in window)) return;

    if (!notifEnabled) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission === 'granted') {
        setNotifEnabled(true);
        localStorage.setItem('flowbit_notif', 'true');
        new Notification('Flowbit 🌱', {
          body: 'Bildirimler açıldı! Her gün saat 20:00\'de hatırlatacağım.',
          icon: '/favicon.svg',
        });
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem('flowbit_notif', 'false');
    }
  };

  const notifBlocked = notifPermission === 'denied';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 600,
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          paddingBottom: 'env(safe-area-inset-bottom, 24px)',
          border: '1px solid var(--border)',
          animation: 'slideUp 0.3s ease',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 0' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Profil</span>
          <button
            onClick={onClose}
            style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Avatar + Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: avatar ? 'transparent' : 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
              border: '3px solid rgba(255,255,255,0.1)',
            }}>
              {avatar
                ? <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={36} color="white" />}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--accent-blue)', border: '2px solid var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Camera size={13} color="white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>

          {editingName ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                autoFocus
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                style={{
                  background: 'var(--surface-alt)', border: '1px solid var(--accent-blue)',
                  borderRadius: 10, padding: '8px 14px', color: 'white',
                  fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit', outline: 'none', textAlign: 'center',
                }}
              />
              <button onClick={saveName} style={{ background: 'var(--accent-blue)', border: 'none', borderRadius: 8, padding: '8px 14px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Kaydet</button>
            </div>
          ) : (
            <button
              onClick={() => { setTempName(name); setEditingName(true); }}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {name}
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 600 }}>düzenle</span>
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {/* Notifications toggle */}
          <button
            onClick={notifBlocked ? undefined : toggleNotifications}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 20px', background: 'none', border: 'none',
              borderBottom: '1px solid var(--border)',
              cursor: notifBlocked ? 'not-allowed' : 'pointer',
              color: 'var(--text-main)', textAlign: 'left',
              opacity: notifBlocked ? 0.5 : 1,
            }}
          >
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-yellow)' }}>
              <Bell size={18} />
            </span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem' }}>
              Bildirimler
              {notifBlocked && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: 'var(--text-dim)' }}>(tarayıcıda engellendi)</span>}
            </span>
            <div style={{
              width: 44, height: 24, borderRadius: 12,
              background: notifEnabled ? 'var(--accent-green)' : 'var(--surface-alt)',
              border: '1px solid var(--border)',
              position: 'relative', transition: 'background 0.2s ease',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 2,
                left: notifEnabled ? 22 : 3,
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </div>
          </button>

          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px', background: 'none', border: 'none',
            borderBottom: '1px solid var(--border)', cursor: 'pointer',
            color: 'var(--text-main)', textAlign: 'left',
          }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
              <Shield size={18} />
            </span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem' }}>Gizlilik & Güvenlik</span>
            <ChevronRight size={16} color="var(--text-dim)" />
          </button>

          <button
            onClick={onLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 20px', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--accent-red)', textAlign: 'left',
            }}
          >
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={18} />
            </span>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
