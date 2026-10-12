// Página de inicio: estreno destacado + buscador + cartelera con filtros.
import Hero from '../components/Hero.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CatalogSection from '../components/CatalogSection.jsx';

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="home-search container" aria-label="Buscador">
        <SearchBar placeholder="Buscar por título..." />
      </section>
      <CatalogSection title="Cartelera Destacada" badge="Actualizado hoy" />
    </>
  );
}
