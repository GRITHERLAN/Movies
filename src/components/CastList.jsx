// Reparto principal: foto, nombre del actor y personaje.
import { imageUrl } from '../services/tmdb.js';

export default function CastList({ cast }) {
  if (cast.length === 0) return null;

  return (
    <section className="detail-section" aria-labelledby="cast-title">
      <h2 id="cast-title" className="detail-section__title">Reparto Principal</h2>
      <ul className="cast-list">
        {cast.map((person) => (
          <li key={person.id} className="cast-list__item">
            {person.photoPath ? (
              <img className="cast-list__photo" src={imageUrl(person.photoPath, 'w185')} alt={person.name} loading="lazy" />
            ) : (
              <span className="cast-list__photo cast-list__photo--empty" aria-hidden="true">?</span>
            )}
            <div>
              <p className="cast-list__name">{person.name}</p>
              <p className="cast-list__character">{person.character}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
