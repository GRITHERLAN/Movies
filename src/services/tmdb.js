// ============================================================================
// Servicio de acceso a la API de TMDB (The Movie Database).
// Todo el código que habla con internet vive aquí; los componentes solo llaman
// a estas funciones y no necesitan saber cómo es la API por dentro.
// Documentación: https://developer.themoviedb.org/reference/getting-started
// ============================================================================

// __API_KEY__ la sustituye Vite al compilar (ver vite.config.js, que la lee del
// fichero .env con la librería dotenv).
const API_KEY = d046b485d196e31111962520edadd292;

const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';

// Idioma de los textos que devuelve la API (títulos, sinopsis, géneros...).
const LANGUAGE = 'es-ES';

// TMDB solo permite consultar hasta la página 500.
export const MAX_PAGES = 500;

// ---------------------------------------------------------------------------
// Opciones de los filtros (se usan para pintar los botones y para consultar)
// ---------------------------------------------------------------------------

const currentYear = new Date().getFullYear();

// Filtro de año: cada opción indica el rango de años "desde"/"hasta".
export const YEAR_OPTIONS = [
  { id: 'all', label: 'Todos', from: null, to: null },
  { id: 'y0', label: String(currentYear), from: currentYear, to: currentYear },
  { id: 'y1', label: String(currentYear - 1), from: currentYear - 1, to: currentYear - 1 },
  { id: 'recent', label: `${currentYear - 5}-${currentYear - 2}`, from: currentYear - 5, to: currentYear - 2 },
  { id: 'classic', label: 'Clásicos', from: null, to: 1999 },
];

// Filtro de puntuación mínima (la nota de TMDB va de 0 a 10).
export const RATING_OPTIONS = [
  { id: 'any', label: 'Cualquiera', min: 0 },
  { id: '7', label: '> 7.0 ★', min: 7 },
  { id: '8', label: '> 8.0 ★', min: 8 },
  { id: '9', label: 'Obras maestras > 9.0 ★', min: 9 },
];

// Criterios de ordenación disponibles.
export const SORT_OPTIONS = [
  { id: 'recent', label: 'Estrenos recientes', tmdb: 'primary_release_date.desc' },
  { id: 'popular', label: 'Más populares', tmdb: 'popularity.desc' },
  { id: 'rating', label: 'Mejor valoradas', tmdb: 'vote_average.desc' },
];

// Filtros por defecto (sin ningún filtro activo).
export const DEFAULT_FILTERS = { genre: 'all', year: 'all', rating: 'any', sort: 'recent' };

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

// Indica si hay una API key configurada.
export function hasApiKey() {
  return Boolean(API_KEY);
}

// Construye la URL de una imagen. "size" es el ancho (w342, w500, w780, original...).
// Si la película no tiene imagen devuelve null para que el componente pinte un hueco.
export function imageUrl(path, size = 'w500') {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}

// Hace una petición GET a TMDB y devuelve el JSON.
// Si algo falla lanza un Error con un mensaje en español, listo para mostrarse.
async function request(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('No se ha encontrado la API_KEY. Añádela al fichero .env y reinicia el servidor.');
  }

  // URLSearchParams se encarga de codificar bien los caracteres especiales.
  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', LANGUAGE);
  Object.entries(params).forEach(([key, value]) => {
    // Ignoramos los parámetros vacíos para no ensuciar la URL.
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url);
  } catch {
    // fetch solo rechaza la promesa cuando no hay conexión.
    throw new Error('No se pudo conectar con TMDB. Revisa tu conexión a internet.');
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error('La API_KEY no es válida (error 401).');
    if (response.status === 404) throw new Error('No se encontró lo que buscabas (error 404).');
    if (response.status === 429) throw new Error('Demasiadas peticiones. Espera unos segundos.');
    throw new Error(`TMDB respondió con un error (${response.status}).`);
  }

  return response.json();
}

// Fecha de hoy en formato AAAA-MM-DD (para no listar estrenos futuros).
function today() {
  return new Date().toISOString().slice(0, 10);
}

// Convierte una película "en bruto" de un listado de TMDB en un objeto simple.
function toSummary(movie) {
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    year: movie.release_date ? movie.release_date.slice(0, 4) : '',
    releaseDate: movie.release_date || '',
    rating: movie.vote_average || 0,
    genreIds: movie.genre_ids || [],
    overview: movie.overview || '',
  };
}

// Convierte la respuesta paginada de TMDB en { movies, page, totalPages, totalResults }.
function toPage(data) {
  return {
    movies: data.results.map(toSummary),
    page: data.page,
    totalPages: Math.min(data.total_pages, MAX_PAGES),
    totalResults: data.total_results,
  };
}

// ---------------------------------------------------------------------------
// Funciones públicas
// ---------------------------------------------------------------------------

// Lista de géneros -> devuelve [{ id, name }, ...]
export async function getGenres() {
  const data = await request('/genre/movie/list');
  return data.genres;
}

// Películas actualmente en cartelera (se usa para la portada destacada).
export async function getNowPlaying() {
  const data = await request('/movie/now_playing', { region: 'ES' });
  return data.results.map(toSummary);
}

// Listado de películas con filtros y paginación.
//  - Sin texto de búsqueda usa /discover/movie, que admite todos los filtros.
//  - Con texto usa /search/movie, que NO admite filtros de género/puntuación,
//    así que los aplicamos nosotros sobre los resultados de esa página.
export async function getMovies({ query = '', page = 1, filters = DEFAULT_FILTERS }) {
  const year = YEAR_OPTIONS.find((option) => option.id === filters.year) || YEAR_OPTIONS[0];
  const rating = RATING_OPTIONS.find((option) => option.id === filters.rating) || RATING_OPTIONS[0];
  const sort = SORT_OPTIONS.find((option) => option.id === filters.sort) || SORT_OPTIONS[0];
  const genreId = filters.genre === 'all' ? null : Number(filters.genre);

  // ---- Búsqueda por texto ----
  if (query.trim()) {
    const data = await request('/search/movie', { query: query.trim(), page, include_adult: false });
    const result = toPage(data);

    result.movies = result.movies
      .filter((movie) => (genreId ? movie.genreIds.includes(genreId) : true))
      .filter((movie) => movie.rating >= rating.min)
      .filter((movie) => {
        const movieYear = Number(movie.year);
        if (!movieYear) return year.id === 'all';
        return (!year.from || movieYear >= year.from) && (!year.to || movieYear <= year.to);
      });

    // Ordenación en cliente (la búsqueda de TMDB ya viene ordenada por relevancia).
    if (filters.sort === 'recent') result.movies.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    if (filters.sort === 'rating') result.movies.sort((a, b) => b.rating - a.rating);

    return result;
  }

  // ---- Catálogo (sin texto) ----
  const params = {
    page,
    sort_by: sort.tmdb,
    include_adult: false,
    with_genres: genreId,
    'vote_average.gte': rating.min || null,
    'primary_release_date.gte': year.from ? `${year.from}-01-01` : null,
    // Nunca más allá de hoy, para listar solo estrenos ya disponibles.
    'primary_release_date.lte': year.to && year.to < currentYear ? `${year.to}-12-31` : today(),
    // Con muy pocos votos las notas no son fiables: exigimos un mínimo.
    'vote_count.gte': filters.sort === 'rating' ? 300 : filters.sort === 'recent' ? 10 : 50,
  };

  return toPage(await request('/discover/movie', params));
}

// Detalle completo de una película (incluye reparto, equipo y similares).
export async function getMovieDetail(id) {
  const data = await request(`/movie/${id}`, { append_to_response: 'credits,similar' });

  // El director aparece en el "crew" con el trabajo (job) "Director".
  const crew = data.credits?.crew || [];
  const directors = crew.filter((person) => person.job === 'Director').map((person) => person.name);
  const writers = crew
    .filter((person) => ['Screenplay', 'Writer', 'Story'].includes(person.job))
    .map((person) => person.name);
  const composers = crew.filter((person) => person.job === 'Original Music Composer').map((person) => person.name);

  return {
    id: data.id,
    title: data.title,
    overview: data.overview || '',
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    year: data.release_date ? data.release_date.slice(0, 4) : '',
    runtime: data.runtime || 0,
    rating: data.vote_average || 0,
    voteCount: data.vote_count || 0,
    budget: data.budget || 0,
    revenue: data.revenue || 0,
    genres: data.genres || [],
    director: directors.join(', '),
    writers: [...new Set(writers)].slice(0, 3),
    composers: composers.slice(0, 2),
    cast: (data.credits?.cast || []).slice(0, 6).map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character,
      photoPath: person.profile_path,
    })),
    similar: (data.similar?.results || []).slice(0, 12).map(toSummary),
  };
}
