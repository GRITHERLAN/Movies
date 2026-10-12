// Carrusel horizontal de películas similares, con flechas para desplazarlo.
import { useRef } from 'react';
import { imageUrl } from '../services/tmdb.js';
import Icon from './Icon.jsx';

export default function SimilarCarousel({ movies }) {
  const trackRef = useRef(null);

  if (movies.length === 0) return null;

  // Desplaza el carrusel una "pantalla" a la izquierda (-1) o a la derecha (1).
  const scroll = (direction) => {
    const track = trackRef.current;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="similar container" aria-labelledby="similar-title">
      <div className="similar__header">
        <div>
          <h2 id="similar-title" className="similar__title">Películas Similares Recomendadas</h2>
          <p className="similar__subtitle">Basado en temática y género de esta película</p>
        </div>
        <div className="similar__arrows">
          <button type="button" className="icon-button" aria-label="Anteriores" onClick={() => scroll(-1)}>
            <Icon name="arrowLeft" size={1.6} />
          </button>
          <button type="button" className="icon-button" aria-label="Siguientes" onClick={() => scroll(1)}>
            <Icon name="arrowRight" size={1.6} />
          </button>
        </div>
      </div>

      <ul className="similar__track" ref={trackRef}>
        {movies.map((movie) => (
          <li key={movie.id} className="similar__item">
            <a href={`#/pelicula/${movie.id}`}>
              <div className="similar__poster">
                {movie.posterPath ? (
                  <img src={imageUrl(movie.posterPath, 'w342')} alt={`Póster de ${movie.title}`} loading="lazy" />
                ) : (
                  <span className="movie-card__no-poster">Sin póster</span>
                )}
                {movie.rating > 0 && (
                  <span className="badge badge--rating"><Icon name="star" filled size={1.2} /> {movie.rating.toFixed(1)}</span>
                )}
              </div>
              <p className="similar__name">{movie.title}</p>
              <p className="similar__year">{movie.year}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
