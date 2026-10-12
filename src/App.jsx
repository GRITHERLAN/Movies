// Componente raíz: pinta cabecera, la página que toque según la URL y el pie.
import { useHashRoute } from './hooks/useHashRoute.js';
import { hasApiKey } from './services/tmdb.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import HomePage from './pages/HomePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import MovieDetailPage from './pages/MovieDetailPage.jsx';
import MyListPage from './pages/MyListPage.jsx';

export default function App() {
  const { path, params } = useHashRoute();
  const tab = params.get('tab') || 'todas';

  // Elegimos qué página mostrar según la ruta.
  let page;
  if (!hasApiKey()) {
    page = <main className="container"><ErrorMessage message="Falta la API_KEY de TMDB. Añádela en el fichero .env (API_KEY=tu_clave) y reinicia el servidor." /></main>;
  } else if (path === '/buscar') {
    page = <SearchPage query={params.get('q') || ''} />;
  } else if (path.startsWith('/pelicula/')) {
    // "key" fuerza a React a reiniciar la página al pasar de una película a otra.
    const id = path.split('/')[2];
    page = <MovieDetailPage key={id} id={id} />;
  } else if (path === '/mi-lista') {
    page = <MyListPage tab={tab} />;
  } else {
    page = <HomePage />;
  }

  return (
    <>
      {/* El buscador de la cabecera se oculta donde ya hay uno grande */}
      <Header path={path} tab={tab} showSearch={path !== '/' && path !== '/buscar'} />
      <div className="page">{page}</div>
      <Footer />
    </>
  );
}
