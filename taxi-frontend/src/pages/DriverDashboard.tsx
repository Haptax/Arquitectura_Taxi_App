import { useEffect, useState } from 'react';
import { apiClient, getAuthUser } from '../api/client';
import type { Trip, User, Driver } from '../api/types';
import { MapPicker } from '../components/MapPicker';

export function DriverDashboard() {
  const [pendingTrips, setPendingTrips] = useState<Trip[]>([]);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 4.711,
    lng: -74.072,
  });
  const [locationMessage, setLocationMessage] = useState('');
  const [confirmState, setConfirmState] = useState<{
    tripId: string;
    nearestDriverId?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTrips = async () => {
    setLoading(true);
    setError('');
    const user = getAuthUser();
    if (!user) return;
    try {
      const [pending, mine, allUsers, allDrivers] = await Promise.all([
        apiClient.get<Trip[]>('/trips?status=requested'),
        apiClient.get<Trip[]>(`/trips?driverId=${user.sub}`),
        apiClient.get<User[]>('/users'),
        apiClient.get<Driver[]>('/drivers'),
      ]);
      setPendingTrips(pending);
      setMyTrips(mine.filter((trip) => trip.status === 'assigned'));
      setUsers(allUsers);
      setDrivers(allDrivers);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (clientId: string) => {
    const user = users.find((item) => item.id === clientId);
    return user ? user.name : clientId;
  };

  const getNearestDriver = (trip: Trip) => {
    if (trip.originLat == null || trip.originLng == null) return null;
    if (drivers.length === 0) return null;

    const originLat = trip.originLat;
    const originLng = trip.originLng;

    const nearest = drivers.reduce((best, current) => {
      const bestDist = Math.hypot(
        (best.currentLat ?? 0) - originLat,
        (best.currentLng ?? 0) - originLng,
      );
      const currentDist = Math.hypot(
        (current.currentLat ?? 0) - originLat,
        (current.currentLng ?? 0) - originLng,
      );
      return currentDist < bestDist ? current : best;
    }, drivers[0]);

    return nearest ?? null;
  };

  const acceptTrip = async (tripId: string, nearestDriverId?: string | null) => {
    setLoading(true);
    setError('');
    try {
      const user = getAuthUser();
      if (nearestDriverId && user && nearestDriverId !== user.sub) {
        setConfirmState({ tripId, nearestDriverId });
        setLoading(false);
        return;
      }
      await apiClient.post<Trip>(`/trips/${tripId}/accept`, {});
      await loadTrips();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const confirmAccept = async () => {
    if (!confirmState) return;
    setConfirmState(null);
    setLoading(true);
    setError('');
    try {
      await apiClient.post<Trip>(`/trips/${confirmState.tripId}/accept`, {});
      await loadTrips();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const completeTrip = async (tripId: string) => {
    setLoading(true);
    setError('');
    try {
      await apiClient.post<Trip>(`/trips/${tripId}/complete`, {});
      await loadTrips();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    if (!location) return;
    setLoading(true);
    setError('');
    setLocationMessage('');
    try {
      const updated = await apiClient.post<Driver>('/drivers/location', {
        currentLat: location.lat,
        currentLng: location.lng,
      });
      setLocationMessage(`Ubicación actualizada (${updated.currentLat.toFixed(5)}, ${updated.currentLng.toFixed(5)})`);
      await loadTrips();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Conductor</h1>
          <p>Solicitudes pendientes y viajes asignados.</p>
        </div>
        <button className="btn" type="button" onClick={loadTrips} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Mi ubicación</h3>
          <p>Selecciona tu ubicación en el mapa.</p>
          <MapPicker value={location} onChange={setLocation} />
          <button className="btn" type="button" onClick={updateLocation} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar ubicación'}
          </button>
          {locationMessage && <p className="muted">{locationMessage}</p>}
        </div>
        <div className="panel">
          <h3>Solicitudes pendientes</h3>
          {pendingTrips.length === 0 ? (
            <p className="muted">No hay solicitudes pendientes.</p>
          ) : (
            <div className="table">
              <div className="table-header">
                <span>Cliente</span>
                <span>Origen</span>
                <span>Más cercano</span>
                <span>Acción</span>
              </div>
              {pendingTrips.map((trip) => (
                <div key={trip.id} className="table-row">
                  <span>{getClientName(trip.clientId)}</span>
                  <span>{trip.origin}</span>
                  <span>{getNearestDriver(trip)?.name ?? 'Sin datos'} </span>
                  <span>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => acceptTrip(trip.id, getNearestDriver(trip)?.id)}
                    >
                      Atender
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Mis viajes activos</h3>
          {myTrips.length === 0 ? (
            <p className="muted">No tienes viajes asignados.</p>
          ) : (
            myTrips.map((trip) => (
              <div key={trip.id} className="result-card">
                <p><strong>ID:</strong> {trip.id}</p>
                <p><strong>Cliente:</strong> {getClientName(trip.clientId)}</p>
                <p><strong>Origen:</strong> {trip.origin}</p>
                <p><strong>Destino:</strong> {trip.destination}</p>
                <p><strong>Tarifa:</strong> {trip.fare.toFixed(2)}</p>
                <p><strong>Pagado:</strong> {trip.paid ? 'Sí' : 'No'}</p>
                <button className="btn" type="button" onClick={() => completeTrip(trip.id)}>
                  Marcar atendido
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
      {confirmState && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Conductor más cercano</h3>
            <p>
              Hay otro conductor más cercano a este cliente. ¿Deseas atender el viaje
              de todas formas?
            </p>
            <div className="stack">
              <button className="btn" type="button" onClick={confirmAccept}>
                Sí, atender
              </button>
              <button
                className="btn secondary"
                type="button"
                onClick={() => setConfirmState(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
