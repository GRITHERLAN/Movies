# CLAUDE.md

Proyecto: 
Aplicacion web tipo buscador de peliculas.

Rol del agente:
Desarrollador web con 12 años de experiencia.

Objetivo: 
Crea una aplicacion web que nos permita buscar peliculas y tener un catalogo
de cine para consultar consumiendo los datos de un api externa ( que luego indicare).

Funcionalidades de la aplicacion:
- Input de busqueda.
- Consumo de API externa.
- Home page con listado de los ultimos estrenos
- Listado de resultados.
- Paginacion.
- Filtros (Año, Ratings, Categorias)
- Vista de detalle, con la sinopsis, imagen de portada, año y director
- Manejo de errores.
- Indicador de carga.
- Poder marcar si la he visto o no.
- Poder marcar si me gusta o no.
- Poder marcar como "Pendiente de ver".
- Seccion de peliculas vistas.
- Seccion de peliculas pendientes de ver.
- La informacion deel usuario se guardara en local (LocalStorage).

Informacion del API externa: 
- El API que vamos a usar es TMDB (The Movie Database), que el API es gratis.
- La URL de la documentacion es esta (si no sabes como hacer algo con el API, investiga en la documentacion): 
  https://developer.themoviedb.org/reference/getting-started
  https://developer.themoviedb.org/docs/getting-started
- El API KEY para usar el API REST, lo tendras en el fichero .env que esta en la Raiz del proyecto. La variable
  que tienes que usar es API_KEY y debes usar la libreria dotenv para acceder a ella(si no esta instalada, instalala).

Stack de tecnologia: 
- HTML5
- CSS3
- JavaScript
- React

Preferencias generales:
- Todos los textos visibles en la web deben estar en español

Preferencias de diseño:
- Basate en las imagenes del diseño que tienes en la carpeta Design del proyecto

Preferencias de estilos:
- Colores (Los del diseño)
- Use medidas en REM, usando un font-size base de 10px
- Uso de HTML5 y CSS3 nativo.
- Uso de buenas practicas de maquetacion CSS y si es necesario usa flexbox y css grid layout.
- Que la web sea responsive

Preferencias de codigo:
- No añadas dependencias externas.
- HTML debe ser semantico.
- Usa siempre let o const, y no uses nunca var.
- No uses alert, confirm o promt, todo el feedback debe ser visual en el dom.
- Toda alerta o ventana modal que aparezca debe tener el mismo estilo que la web.
- No uses innerHTML, todo el contenido debe ser insertado con appendChild o previamente creando un elemento
- con document.createElement
- Cuidado con olvidar prevenir el default en los eventos submit o click.
- Prioriza el codigo legible y mantenible.
- Prioriza que el codigo sea sencillo de entender (Prioridad alta y comentando detalladamente todo).
- Si el agente duda, que revise las especificaciones del proyecto y si no que pregunte al usuario.

Estructura de archivos: orden de carpetas y archivos
- Claude.md
- Carpeta (Design)
- .env
- Estructura de ficheros mas adecuada para proyectos de React (Lo elige el agente de IA)