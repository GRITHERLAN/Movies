// Mini "router" basado en el hash de la URL (lo que va después de #).
// Evita instalar librerías externas. Ejemplos de rutas:
//   #/                       -> inicio
//   #/buscar?q=dune          -> resultados de búsqueda
//   #/pelicula/693134        -> detalle
//   #/mi-lista?tab=vistas    -> listas del usuario
import { useEffect, useState } from 'react';

// Lee el hash actual y lo separa en { path, params }.
function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, queryString = ''] = raw.split('?');
  return { path, params: new URLSearchParams(queryString) };
}

// Cambia de página (equivale a hacer clic en un enlace).
export function navigate(to) {
  window.location.hash = to;
}

// Hook que devuelve la ruta actual y se actualiza cuando el hash cambia.
export function useHashRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      // Al cambiar de página volvemos arriba, como en una web normal.
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
