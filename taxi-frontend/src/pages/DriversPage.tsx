import { useState } from 'react';
import { apiClient } from '../api/client';
import type { Driver } from '../api/types';

export function DriversPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Driver | null>(null);
  const [form, setForm] = useState({
    name: '',
    rating: 4.5,
    currentLat: 0,
    currentLng: 0,
    isAvailable: true,
  });

  const registerDriver = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const driver = await apiClient.post<Driver>('/drivers', form);
      setResult(driver);
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
          <h1>Conductores</h1>
          <p>Registro rápido para pruebas de asignación.</p>
        </div>
      </div>

      <div className="grid-2">
        <form className="panel" onSubmit={registerDriver}>
          <h3>Registrar conductor</h3>
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
            Rating
            <input
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
              required
            />
          </label>
          <div className="grid-2">
            <label className="field">
              Lat
              <input
                type="number"
                step="0.0001"
                value={form.currentLat}
                onChange={(event) =>
                  setForm({ ...form, currentLat: Number(event.target.value) })
                }
                required
              />
            </label>
            <label className="field">
              Lng
              <input
                type="number"
                step="0.0001"
                value={form.currentLng}
                onChange={(event) =>
                  setForm({ ...form, currentLng: Number(event.target.value) })
                }
                required
              />
            </label>
          </div>
          <label className="field checkbox">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(event) =>
                setForm({ ...form, isAvailable: event.target.checked })
              }
            />
            Disponible
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>

        <div className="panel">
          <h3>Resultado</h3>
          {result ? (
            <div className="result-card">
              <p><strong>ID:</strong> {result.id}</p>
              <p><strong>Nombre:</strong> {result.name}</p>
              <p><strong>Rating:</strong> {result.rating}</p>
              <p><strong>Ubicación:</strong> {result.currentLat}, {result.currentLng}</p>
              <p><strong>Disponible:</strong> {result.isAvailable ? 'Sí' : 'No'}</p>
            </div>
          ) : (
            <p className="muted">Registra un conductor para ver el resultado.</p>
          )}
        </div>
      </div>
    </section>
  );
}
