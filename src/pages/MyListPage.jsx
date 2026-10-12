// Sección personal del usuario: películas vistas, pendientes y favoritas.
// Los datos salen de LocalStorage (vía UserListContext), no de la API.
import { useMemo, useState } from 'react';
import { useUserList } from '../context/UserListContext.jsx';
import { navigate } from '../hooks/useHashRoute.js';
import Icon from '../components/Icon.jsx';
import Modal from '../components/Modal.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import Pagination from '../components/Pagination.jsx';

const PAGE_SIZE = 8; // películas por página en las listas

// Definición de las pestañas: qué entradas muestra cada una.
const TABS = [
  { id: 'todas', label: 'Todas', filter: () => true, empty: 'Aún no has guardado ninguna película.' },
  { id: 'vistas', label: 'Películas Vistas', filter: (entry) => entry.watched, empty: 'Todavía no has marcado ninguna película como vista.' },
  { id: 'pendientes', label: 'Pendientes de Ver', filter: (entry) => entry.pending, empty: '¿No tienes películas pendientes?' },
  { id: 'favoritas', label: 'Mis Favoritas', filter: (entry) => entry.liked, empty: 'Aún no te ha gustado ninguna película.' },
];

const SORTS = [
  { id: 'recent', label: 'Añadidas recientemente', compare: (a, b) => b.addedAt - a.addedAt },
  { id: 'title', label: 'Título (A-Z)', compare: (a, b) => a.movie.title.localeCompare(b.movie.title, 'es') },
  { id: 'rating', label: 'Mi valoración', compare: (a, b) => b.userRating - a.userRating },
];

export default function MyListPage({ tab }) {
  const { entries, clearAll } = useUserList();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [confirmClear, setConfirmClear] = useState(false);

  const activeTab = TABS.find((item) => item.id === tab) || TABS[0];
  const all = Object.values(entries);

  // Estadísticas de las películas vistas.
  const stats = useMemo(() => {
    const watched = all.filter((entry) => entry.watched);
    const minutes = watched.reduce((sum, entry) => sum + (entry.movie.runtime || 0), 0);

    // Género más repetido entre las vistas.
    const counts = {};
    watched.forEach((entry) => (entry.movie.genres || []).forEach((genre) => (counts[genre] = (counts[genre] || 0) + 1)));
    const favoriteGenre = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    // Media de TU valoración (solo de las que has valorado).
    const rated = all.filter((entry) => entry.userRating > 0);
    const average = rated.length ? rated.reduce((sum, entry) => sum + entry.userRating, 0) / rated.length : 0;

    return { hours: Math.round(minutes / 60), favoriteGenre, average };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  // Entradas de la pestaña, filtradas por el buscador y ordenadas.
  const visible = all
    .filter(activeTab.filter)
    .filter((entry) => entry.movie.title.toLowerCase().includes(search.trim().toLowerCase()))
    .sort(SORTS.find((item) => item.id === sort).compare);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const countOf = (item) => all.filter(item.filter).length;

  // Descarga la lista completa como fichero JSON.
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cinescope-mi-lista.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearAll();
    setConfirmClear(false);
  };

  return (
    <main className="my-list container">
      <header className="my-list__header">
        <h1 className="my-list__title">Mi Videoteca Personal</h1>
        <p className="my-list__subtitle">Datos guardados en LocalStorage ({all.length} {all.length === 1 ? 'película' : 'películas'})</p>
      </header>

      <section className="stats" aria-label="Estadísticas">
        <div className="stats__card"><p>Tiempo total visto</p><strong>{stats.hours} hrs de cine</strong></div>
        <div className="stats__card"><p>Género favorito</p><strong>{stats.favoriteGenre}</strong></div>
        <div className="stats__card"><p>Tu puntuación media</p><strong>{stats.average ? stats.average.toFixed(1) : '—'} ★</strong></div>
      </section>

      <nav className="tabs" aria-label="Listas">
        {TABS.map((item) => (
          <a
            key={item.id}
            href={`#/mi-lista?tab=${item.id}`}
            className={`tabs__link ${item.id === activeTab.id ? 'is-active' : ''}`}
            aria-current={item.id === activeTab.id ? 'page' : undefined}
            onClick={() => setPage(1)}
          >
            {item.label} ({countOf(item)})
          </a>
        ))}
      </nav>

      <div className="my-list__tools">
        <label className="visually-hidden" htmlFor="list-search">Buscar dentro de mis listas</label>
        <input
          id="list-search"
          className="my-list__search"
          type="search"
          placeholder="Buscar dentro de mis listas..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <div className="my-list__row">
          <div className="filter-bar__sort">
            <label htmlFor="list-sort">Ordenar por:</label>
            <select id="list-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
              {SORTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
          <div className="my-list__buttons">
            <button type="button" className="btn btn--secondary" onClick={exportJson} disabled={all.length === 0}>
              <Icon name="download" size={1.4} /> Exportar lista (JSON)
            </button>
            <button type="button" className="btn btn--danger-outline" onClick={() => setConfirmClear(true)} disabled={all.length === 0}>
              <Icon name="trash" size={1.4} /> Limpiar historial
            </button>
          </div>
        </div>
      </div>

      <h2 className="my-list__section-title">
        {activeTab.label} (mostrando {pageItems.length} de {visible.length})
      </h2>

      {pageItems.length > 0 ? (
        <>
          <MovieGrid movies={pageItems.map((entry) => ({ ...entry.movie, genres: entry.movie.genres }))} />
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </>
      ) : (
        <section className="empty-state">
          <span className="no-results__icon"><Icon name="film" size={3.6} /></span>
          <h3>{search ? 'Ninguna película coincide con tu búsqueda.' : activeTab.empty}</h3>
          <p>Explora los estrenos y agrega tus favoritas para planificar tus próximas sesiones de cine.</p>
          <button type="button" className="btn btn--primary" onClick={() => navigate('/')}>Explorar cartelera de estrenos</button>
        </section>
      )}

      {/* Confirmación con modal propio (sin confirm()) */}
      {confirmClear && (
        <Modal
          title="¿Limpiar todo el historial?"
          confirmLabel="Sí, borrar todo"
          onConfirm={handleClear}
          onCancel={() => setConfirmClear(false)}
        >
          <p>Se eliminarán tus películas vistas, pendientes, favoritas, valoraciones y notas. Esta acción no se puede deshacer.</p>
        </Modal>
      )}
    </main>
  );
}
