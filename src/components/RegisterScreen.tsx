import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface RegisterScreenProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen = ({ onRegister, onNavigateToLogin }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister();
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-header">
        <div className="auth-logo">
          <div className="logo-icon">🌱</div>
        </div>
        <h1>Yeni Hesap Oluştur</h1>
        <p>Hayatını alışkanlıklarla şekillendir.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Ad Soyad</label>
          <div className="input-wrapper">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Adınız Soyadınız" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>E-posta</label>
          <div className="input-wrapper">
            <Mail size={20} className="input-icon" />
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Şifre</label>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="En az 8 karakter" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="terms-text" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
          Kayıt olarak <span className="text-button small">Kullanım Koşulları</span>'nı ve <span className="text-button small">Gizlilik Politikası</span>'nı kabul etmiş sayılırsınız.
        </div>

        <button type="submit" className="primary-button full-width">
          Hesap Oluştur <ArrowRight size={20} />
        </button>
      </form>

      <div className="auth-footer">
        Zaten hesabın var mı? <button className="text-button" onClick={onNavigateToLogin}>Giriş Yap</button>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} /> Güvenli Kayıt İşlemi
        </div>
      </div>
    </div>
  );
};
