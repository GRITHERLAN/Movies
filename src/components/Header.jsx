// Cabecera con el logo, la navegación principal y (opcionalmente) un buscador.
import { useUserList } from '../context/UserListContext.jsx';
import SearchBar from './SearchBar.jsx';

// Enlaces de navegación. "match" decide cuándo se marca como activo.
const LINKS = [
  { label: 'Inicio', to: '/', match: (path) => path === '/' || path === '/buscar' },
  { label: 'Mi Lista', to: '/mi-lista?tab=todas', match: (path, tab) => path === '/mi-lista' && tab === 'todas', counter: true },
  { label: 'Vistas', to: '/mi-lista?tab=vistas', match: (path, tab) => path === '/mi-lista' && tab === 'vistas' },
  { label: 'Pendientes', to: '/mi-lista?tab=pendientes', match: (path, tab) => path === '/mi-lista' && tab === 'pendientes' },
  { label: 'Favoritas', to: '/mi-lista?tab=favoritas', match: (path, tab) => path === '/mi-lista' && tab === 'favoritas' },
];

export default function Header({ path, tab, showSearch }) {
  const { entries } = useUserList();
  const total = Object.keys(entries).length;

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <a className="logo" href="#/" aria-label="CineScope, ir al inicio">
          <span className="logo__mark" aria-hidden="true"></span>
          <span className="logo__text">CineScope</span>
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          <ul className="main-nav__list">
            {LINKS.map((link) => (
              <li key={link.to}>
                <a
                  className={`main-nav__link ${link.match(path, tab) ? 'is-active' : ''}`}
                  href={`#${link.to}`}
                  aria-current={link.match(path, tab) ? 'page' : undefined}
                >
                  {link.label}
                  {link.counter && total > 0 && <span className="main-nav__count">{total}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {showSearch && <SearchBar variant="compact" placeholder="Buscar filmes..." />}
      </div>
    </header>
  );
}
