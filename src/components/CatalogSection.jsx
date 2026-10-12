// Sección reutilizable con filtros + listado + paginación.
// La usan la página de inicio (sin texto de búsqueda) y la de resultados (con texto).
import { useEffect, useRef, useState } from 'react';
import { getMovies, DEFAULT_FILTERS } from '../services/tmdb.js';
import { useFetch } from '../hooks/useFetch.js';
import { useGenres } from '../hooks/useGenres.js';
import { navigate } from '../hooks/useHashRoute.js';
import FilterBar from './FilterBar.jsx';
import MovieGrid from './MovieGrid.jsx';
import Pagination from './Pagination.jsx';
import Loader from './Loader.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import NoResults from './NoResults.jsx';

export default function CatalogSection({ query = '', title, badge }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const { genres, namesFor } = useGenres();
  const topRef = useRef(null);

  // Si cambia el texto buscado volvemos a la primera página.
  useEffect(() => setPage(1), [query]);

  // Pide las películas cada vez que cambia la búsqueda, los filtros o la página.
  const { data, loading, error, retry } = useFetch(
    () => getMovies({ query, page, filters }),
    [query, page, JSON.stringify(filters)]
  );

  // Cambiar un filtro siempre devuelve a la página 1.
  const handleFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePage = (newPage) => {
    setPage(newPage);
    // Sube hasta el principio del listado al cambiar de página.
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReset = () => handleFilters(DEFAULT_FILTERS);

  // Texto resumen que aparece bajo los filtros.
  const summary = data
    ? `Mostrando ${data.movies.length} de ${data.totalResults.toLocaleString('es-ES')} películas encontradas`
    : 'Cargando películas...';

  return (
    <section className="catalog container" ref={topRef} aria-labelledby="catalog-title">
      <FilterBar genres={genres} filters={filters} onChange={handleFilters} onReset={handleReset} summary={summary} />

      <div className="section-heading">
        <h2 id="catalog-title" className="section-heading__title">{title}</h2>
        {badge && <span className="section-heading__badge">{badge}</span>}
      </div>

      {loading && <Loader text="Cargando películas..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={retry} />}

      {!loading && !error && data && data.movies.length === 0 && (
        <NoResults
          query={query}
          onReset={handleReset}
          onShowReleases={() => {
            handleReset();
            navigate('/');
          }}
        />
      )}

      {!loading && !error && data && data.movies.length > 0 && (
        <>
          <MovieGrid movies={data.movies} namesFor={namesFor} />
          <div className="catalog__footer">
            <p className="catalog__page-info">Página {data.page} de {data.totalPages.toLocaleString('es-ES')}</p>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={handlePage} />
          </div>
        </>
      )}
    </section>
  );
}
