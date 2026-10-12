// Formulario de búsqueda. Al enviarlo navega a la página de resultados.
// "variant": "big" (página de inicio / resultados) o "compact" (cabecera).
import { useEffect, useState } from 'react';
import { navigate } from '../hooks/useHashRoute.js';
import Icon from './Icon.jsx';

export default function SearchBar({ initialValue = '', variant = 'big', placeholder = 'Buscar por título...' }) {
  const [text, setText] = useState(initialValue);

  // Si cambia la búsqueda desde fuera (p. ej. "Limpiar término"), sincronizamos el input.
  useEffect(() => setText(initialValue), [initialValue]);

  const handleSubmit = (event) => {
    // Sin esto el navegador recargaría la página al enviar el formulario.
    event.preventDefault();
    const query = text.trim();
    navigate(query ? `/buscar?q=${encodeURIComponent(query)}` : '/');
  };

  const handleClear = () => {
    setText('');
    navigate('/');
  };

  return (
    <form className={`search-bar search-bar--${variant}`} role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor={`search-${variant}`}>Buscar películas</label>
      <span className="search-bar__icon"><Icon name="search" size={variant === 'big' ? 2 : 1.6} /></span>
      <input
        id={`search-${variant}`}
        className="search-bar__input"
        type="search"
        value={text}
        placeholder={placeholder}
        onChange={(event) => setText(event.target.value)}
      />
      {variant === 'big' && text && (
        <button type="button" className="search-bar__clear" onClick={handleClear} aria-label="Borrar búsqueda">
          <Icon name="close" size={1.6} />
        </button>
      )}
      <button type="submit" className="btn btn--primary search-bar__submit">Buscar</button>
    </form>
  );
}
