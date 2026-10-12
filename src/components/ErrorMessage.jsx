// Mensaje de error con estilo de la web y botón opcional para reintentar.
export default function ErrorMessage({ message, onRetry }) {
  return (
    // role="alert" hace que se anuncie de inmediato a los lectores de pantalla.
    <div className="error-message" role="alert">
      <h2 className="error-message__title">Algo ha salido mal</h2>
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}
