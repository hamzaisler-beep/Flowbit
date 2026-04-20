import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, LogIn } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen = ({ onLogin, onNavigateToRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-header">
        <div className="auth-logo">
          <div className="logo-icon">✨</div>
        </div>
        <h1>Hoş Geldiniz!</h1>
        <p>Alışkanlıklarını takip etmeye devam et.</p>
      </div>

      <div className="auth-form">
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Şifre</label>
          </div>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ textAlign: 'right', marginTop: '4px' }}>
            <button type="button" className="text-button" style={{ fontSize: '0.8rem' }}>Şifremi Unuttum?</button>
          </div>
        </div>

        <button type="button" className="primary-button full-width" onClick={() => { console.log('Direct login click'); onLogin(); }}>
          Giriş Yap <ArrowRight size={20} />
        </button>
      </div>

      <div className="auth-divider">
        <span>veya</span>
      </div>

      <button className="secondary-button full-width" onClick={() => { console.log('Guest login clicked'); onLogin(); }}>
        <LogIn size={20} /> Misafir Olarak Devam Et
      </button>

      <div className="auth-footer">
        Hesabın yok mu? <button className="text-button" onClick={onNavigateToRegister}>Hemen Kayıt Ol</button>
      </div>
    </div>
  );
};
