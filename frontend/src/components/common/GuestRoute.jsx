/**
 * Redirige les utilisateurs déjà connectés hors des pages auth
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const hasToken = Boolean(localStorage.getItem('supfile_auth_token'));

  if (isAuthenticated || hasToken) {
    return <Navigate to="/files" replace />;
  }

  return children;
}
