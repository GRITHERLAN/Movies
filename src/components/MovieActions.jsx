// Botones para marcar una película como Vista, Me gusta o Pendiente de ver.
// "variant" cambia el aspecto:
//   - "compact": tres iconos pequeños (para las tarjetas)
//   - "full":    botones grandes con texto (para el detalle y el hero)
import { useUserList } from '../context/UserListContext.jsx';
import Icon from './Icon.jsx';

export default function MovieActions({ movie, variant = 'compact' }) {
  const { getEntry, toggleWatched, toggleLiked, togglePending } = useUserList();
  const entry = getEntry(movie.id);

  // Lista de botones: así evitamos repetir código tres veces.
  const buttons = [
    {
      key: 'pending',
      icon: 'bookmark',
      active: Boolean(entry?.pending),
      label: entry?.pending ? 'Quitar de pendientes' : 'Agregar Por Ver',
      short: 'Pendiente de ver',
      onClick: () => togglePending(movie),
    },
    {
      key: 'watched',
      icon: 'check',
      active: Boolean(entry?.watched),
      label: entry?.watched ? 'Marcar como no vista' : 'Marcar como Vista',
      short: 'Vista',
      onClick: () => toggleWatched(movie),
    },
    {
      key: 'liked',
      icon: 'heart',
      active: Boolean(entry?.liked),
      label: entry?.liked ? 'Quitar Me Gusta' : 'Me Gusta',
      short: 'Me gusta',
      onClick: () => toggleLiked(movie),
    },
  ];

  return (
    <div className={`movie-actions movie-actions--${variant}`}>
      {buttons.map((button) => (
        <button
          key={button.key}
          type="button"
          className={`movie-actions__btn movie-actions__btn--${button.key} ${button.active ? 'is-active' : ''}`}
          aria-pressed={button.active}
          aria-label={`${button.short}: ${button.label}`}
          title={button.label}
          onClick={(event) => {
            // Evita que el clic active el enlace de la tarjeta que lo contiene.
            event.preventDefault();
            event.stopPropagation();
            button.onClick();
          }}
        >
          <Icon name={button.icon} filled={button.active} size={variant === 'full' ? 1.6 : 1.5} />
          {variant === 'full' && <span>{button.label}</span>}
        </button>
      ))}
    </div>
  );
}
