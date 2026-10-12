// Punto de entrada: monta la aplicación React dentro del <div id="root">.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { UserListProvider } from './context/UserListContext.jsx';

// Estilos globales (el orden importa: primero reset y variables).
import './styles/reset.css';
import './styles/variables.css';
import './styles/global.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* El proveedor da acceso a la lista del usuario desde cualquier componente */}
    <UserListProvider>
      <App />
    </UserListProvider>
  </StrictMode>
);
