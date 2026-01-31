import { useState } from 'react';
import { apiClient } from '../api/client';
import type { Trip } from '../api/types';

export function TripsPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Trip | null>(null);
  const [form, setForm] = useState({
    clientId: '',
    origin: '',
    destination: '',
    fare: 0,
    originLat: 0,
    originLng: 0,
    destinationLat: 0,
    destinationLng: 0,
  });

  const requestTrip = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const trip = await apiClient.post<Trip>('/trips/request', form);
      setResult(trip);
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
          <h1>Viajes</h1>
          <p>Solicita un viaje y revisa la asignación automática.</p>
        </div>
      </div>

      <div className="grid-2">
        <form className="panel" onSubmit={requestTrip}>
          <h3>Solicitar viaje</h3>
          <label className="field">
            Cliente ID
            <input
              value={form.clientId}
              onChange={(event) => setForm({ ...form, clientId: event.target.value })}
              placeholder="UUID del cliente"
              required
            />
          </label>
          <label className="field">
            Origen
            <input
              value={form.origin}
              onChange={(event) => setForm({ ...form, origin: event.target.value })}
              placeholder="Dirección origen"
              required
            />
          </label>
          <label className="field">
            Destino
            <input
              value={form.destination}
              onChange={(event) => setForm({ ...form, destination: event.target.value })}
              placeholder="Dirección destino"
              required
            />
          </label>
          <label className="field">
            Tarifa
            <input
              type="number"
              step="0.1"
              value={form.fare}
              onChange={(event) => setForm({ ...form, fare: Number(event.target.value) })}
              required
            />
          </label>
          <div className="grid-2">
            <label className="field">
              Lat origen
              <input
                type="number"
                step="0.0001"
                value={form.originLat}
                onChange={(event) => setForm({ ...form, originLat: Number(event.target.value) })}
              />
            </label>
            <label className="field">
              Lng origen
              <input
                type="number"
                step="0.0001"
                value={form.originLng}
                onChange={(event) => setForm({ ...form, originLng: Number(event.target.value) })}
              />
            </label>
            <label className="field">
              Lat destino
              <input
                type="number"
                step="0.0001"
                value={form.destinationLat}
                onChange={(event) =>
                  setForm({ ...form, destinationLat: Number(event.target.value) })
                }
              />
            </label>
            <label className="field">
              Lng destino
              <input
                type="number"
                step="0.0001"
                value={form.destinationLng}
                onChange={(event) =>
                  setForm({ ...form, destinationLng: Number(event.target.value) })
                }
              />
            </label>
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Solicitar'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>

        <div className="panel">
          <h3>Resultado</h3>
          {result ? (
            <div className="result-card">
              <p><strong>ID:</strong> {result.id}</p>
              <p><strong>Estado:</strong> {result.status}</p>
              <p><strong>Conductor:</strong> {result.driverId ?? 'Sin asignar'}</p>
              <p><strong>Origen:</strong> {result.origin}</p>
              <p><strong>Destino:</strong> {result.destination}</p>
              <p><strong>Tarifa:</strong> {result.fare}</p>
            </div>
          ) : (
            <p className="muted">Envía un viaje para ver la respuesta.</p>
          )}
        </div>
      </div>
    </section>
  );
}
