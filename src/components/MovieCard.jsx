// Tarjeta de película: póster, nota, año, géneros y título.
// Toda la tarjeta es un enlace al detalle; los botones de acción van debajo.
import { imageUrl } from '../services/tmdb.js';
import { useUserList } from '../context/UserListContext.jsx';
import Icon from './Icon.jsx';
import MovieActions from './MovieActions.jsx';

// "genres" es opcional: lista de nombres de género ya traducidos.
export default function MovieCard({ movie, genres = [] }) {
  const { getEntry } = useUserList();
  const entry = getEntry(movie.id);
  const poster = imageUrl(movie.posterPath, 'w500');

  return (
    <article className="movie-card">
      <a className="movie-card__link" href={`#/pelicula/${movie.id}`}>
        <div className="movie-card__poster">
          {poster ? (
            <img src={poster} alt={`Póster de ${movie.title}`} loading="lazy" />
          ) : (
            // Si la película no tiene póster mostramos un hueco con su título.
            <div className="movie-card__no-poster">Sin póster</div>
          )}

          {movie.rating > 0 && (
            <span className="badge badge--rating">
              <Icon name="star" filled size={1.2} /> {movie.rating.toFixed(1)}
            </span>
          )}
          {movie.year && <span className="badge badge--year">{movie.year}</span>}
          {entry?.watched && <span className="badge badge--watched">Vista</span>}
        </div>

        <div className="movie-card__info">
          <p className="movie-card__genres">{genres.slice(0, 2).join(' / ') || 'Película'}</p>
          <h3 className="movie-card__title">{movie.title}</h3>
        </div>
      </a>

      <MovieActions movie={movie} variant="compact" />
    </article>
  );
}
