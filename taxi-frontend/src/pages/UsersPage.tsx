import { useState } from 'react';
import { apiClient } from '../api/client';
import type { User, UserRole } from '../api/types';

const roleOptions: UserRole[] = ['client', 'driver', 'admin'];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', role: 'client' as UserRole });

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
      await apiClient.post<User>('/users/register', form);
      setForm({ name: '', email: '', role: 'client' });
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
          <p>Registro y listado de usuarios.</p>
        </div>
        <button type="button" className="btn" onClick={loadUsers} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      <div className="grid-2">
        <form className="panel" onSubmit={registerUser}>
          <h3>Registrar usuario</h3>
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
            Rol
            <select
              value={form.role}
              onChange={(event) =>
                setForm({ ...form, role: event.target.value as UserRole })
              }
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" type="submit">
            Registrar
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>

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
    </section>
  );
}
