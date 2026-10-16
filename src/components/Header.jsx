// Cabecera con el logo, la navegación principal y (opcionalmente) un buscador.
import { useEffect, useState } from 'react';
import { useUserList } from '../context/UserListContext.jsx';
import SearchBar from './SearchBar.jsx';
import Icon from './Icon.jsx';

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

  // Indica si el menú hamburguesa está desplegado (solo tiene efecto en móvil).
  const [menuOpen, setMenuOpen] = useState(false);

  // Mientras el menú está abierto escuchamos dos cosas para cerrarlo:
  //  - la tecla Escape;
  //  - que la ventana pase a tamaño escritorio (>= 768px), donde el menú
  //    siempre se ve y el estado "abierto" ya no tiene sentido.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const handleResize = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleResize);

    // Al cerrar el menú (o desmontar) quitamos los listeners.
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleResize);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <a className="logo" href="#/" aria-label="CineScope, ir al inicio">
          <span className="logo__mark" aria-hidden="true"></span>
          <span className="logo__text">CineScope</span>
        </a>

        {/* Botón hamburguesa: solo se ve en móvil (ver global.css) */}
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={2.2} />
        </button>

        <nav
          id="main-nav"
          className={`main-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Navegación principal"
        >
          <ul className="main-nav__list">
            {LINKS.map((link) => (
              <li key={link.to}>
                <a
                  className={`main-nav__link ${link.match(path, tab) ? 'is-active' : ''}`}
                  href={`#${link.to}`}
                  aria-current={link.match(path, tab) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
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
