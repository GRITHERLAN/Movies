// Página de resultados de búsqueda (#/buscar?q=texto).
import SearchBar from '../components/SearchBar.jsx';
import CatalogSection from '../components/CatalogSection.jsx';

export default function SearchPage({ query }) {
  return (
    <>
      <section className="home-search container" aria-label="Buscador">
        <SearchBar initialValue={query} placeholder="Buscar por título..." />
        <p className="search-summary">
          Resultados para <em>"{query}"</em>
        </p>
      </section>
      <CatalogSection query={query} title="Resultados de la búsqueda" />
    </>
  );
}
