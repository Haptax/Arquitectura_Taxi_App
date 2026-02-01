import { useState } from 'react';
import { apiClient, authToken, getAuthUser } from '../api/client';
import type { User } from '../api/types';

type Props = {
  onAuth: () => void;
};

export function LoginPage({ onAuth }: Props) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiClient.post<{ accessToken: string }>('/auth/login', loginForm);
      authToken.set(result.accessToken);
      onAuth();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post<User>('/users/register', registerForm);
      const result = await apiClient.post<{ accessToken: string }>('/auth/login', {
        email: registerForm.email,
        password: registerForm.password,
      });
      authToken.set(result.accessToken);
      onAuth();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const user = getAuthUser();

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>Taxi Manager</h1>
        <p>Inicia sesión para continuar.</p>

        <form onSubmit={handleLogin} className="stack">
          <label className="field">
            Email
            <input
              type="email"
              value={loginForm.email}
              onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              placeholder="correo@dominio.com"
              required
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              placeholder="********"
              required
            />
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="divider" />

        <h3>Crear cuenta</h3>
        <form onSubmit={handleRegister} className="stack">
          <label className="field">
            Nombre
            <input
              value={registerForm.name}
              onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
              placeholder="Nombre completo"
              required
            />
          </label>
          <label className="field">
            Email
            <input
              type="email"
              value={registerForm.email}
              onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
              placeholder="correo@dominio.com"
              required
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              value={registerForm.password}
              onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
              placeholder="********"
              required
            />
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Registrarme'}
          </button>
        </form>

        {user && <p className="muted">Sesión activa: {user.email}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}
