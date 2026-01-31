import { useState } from 'react';
import { apiClient } from '../api/client';
import type { User, UserRole, Profile } from '../api/types';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientForm, setClientForm] = useState({ name: '', email: '' });
  const [driverForm, setDriverForm] = useState({ name: '', email: '' });

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

  const registerWithRole = async (role: UserRole, name: string, email: string) => {
    const user = await apiClient.post<User>('/users/register', { name, email, role });
    await apiClient.post<Profile>('/profiles', { userId: user.id, role });
    return user;
  };

  const registerClient = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await registerWithRole('client', clientForm.name, clientForm.email);
      setClientForm({ name: '', email: '' });
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const registerDriver = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await registerWithRole('driver', driverForm.name, driverForm.email);
      setDriverForm({ name: '', email: '' });
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
          <h3>Registrar cliente</h3>
          <form onSubmit={registerClient}>
            <label className="field">
              Nombre
              <input
                value={clientForm.name}
                onChange={(event) => setClientForm({ ...clientForm, name: event.target.value })}
                placeholder="Nombre completo"
                required
              />
            </label>
            <label className="field">
              Email
              <input
                type="email"
                value={clientForm.email}
                onChange={(event) => setClientForm({ ...clientForm, email: event.target.value })}
                placeholder="correo@dominio.com"
                required
              />
            </label>
            <button className="btn" type="submit">
              Registrar cliente
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Registrar conductor</h3>
          <form onSubmit={registerDriver}>
            <label className="field">
              Nombre
              <input
                value={driverForm.name}
                onChange={(event) => setDriverForm({ ...driverForm, name: event.target.value })}
                placeholder="Nombre completo"
                required
              />
            </label>
            <label className="field">
              Email
              <input
                type="email"
                value={driverForm.email}
                onChange={(event) => setDriverForm({ ...driverForm, email: event.target.value })}
                placeholder="correo@dominio.com"
                required
              />
            </label>
            <button className="btn" type="submit">
              Registrar conductor
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
