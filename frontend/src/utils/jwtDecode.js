/**
 * Décode le payload JWT (sans vérification — le backend a déjà signé)
 */
export function jwtDecode(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('JWT invalide');
  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  return payload;
}
