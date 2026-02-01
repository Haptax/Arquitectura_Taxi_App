import { useEffect, useState } from 'react';
import { apiClient, authToken, getAuthUser } from '../api/client';
import type { Driver, Trip } from '../api/types';
import { MapPicker } from '../components/MapPicker';

export function ClientDashboard() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Trip | null>(null);
  const [roleMessage, setRoleMessage] = useState('');
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>({
    lat: 4.711,
    lng: -74.071,
  });
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>({
    lat: 4.72,
    lng: -74.08,
  });

  const getNearestDrivers = () => {
    if (!origin) return [];
    return [...drivers]
      .map((driver) => ({
        driver,
        distance: Math.hypot(
          (driver.currentLat ?? 0) - origin.lat,
          (driver.currentLng ?? 0) - origin.lng,
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  };

  const loadDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get<Driver[]>('/drivers?available=true');
      setDrivers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const requestTrip = async () => {
    const user = getAuthUser();
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const trip = await apiClient.post<Trip>('/trips/request', {
        clientId: user.sub,
        origin: 'Origen demo',
        destination: 'Destino demo',
        originLat: origin?.lat ?? 4.711,
        originLng: origin?.lng ?? -74.071,
        destinationLat: destination?.lat ?? 4.72,
        destinationLng: destination?.lng ?? -74.08,
      });
      setResult(trip);
      await loadDrivers();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async () => {
    const user = getAuthUser();
    if (!user) return;
    setLoading(true);
    setError('');
    setRoleMessage('');
    try {
      await apiClient.post<Trip>('/users/change-role', {});
      const auth = await apiClient.post<{ accessToken: string }>('/auth/login', {
        email: user.email,
        password: '123456',
      });
      authToken.set(auth.accessToken);
      setRoleMessage('Rol actualizado. Recargando...');
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Cliente</h1>
          <p>Conductores disponibles y solicitud rápida de viaje.</p>
        </div>
        <button className="btn" type="button" onClick={loadDrivers} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar conductores'}
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Conductores disponibles</h3>
          {drivers.length === 0 ? (
            <p className="muted">No hay conductores disponibles.</p>
          ) : (
            <div className="table">
              <div className="table-header">
                <span>Nombre</span>
                <span>Rating</span>
                <span>Estado</span>
              </div>
              {drivers.map((driver) => (
                <div key={driver.id} className="table-row">
                  <span>{driver.name}</span>
                  <span>{driver.rating}</span>
                  <span>{driver.isAvailable ? 'Disponible' : 'Ocupado'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Solicitar transporte</h3>
          <p>Usa coordenadas demo por ahora.</p>
          <MapPicker label="Origen" value={origin} onChange={setOrigin} />
          <MapPicker label="Destino" value={destination} onChange={setDestination} />
          <button className="btn" type="button" onClick={requestTrip} disabled={loading}>
            {loading ? 'Solicitando...' : 'Solicitar'}
          </button>
          {result && (
            <div className="result-card">
              <p><strong>ID:</strong> {result.id}</p>
              <p><strong>Estado:</strong> {result.status}</p>
              <p><strong>Conductor:</strong> {result.driverId ?? 'Sin asignar'}</p>
              <p><strong>Tarifa:</strong> {result.fare.toFixed(2)}</p>
              <p><strong>Pagado:</strong> {result.paid ? 'Sí' : 'No'}</p>
            </div>
          )}
          {result && (
            <div className="result-card">
              <h4>Conductores más cercanos</h4>
              {getNearestDrivers().length === 0 ? (
                <p className="muted">No hay conductores cercanos.</p>
              ) : (
                <div className="table">
                  <div className="table-header">
                    <span>Nombre</span>
                    <span>Distancia</span>
                    <span>Estado</span>
                  </div>
                  {getNearestDrivers().map(({ driver, distance }) => (
                    <div key={driver.id} className="table-row">
                      <span>{driver.name}</span>
                      <span>{distance.toFixed(4)}</span>
                      <span>{driver.isAvailable ? 'Disponible' : 'Ocupado'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="divider" />
          <h4>Convertirme en conductor</h4>
          <button className="btn" type="button" onClick={changeRole} disabled={loading}>
            Cambiar a conductor
          </button>
          {roleMessage && <p className="muted">{roleMessage}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </section>
  );
}
