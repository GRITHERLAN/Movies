// Hook para cargar datos de forma asíncrona y conocer su estado.
// Devuelve { data, loading, error, retry }:
//  - loading: true mientras se espera la respuesta (para el indicador de carga)
//  - error:   mensaje de error en español, o null si todo fue bien
//  - retry:   función para volver a lanzar la petición (botón "Reintentar")
import { useCallback, useEffect, useState } from 'react';

// "fetcher" es una función que devuelve una promesa; "deps" son los valores
// que, al cambiar, obligan a repetir la petición (igual que en useEffect).
export function useFetch(fetcher, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  // Contador que incrementamos para forzar una nueva petición al reintentar.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // "cancelled" evita guardar una respuesta antigua si el usuario ya cambió
    // de filtro/página mientras se esperaba (condición de carrera).
    let cancelled = false;

    setState((previous) => ({ ...previous, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error: error.message });
      });

    // Limpieza: se ejecuta antes de la siguiente petición o al desmontar.
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { ...state, retry };
}
