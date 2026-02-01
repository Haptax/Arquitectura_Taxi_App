import { NavLink, Outlet } from 'react-router-dom';
import { authToken, getAuthUser } from '../api/client';

const links = [
  { to: '/', label: 'Dashboard' },
];

export function Layout() {
  const user = getAuthUser();
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-title">Taxi Manager</p>
          <p className="app-subtitle">
            {user ? `Sesión: ${user.email} (${user.role})` : 'Panel local de pruebas'}
          </p>
        </div>
        <nav className="app-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link${isActive ? ' nav-link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            className="btn secondary"
            type="button"
            onClick={() => {
              authToken.clear();
              window.location.href = '/';
            }}
          >
            Salir
          </button>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
