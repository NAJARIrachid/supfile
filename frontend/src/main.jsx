/**
 * Point d'entrée React — hydratation session auth
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { useAuthStore } from './store/authStore';

useAuthStore.getState().hydrate();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
