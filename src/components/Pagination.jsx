// Paginación: "Anterior 1 2 3 ... 48 Siguiente".
import Icon from './Icon.jsx';

// Calcula qué números mostrar. Ejemplo (página 10 de 48): [1, '...', 9, 10, 11, '...', 48]
function buildPages(page, totalPages) {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  // En las primeras páginas mostramos algunos números más para que no quede vacío.
  if (page <= 3) [2, 3, 4].forEach((n) => wanted.add(n));

  const sorted = [...wanted].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  // Entre dos números no consecutivos insertamos "...".
  const result = [];
  sorted.forEach((n, index) => {
    if (index > 0 && n - sorted[index - 1] > 1) result.push('...');
    result.push(n);
  });
  return result;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginación">
      <button type="button" className="pagination__btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <Icon name="chevronLeft" size={1.2} /> Anterior
      </button>

      <ul className="pagination__list">
        {buildPages(page, totalPages).map((item, index) => (
          <li key={`${item}-${index}`}>
            {item === '...' ? (
              <span className="pagination__dots">…</span>
            ) : (
              <button
                type="button"
                className={`pagination__btn ${item === page ? 'is-active' : ''}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            )}
          </li>
        ))}
      </ul>

      <button type="button" className="pagination__btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Siguiente <Icon name="chevronRight" size={1.2} />
      </button>
    </nav>
  );
}
