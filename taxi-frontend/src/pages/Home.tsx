import { Link } from 'react-router-dom';
import { useState } from 'react';
import { apiClient, authToken } from '../api/client';

const cards = [
  {
    title: 'Usuarios',
    description: 'Registrar y listar usuarios del sistema.',
    to: '/usuarios',
  },
  {
    title: 'Conductores',
    description: 'Registrar conductores disponibles para viajes.',
    to: '/conductores',
  },
  {
    title: 'Viajes',
    description: 'Solicitar viajes y verificar asignaciones.',
    to: '/viajes',
  },
];

export function Home() {
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [token, setToken] = useState<string | null>(authToken.get());
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const result = await apiClient.post<{ accessToken: string }>('/auth/login', authForm);
      authToken.set(result.accessToken);
      setToken(result.accessToken);
      setAuthForm({ email: '', password: '' });
    } catch (err) {
      setAuthError((err as Error).message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authToken.clear();
    setToken(null);
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Panel de pruebas</h1>
          <p>Flujo local para validar casos de uso sin APIs externas.</p>
        </div>
      </div>
      <div className="grid-2">
        <form className="panel" onSubmit={handleLogin}>
          <h3>Login</h3>
          <label className="field">
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              placeholder="correo@dominio.com"
              required
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm({ ...authForm, password: event.target.value })
              }
              placeholder="********"
              required
            />
          </label>
          <div className="stack">
            <button className="btn" type="submit" disabled={authLoading}>
              {authLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
            {token && (
              <button className="btn secondary" type="button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            )}
          </div>
          {token && (
            <p className="muted">Token activo: {token.slice(0, 16)}...</p>
          )}
          {authError && <p className="error-text">{authError}</p>}
        </form>

        <div className="panel">
          <h3>Estado de sesión</h3>
          <p>
            {token
              ? 'Autenticado. Los endpoints protegidos están habilitados.'
              : 'Sin sesión. Inicia sesión para usar endpoints protegidos.'}
          </p>
        </div>
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <span>Ir</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
