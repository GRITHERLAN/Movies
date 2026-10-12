// Configuración de Vite (el "empaquetador" que permite usar React en el navegador).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// dotenv lee el fichero .env de la raíz y vuelca sus variables en process.env.
// "quiet" evita mensajes informativos en la consola.
dotenv.config({ quiet: true });

export default defineConfig({
  plugins: [react()],
  // "define" sustituye la constante __API_KEY__ por el valor real de API_KEY
  // durante la compilación. Así el código del navegador puede usarla aunque
  // dotenv solo funcione en Node.
  define: {
    __API_KEY__: JSON.stringify(process.env.API_KEY || ''),
  },
});
