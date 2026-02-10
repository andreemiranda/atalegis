
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Fix: the signIn function from useAuth does not accept any arguments.
      signIn();
      navigate('/');
      setLoading(false);
    }, 500);
  };

  const handleQuickAccess = () => {
    setLoading(true);
    setTimeout(() => {
      // Fix: the signIn function from useAuth does not accept any arguments.
      signIn();
      navigate('/');
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="card max-w-md w-full animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Legislativo IA</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Gerador Inteligente de Atas</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">E-mail</label>
            <input
              type="email"
              className="input-field"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Senha</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Aguarde...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4">
          <button 
            onClick={handleQuickAccess}
            disabled={loading}
            className="w-full bg-gray-50 border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            Acesso Rápido (Demo Admin)
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Crie agora</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
