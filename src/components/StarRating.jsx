// Valoración personal de 1 a 5 estrellas. Pulsar la estrella ya elegida la quita.
import Icon from './Icon.jsx';

const LABELS = ['Sin valorar', 'Mala', 'Regular', 'Buena', 'Muy buena', 'Obra maestra'];

export default function StarRating({ value, onChange }) {
  return (
    <section className="star-rating" aria-labelledby="star-rating-title">
      <div>
        <h3 id="star-rating-title" className="star-rating__title">Tu calificación personal</h3>
        <p className="star-rating__hint">Evalúa del 1 al 5 según tu experiencia de visualización</p>
      </div>
      <p className="star-rating__value">{value} / 5 ★ ({LABELS[value]})</p>
      <div className="star-rating__stars" role="group" aria-label="Estrellas">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-rating__star ${star <= value ? 'is-active' : ''}`}
            aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
            aria-pressed={star <= value}
            onClick={() => onChange(star === value ? 0 : star)}
          >
            <Icon name="star" filled={star <= value} size={3} />
          </button>
        ))}
      </div>
    </section>
  );
}
