// Pie de página con la atribución obligatoria a TMDB.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <p>
          <strong className="site-footer__brand">CineScope</strong>
          Datos proporcionados por{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>. Esta aplicación usa la
          API de TMDB pero no está avalada ni certificada por TMDB.
        </p>
        <p>Tu lista personal se guarda solo en este navegador (LocalStorage).</p>
      </div>
    </footer>
  );
}
