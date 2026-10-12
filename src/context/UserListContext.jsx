// ============================================================================
// Contexto con la información personal del usuario:
// vista / me gusta / pendiente / valoración / notas de cada película.
// Todo se guarda en LocalStorage (clave "cinescope_user_db"), así que sigue ahí
// aunque se cierre el navegador.
// ============================================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getMovieDetail } from '../services/tmdb.js';

const STORAGE_KEY = 'cinescope_user_db';

const UserListContext = createContext(null);

// Lee la base de datos guardada. Si no existe o está corrupta devuelve {}.
function loadFromStorage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

// Entrada vacía para una película que el usuario aún no ha tocado.
function emptyEntry(movie) {
  return {
    movie,
    watched: false,
    watchedAt: null,
    liked: false,
    pending: false,
    userRating: 0,
    notes: '',
    addedAt: Date.now(),
  };
}

// Guardamos solo los datos mínimos de la película, para poder pintar las listas
// sin volver a llamar a la API. "genres" es una lista de nombres (texto).
function toStoredMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.posterPath || null,
    year: movie.year || '',
    rating: movie.rating || 0,
    runtime: movie.runtime, // puede ser undefined hasta que se complete en segundo plano
    genres: movie.genres ? movie.genres.map((genre) => genre.name || genre) : undefined,
    director: movie.director,
  };
}

// Una entrada sin ninguna marca ni dato personal no hace falta guardarla.
function isUseless(entry) {
  return !entry.watched && !entry.liked && !entry.pending && !entry.userRating && !entry.notes;
}

export function UserListProvider({ children }) {
  const [entries, setEntries] = useState(loadFromStorage);
  // Ids de películas cuyos datos extra ya hemos pedido (para no repetir).
  const enriched = useRef(new Set());

  // Cada vez que cambian los datos los guardamos en LocalStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Si el almacenamiento está lleno o bloqueado, la app sigue funcionando.
    }
  }, [entries]);

  // Las películas marcadas desde una tarjeta no traen duración, géneros ni
  // director. Los pedimos en segundo plano para que las estadísticas sean correctas.
  useEffect(() => {
    Object.values(entries).forEach(({ movie }) => {
      if (movie.runtime !== undefined || enriched.current.has(movie.id)) return;
      enriched.current.add(movie.id);
      getMovieDetail(movie.id)
        .then((detail) => {
          setEntries((current) =>
            current[movie.id]
              ? { ...current, [movie.id]: { ...current[movie.id], movie: toStoredMovie(detail) } }
              : current
          );
        })
        .catch(() => {
          // Si falla, se reintentará la próxima vez que se abra la aplicación.
        });
    });
  }, [entries]);

  // Aplica un cambio a la entrada de una película (la crea si no existe).
  const update = useCallback((movie, changes) => {
    setEntries((current) => {
      const previous = current[movie.id] || emptyEntry(toStoredMovie(movie));
      const next = { ...previous, ...changes };
      const copy = { ...current };
      if (isUseless(next)) delete copy[movie.id];
      else copy[movie.id] = next;
      return copy;
    });
  }, []);

  // --- Acciones disponibles para los componentes ---

  // Marcar / desmarcar como vista. Si se marca vista deja de estar pendiente.
  const toggleWatched = (movie) => {
    const current = entries[movie.id];
    const watched = !current?.watched;
    update(movie, { watched, watchedAt: watched ? Date.now() : null, pending: watched ? false : Boolean(current?.pending) });
  };

  // Marcar / desmarcar "Me gusta".
  const toggleLiked = (movie) => update(movie, { liked: !entries[movie.id]?.liked });

  // Marcar / desmarcar como "Pendiente de ver". Si se marca pendiente deja de estar vista.
  const togglePending = (movie) => {
    const pending = !entries[movie.id]?.pending;
    update(movie, pending ? { pending, watched: false, watchedAt: null } : { pending });
  };

  const setUserRating = (movie, userRating) => update(movie, { userRating });
  const setNotes = (movie, notes) => update(movie, { notes });

  // Borra toda la información del usuario.
  const clearAll = () => setEntries({});

  const value = useMemo(
    () => ({
      entries,
      getEntry: (id) => entries[id] || null,
      toggleWatched,
      toggleLiked,
      togglePending,
      setUserRating,
      setNotes,
      clearAll,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entries]
  );

  return <UserListContext.Provider value={value}>{children}</UserListContext.Provider>;
}

// Hook cómodo para usar el contexto desde cualquier componente.
export function useUserList() {
  const context = useContext(UserListContext);
  if (!context) throw new Error('useUserList debe usarse dentro de <UserListProvider>');
  return context;
}
