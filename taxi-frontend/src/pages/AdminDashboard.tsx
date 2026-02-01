import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../api/client';
import type { Driver, Trip, TripStatus, User } from '../api/types';

const statusOptions: TripStatus[] = [
  'requested',
  'assigned',
  'in_progress',
  'completed',
  'canceled',
];

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [statusFilter, setStatusFilter] = useState<TripStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersData, driversData, tripsData] = await Promise.all([
        apiClient.get<User[]>('/users'),
        apiClient.get<Driver[]>('/drivers'),
        apiClient.get<Trip[]>('/trips'),
      ]);
      setUsers(usersData);
      setDrivers(driversData);
      setTrips(tripsData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTrips = useMemo(() => {
    if (statusFilter === 'all') return trips;
    return trips.filter((trip) => trip.status === statusFilter);
  }, [trips, statusFilter]);

  const totalRevenue = useMemo(() => {
    return trips.reduce((sum, trip) => sum + (trip.fare || 0), 0);
  }, [trips]);

  const totalPaidRevenue = useMemo(() => {
    return trips.reduce((sum, trip) => sum + (trip.paid ? trip.fare || 0 : 0), 0);
  }, [trips]);

  const earningsByDriver = useMemo(() => {
    const map = new Map<string, number>();
    trips.forEach((trip) => {
      if (!trip.driverId || !trip.paid) return;
      map.set(trip.driverId, (map.get(trip.driverId) ?? 0) + (trip.fare || 0));
    });
    return map;
  }, [trips]);

  const getUserName = (userId?: string | null) => {
    if (!userId) return 'Sin asignar';
    const user = users.find((item) => item.id === userId);
    return user ? user.name : userId;
  };

  const getDriverName = (driverId?: string | null) => {
    if (!driverId) return 'Sin asignar';
    const driver = drivers.find((item) => item.id === driverId);
    if (driver) return driver.name;
    const user = users.find((item) => item.id === driverId);
    return user ? user.name : driverId;
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Administrador</h1>
          <p>Resumen general de usuarios, conductores y viajes.</p>
        </div>
        <button className="btn" type="button" onClick={loadData} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Totales</h3>
          <div className="result-card">
            <p><strong>Tarifas totales:</strong> {totalRevenue.toFixed(2)}</p>
            <p><strong>Tarifas pagadas:</strong> {totalPaidRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="panel">
          <h3>Usuarios</h3>
          {users.length === 0 ? (
            <p className="muted">Sin usuarios.</p>
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

        <div className="panel">
          <h3>Conductores</h3>
          {drivers.length === 0 ? (
            <p className="muted">Sin conductores.</p>
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
      </div>

      <div className="panel">
        <h3>Ganancias por conductor (pagadas)</h3>
        {drivers.length === 0 ? (
          <p className="muted">Sin conductores.</p>
        ) : (
          <div className="table">
            <div className="table-header">
              <span>Conductor</span>
              <span>Total</span>
            </div>
            {drivers.map((driver) => (
              <div key={driver.id} className="table-row">
                <span>{driver.name}</span>
                <span>{(earningsByDriver.get(driver.id) ?? 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="page-header">
          <div>
            <h3>Viajes</h3>
            <p>Filtra por estado.</p>
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as TripStatus | 'all')}
          >
            <option value="all">Todos</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        {filteredTrips.length === 0 ? (
          <p className="muted">Sin viajes.</p>
        ) : (
          <div className="table">
            <div className="table-header">
              <span>Cliente</span>
              <span>Conductor</span>
              <span>Estado</span>
            </div>
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="table-row">
                <span>{getUserName(trip.clientId)}</span>
                <span>{getDriverName(trip.driverId)}</span>
                <span>{trip.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
