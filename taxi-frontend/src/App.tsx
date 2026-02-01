import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { getAuthUser } from './api/client';

function App() {
  const [authTick, setAuthTick] = useState(0);
  const user = getAuthUser();

  if (!user) {
    return <LoginPage onAuth={() => setAuthTick(authTick + 1)} />;
  }

  const dashboard = user.role === 'admin'
    ? <AdminDashboard />
    : user.role === 'driver'
      ? <DriverDashboard />
      : <ClientDashboard />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={dashboard} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
