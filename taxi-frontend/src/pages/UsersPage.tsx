import { useState } from 'react';
import { apiClient } from '../api/client';
import type { User, Profile } from '../api/types';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [roleForm, setRoleForm] = useState({ password: '' });

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get<User[]>('/users');
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const user = await apiClient.post<User>('/users/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      await apiClient.post<Profile>('/profiles', { userId: user.id, role: 'client' });
      setForm({ name: '', email: '', password: '' });
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const changeRole = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await apiClient.post<User>('/users/change-role', roleForm);
      setRoleForm({ password: '' });
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Registro rápido de clientes y conductores.</p>
        </div>
        <button type="button" className="btn" onClick={loadUsers} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Registrar usuario (cliente)</h3>
          <form onSubmit={registerUser}>
            <label className="field">
              Nombre
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Nombre completo"
                required
              />
            </label>
            <label className="field">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="correo@dominio.com"
                required
              />
            </label>
            <label className="field">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="********"
                required
              />
            </label>
            <button className="btn" type="submit">
              Registrar usuario
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Convertirme en conductor</h3>
          <form onSubmit={changeRole}>
            <label className="field">
              Password
              <input
                type="password"
                value={roleForm.password}
                onChange={(event) => setRoleForm({ password: event.target.value })}
                placeholder="Tu contraseña"
                required
              />
            </label>
            <button className="btn" type="submit">
              Cambiar a conductor
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Listado</h3>
          {users.length === 0 ? (
            <p className="muted">Sin usuarios cargados.</p>
          ) : (
            <div className="table">
              <div className="table-header">
                <span>Nombre</span>
                <span>Email</span>
                <span>Rol</span>
              </div>
              {users.map((user) => (
                <div key={user.id} className="table-row">
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                  <span>{user.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
