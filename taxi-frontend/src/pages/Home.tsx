import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'Usuarios',
    description: 'Registrar y listar usuarios del sistema.',
    to: '/usuarios',
  },
  {
    title: 'Perfiles',
    description: 'Asignar perfiles y permisos por rol.',
    to: '/perfiles',
  },
  {
    title: 'Conductores',
    description: 'Registrar conductores disponibles para viajes.',
    to: '/conductores',
  },
  {
    title: 'Viajes',
    description: 'Solicitar viajes y verificar asignaciones.',
    to: '/viajes',
  },
];

export function Home() {
  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Panel de pruebas</h1>
          <p>Flujo local para validar casos de uso sin APIs externas.</p>
        </div>
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <span>Ir</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
