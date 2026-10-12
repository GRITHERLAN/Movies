// Iconos SVG sencillos (sin librerías externas). Se dibujan con trazos de 24x24.
// Uso: <Icon name="heart" filled />
const PATHS = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.500-7 10-7 10z',
  bookmark: 'M7 4h10v16l-5-4-5 4z',
  check: 'M5 12.500l4.500 4.500L19 7.500',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  star: 'M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z',
  arrowLeft: 'M19 12H5m6-6-6 6 6 6',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  chevronLeft: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  close: 'M6 6l12 12M18 6 6 18',
  download: 'M12 4v11m-5-4 5 5 5-5M5 20h14',
  trash: 'M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13',
  film: 'M4 4h16v16H4zM4 9h16M4 15h16M9 4v16M15 4v16',
  reset: 'M4 12a8 8 0 1 0 3-6.200M4 4v5h5',
};

export default function Icon({ name, filled = false, size = 1.6 }) {
  return (
    <svg
      className="icon"
      style={{ width: `${size}rem`, height: `${size}rem` }}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
