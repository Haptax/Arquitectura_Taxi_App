import { useState } from 'react';
import { apiClient } from '../api/client';
import type { Profile, UserRole } from '../api/types';

const roleOptions: UserRole[] = ['client', 'driver'];

export function ProfilesPage() {
  const [result, setResult] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ userId: '', role: 'client' as UserRole });
  const [searchId, setSearchId] = useState('');

  const createProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const profile = await apiClient.post<Profile>('/profiles', form);
      setResult(profile);
      setForm({ userId: '', role: 'client' });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    if (!searchId) return;
    setError('');
    setLoading(true);
    try {
      const profile = await apiClient.get<Profile>(`/profiles/${searchId}`);
      setResult(profile);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Perfiles</h1>
          <p>Crear y consultar perfiles por usuario.</p>
        </div>
      </div>

      <div className="grid-2">
        <form className="panel" onSubmit={createProfile}>
          <h3>Crear perfil</h3>
          <label className="field">
            User ID
            <input
              value={form.userId}
              onChange={(event) => setForm({ ...form, userId: event.target.value })}
              placeholder="UUID del usuario"
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
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear perfil'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>

        <div className="panel">
          <h3>Consultar perfil</h3>
          <label className="field">
            User ID
            <input
              value={searchId}
              onChange={(event) => setSearchId(event.target.value)}
              placeholder="UUID del usuario"
            />
          </label>
          <button className="btn" type="button" onClick={getProfile} disabled={loading}>
            {loading ? 'Buscando...' : 'Consultar'}
          </button>
          {result && (
            <div className="result-card">
              <p><strong>ID:</strong> {result.id}</p>
              <p><strong>Rol:</strong> {result.role}</p>
              <p><strong>Permisos:</strong> {result.permissions.join(', ')}</p>
            </div>
          )}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </section>
  );
}
