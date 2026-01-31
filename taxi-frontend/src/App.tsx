import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { UsersPage } from './pages/UsersPage';
import { DriversPage } from './pages/DriversPage';
import { TripsPage } from './pages/TripsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="conductores" element={<DriversPage />} />
        <Route path="viajes" element={<TripsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
