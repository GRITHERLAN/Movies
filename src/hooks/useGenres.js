// Hook que devuelve la lista de géneros de TMDB.
// La lista casi nunca cambia, así que la pedimos una sola vez y la guardamos
// en memoria para que todos los componentes la compartan.
import { useEffect, useState } from 'react';
import { getGenres } from '../services/tmdb.js';

// Promesa compartida: la primera llamada hace la petición, las demás la reutilizan.
let genresPromise = null;

export function useGenres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (!genresPromise) {
      genresPromise = getGenres().catch(() => {
        // Si falla, permitimos reintentar la próxima vez y seguimos sin géneros.
        genresPromise = null;
        return [];
      });
    }
    let cancelled = false;
    genresPromise.then((list) => {
      if (!cancelled) setGenres(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Útil para traducir los ids de género de una película a nombres.
  const namesFor = (ids) =>
    ids
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean);

  return { genres, namesFor };
}
