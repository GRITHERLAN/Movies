// Estado "sin resultados" (pantalla "Sala a Oscuras" del diseño) con sugerencias.
import { getMovies } from '../services/tmdb.js';
import { useFetch } from '../hooks/useFetch.js';
import { useGenres } from '../hooks/useGenres.js';
import Icon from './Icon.jsx';
import MovieGrid from './MovieGrid.jsx';

export default function NoResults({ query, onReset, onShowReleases }) {
  const { namesFor } = useGenres();

  // Sugerencias: las 4 películas más populares.
  const { data } = useFetch(() => getMovies({ filters: { genre: 'all', year: 'all', rating: 'any', sort: 'popular' } }), []);

  return (
    <div className="no-results">
      <section className="no-results__panel" aria-live="polite">
        <span className="no-results__icon"><Icon name="film" size={4} /></span>
        <h2 className="no-results__title">
          Sala a Oscuras: <em>no se encontraron películas</em>
        </h2>
        <p className="no-results__text">
          {query
            ? `No hemos localizado ninguna película para "${query}" con los filtros seleccionados. `
            : 'No hemos localizado ninguna película con los filtros seleccionados. '}
          Verifica la ortografía o prueba con términos más generales.
        </p>
        <button type="button" className="btn btn--primary" onClick={onReset}>Restablecer filtros</button>
        <button type="button" className="btn btn--secondary" onClick={onShowReleases}>Ver estrenos recomendados</button>
      </section>

      {data && data.movies.length > 0 && (
        <section className="no-results__suggestions" aria-labelledby="suggestions-title">
          <h3 id="suggestions-title" className="section-heading__title">¿Quizás buscabas algo de esto?</h3>
          <MovieGrid movies={data.movies.slice(0, 4)} namesFor={namesFor} />
        </section>
      )}
    </div>
  );
}
