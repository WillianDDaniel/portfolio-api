import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

import FullScreenLoader from '@/components/FullScreenLoader';
import WelcomePanel from '@/components/WelcomePanel';
import Input from '@/components/Input';
import ErrorAlert from '@/components/ErrorAlert';

export default function Login() {
  const { checkingAuth, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/panel', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (checkingAuth) return <FullScreenLoader />;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white md:flex-row">
      <WelcomePanel />

      <div className="flex h-full w-full flex-1 items-center justify-center p-6 md:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center md:hidden">
            <h2 className="text-2xl font-bold text-gray-900">Acesso Admin</h2>
            <p className="text-sm text-gray-500">Painel do Portfólio</p>
          </div>
          <div className="hidden md:block mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Entrar</h2>
            <p className="text-sm text-gray-500">Insira suas credenciais</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && <ErrorAlert message={error} />}

            <Input
              id="email" name="email" label="E-mail" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemplo.com" required
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 dark:text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </Input>

            <Input
              id="password" name="password" label="Senha" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 dark:text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </Input>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            >
              {loading && (
                <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Entrando...' : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
