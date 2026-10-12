// Ventana modal con el estilo de la web. Sustituye a confirm()/alert(),
// que están prohibidos en este proyecto.
import { useEffect } from 'react';

export default function Modal({ title, children, confirmLabel = 'Aceptar', cancelLabel = 'Cancelar', onConfirm, onCancel }) {
  // Permite cerrar la ventana con la tecla Escape.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    // Fondo oscuro: al hacer clic fuera de la ventana se cancela.
    <div className="modal-backdrop" onClick={onCancel}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        // Evitamos que un clic dentro de la ventana llegue al fondo.
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="modal-title" className="modal__title">{title}</h2>
        <div className="modal__body">{children}</div>
        <div className="modal__actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
