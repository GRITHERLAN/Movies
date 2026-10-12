// Panel de filtros: género, año, puntuación y ordenación.
import { YEAR_OPTIONS, RATING_OPTIONS, SORT_OPTIONS, DEFAULT_FILTERS } from '../services/tmdb.js';
import Icon from './Icon.jsx';

// Grupo de botones tipo "chip" donde solo uno puede estar activo.
function ChipGroup({ legend, options, value, onChange }) {
  return (
    <fieldset className="filter-group">
      <legend className="filter-group__legend">{legend}</legend>
      <div className="filter-group__chips">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`chip ${option.id === value ? 'is-active' : ''}`}
            aria-pressed={option.id === value}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// "summary" es el texto "Mostrando X de Y películas" que se enseña al pie.
export default function FilterBar({ genres, filters, onChange, onReset, summary }) {
  // Cambia solo un filtro y mantiene el resto.
  const setFilter = (name, value) => onChange({ ...filters, [name]: value });

  // El género "Todos" no viene de la API, lo añadimos al principio.
  const genreOptions = [{ id: 'all', label: 'Todos' }, ...genres.map((genre) => ({ id: String(genre.id), label: genre.name }))];

  const isDefault = Object.keys(DEFAULT_FILTERS).every((key) => filters[key] === DEFAULT_FILTERS[key]);

  return (
    <section className="filter-bar" aria-label="Filtros">
      <div className="filter-bar__sort">
        <label htmlFor="sort-select">Ordenar por:</label>
        <select id="sort-select" value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
      </div>

      <ChipGroup legend="Género" options={genreOptions} value={filters.genre} onChange={(value) => setFilter('genre', value)} />
      <div className="filter-bar__row">
        <ChipGroup legend="Año" options={YEAR_OPTIONS} value={filters.year} onChange={(value) => setFilter('year', value)} />
        <ChipGroup legend="Puntuación" options={RATING_OPTIONS} value={filters.rating} onChange={(value) => setFilter('rating', value)} />
      </div>

      <div className="filter-bar__footer">
        <p className="filter-bar__summary">{summary}</p>
        <button type="button" className="link-button" onClick={onReset} disabled={isDefault}>
          <Icon name="reset" size={1.4} /> Restablecer filtros
        </button>
      </div>
    </section>
  );
}
