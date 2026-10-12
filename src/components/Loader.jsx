// Indicador de carga: un círculo giratorio con un texto accesible.
export default function Loader({ text = 'Cargando...' }) {
  return (
    // role="status" avisa a los lectores de pantalla de que algo está cargando.
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true"></span>
      <p className="loader__text">{text}</p>
    </div>
  );
}
