import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/usuarios', label: 'Usuarios' },
  { to: '/perfiles', label: 'Perfiles' },
  { to: '/conductores', label: 'Conductores' },
  { to: '/viajes', label: 'Viajes' },
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-title">Taxi Manager</p>
          <p className="app-subtitle">Panel local de pruebas</p>
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
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
