// Vista de detalle de una película: sinopsis, portada, año, director,
// acciones del usuario (vista / me gusta / pendiente), valoración y notas.
import { useEffect, useState } from 'react';
import { getMovieDetail, imageUrl } from '../services/tmdb.js';
import { useFetch } from '../hooks/useFetch.js';
import { useUserList } from '../context/UserListContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Icon from '../components/Icon.jsx';
import MovieActions from '../components/MovieActions.jsx';
import StarRating from '../components/StarRating.jsx';
import CastList from '../components/CastList.jsx';
import SimilarCarousel from '../components/SimilarCarousel.jsx';

// Formatea dinero en dólares; si TMDB no tiene el dato (0) lo indicamos.
function formatMoney(amount) {
  if (!amount) return 'No disponible';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

// Convierte minutos en "169 min (2h 49m)".
function formatDuration(minutes) {
  if (!minutes) return 'No disponible';
  return `${minutes} min (${Math.floor(minutes / 60)}h ${minutes % 60}m)`;
}

// Convierte un timestamp en "14/10/2023".
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('es-ES');
}

export default function MovieDetailPage({ id }) {
  const { data: movie, loading, error, retry } = useFetch(() => getMovieDetail(id), [id]);
  const { getEntry, setUserRating, setNotes } = useUserList();

  // Texto de la caja de notas (se guarda solo al pulsar "Guardar nota").
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const entry = movie ? getEntry(movie.id) : null;

  // Al cargar otra película, rellenamos la caja con su nota guardada.
  useEffect(() => {
    setNoteText(entry?.notes || '');
    setNoteSaved(false);
    setShareMessage('');
    // Solo queremos reaccionar al cambio de película, no a cada modificación de la entrada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie?.id]);

  if (loading) return <main className="container"><Loader text="Cargando película..." /></main>;
  if (error) {
    return (
      <main className="container">
        <ErrorMessage message={error} onRetry={retry} />
        <a className="btn btn--secondary" href="#/">Volver al catálogo</a>
      </main>
    );
  }

  const saveNote = (event) => {
    // El botón está dentro de un formulario: evitamos que recargue la página.
    event.preventDefault();
    setNotes(movie, noteText.trim());
    setNoteSaved(true);
  };

  // "Compartir": copia el enlace al portapapeles y avisa en pantalla (sin alert).
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage('Enlace copiado al portapapeles');
    } catch {
      setShareMessage('No se pudo copiar el enlace');
    }
  };

  const backdrop = imageUrl(movie.backdropPath, 'w1280');
  const poster = imageUrl(movie.posterPath, 'w500');

  return (
    <main className="detail">
      {/* Banda superior con la imagen de fondo */}
      <header className="detail__banner">
        {backdrop && <img className="detail__backdrop" src={backdrop} alt="" />}
        <div className="detail__banner-shade"></div>
        <div className="container detail__banner-content">
          <a className="btn btn--secondary detail__back" href="#/">
            <Icon name="arrowLeft" size={1.4} /> Volver al catálogo
          </a>
          <h1 className="detail__title">
            {movie.title} {movie.year && <span className="detail__year">({movie.year})</span>}
          </h1>
        </div>
      </header>

      <div className="container detail__layout">
        {/* Columna izquierda: portada y acciones */}
        <aside className="detail__side">
          <div className="detail__poster">
            {poster ? <img src={poster} alt={`Portada de ${movie.title}`} /> : <div className="movie-card__no-poster">Sin portada</div>}
            {movie.rating > 0 && (
              <span className="badge badge--rating">
                <Icon name="star" filled size={1.2} /> {movie.rating.toFixed(1)} / 10
                <small>{movie.voteCount.toLocaleString('es-ES')} votos TMDB</small>
              </span>
            )}
          </div>

          <section className="panel" aria-labelledby="collection-title">
            <h2 id="collection-title" className="panel__title">Panel de colección</h2>
            <MovieActions movie={movie} variant="full" />
            {entry?.watched && entry.watchedAt && (
              <p className="panel__note">Vista el {formatDate(entry.watchedAt)}</p>
            )}
            <button type="button" className="btn btn--secondary btn--block" onClick={share}>Compartir</button>
            {/* Aviso visual (sustituye a alert) */}
            {shareMessage && <p className="panel__note" role="status">{shareMessage}</p>}
          </section>
        </aside>

        {/* Columna derecha: información */}
        <div className="detail__main">
          <ul className="detail__genres">
            {movie.genres.map((genre) => (
              <li key={genre.id} className="chip chip--static">{genre.name}</li>
            ))}
          </ul>

          <dl className="detail__facts">
            <div><dt>Año</dt><dd>{movie.year || 'No disponible'}</dd></div>
            <div><dt>Duración</dt><dd>{formatDuration(movie.runtime)}</dd></div>
            <div><dt>Puntuación TMDB</dt><dd>{movie.rating ? `${movie.rating.toFixed(1)} / 10` : 'Sin votos'}</dd></div>
            <div><dt>Dirección</dt><dd className="detail__director">{movie.director || 'No disponible'}</dd></div>
          </dl>

          {(movie.writers.length > 0 || movie.composers.length > 0) && (
            <p className="detail__credits">
              {movie.writers.length > 0 && <span><strong>Guion:</strong> {movie.writers.join(', ')}</span>}
              {movie.composers.length > 0 && <span><strong>Banda sonora:</strong> {movie.composers.join(', ')}</span>}
            </p>
          )}

          <section className="detail-section" aria-labelledby="synopsis-title">
            <h2 id="synopsis-title" className="detail-section__title">Sinopsis Oficial</h2>
            <p className="detail__synopsis">{movie.overview || 'Esta película todavía no tiene sinopsis en español.'}</p>
          </section>

          <StarRating value={entry?.userRating || 0} onChange={(value) => setUserRating(movie, value)} />

          <CastList cast={movie.cast} />

          <dl className="detail__money">
            <div><dt>Presupuesto estimado</dt><dd>{formatMoney(movie.budget)}</dd></div>
            <div><dt>Recaudación mundial</dt><dd className="detail__money-gain">{formatMoney(movie.revenue)}</dd></div>
          </dl>

          <form className="notes" onSubmit={saveNote}>
            <label className="notes__title" htmlFor="notes-text">Notas personales de visualización</label>
            <textarea
              id="notes-text"
              className="notes__text"
              rows="4"
              value={noteText}
              placeholder="Escribe aquí lo que te ha parecido..."
              onChange={(event) => {
                setNoteText(event.target.value);
                setNoteSaved(false);
              }}
            />
            <div className="notes__footer">
              <p className="notes__hint" role="status">
                {noteSaved ? 'Nota guardada en tu navegador.' : 'Las notas se guardan solo en tu navegador.'}
              </p>
              <button type="submit" className="btn btn--primary">Guardar nota</button>
            </div>
          </form>
        </div>
      </div>

      <SimilarCarousel movies={movie.similar} />
    </main>
  );
}
