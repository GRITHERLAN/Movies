// Portada destacada de la home: la primera película en cartelera.
import { getNowPlaying, getMovieDetail, imageUrl } from '../services/tmdb.js';
import { useFetch } from '../hooks/useFetch.js';
import { useUserList } from '../context/UserListContext.jsx';
import Icon from './Icon.jsx';
import Loader from './Loader.jsx';
import ErrorMessage from './ErrorMessage.jsx';

// Convierte minutos en "2h 46min".
export function formatRuntime(minutes) {
  if (!minutes) return '';
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}min`;
}

export default function Hero() {
  const { getEntry, toggleWatched, toggleLiked, togglePending } = useUserList();

  // 1) Buscamos las películas en cartelera y 2) pedimos el detalle de la primera
  // con backdrop (para conocer director y duración).
  const { data: movie, loading, error, retry } = useFetch(async () => {
    const list = await getNowPlaying();
    const featured = list.find((item) => item.backdropPath) || list[0];
    if (!featured) throw new Error("No hay estrenos disponibles ahora mismo.");
    return getMovieDetail(featured.id);
  }, []);

  if (loading) return <section className="hero hero--loading container"><Loader text="Cargando estreno destacado..." /></section>;
  if (error) return <section className="hero container"><ErrorMessage message={error} onRetry={retry} /></section>;

  const entry = getEntry(movie.id);
  const backdrop = imageUrl(movie.backdropPath, 'w1280');

  return (
    <section className="hero container" aria-labelledby="hero-title">
      {backdrop && <img className="hero__image" src={backdrop} alt="" />}
      <div className="hero__shade"></div>

      <div className="hero__content">
        <p className="hero__label">Estreno de la semana</p>
        <p className="hero__meta">
          <span className="hero__genres">{movie.genres.map((genre) => genre.name).join(' / ')}</span>
          <span><Icon name="star" filled size={1.4} /> {movie.rating.toFixed(1)} / 10 TMDB</span>
          {movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
          {movie.director && <span>Dir. <strong>{movie.director}</strong></span>}
        </p>
        <h1 id="hero-title" className="hero__title">{movie.title}</h1>
        <p className="hero__overview">{movie.overview}</p>

        <div className="hero__actions">
          <button type="button" className={`btn btn--primary ${entry?.pending ? 'is-active' : ''}`} onClick={() => togglePending(movie)}>
            <Icon name="bookmark" filled={Boolean(entry?.pending)} size={1.6} />
            {entry?.pending ? 'Quitar de Por Ver' : 'Agregar a Por Ver'}
          </button>
          <button type="button" className={`btn btn--secondary ${entry?.watched ? 'is-active' : ''}`} onClick={() => toggleWatched(movie)}>
            <Icon name="check" size={1.6} />
            {entry?.watched ? 'Vista' : 'Marcar como Vista'}
          </button>
          <button type="button" className={`btn btn--secondary btn--like ${entry?.liked ? 'is-active' : ''}`} onClick={() => toggleLiked(movie)}>
            <Icon name="heart" filled={Boolean(entry?.liked)} size={1.6} />
            Me Gusta
          </button>
          <a className="hero__more" href={`#/pelicula/${movie.id}`}>
            Ver Ficha Completa <Icon name="arrowRight" size={1.4} />
          </a>
        </div>
      </div>
    </section>
  );
}
