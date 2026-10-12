// Rejilla (CSS grid) con una tarjeta por película.
import MovieCard from './MovieCard.jsx';

// "namesFor" traduce los ids de género de una película a nombres (viene de useGenres).
export default function MovieGrid({ movies, namesFor }) {
  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <li key={movie.id}>
          {/* Las películas guardadas por el usuario ya traen "genres" (nombres);
              las de la API traen "genreIds" (números). */}
          <MovieCard movie={movie} genres={movie.genres || (namesFor ? namesFor(movie.genreIds || []) : [])} />
        </li>
      ))}
    </ul>
  );
}
